const express = require("express");
const router = express.Router();
const { db, supabase } = require("../config.js");
const admin = require("firebase-admin");
const multer = require("multer");
const { v4: uuidv4 } = require('uuid');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  }
});

// Route to get image by file name
router.get("/get-image/:fileName", async (req, res) => {
  try {
    const { fileName } = req.params;

    // First check if the file exists
    const { data: fileData, error: fileError } = await supabase.storage
      .from('rankit-images')
      .list('posts/');

    if (fileError) {
      return res.status(500).json({ error: "Error checking file existence" });
    }

    const fileExists = fileData.some(file => file.name === fileName);
    if (!fileExists) {
      return res.status(404).json({ error: "Image not found in storage" });
    }

    // Get the public URL for the image
    const { data, error } = supabase.storage
      .from('rankit-images')
      .getPublicUrl(`posts/${fileName}`);

    if (error) {
      return res.status(404).json({ error: "Error getting image URL" });
    }

    res.status(200).json({
      message: "Image retrieved successfully",
      publicUrl: data.publicUrl
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test endpoint for image upload
// router.post("/test-upload", upload.single('image'), async (req, res) => {
//   try {
//     console.log('[DEBUG] Received test-upload request');
//     console.log('[DEBUG] req.file:', req.file);
//     console.log('[DEBUG] req.body:', req.body);

//     if (!req.file) {
//       return res.status(400).json({ error: "No image file provided" });
//     }

//     const file = req.file;
//     const fileExt = file.mimetype.split('/')[1];
//     const fileName = `test-${uuidv4()}.${fileExt}`;
//     const filePath = `posts/${fileName}`;

//     console.log('[DEBUG] Attempting Supabase upload:', { fileName, filePath });

//     // Upload to Supabase Storage
//     const { data, error: uploadError } = await supabase.storage
//       .from('rankit-images')
//       .upload(filePath, file.buffer, {
//         contentType: file.mimetype,
//         cacheControl: '3600'
//       });

//     if (uploadError) {
//       console.error('[DEBUG] Supabase upload error:', uploadError);
//       throw new Error(`Error uploading image: ${uploadError.message}`);
//     }

//     console.log('[DEBUG] Supabase upload successful:', data);

//     // Get the public URL
//     const { data: { publicUrl }, error: urlError } = supabase.storage
//       .from('rankit-images')
//       .getPublicUrl(filePath);

//     if (urlError) {
//       console.error('[DEBUG] Supabase URL error:', urlError);
//       throw new Error(`Error getting public URL: ${urlError.message}`);
//     }

//     res.status(200).json({
//       message: "Image uploaded successfully",
//       fileName,
//       filePath,
//       publicUrl,
//       fileSize: file.size,
//       mimeType: file.mimetype
//     });
//   } catch (error) {
//     console.error("[DEBUG] Error in test-upload:", error);
//     res.status(500).json({ error: error.message });
//   }
// });

// Dedicated route for image upload
router.post("/upload-image", upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    const file = req.file;
    const fileExt = file.mimetype.split('/')[1];
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `posts/${fileName}`;

    // Upload to Supabase Storage
    const { data, error: uploadError } = await supabase.storage
      .from('rankit-images')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600'
      });

    if (uploadError) {
      throw new Error(`Error uploading image: ${uploadError.message}`);
    }

    // Get the public URL
    const { data: { publicUrl }, error: urlError } = supabase.storage
      .from('rankit-images')
      .getPublicUrl(filePath);

    if (urlError) {
      throw new Error(`Error getting public URL: ${urlError.message}`);
    }

    res.status(200).json({
      message: "Image uploaded successfully",
      fileName,
      filePath,
      publicUrl,
      fileSize: file.size,
      mimeType: file.mimetype
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new post (without image upload)
router.post("/create-post", async (req, res) => {
  try {
    const { title, description, authorId, authorName, imageUrl } = req.body;

    if (!title || !description || !authorId || !authorName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newPostRef = await db.collection("posts").add({
      title,
      description,
      authorId,
      authorName,
      imageUrl,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      upvotes: 0
    });

    res.status(201).json({ 
      message: "Post created successfully", 
      postId: newPostRef.id,
      imageUrl 
    });
  } catch (error) {
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
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
