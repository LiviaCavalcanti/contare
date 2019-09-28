const mongoose = require("mongoose")

const Expense = mongoose.model("Expense");
const User = mongoose.model("User")
const Invitation = mongoose.model("Invitation")
const bcrypt = require("bcryptjs");


let findUser = function(userId){
    return User.findById(userId, {password: 0}, function (err, user) {
        if (err) return res.status(500).send("Houve um problema ao encontrar o usuario");
        if (!user) return res.status(404).send("Nenhum usuário encontrado.");
        return user;
    })
}
module.exports = {
    async show(req, res) {
        const user = await findUser(req.userId);
        if(!user) return res;
        else return res.status(200).send(user);
    },

    async update(req, res) {
        if(req.body.password){
            const hash = await bcrypt.hash(req.body.password,10)
            req.body.password = hash
        }
        const user = await User.findByIdAndUpdate(req.userId,req.body,{new:true},
            function(err,res){
                if (err) return res.status(500).send("Houve um problema ao encontrar o usuario");
                if (!res) return res.status(404).send("Nenhum usuário encontrado.");
            });

        if (!user) return res;
        return res.status(200).send(user);
    },

    async indexExpenses(req, res){
        const user = await findUser(req.userId);
        if(!user) return res;
        const userExpenses = await Expense.find({participants:{
                                                    userId:user.id,
                                                    participantStatus:"ACTIVE"
                                                    }
                                                });
        return res.json(userExpenses)
    },

    async indexInvitations(req, res){
        const user = await findUser(req.userId);
        if(!user) return res;
        else return res.json(await Invitation.find({to:user.id}))
    },

    async listEmails(req,res){
        const user = await findUser(req.userId);
        
        const allEmails = await User.find({"email":{$ne:user.email}}).distinct("email")

        return res.status(200).send(allEmails)
    },
    
    async getObjUSER(req, res) {

        const user = await findUser(req.userId);
        if (!user) return res;
        else return res.status(200).send(user);
    }
}