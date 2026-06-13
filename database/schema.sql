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

-- =============================================
-- Step 4: Blood Requests Table
-- Stores blood requests from patients
-- =============================================
CREATE TABLE IF NOT EXISTS blood_requests (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Unique request ID',
    patient_id INT COMMENT 'Reference to requester user',
    blood_group ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL COMMENT 'Required blood type',
    urgency ENUM('normal', 'urgent', 'critical') DEFAULT 'normal' COMMENT 'Request priority level',
    units_needed INT DEFAULT 1 COMMENT 'Number of blood units required',
    location_lat DECIMAL(10, 8) COMMENT 'Request location latitude',
    location_lng DECIMAL(11, 8) COMMENT 'Request location longitude',
    hospital_name VARCHAR(200) COMMENT 'Hospital name where blood is needed',
    patient_name VARCHAR(100) COMMENT 'Patient name',
    contact_phone VARCHAR(15) COMMENT 'Contact number for coordination',
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Request creation timestamp',
    status ENUM('pending', 'matched', 'fulfilled', 'cancelled') DEFAULT 'pending' COMMENT 'Request status',
    description TEXT COMMENT 'Additional details or medical notes',
    
    FOREIGN KEY (patient_id) REFERENCES users(id),
    INDEX idx_blood_group (blood_group),
    INDEX idx_status (status),
    INDEX idx_urgency (urgency),
    INDEX idx_request_date (request_date),
    INDEX idx_location (location_lat, location_lng)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Blood requests from patients';

-- =============================================
-- Step 5: Request Matches Table
-- Stores AI-generated donor matches for requests
-- =============================================
CREATE TABLE IF NOT EXISTS request_matches (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Unique match ID',
    request_id INT COMMENT 'Blood request ID',
    donor_id INT COMMENT 'Matched donor ID',
    match_score DECIMAL(5, 2) COMMENT 'AI match score (0-100)',
    notified BOOLEAN DEFAULT FALSE COMMENT 'Whether donor was notified',
    responded BOOLEAN DEFAULT FALSE COMMENT 'Whether donor responded',
    accepted BOOLEAN DEFAULT FALSE COMMENT 'Whether donor accepted the request',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Match creation timestamp',
    
    FOREIGN KEY (request_id) REFERENCES blood_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (donor_id) REFERENCES donors(id),
    INDEX idx_request (request_id),
    INDEX idx_donor (donor_id),
    INDEX idx_match_score (match_score),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AI-generated donor matches';
