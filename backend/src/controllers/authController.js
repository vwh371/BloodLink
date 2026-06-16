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
