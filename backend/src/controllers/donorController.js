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
    } 