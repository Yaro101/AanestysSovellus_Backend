// we can update the schema (user model) based on our need

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    votedPolls: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Poll' }]
});

module.exports = mongoose.model('User', userSchema);
