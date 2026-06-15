/**
 * Donor Routes
 */

const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { registerDonor, updateAvailability, getDonorProfile, getAllDonors } = require('../controllers/donorController');

router.post('/register', protect, registerDonor);
router.put('/availability', protect, updateAvailability);
router.get('/profile', protect, getDonorProfile);
router.get('/all', protect, adminOnly, getAllDonors);

module.exports = router;