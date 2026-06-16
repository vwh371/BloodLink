/**
 * Maps Controller
 * Handles Google Maps related API endpoints
 */

const GoogleMapsService = require('../services/googleMapsService');
const Donor = require('../models/Donor');

/**
 * Get nearby donors for display on map
 */
exports.getNearbyDonorsOnMap = async (req, res) => {
    try {
        const { lat, lng, blood_group, radius = 20 } = req.query;
        
        if (!lat || !lng) {
            return res.status(400).json({ error: 'Location required' });
        }
        
        // Find donors within radius
        const donors = await Donor.getNearbyDonors(
            parseFloat(lat), parseFloat(lng), blood_group, parseFloat(radius)
        );
        
        // Get user's location address
        const locationDetails = await GoogleMapsService.reverseGeocode(
            parseFloat(lat), parseFloat(lng)
        );
        
        // Find nearby hospitals
        const nearbyHospitals = await GoogleMapsService.findNearbyHospitals(
            parseFloat(lat), parseFloat(lng), 10000
        );
        
        res.json({
            success: true,
            user_location: {
                lat: parseFloat(lat),
                lng: parseFloat(lng),
                address: locationDetails.success ? locationDetails.address : null
            },
            donors: donors.map(donor => ({
                ...donor,
                distance_km: parseFloat(donor.distance_km).toFixed(1)
            })),
            nearby_hospitals: nearbyHospitals.success ? nearbyHospitals.places : [],
            count: donors.length
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * Convert address to coordinates
 */
exports.geocodeAddress = async (req, res) => {
    try {
        const { address } = req.body;
        const result = await GoogleMapsService.geocodeAddress(address);
        
        if (result.success) {
            res.json({ success: true, data: result });
        } else {
            res.status(404).json({ error: result.error });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
