const express = require('express')
const router = express.Router()
const { supabase, db } = require('../config.js')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid')
const PostLogic = require('../functions/postLogic')
const auth = require('./auth') // Update import
const verifyAuth = auth.verifyAuth // Get verifyAuth from auth module

// Configure multer for memory storage
const storage = multer.memoryStorage()
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only images are allowed'))
    }
  }
})

// Route to get image by file name
router.get('/get-image/:fileName', async (req, res) => {
  try {
    const { fileName } = req.params

    const { data: fileData, error: fileError } = await supabase.storage
      .from('rankit-images')
      .list('posts/')

    if (fileError) {
      return res.status(500).json({ error: 'Error checking file existence' })
    }

    const fileExists = fileData.some((file) => file.name === fileName)
    if (!fileExists) {
      return res.status(404).json({ error: 'Image not found in storage' })
    }

    const { data, error } = supabase.storage
      .from('rankit-images')
      .getPublicUrl(`posts/${fileName}`)

    if (error) {
      return res.status(404).json({ error: 'Error getting image URL' })
    }

    res.status(200).json({
      message: 'Image retrieved successfully',
      publicUrl: data.publicUrl
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Dedicated route for image upload
router.post('/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' })
    }

    const file = req.file
    const fileExt = file.mimetype.split('/')[1]
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = `posts/${fileName}`

    const { data, error: uploadError } = await supabase.storage
      .from('rankit-images')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600'
      })

    if (uploadError) {
      throw new Error(`Error uploading image: ${uploadError.message}`)
    }

    const {
      data: { publicUrl },
      error: urlError
    } = supabase.storage.from('rankit-images').getPublicUrl(filePath)

    if (urlError) {
      throw new Error(`Error getting public URL: ${urlError.message}`)
    }

    res.status(200).json({
      message: 'Image uploaded successfully',
      fileName,
      filePath,
      publicUrl,
      fileSize: file.size,
      mimeType: file.mimetype
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create a new post
router.post('/create-post', verifyAuth, async (req, res) => {
  try {
    const postData = {
      ...req.body,
      authorId: req.user.uid, // Use the authenticated user's ID
      authorName: req.user.email // Use the authenticated user's email
    }
    const result = await PostLogic.createPost(postData)
    res.status(201).json({
      message: 'Post created successfully',
      ...result
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get all posts with pagination
router.get('/get-posts', async (req, res) => {
  try {
    const { limit, lastPostId } = req.query
    const posts = await PostLogic.getPosts(limit, lastPostId)
    res.status(200).json(posts)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get a single post with its comments
router.get('/get-post/:postId', async (req, res) => {
  try {
    const { postId } = req.params
    const post = await PostLogic.getPost(postId)
    res.status(200).json(post)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Add a comment with rating to a post
router.post('/add-comment', verifyAuth, async (req, res) => {
  try {
    const commentData = {
      ...req.body,
      authorId: req.user.uid,
      authorName: req.user.email
    }
    const result = await PostLogic.addComment(commentData)
    res.status(201).json({
      message: 'Comment and rating added successfully',
      ...result
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get post's rating details
router.get('/get-rating/:postId', async (req, res) => {
  try {
    const { postId } = req.params
    const ratingDetails = await PostLogic.getPostRating(postId)
    res.status(200).json(ratingDetails)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Vote on a comment (upvote or downvote)
router.post('/:postId/comments/:commentId/vote', async (req, res) => {
  try {
    const { postId, commentId } = req.params
    const { userId, vote } = req.body

    const postRef = db.collection('posts').doc(postId)
    const postDoc = await postRef.get()

    if (!postDoc.exists) {
      return res.status(404).json({ error: 'Post not found' })
    }

    const commentRef = postRef.collection('comments').doc(commentId)
    const commentDoc = await commentRef.get()

    if (!commentDoc.exists) {
      return res.status(404).json({ error: 'Comment not found' })
    }

    // Check if user has already voted
    const userVoteRef = db
      .collection('users')
      .doc(userId)
      .collection('commentVotes')
      .doc(commentId)

    const userVoteDoc = await userVoteRef.get()

    if (userVoteDoc.exists) {
      const currentVote = userVoteDoc.data().vote

      // If clicking the same vote button again, remove the vote
      if (currentVote === vote) {
        await commentRef.update({
          upvotes: vote
        })
        await userVoteRef.delete()
        return res.status(200).json({
          message: 'Vote count updated successfully',
          currentVotes: vote
        })
      }

      // If changing vote, update the vote count
      await commentRef.update({
        upvotes: vote
      })
      await userVoteRef.update({ vote })
      return res.status(200).json({
        message: 'Vote updated successfully',
        currentVotes: vote
      })
    }

    // First time voting
    await commentRef.update({
      upvotes: vote
    })
    await userVoteRef.set({
      vote,
      postId
    })
    res.status(200).json({
      message: 'Vote recorded successfully',
      currentVotes: vote
    })
  } catch (error) {
    console.error('Error voting on comment:', error)
    res.status(500).json({ error: error.message })
  }
})

// Get posts by category
router.get("/category/:category", async (req, res) => {
    try {
        const { category } = req.params;
        const { limit, lastPostId } = req.query;
        const posts = await PostLogic.getPostsByCategory(category, limit, lastPostId);
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Search posts by title
router.get("/search", async (req, res) => {
    try {
        const { query, limit, lastPostId } = req.query;
        
        if (!query) {
            return res.status(400).json({ error: "Search query is required" });
        }

        const posts = await PostLogic.searchPostsByTitle(query, limit, lastPostId);
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
