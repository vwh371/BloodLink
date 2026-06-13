-- =============================================
-- BloodLink AI - Database Schema
-- AI-Powered Blood Donation Management System
-- =============================================

-- Step 1: Create Database
-- =============================================
CREATE DATABASE IF NOT EXISTS bloodlink_ai;
USE bloodlink_ai;

-- =============================================
-- Step 2: Users Table
-- Stores all user information (donors, patients, admins)
-- =============================================
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Unique user ID',
    name VARCHAR(100) NOT NULL COMMENT 'User full name',
    email VARCHAR(100) UNIQUE NOT NULL COMMENT 'Email for login (unique)',
    password VARCHAR(255) NOT NULL COMMENT 'Hashed password',
    phone VARCHAR(15) COMMENT 'Contact phone number',
    user_type ENUM('donor', 'patient', 'admin') DEFAULT 'patient' COMMENT 'User role type',
    is_active BOOLEAN DEFAULT TRUE COMMENT 'Account active status',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Registration timestamp',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp',
    
    INDEX idx_email (email),
    INDEX idx_user_type (user_type),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Users table for authentication';

-- =============================================
-- Step 3: Donors Table
-- Stores donor-specific information and location
-- =============================================
CREATE TABLE IF NOT EXISTS donors (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Unique donor ID',
    user_id INT UNIQUE COMMENT 'Reference to users table',
    blood_group ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL COMMENT 'Blood type',
    latitude DECIMAL(10, 8) COMMENT 'Geographic latitude for mapping',
    longitude DECIMAL(11, 8) COMMENT 'Geographic longitude for mapping',
    address TEXT COMMENT 'Full address',
    city VARCHAR(100) COMMENT 'City name',
    state VARCHAR(100) COMMENT 'State name',
    pincode VARCHAR(10) COMMENT 'Postal code',
    is_available BOOLEAN DEFAULT TRUE COMMENT 'Donation availability status',
    last_donation_date DATE COMMENT 'Last donation date for eligibility check',
    donation_count INT DEFAULT 0 COMMENT 'Total number of donations',
    verified BOOLEAN DEFAULT FALSE COMMENT 'Admin verification status',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Profile creation date',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Profile update date',
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_blood_group (blood_group),
    INDEX idx_availability (is_available),
    INDEX idx_verified (verified),
    INDEX idx_location (latitude, longitude),
    INDEX idx_city (city)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Donor profiles with location data';
