const express = require('express');
const router = express.Router();
const restaurants = require('../config/restaurantsData');

/**
 * @route   GET /api/restaurants
 * @desc    Get verified Noida restaurant options for the romantic date
 * @access  Public
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    count: restaurants.length,
    data: restaurants
  });
});

module.exports = router;
