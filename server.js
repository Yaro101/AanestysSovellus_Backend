// express for building the server and handling routes
// cors to enable cross-origin resource sharing, allowing the frontend to communicate with the backend

// dotenv for managing environment variables (MongoDB URI that include the db password, JWT secret)

const express = require('express');
const connectDB = require('./config/db'); 
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/options', require('./routes/pollRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// 18.11.24: Added description to dependencies for clarification and maybe useful in the presentation when explaining what we used and why
// 18.11.24: While changing password try to keep password only alphabetical because special characters need encoding this made quite a mess
