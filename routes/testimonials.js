const express = require('express');
const Testimonial = require('../models/Testimonial.js');
const { protect } = require('../middleware/auth.js');

const router = express.Router();

// @desc    Submit testimonial
// @route   POST /api/testimonials
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const testimonial = new Testimonial({
      user: req.user._id,
      name: req.body.name,
      email: req.body.email,
      message: req.body.message,
      rating: req.body.rating,
    });

    const createdTestimonial = await testimonial.save();
    res.status(201).json(createdTestimonial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public
router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({}).populate('user', 'name');
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update testimonial
// @route   PUT /api/testimonials/:id
// @access  Private/Admin
router.put('/:id', protect, async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (testimonial) {
      testimonial.name = req.body.name || testimonial.name;
      testimonial.email = req.body.email || testimonial.email;
      testimonial.message = req.body.message || testimonial.message;
      testimonial.rating = req.body.rating || testimonial.rating;
      testimonial.isApproved = req.body.isApproved !== undefined ? req.body.isApproved : testimonial.isApproved;

      const updatedTestimonial = await testimonial.save();
      res.json(updatedTestimonial);
    } else {
      res.status(404).json({ message: 'Testimonial not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private/Admin
router.delete('/:id', protect, async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (testimonial) {
      await testimonial.deleteOne();
      res.json({ message: 'Testimonial removed' });
    } else {
      res.status(404).json({ message: 'Testimonial not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
