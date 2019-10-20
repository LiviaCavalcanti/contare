const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Expense = mongoose.model("Expense");
const User = mongoose.model("User");
const Invitation = mongoose.model("Invitation");

const emitUserProfileUpdate = require("./ConnectionController").emitUserProfileUpdate;

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

    async findUserById(userId) {
        return User.findById(userId, {password: 0}, function (err, user) {
            if (err) {
                let msg = "Houve um problema ao encontrar o usuario";
                console.error(msg);
                return msg;
            }
            if (!user) {
                let msg = "Nenhum usuário encontrado.";
                console.error(msg);
                return msg;
            }
            return user;
        });
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
        await emitUserProfileUpdate(req.userId, user);
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
    },

    async addNewFriendship(req,res){
        const user = await findUser(req.userId,res);
        if(!user) return res;

        const friend = await User.findOne({email: req.body.friend});
        if(!friend) return res.status(404).send("Usuario ".concat(req.body.friend).concat(" não encontrado"));
        if(friend.email === user.email) return res.status(400).send("Você nao pode ser seu amigo");
        
        var index = user.friends.findIndex(e=>{
            return (e._id.equals(friend.id))
        });

        if(index != -1){
            return res.status(400).send(friend.name.concat(" já é seu amigo."));
        }else{
            user.friends.push(friend.id);
            friend.friends.push(user.id);

            await User.findByIdAndUpdate(user.id,user,{new:true});
            await User.findByIdAndUpdate(friend.id,friend,{new:true});
        }

        return res.status(200).send(user.friends)
    },

    async deleteFriendship(req,res){
        const user = await findUser(req.userId, res);
        if(!user) return res;
        else {
            const friend = await User.findOne({email: req.body.friend});
            if(!friend) return res.status(404).send("Usuario ".concat(req.body.friend).concat(" não encontrado"));
            
            var index = user.friends.findIndex(e=>{
                return (e._id.equals(friend.id))
            });

            if(index === -1) return res.status(404).send(friend.name.concat(" não é seu amigo."));
            user.friends.splice(index,1);
            
            index = friend.friends.indexOf(user.id);
            friend.friends.splice(index,1);

            await User.findByIdAndUpdate(user.id,user,{new:true});
            await User.findByIdAndUpdate(friend.id,friend,{new:true});
        }
        return res.status(200).send("Amizade desfeita.")
    },
    
    async getFriends(req,res){
        const user = await findUser(req.userId,res);
        if(!user) return res;
        
        var friends = await User.find({friends:{$elemMatch:{_id:user.id}}},"name + email");

        return res.status(200).send(friends);
    }
}
