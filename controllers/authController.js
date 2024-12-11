// We need authentication controlls for login and registering

// bcryptjs for securely hashing and comparing passwords
// jsonwebtoken for handling user authentication via JWTs

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const { isAdmin } = require('../middlware/authMiddleware');

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
        const userRole = role || 'user'; // Default to 'user' if role is not provided

        if (existingUser) {
            return res.status(400).json({ message: `${userRole === 'admin' ? 'Admin' : 'User'} already exists, you cannot have multi accounts for voting` });
        }

        // Hash the password and create new user
        const hashedPassword = await bcrypt.hash(password, 10);
        // Extracting the user role for the response message
        // Create new user
        const user = new User({ username, password: hashedPassword, role: userRole });
        await user.save();
        const roleMessage = userRole === 'admin' ? 'Admin' : 'User';
        res.status(201).json({ message: `${roleMessage} registered successfully` });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
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
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if there is JWT_SECRET saved in .env
        if (!process.env.JWT_SECRET) {
            console.warn('JWT_SECRET is not defined. Pleae add it to your environment variables aka .env file')
        }

        // Getting the token and setting 1h expiry security
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Login successful', token, role: user.role });
    } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
            console.error('Error during user login:', error);
        }
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};


// 19.11.24: added checks -> empty username or password, existing user
// 20.11.24: Added dynamic roleName in response message

// removed isAdmin middlware
// Added check (catch) if not on production environment to prevent sensitive data from being logged as error during login

// 03.12.24: Fixed bug in exports.login, where server was trying to send multiple responses for single requests. 
// Added error handlers and return statements to exports.login, these return statements make sure that no further code is executed after the sending a response
// 06.11.24: added log error message
// 06.11.24: added JWT_SECRET warn to catch error due to non existing or badly formatted
// 06.11.24: maybe we should change to 2h expiring time to token

// 11.12.24  Changed login endpoint to also return the role of the user