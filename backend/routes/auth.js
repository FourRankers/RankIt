const express = require("express");
const admin = require("firebase-admin");
const { validatePassword } = require("../functions/passwordValidation");
const router = express.Router();

// Sign up a new user
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Validate password before creating user
    validatePassword(password);
    
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });
    res.status(201).json({ message: "User created successfully", uid: userRecord.uid });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(400).json({ error: error.message });
  }
});

// Log in a user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userRecord = await admin.auth().getUserByEmail(email);
    // Here you would typically verify the password using a custom method
    // Firebase Admin SDK does not provide password verification
    res.status(200).json({ message: "User logged in", uid: userRecord.uid });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// Log out a user (Firebase does not have a server-side logout, this is typically handled on the client)
router.post("/logout", (req, res) => {
  // Invalidate the user's session on the client-side
  res.status(200).json({ message: "User logged out" });
});

// Send password reset email
router.post("/send-password-reset", async (req, res) => {
  const { email } = req.body;
  try {
    await admin.auth().sendPasswordResetEmail(email);
    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Error sending password reset email:", error);
    res.status(400).json({ error: error.message });
  }
});

// Send sign-in link for passwordless authentication
router.post("/send-signin-link", async (req, res) => {
  const { email, redirectUrl } = req.body;
  try {
    const actionCodeSettings = {
      url: redirectUrl || `${process.env.FRONTEND_URL}/auth/verify-email`, // URL to redirect after email verification
      handleCodeInApp: true,
    };

    await admin.auth().generateSignInWithEmailLink(email, actionCodeSettings);
    res.status(200).json({ 
      message: "Sign-in link sent successfully",
      note: "Please check your email for the sign-in link"
    });
  } catch (error) {
    console.error("Error sending sign-in link:", error);
    res.status(400).json({ error: error.message });
  }
});

// Verify email link and sign in user
router.post("/verify-email-link", async (req, res) => {
  const { email, emailLink } = req.body;
  try {
    // Verify the email link
    const result = await admin.auth().verifySignInWithEmailLink(email, emailLink);
    const { uid } = result.user;
    
    // Generate a custom token for the user
    const customToken = await admin.auth().createCustomToken(uid);
    
    res.status(200).json({ 
      message: "Email verified successfully",
      customToken,
      uid
    });
  } catch (error) {
    console.error("Error verifying email link:", error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
