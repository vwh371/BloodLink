/**
 * User Model
 * Handles all database operations related to users
 */

const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    /**
     * Create a new user
     * @param {Object} userData - User registration data
     * @returns {Promise<number>} - New user's ID
     */
    static async create(userData) {
        const { name, email, password, phone, user_type } = userData;
        
        // Hash password for security (never store plain text passwords)
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert user into database
        const [result] = await pool.execute(
            'INSERT INTO users (name, email, password, phone, user_type) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, phone, user_type || 'patient']
        );
        return result.insertId;
    }
  }