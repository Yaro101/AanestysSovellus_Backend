// We need to know what is the model of voting polls and user / admin needed by the front end devs

const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: [{ name: String, votes: { type: Number, default: 0 } }]
});

module.exports = mongoose.model('Poll', pollSchema);

// Both models for polls and user are for testing and replaceable with Tuomas models