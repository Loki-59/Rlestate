const express = require('express');
const Property = require('../models/Property');
const { getResidentialPrices } = require('../services/estateintel');

const router = express.Router();

// @desc    Get average price by city (optionally enhanced with market data)
// @route   GET /api/analytics/avg-price-by-city
// @access  Public
router.get('/avg-price-by-city', async (req, res) => {
  try {
    const { enhanced = false, city, type = 'sale', beds = 3 } = req.query;
    let data = await Property.aggregate([
      {
        $group: {
          _id: '$location.city',
          localAvgPrice: { $avg: '$price' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { localAvgPrice: -1 },
      },
    ]);

    if (enhanced === 'true' && city) {
      try {
        const locationSlug = city.toLowerCase() === 'lagos' ? 'lagos-ikeja' : `${city.toLowerCase()}-central`;
        const marketData = await getResidentialPrices(locationSlug, type, beds);
        const cityData = data.find(d => d._id.toLowerCase() === city.toLowerCase());
        if (cityData) {
          cityData.marketAvgPrice = marketData.average_price;
          cityData.enhancedAvgPrice = (cityData.localAvgPrice + marketData.average_price) / 2;
        } else {
          data.push({
            _id: city,
            localAvgPrice: null,
            count: 0,
            marketAvgPrice: marketData.average_price,
            enhancedAvgPrice: marketData.average_price,
          });
        }
      } catch (marketError) {
        console.warn(`Market data unavailable for ${city}:`, marketError.message);
      }
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get number of listings per city
// @route   GET /api/analytics/listings-per-city
// @access  Public
router.get('/listings-per-city', async (req, res) => {
  try {
    const data = await Property.aggregate([
      {
        $group: {
          _id: '$location.city',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get property price trends over time
// @route   GET /api/analytics/price-trends
// @access  Public
router.get('/price-trends', async (req, res) => {
  try {
    const data = await Property.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$dateListed' },
            month: { $month: '$dateListed' },
          },
          avgPrice: { $avg: '$price' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get total listings, average prices, top cities
// @route   GET /api/analytics/summary
// @access  Public
router.get('/summary', async (req, res) => {
  try {
    const totalListings = await Property.countDocuments();
    const avgPrice = await Property.aggregate([
      { $group: { _id: null, avgPrice: { $avg: '$price' } } },
    ]);
    const topCities = await Property.aggregate([
      { $group: { _id: '$location.city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    res.json({
      totalListings,
      avgPrice: avgPrice[0]?.avgPrice || 0,
      topCities,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get market residential prices from EstateIntel API
// @route   GET /api/analytics/market-prices
// @access  Public
router.get('/market-prices', async (req, res) => {
  try {
    const { location, type = 'sale', beds = 3, country = 'NG' } = req.query;
    if (!location) {
      return res.status(400).json({ message: 'Location slug is required (e.g., lagos-ikeja)' });
    }

    const prices = await getResidentialPrices(location, type, beds, country);
    res.json(prices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// (Removed duplicate enhanced avg-price-by-city route; use /avg-price-by-city with ?enhanced=true&city=CityName)

module.exports = router;
