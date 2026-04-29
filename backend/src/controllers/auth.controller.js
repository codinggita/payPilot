const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
    try {
        console.log('Registration attempt:', req.body);
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: 'Please provide all fields' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user
        const user = await User.create({
            fullName,
            email,
            password
        });

        if (user) {
            const token = generateToken(user._id);
            console.log('User created with token:', token.substring(0, 50) + '...');
            
            res.status(201).json({
                message: 'User registered successfully',
                token: token,
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email
                }
            });
        }
    } catch (error) {
        console.error('Registration error detail:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
    try {
        console.log('Login attempt:', req.body.email);
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found:', email);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log('Password mismatch for:', email);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = generateToken(user._id);
        console.log('Login successful for:', email, 'Token generated:', token.substring(0, 50) + '...');

        res.status(200).json({
            message: 'Login successful',
            token: token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error detail:', error);
        res.status(500).json({ message: error.message });
    }
};
