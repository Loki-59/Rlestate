const express = require('express');
const { getSupportedLocations } = require('../services/estateintel');

const router = express.Router();

// @desc    Get supported locations from EstateIntel API
// @route   GET /api/locations
// @access  Public
router.get('/', async (req, res) => {
  try {
    const locations = await getSupportedLocations();
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
