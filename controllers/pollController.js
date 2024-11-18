// We need authentication for creating polls (needs to respond 200 or error 500) getting polls and voting (success or error) and maybe and getting results?

// We need admin authentication for adding poll or deleting poll and getting results

// Create new poll

// Get all polls

// Vote on a poll

// Get results (does user also get access to results?)

// Admin add a poll (and or an option to a poll)

// Admin remove a poll (and or an option to a poll)

const Poll = require('../models/Poll');
const User = require('../models/User');

// // luo uusi poll
exports.createPoll = async (req, res) => {
    try {
        const { question, options } = req.body;
        const poll = new Poll({ question, options });
        await poll.save();
        res.status(201).json(poll);
    } catch (error) {
        res.status(500).json({ message: 'Error creating poll' });
    }
};

// get kaikki options 
exports.getPolls = async (req, res) => {
    try {
        const polls = await Poll.find();
        res.json(polls);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching polls' });
    }
};

// Vote on a poll
exports.voteOnPoll = async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id);
        const user = await User.findById(req.user.userId);

        if (user.votedPolls.includes(poll._id)) {
            return res.status(403).json({ message: 'User has already voted on this poll' });
        }

        const { optionIndex } = req.body;
        if (poll && poll.options[optionIndex]) {
            poll.options[optionIndex].votes += 1;
            user.votedPolls.push(poll._id);

            await poll.save();
            await user.save();
            res.json({ message: 'Vote recorded' });
        } else {
            res.status(404).json({ message: 'Poll or option not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error voting on poll' });
    }
};

// päivittää poll
 exports.updatePoll = async (req, res) => {
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
};

// Admin: Add an option to poll
exports.addOption = async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id);
        poll.options.push({ name: req.body.name, votes: 0 });
        await poll.save();
        res.json({ message: 'Option added', poll });
    } catch (error) {
        res.status(500).json({ message: 'Error adding option' });
    }
};

// Admin: Remove an option from poll
exports.removeOption = async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id);
        poll.options.id(req.body.optionId).remove();
        await poll.save();
        res.json({ message: 'Option removed', poll });
    } catch (error) {
        res.status(500).json({ message: 'Error removing option' });
    }
};

// poistaa optionin
exports.removePoll = async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id);
        if (!poll) return res.status(404).json ({ message: 'Poll not found'});

        await poll.remove();
        res.json({message: 'Poll deleted'});
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
};

// Admin: Get poll results
exports.getResults = async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id);
        res.json({ results: poll.options });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching results' });
    }
};



// @ Tuomas we should move the controllers (create, remove, get...) to this file then export it tothe pollRoutes

// migrated Tuomas pollControllers from pollRoutes to here

// 16.11.24: Adding options needs debugging
