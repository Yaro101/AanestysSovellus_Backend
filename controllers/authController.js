// We need authentication controlls for login and registering

// bcryptjs for securely hashing and comparing passwords
// jsonwebtoken for handling user authentication via JWTs

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { isAdmin } = require('../middlware/authMiddleware');

// Register a new user
exports.register = async (req, res) => {
    const { username, password, role } = req.body;

    // Check for missing fields
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        // Check if user already exist
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists, you cannot have multi accounts for voting' });
        }

        // Hash the password and create new user
        const hashedPassword = await bcrypt.hash(password, 10);
        // Extracting the user role for the response message
        const userRole = role || 'user'; // Default to 'user' if role is not provided
        // Create new user
        const user = new User({ username, password: hashedPassword, role: userRole });
        await user.save();
        const roleMessage = userRole === 'admin' ? 'Admin' : 'User'; 
        res.status(201).json({ message: `${roleMessage}registered successfully` });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user' });
    }
};

// Login and generate token
exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' })
    }
    try {
        const user = await User.findOne({ username });
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ token });
            res.status(200).json({ message: 'Logged in successfully' });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).json({ message: 'Error logging in SSS', error: error.message });
    }
};


// 19.11.24: added checks -> empty username or password, existing user
// 20.11.24: Added dynamic roleName in response message