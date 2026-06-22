/**
 * Blood Request Controller
 * Handles blood request creation and management
 */

const BloodRequest = require('../models/BloodRequest');
const Donor = require('../models/Donor');

/**
 * Create a new blood request
 */
exports.createRequest = async (req, res) => {
    try {
        const requestData = {
            ...req.body,
            patient_id: req.user.id
        };
        
        const requestId = await BloodRequest.create(requestData);
