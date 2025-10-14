const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer config for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// @desc    Upload image
// @route   POST /api/uploads
// @access  Private/Admin
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'rea-properties' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    res.json({ imageUrl: result.secure_url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
