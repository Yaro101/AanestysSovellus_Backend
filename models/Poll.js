// We need to know what is the model of voting polls and user / admin needed by the front end devs

const mongoose = require('mongoose');

// Model for Poll
const pollSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: true,
            trim: true,  // Trims whitespace around the question
        },
        options: [
            {
                name: {
                    type: String,
                    required: true,
                    trim: true, // Ensures no extra spaces in the option name
                },
                votes: {
                    type: Number,
                    default: 0,
                },
            },
        ],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Reference to the User who created the poll
            required: true,
        },

        votedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    },
    { timestamps: true } // Adds createdAt and updatedAt fields --> very usefull if frontend wants to add it to the view
);

// Checking for duplicate options
pollSchema.pre('save', function (next) {
    // Check for duplicate options
    const optionNames = this.options.map((option) => option.name);
    const hasDuplicates = optionNames.length !== new Set(optionNames).size;
    if (hasDuplicates) {
        return next(new Error('Poll options must be unique.'));
    }
    if (optionNames.length < 2) {
        return next(new Error('A poll must have at least 2 options'))
    }
    next();
});

// Add validation to prevent multiple votes by the same user
pollSchema.methods.vote = async function (userId, optionId) {
    if (this.votedBy.includes(userId)) {
        throw new Error('User has already voted on this poll.');
    }

    // Increment the votes for the chosen option
    const option = this.options.id(optionId);
    if (option) {
        option.votes += 1;
        this.votedBy.push(userId);  // Add user to votedBy array
        await this.save();
    } else {
        throw new Error('Option not found');
    }
};

module.exports = mongoose.model('Poll', pollSchema);


// Both models for polls and user are for testing and replaceable with Tuomas models