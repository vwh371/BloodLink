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
    
}

module.exports = Donor;