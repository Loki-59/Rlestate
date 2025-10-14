const express = require('express');
const SavedSearch = require('../models/SavedSearch');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Get user's saved searches
// @route   GET /api/saved-searches
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const savedSearches = await SavedSearch.find({ user: req.user._id });
    res.json(savedSearches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a saved search
// @route   POST /api/saved-searches
// @access  Private
router.post('/', protect, async (req, res) => {
  const { name, filters } = req.body;

  try {
    const savedSearch = new SavedSearch({
      user: req.user._id,
      name,
      filters,
    });

    const createdSavedSearch = await savedSearch.save();
    res.status(201).json(createdSavedSearch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update a saved search
// @route   PUT /api/saved-searches/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const savedSearch = await SavedSearch.findOne({ _id: req.params.id, user: req.user._id });

    if (savedSearch) {
      savedSearch.name = req.body.name || savedSearch.name;
      savedSearch.filters = req.body.filters || savedSearch.filters;

      const updatedSavedSearch = await savedSearch.save();
      res.json(updatedSavedSearch);
    } else {
      res.status(404).json({ message: 'Saved search not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a saved search
// @route   DELETE /api/saved-searches/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const savedSearch = await SavedSearch.findOne({ _id: req.params.id, user: req.user._id });

    if (savedSearch) {
      await savedSearch.remove();
      res.json({ message: 'Saved search removed' });
    } else {
      res.status(404).json({ message: 'Saved search not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
