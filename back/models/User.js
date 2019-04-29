const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
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
    rent: {
        type: Number,
        required: false,
        default: 0,
    },

});
// encriptando a senha do usuario
UserSchema.pre("save",async function(next){
    const hash = await bcrypt.hash(this.password,10);
    this.password = hash;
    next();
});
const User = mongoose.model("User", UserSchema);

module.exports = User;

