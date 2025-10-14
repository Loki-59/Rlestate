const express = require('express');
const Favorite = require('../models/Favorite');
const Property = require('../models/Property');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Get user's favorites
// @route   GET /api/favorites
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id }).populate('property');
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Add property to favorites
// @route   POST /api/favorites
// @access  Private
router.post('/', protect, async (req, res) => {
  const { propertyId } = req.body;

  try {
    const existingFavorite = await Favorite.findOne({ user: req.user._id, property: propertyId });

    if (existingFavorite) {
      return res.status(400).json({ message: 'Property already in favorites' });
    }

    const favorite = new Favorite({
      user: req.user._id,
      property: propertyId,
    });

    const createdFavorite = await favorite.save();
    await createdFavorite.populate('property');
    res.status(201).json(createdFavorite);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Remove property from favorites
// @route   DELETE /api/favorites/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const favorite = await Favorite.findOne({ _id: req.params.id, user: req.user._id });

    if (favorite) {
      await favorite.remove();
      res.json({ message: 'Favorite removed' });
    } else {
      res.status(404).json({ message: 'Favorite not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
