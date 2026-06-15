/**
 * Maps Routes
 */

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const mapsController = require('../controllers/mapsController');

router.get('/nearby-donors-map', protect, mapsController.getNearbyDonorsOnMap);
router.post('/geocode', protect, mapsController.geocodeAddress);
router.get('/distance', protect, mapsController.calculateDonorDistance);
router.get('/hospitals', protect, mapsController.getHospitalSuggestions);

module.exports = router;