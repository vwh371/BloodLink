/**
 * Google Maps Service
 * Handles all Google Maps API interactions
 */

const { Client } = require('@googlemaps/google-maps-services-js');

const googleMapsClient = new Client({});

class GoogleMapsService {
    
    /**
     * Convert address to geographic coordinates (geocoding)
     */
    static async geocodeAddress(address) {
        try {
            const response = await googleMapsClient.geocode({
                params: {
                    address: address,
                    key: process.env.GOOGLE_MAPS_API_KEY
                }
            });
            
            if (response.data.results && response.data.results.length > 0) {
                const location = response.data.results[0].geometry.location;
                return {
                    success: true,
                    latitude: location.lat,
                    longitude: location.lng,
                    formatted_address: response.data.results[0].formatted_address
                };
            }
            return { success: false, error: 'Address not found' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    