const express = require('express');
const router = express.Router();
const { addPoll } = require('./pollController');

router.post('/addPoll', addPoll);

module.exports = router;

// 13.11.2024 Added a new route to hande the poll addition