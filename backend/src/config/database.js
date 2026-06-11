/**
 * Database Configuration Module
 * Handles MySQL connection pool, table creation, and database initialization
 */

const mysql = require('mysql2');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

// Create MySQL connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise();

/**
 * Test database connection
 */
const testConnection = async () => {
    try {
        const connection = await promisePool.getConnection();
        console.log('✅ MySQL Database connected');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
};

/**
 * Initialize database tables
 */
const initDatabase = async () => {
    try {
        // Users table
        await promisePool.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                phone VARCHAR(15),
                user_type ENUM('donor', 'patient', 'admin') DEFAULT 'patient',
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        // Donors table
        await promisePool.execute(`
            CREATE TABLE IF NOT EXISTS donors (
                id INT PRIMARY KEY AUTO_INCREMENT,
                user_id INT UNIQUE,
                blood_group ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
                latitude DECIMAL(10, 8),
                longitude DECIMAL(11, 8),
                address TEXT,
                city VARCHAR(100),
                is_available BOOLEAN DEFAULT TRUE,
                last_donation_date DATE,
                donation_count INT DEFAULT 0,
                verified BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        
        
        console.log('✅ Database tables ready');
    } catch (error) {
        console.error('Database init error:', error.message);
    }
};

module.exports = { pool: promisePool, testConnection, initDatabase };