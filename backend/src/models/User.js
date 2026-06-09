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
    
    /**
     * Find user by email (used for login)
     * @param {string} email - User's email address
     * @returns {Promise<Object>} - User object or null
     */
    static async findByEmail(email) {
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return rows[0];
    }
    
    /**
     * Find user by ID
     * @param {number} id - User ID
     * @returns {Promise<Object>} - User object without password
     */
    static async findById(id) {
        // Exclude password from results for security
        const [rows] = await pool.execute(
            'SELECT id, name, email, phone, user_type, is_active, created_at FROM users WHERE id = ?',
            [id]
        );
        return rows[0];
    }
  }

module.exports = User;