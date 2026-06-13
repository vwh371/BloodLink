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
