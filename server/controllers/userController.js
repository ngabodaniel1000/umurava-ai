const User = require('../models/userModel');
const generateToken = require('../config/generateToken');

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        const token = generateToken(user._id);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'development' ? "lax" : "none",
            maxAge: 30 * 24 * 60 * 60 * 1000,   
        });

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            company: user.company,
            avatar: user.avatar,
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, company, role } = req.body;

    if (password.length < 6) {
        res.status(400).json({ message: 'Password must be at least 6 characters long' });
        return;
    }

    if (password.length > 30) {
        res.status(400).json({ message: 'Password must be no more than 30 characters long' });
        return;
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }

    const user = await User.create({
        name,
        email,
        password,
        company,
        role: role || 'recruiter',
    });

    if (user) {
        const token = generateToken(user._id);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'development' ? "lax" : "none",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            company: user.company,
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = async (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            company: user.company,
            avatar: user.avatar,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

module.exports = {
    authUser,
    registerUser,
    getUserProfile,
    logoutUser,
};
