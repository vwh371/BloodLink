/**
 * Donor Controller
 * Handles donor registration and management
 */

const Donor = require('../models/Donor');
const GoogleMapsService = require('../services/googleMapsService');

/**
 * Register a new donor
 */
exports.registerDonor = async (req, res) => {
    try {
        const { blood_group, address } = req.body;
        
        const geocodeResult = await GoogleMapsService.geocodeAddress(address);
        if (!geocodeResult.success) {
            return res.status(400).json({ error: 'Invalid address' });
        }
        
        const existingDonor = await Donor.findByUserId(req.user.id);
        if (existingDonor) {
            return res.status(400).json({ error: 'Already registered as donor' });
        }
        
        await Donor.create({
            user_id: req.user.id,
            blood_group,
            latitude: geocodeResult.latitude,
            longitude: geocodeResult.longitude,
            address: geocodeResult.formatted_address,
            city: address.split(',')[0]
        });
        
        res.json({ success: true, message: 'Donor registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * Update donor availability
 */
exports.updateAvailability = async (req, res) => {
    try {
        const { is_available } = req.body;
        await Donor.updateAvailability(req.user.id, is_available);
        res.json({ 
            success: true, 
            message: `Availability updated to ${is_available ? 'Available' : 'Not Available'}` 
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * Get donor profile
 */
exports.getDonorProfile = async (req, res) => {
    try {
        const donor = await Donor.findByUserId(req.user.id);
        res.json({ success: true, donor });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
