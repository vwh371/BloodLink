/**
 * Blood Request Routes
 */

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createRequest, getMyRequests, getPendingRequests } = require('../controllers/requestController');

router.post('/create', protect, createRequest);
router.get('/my-requests', protect, getMyRequests);
router.get('/pending', protect, getPendingRequests);

module.exports = router;