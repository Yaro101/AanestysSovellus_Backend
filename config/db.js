// We can make a template so the app can have a db like mongodb instead of local for example or we make a local db.json

// MangoDB url is stored in .env locally so each can test it

// mongoose to interact with MongoDB

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
