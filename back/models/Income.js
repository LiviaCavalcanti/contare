const mongoose = require('mongoose');

const IncomeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    value: {
        type: Number,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receivedOn: {
        type: Date,
        default: Date.now
    },
    canceledOn: {
        type: Date,
    },
    periodicity: {
        type: String,
        enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'ANNUALLY', 'NONE'],
        default: 'NONE'
    }
});

mongoose.model('Income', IncomeSchema);