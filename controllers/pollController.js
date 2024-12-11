// We need authentication for creating polls (needs to respond 200 or error 500) getting polls and voting (success or error) and maybe and getting results?

// We need admin authentication for adding poll or deleting poll and getting results

// Create new poll

// Get all polls

// Vote on a poll

// Get results (does user also get access to results?)

// Admin add a poll (and or an option to a poll)

// Admin remove a poll (and or an option to a poll)

const Poll = require('../models/Poll');
const { verifyToken, isAdmin } = require('../middlware/authMiddleware');
const User = require('../models/User');

// // luo uusi poll (Admin only)
exports.createPoll = async (req, res) => {
    const { question, options } = req.body;
    // Validating input
    if (!question || !Array.isArray(options) || options.length < 2) {
        return res.status(400).json({ message: 'The poll must have at least 2 options' })
    }

    try {
        // Admin user is already verified through the 'isAdmin' middleware and then assigned to createdBy automatically
        const createdBy = req.user.id;
        const poll = new Poll({ question, options, createdBy });
        await poll.save();
        res.status(201).json({ message: 'Poll created successfully', poll });
    } catch (error) {
        console.error('Error creating poll:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
// get kaikki options 
exports.getPolls = async (req, res) => {
    try {
        const polls = await Poll.find();
        res.json(polls);
    } catch (error) {
        // logging the error
        console.error('Error fetching polls', error)
        res.status(500).json({ message: 'Error fetching polls' });
    }
};

// Vote on a poll (Logged in user)
exports.voteOnPoll = async (req, res) => {
    const { id } = req.params; // Getting the poll id from url
    const { optionId } = req.body; // getiing the option id the user voted for
    const userId = req.user.id;  // Getting the logged in user's id from the token

    try {
        const poll = await Poll.findById(id);
        if (!poll) {
            return res.status(404).json({ message: 'Poll not found' })
        };
        // Check if user already voted
        if (poll.votedBy.includes(userId)) {
            return res.status(400).json({ message: 'You have already voted on this poll' });
        }

        // selecting the option and incrementing votes
        const option = poll.options.id(optionId);
        if (!option) {
            return res.status(404).json({ message: 'Option not found' });
        }
        option.votes += 1;

        // make sure userId is valid before pushing it to the votedBy array
        if (userId) {
            poll.votedBy.push(userId);
        }

        await poll.save(); // saving the poll
        res.status(200).json({ message: 'Vote recorded', poll });

    } catch (error) {
        res.status(500).json({ message: 'Error voting on poll', error: error.message });
    }
};

// päivittää poll (Admin role)
exports.updatePoll = async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id);
        if (!poll) return res.status(404).json({ message: 'Poll not found' });

        if (req.body.question) poll.question = req.body.question
        if (req.body.options && Array.isArray(req.body.options)) {
            poll.options = req.body.options.map(opt => ({ name: opt.name, votes: opt.votes || 0 }))
        }

        const updatedPoll = await poll.save();
        res.json({ message: 'Poll updated successfully', updatedPoll });
    } catch (error) {
        // Logging the error
        console.error('Error updating poll', error)
        res.status(500).json({ message: 'Error updating the poll', error: error.message });
    }
};

// Add an option to poll (Admin)
exports.addOption = async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id);
        if (!poll) return res.status(404).json({ message: 'Poll not found' })
        if (!req.body.name) {
            return res.status(400).json({ message: 'Option name is required' })
        }
        poll.options.push({ name: req.body.name, votes: 0 });
        await poll.save();

        res.json({ message: 'Option added successfully', poll });
    } catch (error) {
        console.error('Error adding option')
        res.status(500).json({ message: 'Error adding option', error: error.message });
    }
};

//  Admin: Remove an option from poll
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

// poistaa optionin (Admin)
exports.removePoll = async (req, res) => {
    try {
        const poll = await Poll.findByIdAndDelete(req.params.id);
        // const poll = await Poll.findByIdAndDelete(mongoose.Types.ObjectId(req.params.id));
        if (!poll) return res.status(404).json({ message: 'Poll not found' });

        res.json({ message: 'Poll deleted successfully' });
    } catch (error) {
        console.error('Error deleting poll', error)
        res.status(500).json({ message: 'Error deleting the poll', error: error.message });
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

// Get poll by ID
exports.getPollById = async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id);
        if (!poll) {
            return res.status(404).json({ message: 'Poll not found' });
        }
        res.json(poll);
    } catch (error) {
        console.error('Error fetching poll:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};



// @ Tuomas we should move the controllers (create, remove, get...) to this file then export it tothe pollRoutes

// migrated Tuomas pollControllers from pollRoutes to here

// 16.11.24: Adding options needs debugging

// 30.11.24: Bug fixed double res. sending in one request will always through an error

// 04.12.24: changed req.user.userId to req.user.id to fix validation error

// 04.12.12 added a check that ensures userId is valid before pushing to votedBy

// 06.11.24: replaced to findByIdAndDelete

// 11.12.24 added getPollById endpoint
