const express = require("express");
const router = express.Router();
const db = require("../config.js");
const admin = require("firebase-admin");

// Create a new post
router.post("/create-post", async (req, res) => {
  try {
    const { title, description, authorId, authorName } = req.body;

    if (!title || !description || !authorId || !authorName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newPostRef = await db.collection("posts").add({
      title,
      description,
      authorId,
      authorName,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      upvotes: 0
    });

    res.status(201).json({ 
      message: "Post created successfully", 
      postId: newPostRef.id 
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get all posts with pagination
router.get("/get-posts", async (req, res) => {
  try {
    const { limit = 10, lastPostId } = req.query;
    let query = db.collection("posts")
      .orderBy("timestamp", "desc")
      .limit(parseInt(limit));

    // If lastPostId is provided, start after that post
    if (lastPostId) {
      const lastPost = await db.collection("posts").doc(lastPostId).get();
      query = query.startAfter(lastPost);
    }

    const postsSnapshot = await query.get();
    const posts = postsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get a single post with its comments
router.get("/get-post/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const postDoc = await db.collection("posts").doc(postId).get();

    if (!postDoc.exists) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Get comments from the subcollection
    const commentsSnapshot = await postDoc.ref.collection("comments").get();
    const comments = commentsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    const post = {
      id: postDoc.id,
      ...postDoc.data(),
      comments
    };

    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: error.message });
  }
});

// Add a comment to a post
router.post("/add-comment", async (req, res) => {
  try {
    const { postId, content, authorId, authorName } = req.body;

    if (!postId || !content || !authorId || !authorName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const postRef = db.collection("posts").doc(postId);
    const postDoc = await postRef.get();

    if (!postDoc.exists) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Add comment to the comments subcollection
    const newCommentRef = await postRef.collection("comments").add({
      content,
      authorId,
      authorName,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      upvotes: 0
    });

    res.status(201).json({ 
      message: "Comment added successfully", 
      commentId: newCommentRef.id 
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: error.message });
  }
});

// Upvote a post
router.post("/upvote-post/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const postRef = db.collection("posts").doc(postId);
    const postDoc = await postRef.get();

    if (!postDoc.exists) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Update the upvotes count
    await postRef.update({
      upvotes: admin.firestore.FieldValue.increment(1)
    });

    res.status(200).json({ message: "Post upvoted successfully" });
  } catch (error) {
    console.error("Error upvoting post:", error);
    res.status(500).json({ error: error.message });
  }
});

// Upvote a comment
router.post("/upvote-comment/:postId/:commentId", async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const postRef = db.collection("posts").doc(postId);
    const postDoc = await postRef.get();

    if (!postDoc.exists) {
      return res.status(404).json({ error: "Post not found" });
    }

    const commentRef = postRef.collection("comments").doc(commentId);
    const commentDoc = await commentRef.get();

    if (!commentDoc.exists) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Update the comment's upvotes
    await commentRef.update({
      upvotes: admin.firestore.FieldValue.increment(1)
    });

    res.status(200).json({ message: "Comment upvoted successfully" });
  } catch (error) {
    console.error("Error upvoting comment:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
