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
    
}

module.exports = Donor;