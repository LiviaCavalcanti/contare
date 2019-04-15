const mongoose = require('mongoose')

const ExpenseGroupSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    totalValue:{
        type: Number,
        required: true,
        default: 0,
    },
    expenses: [{
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Expense',
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    createdAt:{
      type: Date,
      default: Date.now,
      required: true,
    },
})

mongoose.model('ExpenseGroup', ExpenseGroupSchema);
