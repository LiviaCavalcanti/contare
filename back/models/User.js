const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    expenses: [{
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "Expense",
    }],
    rent: {
        type: Number,
        required: false,
        default: 0,
    },
    expensesGroupsId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ExpenseGroup',
        required: false,
    }],
});

mongoose.model('User', UserSchema);
