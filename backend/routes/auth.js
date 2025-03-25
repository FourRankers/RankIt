const express = require("express");
const router = express.Router();
const { db } = require("../config.js"); // Import the initialized db instance

// Add verifyAuth middleware
const verifyAuth = async (req, res, next) => {
  const { userId } = req.headers;
  
  if (!userId) {
    return res.status(401).json({ error: "No user ID provided" });
  }

  try {
    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      throw new Error('Invalid user ID');
    }

    // Add user info to request object
    const userData = userDoc.data();
    req.user = {
      uid: userDoc.id,
      email: userData.email
    };
    
    next();
  } catch (error) {
    console.error("Error verifying user:", error);
    res.status(401).json({ error: "Invalid user ID" });
  }
};

// Sign up a new user
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check for required fields
    if (!email) {
      throw new Error('Email is required');
    }
    if (!password) {
      throw new Error('Password is required');
    }

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Invalid email format');
    }

    // Check if email already exists
    const existingUsers = await db.collection('users')
      .where('email', '==', email)
      .get();

    if (!existingUsers.empty) {
      throw new Error('Email already registered');
    }

    // Create user in Firebase
    const newUserRef = await db.collection('users').add({
      email,
      password,  // Password should be pre-hashed from frontend
      createdAt: new Date()
    });

    const newUser = await newUserRef.get();
    
    res.status(201).json({ 
      message: "User created successfully", 
      uid: newUser.id,
      email: newUser.data().email
    });

  } catch (error) {
    console.error("Error in signup process:", error);
    res.status(400).json({ 
      error: error.message || 'Error during signup process'
    });
  }
});

// Login endpoint
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Get user from Firebase
    const usersRef = await db.collection('users')
      .where('email', '==', email)
      .where('password', '==', password)
      .get();

    if (usersRef.empty) {
      throw new Error('Invalid credentials');
    }

    const user = usersRef.docs[0];
    
    res.status(200).json({ 
      message: "Login successful",
      uid: user.id,
      email: user.data().email
    });
  } catch (error) {
    console.error("Error in login process:", error);
    res.status(401).json({ error: "Invalid credentials" });
  }
});

module.exports = { router, verifyAuth };
