const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    }, 
    senha: {
        type: String,
        required: true,
    },
    expenses: {
        type: Number,
        required: false,
        default: 0,
    },
    rent: {
        type: Number,
        required: false,
        default: 0,
    },
    expensesGroupsId: [{
        type: Schema.Types.ObjectId,
        ref: 'ExpenseGroupSchema'
    }],
})

mongoose.model('UserSchema', UserSchema)