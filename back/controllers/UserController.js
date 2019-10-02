const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Expense = mongoose.model("Expense");
const User = mongoose.model("User");
const Invitation = mongoose.model("Invitation");

function findUser(userId,res){
    return User.findById(userId, {password: 0}, function (err, user) {
        if (err) return res.status(500).send("Houve um problema ao encontrar o usuario");
        if (!user) return res.status(404).send("Nenhum usuário encontrado.");
        return user;
    })
}

module.exports = {
    async findUser(userId,res){
        return findUser(userId,res);
    },

    async show(req, res) {
        const user = await findUser(req.userId,res);
        if(!user) return res;
        else return res.status(200).send(user);
    },

    async update(req, res) {
        if(req.body.password){
            const hash = await bcrypt.hash(req.body.password,10)
            req.body.password = hash
        }

        var user = await findUser(req.userId,res);
        if(!user) return res;

        user = await User.findByIdAndUpdate(req.userId,req.body,{new:true});
        return res.status(200).send(user);
    },

    async indexExpenses(req, res){
        const user = await findUser(req.userId,res);
        if(!user) return res;
        const userExpenses = await Expense.find({participants:{$elemMatch:{_id:user.id,
                                                 participantStatus:"ACTIVE"}}});
        return res.status(200).send(userExpenses)
    },

    async indexInvitations(req, res){
        const user = await findUser(req.userId,res);
        if(!user) return res;
        else return res.status(200).json(await Invitation.find({to:user.id}))
    },

    async listEmails(req,res){
        const user = await findUser(req.userId,res);
        if(!user) return res;
        const allEmails = await User.find({"email":{$ne:user.email}}).distinct("email")
        return res.status(200).send(allEmails)
    },
    
    async getObjUSER(req, res) {
        const user = await findUser(req.userId,res);
        if (!user) return res;
        else return res.status(200).send(user);
    }
}
