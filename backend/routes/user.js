const express = require("express");
const router = express.Router();
const db = require("../config.js");
const admin = require("firebase-admin");

// Get all posts by a specific user
router.get("/:userId/posts", async (req, res) => {
  try {
    const { userId } = req.params;
    const postsSnapshot = await db.collection("posts")
      .where("authorId", "==", userId)
      .orderBy("timestamp", "desc")
      .get();

    const posts = postsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get all comments by a specific user
router.get("/:userId/comments", async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get all posts to search through their comments
    const postsSnapshot = await db.collection("posts").get();
    const userComments = [];

    // Search through each post's comments
    for (const postDoc of postsSnapshot.docs) {
      const commentsSnapshot = await postDoc.ref.collection("comments")
        .where("authorId", "==", userId)
        .get();

      const comments = commentsSnapshot.docs.map(doc => ({
        id: doc.id,
        postId: postDoc.id,
        postTitle: postDoc.data().title,
        ...doc.data()
      }));

      userComments.push(...comments);
    }

    // Sort comments by timestamp
    userComments.sort((a, b) => b.timestamp - a.timestamp);

    res.status(200).json(userComments);
  } catch (error) {
    console.error("Error fetching user comments:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get user's vote history for posts
router.get("/:userId/post-votes", async (req, res) => {
  try {
    const { userId } = req.params;
    const votesSnapshot = await db.collection("users")
      .doc(userId)
      .collection("postVotes")
      .get();

    const votes = votesSnapshot.docs.map(doc => ({
      postId: doc.id,
      vote: doc.data().vote // 1 for upvote, -1 for downvote
    }));

    res.status(200).json(votes);
  } catch (error) {
    console.error("Error fetching user post votes:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get user's vote history for comments
router.get("/:userId/comment-votes", async (req, res) => {
  try {
    const { userId } = req.params;
    const votesSnapshot = await db.collection("users")
      .doc(userId)
      .collection("commentVotes")
      .get();

    const votes = votesSnapshot.docs.map(doc => ({
      postId: doc.data().postId,
      commentId: doc.id,
      vote: doc.data().vote // 1 for upvote, -1 for downvote
    }));

    res.status(200).json(votes);
  } catch (error) {
    console.error("Error fetching user comment votes:", error);
    res.status(500).json({ error: error.message });
  }
});

// Rate a comment (1 to 5 stars)
router.post("/:userId/rate-comment/:postId/:commentId", async (req, res) => {
  try {
    const { userId, postId, commentId } = req.params;
    const { rating } = req.body; // Rating from 1 to 5

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Invalid rating value" });
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

    // Check if user has already rated the comment
    const userRatingRef = db.collection("users")
      .doc(userId)
      .collection("commentRatings")
      .doc(commentId);

    const userRatingDoc = await userRatingRef.get();

    if (userRatingDoc.exists) {
      // Update the existing rating
      await userRatingRef.update({ rating });
      return res.status(200).json({ 
        message: "Rating updated successfully"
      });
    }

    // First time rating
    await userRatingRef.set({ rating });
    res.status(200).json({ 
      message: "Rating recorded successfully"
    });
  } catch (error) {
    console.error("Error rating comment:", error);
    res.status(500).json({ error: error.message });
  }
});

// Vote on a comment (upvote or downvote)
router.post("/:userId/vote-comment/:postId/:commentId", async (req, res) => {
  try {
    const { userId, postId, commentId } = req.params;
    const { vote } = req.body; // 1 for upvote, -1 for downvote

    if (!vote || (vote !== 1 && vote !== -1)) {
      return res.status(400).json({ error: "Invalid vote value" });
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

    // Check if user has already voted
    const userVoteRef = db.collection("users")
      .doc(userId)
      .collection("commentVotes")
      .doc(commentId);

    const userVoteDoc = await userVoteRef.get();

    if (userVoteDoc.exists) {
      const currentVote = userVoteDoc.data().vote;
      
      // If clicking the same vote button again, remove the vote
      if (currentVote === vote) {
        // Remove the vote
        await commentRef.update({
          upvotes: admin.firestore.FieldValue.increment(-currentVote)
        });
        await userVoteRef.delete();
        return res.status(200).json({ 
          message: "Vote removed successfully",
          currentVotes: commentDoc.data().upvotes - currentVote
        });
      }
      
      // If changing vote, update the vote count
      await commentRef.update({
        upvotes: admin.firestore.FieldValue.increment(vote - currentVote)
      });
      await userVoteRef.update({ vote });
      return res.status(200).json({ 
        message: "Vote updated successfully",
        currentVotes: commentDoc.data().upvotes + (vote - currentVote)
      });
    }

    // First time voting
    await commentRef.update({
      upvotes: admin.firestore.FieldValue.increment(vote)
    });
    await userVoteRef.set({ 
      vote,
      postId // Store postId for reference
    });
    res.status(200).json({ 
      message: "Vote recorded successfully",
      currentVotes: commentDoc.data().upvotes + vote
    });
  } catch (error) {
    console.error("Error voting on comment:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
