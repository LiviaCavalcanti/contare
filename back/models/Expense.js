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
    value:{
        type: Number,
        required: true,
    },
    dueDate:{
      type: Date,
      required: true,
    },
    status:{
      type: Boolean,
      required: true,
      default: false,
    },
    editable:{
      type: Boolean,
      requred: true,
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt:{
      type: Date,
      default: Date.now,
      required:true,
    },
});

mongoose.model('Expense', ExpenseSchema);
