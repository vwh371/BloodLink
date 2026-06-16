/**
 * Authentication Controller
 * Handles user registration, login, and profile management
 */

const User = require('../models/User');
const Donor = require('../models/Donor');
const jwt = require('jsonwebtoken');
const GoogleMapsService = require('../services/googleMapsService');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

/**
 * Register a new user
 */
exports.register = async (req, res) => {
    try {
        const { name, email, password, phone, user_type, blood_group, address } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        
        // Create user account
        const userId = await User.create({ name, email, password, phone, user_type });
        
        // If registering as donor, create donor profile
        if (user_type === 'donor' && address) {
            const geocodeResult = await GoogleMapsService.geocodeAddress(address);
            if (geocodeResult.success) {
                await Donor.create({
                    user_id: userId,
                    blood_group,
                    latitude: geocodeResult.latitude,
                    longitude: geocodeResult.longitude,
                    address: geocodeResult.formatted_address,
                    city: address.split(',')[0]
                });
            }
        }
        
        const token = generateToken(userId);
        
        res.status(201).json({
            success: true,
            token,
            user: { id: userId, name, email, user_type }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * Login existing user
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const isPasswordValid = await User.verifyPassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const token = generateToken(user.id);
        
        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                user_type: user.user_type
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * Get current user profile
 */
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        let donorInfo = null;
        
        if (user.user_type === 'donor') {
            donorInfo = await Donor.findByUserId(req.user.id);
        }
        
        res.json({ success: true, user, donor_info: donorInfo });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};