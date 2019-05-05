const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    dueDate:{
      type: Date,
      required: false,
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt:{
      type: Date,
      default: Date.now,
      required:false,
    },
    participants: [{
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        payValue: Number,
        status: Boolean
    }]
});

mongoose.model('Expense', ExpenseSchema);