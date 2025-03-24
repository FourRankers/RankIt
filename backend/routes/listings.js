const express = require("express");
const router = express.Router();
const db = require("../config.js"); // Ensure correct path

// Test route
router.get("/", (req, res) => {
  res.json({ message: "Listings route is working!" });
});

// Add a listing to Firestore
router.post("/add-listing", async (req, res) => {
  try {
    const { title, price, location } = req.body;

    if (!title || !price || !location) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newListingRef = await db.collection("listings").add({
      title,
      price,
      location,
      createdAt: new Date(),
    });

    res.status(200).json({ message: "Listing added!", id: newListingRef.id });
  } catch (error) {
    console.error("Error adding listing:", error);
    res.status(500).json({ error: error.message });
  }
});
// Get all listings from Firestore
router.get("/get-listings", async (req, res) => {
  try {
    const listingsSnapshot = await db.collection("listings").get();
    const listings = listingsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(listings);
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
