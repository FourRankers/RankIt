const { db } = require("../config.js");
const admin = require("firebase-admin");

class PostLogic {
    // Calculate average rating for a post
    static async calculateAverageRating(postRef) {
        const postDoc = await postRef.get();
        const postData = postDoc.data();
        const authorRating = postData.authorRating || 0;
        const commentRatings = postData.commentRatings || [];
        
        if (commentRatings.length === 0) {
            return authorRating; // If no comments, return just the author rating
        }

        // Calculate average of comment ratings
        const commentsAverage = commentRatings.reduce((sum, rating) => sum + rating, 0) / commentRatings.length;
        
        // Return average of author rating and comments average (equal weight)
        return (authorRating + commentsAverage) / 2;
    }

    // Create a new post
    static async createPost(postData) {
        const { title, description, authorId, authorName, imageUrl, category, authorRating } = postData;

        if (!title || !description || !authorId || !authorName || !authorRating) {
            throw new Error("Missing required fields");
        }

        // Validate author rating
        const rating = Number(authorRating);
        if (rating < 1 || rating > 5 || isNaN(rating)) {
            throw new Error("Author rating must be between 1 and 5");
        }

        const newPostRef = await db.collection("posts").add({
            title,
            description,
            authorId,
            authorName,
            imageUrl,
            category,
            authorRating: rating,
            commentRatings: [], // Array to store ratings from comments
            averageRating: rating, // Initial average is just the author's rating
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });

        return {
            postId: newPostRef.id,
            imageUrl,
            authorRating: rating,
            averageRating: rating
        };
    }

    // Get all posts with pagination
    static async getPosts(limit = 10, lastPostId = null) {
        let query = db.collection("posts")
            .orderBy("timestamp", "desc")
            .limit(parseInt(limit));

        if (lastPostId) {
            const lastPost = await db.collection("posts").doc(lastPostId).get();
            query = query.startAfter(lastPost);
        }

        const postsSnapshot = await query.get();
        return postsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            averageRating: doc.data().averageRating || 0,
            totalRatings: (doc.data().commentRatings || []).length + 1 // +1 for author rating
        }));
    }

    // Get a single post with its comments
    static async getPost(postId) {
        const postRef = db.collection("posts").doc(postId);
        const postDoc = await postRef.get();

        if (!postDoc.exists) {
            throw new Error("Post not found");
        }

        const commentsSnapshot = await postRef.collection("comments")
            .orderBy("timestamp", "desc")
            .get();

        const comments = commentsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        const postData = postDoc.data();
        return {
            id: postDoc.id,
            ...postData,
            comments,
            averageRating: postData.averageRating || 0,
            totalRatings: (postData.commentRatings || []).length + 1 // +1 for author rating
        };
    }

    // Add a comment with rating to a post
    static async addComment(commentData) {
        const { postId, content, authorId, authorName, rating } = commentData;

        if (!postId || !content || !authorId || !authorName || !rating) {
            throw new Error("Missing required fields");
        }

        // Validate rating
        const commentRating = Number(rating);
        if (commentRating < 1 || commentRating > 5 || isNaN(commentRating)) {
            throw new Error("Rating must be between 1 and 5");
        }

        const postRef = db.collection("posts").doc(postId);
        const postDoc = await postRef.get();

        if (!postDoc.exists) {
            throw new Error("Post not found");
        }

        try {
            // Start a batch write to ensure atomic updates
            const batch = db.batch();

            // Create the comment
            const newCommentRef = postRef.collection("comments").doc();
            batch.set(newCommentRef, {
                content,
                authorId,
                authorName,
                rating: commentRating,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
                upvotes: 0
            });

            // Get current post data for calculation
            const postData = postDoc.data();
            const currentCommentRatings = postData.commentRatings || [];
            const newCommentRatings = [...currentCommentRatings, commentRating];
            
            // Calculate new average
            const authorRating = postData.authorRating || 0;
            const commentsAverage = newCommentRatings.reduce((sum, r) => sum + r, 0) / newCommentRatings.length;
            const newAverageRating = (authorRating + commentsAverage) / 2;

            // Update post with new ratings
            batch.update(postRef, {
                commentRatings: newCommentRatings,
                averageRating: newAverageRating
            });

            // Commit all changes
            await batch.commit();

            return {
                commentId: newCommentRef.id,
                rating: commentRating,
                averageRating: newAverageRating
            };
        } catch (error) {
            throw new Error(`Failed to add comment: ${error.message}`);
        }
    }

    // Get post's rating details
    static async getPostRating(postId) {
        const postRef = db.collection("posts").doc(postId);
        const postDoc = await postRef.get();

        if (!postDoc.exists) {
            throw new Error("Post not found");
        }

        const postData = postDoc.data();
        return {
            averageRating: postData.averageRating || 0,
            authorRating: postData.authorRating || 0,
            commentRatings: postData.commentRatings || [],
            totalRatings: (postData.commentRatings || []).length + 1 // +1 for author rating
        };
    }

    // Upvote a comment
    static async upvoteComment(postId, commentId, userId) {
        if (!userId) {
            throw new Error("User ID is required");
        }

        const postRef = db.collection("posts").doc(postId);
        const postDoc = await postRef.get();

        if (!postDoc.exists) {
            throw new Error("Post not found");
        }

        const commentRef = postRef.collection("comments").doc(commentId);
        const commentDoc = await commentRef.get();

        if (!commentDoc.exists) {
            throw new Error("Comment not found");
        }

        await commentRef.update({
            upvotes: admin.firestore.FieldValue.increment(1)
        });
    }
}

module.exports = PostLogic;