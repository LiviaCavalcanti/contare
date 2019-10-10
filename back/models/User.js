const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: false
    },
    username: {
        type: String,
        required: false
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    company: {
        type: String,
        required: false
    },
    bio: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    country: {
        type: String,
        required: false
    },
    zip: {
        type: String,
        required: false
    },
    // What is a rent????????
    rent: {
        type: Number,
        required: false,
        default: 0,
    },
    friends: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            required:true,
            ref: 'User'
        },
        required:false
    }]
});
// encriptando a senha do usuario
UserSchema.pre("save",async function(next){
    const hash = await bcrypt.hash(this.password,10);
    this.password = hash;
    next();
});
const User = mongoose.model("User", UserSchema);

module.exports = User;
