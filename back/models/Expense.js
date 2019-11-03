const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        lowercase:true
    },
    description: {
        type: String,
        required: false,
    },
    createdAt:{
      type: Date,
      default: Date.now,
      required:false,
    },
    dueDate:{
      type: Date,
      required: false,
    },
    endDate: {
      type: Date,
      default: Date.now,
      required:false,
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    participants: [{
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        name:{type:String},
        email:{type:String},
        payValue: Number,
        status:Boolean,
        participantStatus: {
          type:String,
          enum:["ACTIVE","WAITING","REFUSED"]
        }
    }],
    totalValue:{
      type: Number,
      required: true
    },
    periodicity: {
        type: String,
        enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'ANNUALLY', 'NONE'],
        default: 'NONE'
    },
    category:{
      type: String,
      required: false,
      default:"NONE"
    }
});

mongoose.model('Expense', ExpenseSchema);