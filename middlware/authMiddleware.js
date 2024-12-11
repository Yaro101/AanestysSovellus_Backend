// We need to know more from the teacher to know what and how many middlwares we need. 

// Admin authentication middlware that we can change or modify based on the previleges the admin have

// User data need to have role either admin or user so when logged if it is user he can vote and if it is admin he can add, remove or update voting options like Tuomas L added in the routes

// jsonwebtoken for handling user authentication via JWTs

const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const tokenParts = token.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        return res.status(401).json({ message: 'Invalid token format' });
    }

    jwt.verify(tokenParts[1], process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = decoded; // adding the decoded user info to the request
        next();
    });
};

exports.isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (user && user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ message: 'Admin role is required' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.isUser = (req, res, next) => {
    if (req.user && req.user.role === 'user') {
        next();
    } else {
        res.status(403).json({ message: 'User role is required' });
    }
};


// middlware for auth and role checking (admin/user)
