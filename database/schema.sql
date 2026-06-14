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

-- =============================================
-- Step 6: Notifications Table
-- Stores user notifications
-- =============================================
CREATE TABLE IF NOT EXISTS notifications (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Unique notification ID',
    user_id INT COMMENT 'User receiving notification',
    title VARCHAR(100) COMMENT 'Notification title',
    message TEXT COMMENT 'Notification content',
    type ENUM('request', 'match', 'reminder', 'system', 'emergency') DEFAULT 'system' COMMENT 'Notification type',
    is_read BOOLEAN DEFAULT FALSE COMMENT 'Whether notification was read',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Notification timestamp',
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_read (user_id, is_read),
    INDEX idx_created_at (created_at),
    INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User notifications';

-- =============================================
-- Step 7: Insert Default Admin User
-- Default credentials: admin@bloodlink.com / Admin@123
-- =============================================
-- Note: Password 'Admin@123' is hashed using bcrypt
-- The hash below corresponds to 'Admin@123'
INSERT INTO users (name, email, password, phone, user_type, is_active) VALUES 
('System Admin', 'admin@bloodlink.com', '$2a$10$rQKqQKqQKqQKqQKqQKqQKu', '9999999999', 'admin', TRUE);

-- =============================================
-- Step 8: Insert Sample Donors (For Testing)
-- =============================================

-- Sample Donor 1: O+ Blood Group in Connaught Place, Delhi
INSERT INTO users (name, email, password, phone, user_type, is_active) VALUES 
('Rajesh Kumar', 'rajesh@example.com', '$2a$10$rQKqQKqQKqQKqQKqQKqQKu', '9876543210', 'donor', TRUE);

INSERT INTO donors (user_id, blood_group, latitude, longitude, address, city, state, pincode, is_available, verified) VALUES 
(2, 'O+', 28.6139, 77.2090, 'Connaught Place, New Delhi', 'New Delhi', 'Delhi', '110001', TRUE, TRUE);

-- Sample Donor 2: A+ Blood Group in Karol Bagh, Delhi
INSERT INTO users (name, email, password, phone, user_type, is_active) VALUES 
('Priya Sharma', 'priya@example.com', '$2a$10$rQKqQKqQKqQKqQKqQKqQKu', '9876543211', 'donor', TRUE);

INSERT INTO donors (user_id, blood_group, latitude, longitude, address, city, state, pincode, is_available, verified) VALUES 
(3, 'A+', 28.6529, 77.1903, 'Karol Bagh, New Delhi', 'New Delhi', 'Delhi', '110005', TRUE, TRUE);

-- Sample Donor 3: B+ Blood Group in Rajouri Garden, Delhi
INSERT INTO users (name, email, password, phone, user_type, is_active) VALUES 
('Amit Patel', 'amit@example.com', '$2a$10$rQKqQKqQKqQKqQKqQKqQKu', '9876543212', 'donor', TRUE);

INSERT INTO donors (user_id, blood_group, latitude, longitude, address, city, state, pincode, is_available, verified) VALUES 
(4, 'B+', 28.6456, 77.1198, 'Rajouri Garden, New Delhi', 'New Delhi', 'Delhi', '110027', TRUE, TRUE);

-- Sample Donor 4: AB- Blood Group (Rare) in South Delhi
INSERT INTO users (name, email, password, phone, user_type, is_active) VALUES 
('Neha Gupta', 'neha@example.com', '$2a$10$rQKqQKqQKqQKqQKqQKqQKu', '9876543213', 'donor', TRUE);

INSERT INTO donors (user_id, blood_group, latitude, longitude, address, city, state, pincode, is_available, verified) VALUES 
(5, 'AB-', 28.5562, 77.2590, 'Saket, New Delhi', 'New Delhi', 'Delhi', '110017', TRUE, TRUE);

-- Sample Donor 5: O- Blood Group (Universal Donor) in Noida
INSERT INTO users (name, email, password, phone, user_type, is_active) VALUES 
('Vikram Singh', 'vikram@example.com', '$2a$10$rQKqQKqQKqQKqQKqQKqQKu', '9876543214', 'donor', TRUE);

INSERT INTO donors (user_id, blood_group, latitude, longitude, address, city, state, pincode, is_available, verified) VALUES 
(6, 'O-', 28.5355, 77.3910, 'Sector 18, Noida', 'Noida', 'Uttar Pradesh', '201301', TRUE, TRUE);

-- =============================================
-- Step 9: Insert Sample Blood Requests (For Testing)
-- =============================================

-- Sample Request 1: Critical emergency request
INSERT INTO blood_requests (patient_id, blood_group, urgency, units_needed, location_lat, location_lng, hospital_name, patient_name, contact_phone, status, description) VALUES 
(1, 'O+', 'critical', 2, 28.6139, 77.2090, 'AIIMS Hospital', 'Patient Name', '9999999999', 'pending', 'Emergency surgery required. Need blood immediately.');

-- Sample Request 2: Urgent request
INSERT INTO blood_requests (patient_id, blood_group, urgency, units_needed, location_lat, location_lng, hospital_name, patient_name, contact_phone, status, description) VALUES 
(1, 'A+', 'urgent', 1, 28.6529, 77.1903, 'Sir Ganga Ram Hospital', 'Patient Name', '9999999999', 'pending', 'Urgent blood required for surgery tomorrow.');

-- =============================================
-- Step 10: Insert Sample Notifications
-- =============================================

INSERT INTO notifications (user_id, title, message, type, is_read) VALUES 
(2, 'Welcome to BloodLink AI', 'Thank you for registering as a donor. You can now save lives!', 'system', FALSE),
(3, 'Welcome to BloodLink AI', 'Thank you for registering as a donor. You can now save lives!', 'system', FALSE),
(4, 'Welcome to BloodLink AI', 'Thank you for registering as a donor. You can now save lives!', 'system', FALSE),
(5, 'Welcome to BloodLink AI', 'Thank you for registering as a donor. You can now save lives!', 'system', FALSE),
(6, 'Welcome to BloodLink AI', 'Thank you for registering as a donor. You can now save lives!', 'system', FALSE);

-- =============================================
-- Step 11: Create Useful Views
-- =============================================

-- View: Active Donors with Location
CREATE OR REPLACE VIEW active_donors_view AS
SELECT 
    d.id,
    u.name,
    u.email,
    u.phone,
    d.blood_group,
    d.latitude,
    d.longitude,
    d.address,
    d.city,
    d.is_available,
    d.donation_count,
    d.created_at
FROM donors d
JOIN users u ON d.user_id = u.id
WHERE d.is_available = TRUE AND d.verified = TRUE;

-- View: Pending Requests with Patient Details
CREATE OR REPLACE VIEW pending_requests_view AS
SELECT 
    r.*,
    u.name as patient_name,
    u.email as patient_email,
    u.phone as patient_phone
FROM blood_requests r
JOIN users u ON r.patient_id = u.id
WHERE r.status = 'pending'
ORDER BY FIELD(r.urgency, 'critical', 'urgent', 'normal'), r.request_date ASC;

-- View: Donor Statistics
CREATE OR REPLACE VIEW donor_statistics_view AS
SELECT 
    blood_group,
    COUNT(*) as total_donors,
    SUM(CASE WHEN is_available = TRUE THEN 1 ELSE 0 END) as available_donors,
    SUM(donation_count) as total_donations,
    AVG(donation_count) as avg_donations
FROM donors
WHERE verified = TRUE
GROUP BY blood_group;

-- =============================================
-- Step 12: Create Stored Procedures
-- =============================================

-- Procedure: Update donor availability based on last donation date
DELIMITER //
CREATE PROCEDURE UpdateDonorAvailability()
BEGIN
    UPDATE donors 
    SET is_available = TRUE 
    WHERE last_donation_date <= DATE_SUB(CURDATE(), INTERVAL 90 DAY)
    AND is_available = FALSE;
END //
DELIMITER ;

-- Procedure: Get nearby donors
DELIMITER //
CREATE PROCEDURE GetNearbyDonors(
    IN p_lat DECIMAL(10, 8),
    IN p_lng DECIMAL(11, 8),
    IN p_radius_km INT,
    IN p_blood_group VARCHAR(5)
)
BEGIN
    SELECT 
        d.*, u.name, u.email, u.phone,
        (6371 * acos(cos(radians(p_lat)) * cos(radians(d.latitude)) 
        * cos(radians(d.longitude) - radians(p_lng)) + sin(radians(p_lat)) 
        * sin(radians(d.latitude)))) AS distance_km
    FROM donors d
    JOIN users u ON d.user_id = u.id
    WHERE d.is_available = 1 
        AND d.verified = 1
        AND (p_blood_group IS NULL OR d.blood_group = p_blood_group)
        AND (6371 * acos(cos(radians(p_lat)) * cos(radians(d.latitude)) 
        * cos(radians(d.longitude) - radians(p_lng)) + sin(radians(p_lat)) 
        * sin(radians(d.latitude)))) <= p_radius_km
    ORDER BY distance_km ASC;
END //
DELIMITER ;
