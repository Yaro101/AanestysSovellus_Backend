// After the models we do the routes for the option that would be voted/displayed/needed for numbers or percentages

const express = require('express');
const router = express.Router();
const Option = require('../models/Option');


// get kaikki options
router.get('/', async (req, res) => {
    try {
        const options = await Option.find();
        res.json(options);
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
});

// get yksittäinen option
router.get('/:id', async (req, res) => {
    try {
        const option = await Option.findById(req.params.id);
        if (!option) return res.status(404).json({ message: 'Option not found'});
        res.json(option);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});


// luo optionin
router.post('/', async (req, res) => {
    const option = new Option({
        name: req.body.name,
        votes: req.body.votes
        });

    try {
        const newOption = await option.save();
        res.status(201).json(newOption);
    } catch (error) {
        res.status(400).json({ message: error.message});
    }
});

// päivittää optionin
router.put('/:id', async (req, res) => {
    try {
        const option = await Option.findById(req.params.id);
        if (!option) return res.status(404).json({ message: 'Option not found'});

        option.name = req.body.name || option.name;
        option.votes = req.body.votes || option.votes;

        const updatedOption = await option.save();
        res.json(updatedOption);
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
});


// poistaa optionin
router.delete('/:id', async (req, res) => {
    try {
        const option = await Option.findById(req.params.id);
        if (!option) return res.status(404).json ({ message: 'Option not found'});

        await option.remove();
        res.json({message: 'Option deleted'});
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
});

module.exports = router;