const mongoose = require('mongoose');

const savedSearchSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  filters: {
    city: String,
    state: String,
    minPrice: Number,
    maxPrice: Number,
    bedrooms: Number,
    propertyType: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('SavedSearch', savedSearchSchema);
