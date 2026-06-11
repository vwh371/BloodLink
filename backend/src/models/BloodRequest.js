/**
 * Blood Request Model
 * Handles database operations for blood requests
 */

const { pool } = require('../config/database');

class BloodRequest {
    /**
     * Create a new blood request
     */
    static async create(requestData) {
        const {
            patient_id, blood_group, urgency, units_needed,
            location_lat, location_lng, hospital_name, patient_name,
            contact_phone, description
        } = requestData;
        
        const [result] = await pool.execute(
            `INSERT INTO blood_requests 
             (patient_id, blood_group, urgency, units_needed, location_lat, 
              location_lng, hospital_name, patient_name, contact_phone, description) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [patient_id, blood_group, urgency || 'normal', units_needed || 1,
             location_lat, location_lng, hospital_name, patient_name, contact_phone, description]
        );
        
        return result.insertId;
    }
    
    /**
     * Find request by ID
     */
    static async findById(id) {
        const [rows] = await pool.execute(
            `SELECT * FROM blood_requests WHERE id = ?`,
            [id]
        );
        return rows[0];
    }
    
    /**
     * Find requests by patient ID
     */
    static async findByPatientId(patientId) {
        const [rows] = await pool.execute(
            `SELECT * FROM blood_requests 
             WHERE patient_id = ? 
             ORDER BY request_date DESC`,
            [patientId]
        );
        return rows;
    }
    
    /**
     * Update request status
     */
    static async updateStatus(requestId, status) {
        const [result] = await pool.execute(
            'UPDATE blood_requests SET status = ? WHERE id = ?',
            [status, requestId]
        );
        return result.affectedRows > 0;
    }
    
    /**
     * Get all pending requests
     */
    static async getPendingRequests() {
        const [rows] = await pool.execute(
            `SELECT r.*, u.name as requester_name
             FROM blood_requests r
             JOIN users u ON r.patient_id = u.id
             WHERE r.status = 'pending'
             ORDER BY FIELD(r.urgency, 'critical', 'urgent', 'normal'), r.request_date ASC`
        );
        return rows;
    }
}

module.exports = BloodRequest;