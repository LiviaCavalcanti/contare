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
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'ExpenseSchema',
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'UserSchema'
    },
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'UserSchema',
    }],
})

mongoose.model('ExpenseGroupSchema', ExpenseGroupSchema)
