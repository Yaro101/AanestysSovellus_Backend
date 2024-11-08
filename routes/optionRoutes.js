// After the models we do the routes for the option that would be voted/displayed/needed for numbers or percentages

const express = require('express');
const router = express.Router();
const Poll = require('../models/Poll');


// get kaikki options 
router.get('/', async (req, res) => {
    try {
        const polls = await Poll.find();
        res.json(polls);
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
});

// get yksittäinen option
router.get('/:id', async (req, res) => {
    try {
        const Poll = await Poll.findById(req.params.id);
        if (!option) return res.status(404).json({ message: 'Poll not found'});
        res.json(option);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});


// luo optionin
router.post('/', async (req, res) => {
    const poll = new Poll({
        name: req.body.name,
        votes: req.body.votes
        });

    try {
        const newPoll = await poll.save();
        res.status(201).json(newPoll);
    } catch (error) {
        res.status(400).json({ message: error.message});
    }
});

// päivittää optionin
router.put('/:id', async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id);
        if (!poll) return res.status(404).json({ message: 'Poll not found'});

        poll.name = req.body.name || poll.name;
        poll.votes = req.body.votes || poll.votes;

        const updatedPoll = await poll.save();
        res.json(updatedPoll);
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
});


// poistaa optionin
router.delete('/:id', async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id);
        if (!poll) return res.status(404).json ({ message: 'Option not found'});

        await poll.remove();
        res.json({message: 'Poll deleted'});
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
});

module.exports = router;