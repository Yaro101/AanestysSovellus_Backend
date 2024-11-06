// We need to know more from the teacher to know what and how many middlwares we need. 

// Admin authentication middlware that we can change or modify based on the previleges the admin have

// User data need to have role either admin or user so when logged if it is user he can vote and if it is admin he can add, remove or update voting options like Tuomas L added in the routes

const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

exports.isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    next();
};
