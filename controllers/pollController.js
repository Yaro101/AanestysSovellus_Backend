const Poll = require('./models/Poll');

exports.addPoll = async (req, res) => {
    try {
        const {question, options} = req.body;

        // validate the input
        if (!question || !options || !Array.isArray(options) || options.length === 0) {
            return res.status(400).json({ message: 'Question and options are required'});
        }

        // create a new poll
        const newPoll = new Poll({ question, options });
        await newPoll.save();

        res.status(201).json({ message: 'New poll created', poll: newPoll});
    } catch (error) {
        res.status(500).json({ message: 'Server error', error});
    }
}

// 13.11.2024 renamed optionController to pollController, added the function to create a new poll