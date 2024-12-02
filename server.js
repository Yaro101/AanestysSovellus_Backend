// express for building the server and handling routes
// cors to enable cross-origin resource sharing, allowing the frontend to communicate with the backend

// dotenv for managing environment variables (MongoDB URI that include the db password, JWT secret)
// 20.11.24: Yaro: can we change this part...

const express = require('express');
const connectDB = require('./config/db'); 
const cors = require('cors');
require('dotenv').config();

const app = express();

// Use express.json() to parse incoming JSON payloads
app.use(express.json());

app.use(cors());

connectDB();

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/polls', require('./routes/pollRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// 18.11.24: Added description to dependencies for clarification and maybe useful in the presentation when explaining what we used and why
// 18.11.24: While changing password try to keep password only alphabetical because special characters need encoding this made quite a mess
// 19.11.24: moved up express.json() middlware
// 19.11.24: Testing routes and auths and if the role user/admin is working as it should
// 19.11.24: Added functionalities to poll schema (created by, timestamp and datestamp and duplicate check for options)
// 19.11.24: Added validation to prevent multiple votes to pollSchema, added increment and votedBy
// 25.11.24: Added input validation to createPoll
