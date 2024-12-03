// We need authentication controlls for login and registering

// bcryptjs for securely hashing and comparing passwords
// jsonwebtoken for handling user authentication via JWTs

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
exports.register = async (req, res) => {
    const { username, password, role } = req.body;

    // Check for missing fields
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    // Validate the role field
    const validRoles = ['user', 'admin'];
    if (role && !validRoles.includes(role)) {
        return res.status(400).json({ message: 'Invalid role provided' });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists, you cannot have multiple accounts for voting' });
        }

        // Hash the password and create the user
        const hashedPassword = await bcrypt.hash(password, 10);
        const userRole = role || 'user'; // Default to 'user' if role is not provided
        const user = new User({ username, password: hashedPassword, role: userRole });

        await user.save();

        // Return success message
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
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const user = await User.findOne({ username });
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
                { userId: user._id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            res.status(200).json({ message: 'Logged in successfully', token });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
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
// Added check (catch) if not on production environment to prevent sensitive data from being logged