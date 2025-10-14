const express = require('express');
const Property = require('../models/Property');
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
router.put('/users/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.role = req.body.role || user.role;

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
router.delete('/users/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      await user.remove();
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all properties for admin
// @route   GET /api/admin/properties
// @access  Private/Admin
router.get('/properties', protect, admin, async (req, res) => {
  try {
    const properties = await Property.find({});
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create property
// @route   POST /api/admin/properties
// @access  Private/Admin
router.post('/properties', protect, admin, async (req, res) => {
  try {
    const property = new Property(req.body);
    const createdProperty = await property.save();
    res.status(201).json(createdProperty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update property
// @route   PUT /api/admin/properties/:id
// @access  Private/Admin
router.put('/properties/:id', protect, admin, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

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

// @desc    Delete property
// @route   DELETE /api/admin/properties/:id
// @access  Private/Admin
router.delete('/properties/:id', protect, admin, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (property) {
      await property.remove();
      res.json({ message: 'Property removed' });
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProperties = await Property.countDocuments();
    const avgPrice = await Property.aggregate([
      { $group: { _id: null, avgPrice: { $avg: '$price' } } },
    ]);
    const topCities = await Property.aggregate([
      { $group: { _id: '$location.city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    res.json({
      totalUsers,
      totalProperties,
      avgPrice: avgPrice[0]?.avgPrice || 0,
      topCities,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
