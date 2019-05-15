const mongoose = require('mongoose');

const InviteSchema = new mongoose.Schema({

    from:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },

    to:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    expirationDate:{
      type: Date
    },

    expense:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Expense'
    }
});

mongoose.model('Invitation', InviteSchema);