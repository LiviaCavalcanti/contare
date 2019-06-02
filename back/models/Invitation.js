const mongoose = require('mongoose');

const InviteSchema = new mongoose.Schema({

    from:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },

    to:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    expense:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Expense',
      required: true
    },
    participationValue:{
      type:Number,
      required: true
    }
});

module.exports = mongoose.model('Invitation', InviteSchema);