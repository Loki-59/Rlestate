const express = require('express');
const Property = require('../models/Property');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Get user's properties
// @route   GET /api/user/properties
// @access  Private
router.get('/properties', protect, async (req, res) => {
  try {
    const properties = await Property.find({ user: req.user._id });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create user property
// @route   POST /api/user/properties
// @access  Private
router.post('/properties', protect, async (req, res) => {
  try {
    const property = new Property({
      ...req.body,
      user: req.user._id,
    });
    const createdProperty = await property.save();
    res.status(201).json(createdProperty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update user property
// @route   PUT /api/user/properties/:id
// @access  Private
router.put('/properties/:id', protect, async (req, res) => {
  try {
    const property = await Property.findOne({ _id: req.params.id, user: req.user._id });

    if (property) {
      Object.assign(property, req.body);
      const updatedProperty = await property.save();
      res.json(updatedProperty);
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete user property
// @route   DELETE /api/user/properties/:id
// @access  Private
router.delete('/properties/:id', protect, async (req, res) => {
  try {
    const property = await Property.findOne({ _id: req.params.id, user: req.user._id });

    if (property) {
      await Property.deleteOne({ _id: property._id });
      res.json({ message: 'Property removed' });
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
