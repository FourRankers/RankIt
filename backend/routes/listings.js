const express = require('express');
const router = express.Router();

// Example route:
router.get('/', (req, res) => {
    res.json({ message: 'Listings route is working!' });
});

module.exports = router;