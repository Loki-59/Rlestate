const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    neighborhood: {
      type: String,
    },
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  price: {
    type: Number,
    required: true,
  },
  bedrooms: {
    type: Number,
    required: true,
  },
  bathrooms: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  dateListed: {
    type: Date,
    default: Date.now,
  },
  propertyType: {
    type: String,
    enum: ['Apartment', 'Duplex', 'Villa', 'House', 'Condo'],
    default: 'House',
  },
  forSale: {
    type: Boolean,
    default: true,
  },
  forRent: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

module.exports = mongoose.model('Property', propertySchema);
