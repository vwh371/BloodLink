/**
 * Donor Model
 * Handles database operations for donor profiles and searches
 */

const { pool } = require('../config/database');

class Donor {
    /**
     * Create a new donor profile
     * @param {Object} donorData - Donor registration data
     * @returns {Promise<number>} - New donor's ID
     */
    static async create(donorData) {
        const { user_id, blood_group, latitude, longitude, address, city } = donorData;
        
        const [result] = await pool.execute(
            `INSERT INTO donors (user_id, blood_group, latitude, longitude, address, city) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [user_id, blood_group, latitude, longitude, address, city]
        );
        return result.insertId;
    }
    
    /**
     * Find donor profile by user ID
     * @param {number} userId - User ID
     * @returns {Promise<Object>} - Donor profile with user details
     */
    static async findByUserId(userId) {
        // Join with users table to get name, email, phone
        const [rows] = await pool.execute(
            `SELECT d.*, u.name, u.email, u.phone 
             FROM donors d 
             JOIN users u ON d.user_id = u.id 
             WHERE d.user_id = ?`,
            [userId]
        );
        return rows[0];
    }
    
    /**
     * Update donor's availability status
     * @param {number} userId - User ID
     * @param {boolean} isAvailable - New availability status
     * @returns {Promise<boolean>} - True if updated successfully
     */
    static async updateAvailability(userId, isAvailable) {
        const [result] = await pool.execute(
            'UPDATE donors SET is_available = ? WHERE user_id = ?',
            [isAvailable, userId]
        );
        return result.affectedRows > 0;
    }
    
    /**
     * Find nearby donors using Haversine formula
     * Calculates distance between user and donors using latitude/longitude
     * @param {number} lat - User's latitude
     * @param {number} lng - User's longitude
     * @param {string} bloodGroup - Filter by blood group (optional)
     * @param {number} radiusKm - Search radius in kilometers
     * @returns {Promise<Array>} - List of nearby donors with distances
     */
    static async getNearbyDonors(lat, lng, bloodGroup = null, radiusKm = 20) {
        // Haversine formula calculates great-circle distance between two points on Earth
        // 6371 is Earth's radius in kilometers
        let query = `
            SELECT d.*, u.name, u.email, u.phone,
            (6371 * acos(cos(radians(?)) * cos(radians(d.latitude)) 
            * cos(radians(d.longitude) - radians(?)) + sin(radians(?)) 
            * sin(radians(d.latitude)))) AS distance_km
            FROM donors d
            JOIN users u ON d.user_id = u.id
            WHERE d.is_available = 1 
            AND d.verified = 1
            AND d.latitude IS NOT NULL 
            AND d.longitude IS NOT NULL
        `;
        
        const params = [lat, lng, lat];
        
        // Add blood group filter if specified
        if (bloodGroup && bloodGroup !== 'all') {
            query += ` AND d.blood_group = ?`;
            params.push(bloodGroup);
        }
        
        // Filter by radius and sort by distance (nearest first)
        query += ` HAVING distance_km <= ? ORDER BY distance_km ASC`;
        params.push(radiusKm);
        
        const [rows] = await pool.execute(query, params);
        return rows;
    }
    
}

module.exports = Donor;