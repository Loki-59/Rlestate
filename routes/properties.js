const express = require('express');
const Property = require('../models/Property');
const { getSupportedLocations } = require('../services/estateintel');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Function to validate location against supported locations
const validateLocation = async (city, state, neighborhood) => {
  try {
    const locations = await getSupportedLocations();
    const supportedCities = locations.map(loc => loc.city.toLowerCase());
    const uniqueCities = [...new Set(supportedCities)];

    if (city && !uniqueCities.includes(city.toLowerCase())) {
      const suggestions = uniqueCities.slice(0, 3);
      throw new Error(`Invalid city: ${city}. Supported cities include: ${suggestions.join(', ')}`);
    }

    if (neighborhood) {
      const cityLocations = locations.filter(loc => loc.city.toLowerCase() === city.toLowerCase());
      const supportedNeighborhoods = cityLocations.map(loc => loc.neighborhood.toLowerCase());
      if (!supportedNeighborhoods.includes(neighborhood.toLowerCase())) {
        const suggestions = supportedNeighborhoods.slice(0, 3);
        throw new Error(`Invalid neighborhood: ${neighborhood} for city ${city}. Supported: ${suggestions.join(', ')}`);
      }
    }

    // Assume state validation if needed, but since API doesn't have state, skip or map city to state
    return true;
  } catch (error) {
    throw error;
  }
};

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { city, state, neighborhood, minPrice, maxPrice, bedrooms, propertyType } = req.query;
    let query = {};

    // Validate location using external API
    if (city || neighborhood) {
      await validateLocation(city || '', state || '', neighborhood || '');
    }

    if (city) query['location.city'] = city;
    if (state) query['location.state'] = state;
    if (neighborhood) query['location.neighborhood'] = neighborhood;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (bedrooms) query.bedrooms = Number(bedrooms);
    if (propertyType) query.propertyType = propertyType;

    const properties = await Property.find(query).sort({ dateListed: -1 });
    res.json(properties);
  } catch (error) {
    if (error.message.includes('Invalid')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (property) {
      res.json(property);
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a property
// @route   POST /api/properties
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  const { title, description, location, price, bedrooms, bathrooms, imageUrl, propertyType, forSale, forRent } = req.body;

  try {
    // Validate location if provided
    if (location && (location.city || location.neighborhood)) {
      await validateLocation(location.city || '', location.state || '', location.neighborhood || '');
    }

    const property = new Property({
      title,
      description,
      location,
      price,
      bedrooms,
      bathrooms,
      imageUrl,
      propertyType,
      forSale,
      forRent,
      createdBy: req.user._id,
    });

    const createdProperty = await property.save();
    res.status(201).json(createdProperty);
  } catch (error) {
    if (error.message.includes('Invalid')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update a property
// @route   PUT /api/properties/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (property) {
      const newLocation = req.body.location || property.location;
      // Validate updated location if changed
      if (newLocation && (newLocation.city || newLocation.neighborhood)) {
        await validateLocation(newLocation.city || '', newLocation.state || '', newLocation.neighborhood || '');
      }

      property.title = req.body.title || property.title;
      property.description = req.body.description || property.description;
      property.location = newLocation;
      property.price = req.body.price || property.price;
      property.bedrooms = req.body.bedrooms || property.bedrooms;
      property.bathrooms = req.body.bathrooms || property.bathrooms;
      property.imageUrl = req.body.imageUrl || property.imageUrl;
      property.propertyType = req.body.propertyType || property.propertyType;
      property.forSale = req.body.forSale !== undefined ? req.body.forSale : property.forSale;
      property.forRent = req.body.forRent !== undefined ? req.body.forRent : property.forRent;

      const updatedProperty = await property.save();
      res.json(updatedProperty);
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
    if (error.message.includes('Invalid')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a property
// @route   DELETE /api/properties/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
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

module.exports = router;
