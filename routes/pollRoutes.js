// After the models we do the routes for the option that would be voted/displayed/needed for numbers or percentages

// Moved to pollController

// const express = require('express');
// const router = express.Router();
// const Poll = require('../models/Poll');


// // get kaikki options 
// router.get('/', async (req, res) => {
//     try {
//         const polls = await Poll.find();
//         res.json(polls);
//     } catch (error) {
//         res.status(500).json({ message: error.message});
//     }
// });

// // get yksittäinen option
// router.get('/:id', async (req, res) => {
//     try {
//         const Poll = await Poll.findById(req.params.id);
//         if (!option) return res.status(404).json({ message: 'Poll not found'});
//         res.json(option);
//     } catch (error) {
//         res.status(500).json({message: error.message});
//     }
// });


// // luo optionin
// router.post('/', async (req, res) => {
//     const poll = new Poll({
//         name: req.body.name,
//         votes: req.body.votes
//         });

//     try {
//         const newPoll = await poll.save();
//         res.status(201).json(newPoll);
//     } catch (error) {
//         res.status(400).json({ message: error.message});
//     }
// });

// // päivittää optionin
// router.put('/:id', async (req, res) => {
//     try {
//         const poll = await Poll.findById(req.params.id);
//         if (!poll) return res.status(404).json({ message: 'Poll not found'});

//         poll.name = req.body.name || poll.name;
//         poll.votes = req.body.votes || poll.votes;

//         const updatedPoll = await poll.save();
//         res.json(updatedPoll);
//     } catch (error) {
//         res.status(500).json({ message: error.message});
//     }
// });


// // poistaa optionin
// router.delete('/:id', async (req, res) => {
//     try {
//         const poll = await Poll.findById(req.params.id);
//         if (!poll) return res.status(404).json ({ message: 'Option not found'});

//         await poll.remove();
//         res.json({message: 'Poll deleted'});
//     } catch (error) {
//         res.status(500).json({ message: error.message});
//     }
// });

// module.exports = router;


const express = require('express');
const {
    createPoll,
    getPolls,
    voteOnPoll,
    updatePoll,
    addOption,
    removeOption,
    removePoll,
    getResults,
    getPollById
} = require('../controllers/pollController');

const { verifyToken, isAdmin, isUser } = require('../middlware/authMiddleware');
const router = express.Router();

// Routes are protected with verifyToken (and isAdmin where necessary)
router.post('/', verifyToken, isAdmin, createPoll); // Only admins can create a poll
router.get('/', verifyToken, getPolls); // All users can view the polls
router.get('/:id', getPollById); // All users can view the poll
router.post('/:id/vote', verifyToken, voteOnPoll, isUser); // All users can vote on a poll
router.post('/:id/add-option', verifyToken, isAdmin, addOption); // Only admins can add options
router.patch('/:id/update-poll', verifyToken, isAdmin, updatePoll); // Only admins can update a poll
router.delete('/:id/remove-option', verifyToken, isAdmin, removeOption); // Only admins can remove options
router.delete('/:id', verifyToken, isAdmin, removePoll); // Only admins can remove a poll
router.get('/:id/results', verifyToken, isAdmin, getResults); // Only admins can view results

module.exports = router;


// 18.11.24: Adapted to only routes and separated poll controllers to pollControllers.js
// 18.11.24: Added routes for adding/removing options to poll and updating the poll with patch

// 06.11.24: bug related to remove poll due to extra changed from "router.delete('/:id/remove-poll', verifyToken, isAdmin, removePoll)" to router.delete('/:id', verifyToken, isAdmin, removePoll);

// 06.11.24: other routes need rework to remove the excess to avoid similar issue

// 06.11.24: added getPollById to get a single poll by id