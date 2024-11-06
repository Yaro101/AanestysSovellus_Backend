// We need to know what is the model of voting option and user / admin needed by the front end devs

const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: [{ name: String, votes: { type: Number, default: 0 } }]
});

module.exports = mongoose.model('Poll', pollSchema);