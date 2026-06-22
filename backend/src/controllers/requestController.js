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
        
        // Find matching donors
        const nearbyDonors = await Donor.getNearbyDonors(
            requestData.location_lat,
            requestData.location_lng,
            requestData.blood_group,
            20
        );
        
        res.status(201).json({
            success: true,
            message: 'Blood request created successfully',
            request_id: requestId,
            matched_donors_count: nearbyDonors.length
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
