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
    
}

module.exports = BloodRequest;