const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { emitFriendshipUpdate } = require("./ConnectionController");
const { restart } = require("nodemon");

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

    // async findUserById(userId) {
    //     return User.findById(userId, {password: 0}, function (err, user) {
    //         if (err) {
    //             let msg = "Houve um problema ao encontrar o usuario";
    //             console.error(msg);
    //             return msg;
    //         }
    //         if (!user) {
    //             let msg = "Nenhum usuário encontrado.";
    //             console.error(msg);
    //             return msg;
    //         }
    //         return user;
    //     });
    // },

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
        /** 
         * Observação feita por Rafael:
         * No arquivo de rotas, temos esta chamada:
         * router.get("/user/:userID",UserController.getObjUSER)
         * Mas aqui, não se usa o userID da URL.
         * Algo errado não está certo. :S
        */
        const user = await findUser(req.userId,res);
        if (!user) return res;
        else return res.status(200).send(user);
    },

    async sendFriendRequest(req,res) {
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
        } else {
            user.sentFriendRequests.push(friend.id);
            friend.receivedFriendRequests.push(user.id);

            await User.findByIdAndUpdate(user.id,user,{new:true});
            await User.findByIdAndUpdate(friend.id,friend,{new:true});
            
            emitFriendshipUpdate(user.id);
            emitFriendshipUpdate(friend.id);
        }

        return res.status(200).send(user.sentFriendRequests)
    },

    async deleteFriendship(req,res){
        const user = await findUser(req.userId, res);
        if(!user) {
            return res.status(404).send("Você não está cadastrado. Cadastre-se.");
        }
        else {
            const friend = await User.findOne({email: req.body.friend});
            if(!friend) return res.status(404).send("Usuario ".concat(req.body.friend).concat(" não encontrado"));
            
            var userFriendIndex = user.friends.findIndex(e=>{
                return (e._id.equals(friend.id))
            });
            if (userFriendIndex !== -1) {
                // Is a friend. Remove it.
                user.friends.splice(userFriendIndex, 1);
                await User.findByIdAndUpdate(user.id,user,{new:true});
                emitFriendshipUpdate(user.id);
            }
            
            let friendUserIndex = friend.friends.findIndex(e=>{
                return (e._id.equals(user.id))
            });
            if (friendUserIndex !== -1) {
                // Is a friend. Remove it.
                friend.friends.splice(friendUserIndex, 1);
                await User.findByIdAndUpdate(friend.id,friend,{new:true});
                emitFriendshipUpdate(friend.id);
            }
            if(userFriendIndex === -1) return res.status(404).send(friend.name.concat(" não é seu amigo."));
        }
        return res.status(200).send("Amizade desfeita.")
    },
    
    async getFriends(req,res){
        const user = await findUser(req.userId,res);
        if(!user) return res;
        
        var friendsPromises = await user.friends.map( async (friendId) => {
            let friend = await User.findById(friendId._id)
            let friendRes = {
                                name: friend.name,
                                email: friend.email,
                                image: friend.image
                            };
            return friendRes;
        })
        Promise.all(friendsPromises).then( (friends) => {
            return res.status(200).send(friends);
        }).catch((error) => {
            return res.status(404).send("Sem amigos!");
        })

    },

    async getSentFriendRequests(req,res){
        const user = await findUser(req.userId,res);
        if(!user) return res;
        
        var sentFriendRequestsPromises = await user.sentFriendRequests.map( async (friendId) => {
            let friend = await User.findById(friendId._id)
            let friendRes = {
                                name: friend.name,
                                email: friend.email,
                                image: friend.image
                            };
            return friendRes;
        })
        Promise.all(sentFriendRequestsPromises).then( (friends) => {
            return res.status(200).send(friends);
        }).catch((error) => {
            return res.status(200).send("Sem amigos adicionados recentemente.");
        })

    },

    async getReceivedFriendRequests(req,res){
        const user = await findUser(req.userId,res);
        if(!user) return res;
        
        var receivedFriendRequestsPromises = await user.receivedFriendRequests.map( async (friendId) => {
            let friend = await User.findById(friendId._id)
            let friendRes = {
                                name: friend.name,
                                email: friend.email,
                                image: friend.image
                            };
            return friendRes;
        })
        Promise.all(receivedFriendRequestsPromises).then( (friends) => {
            return res.status(200).send(friends);
        }).catch((error) => {
            return res.status(200).send("Sem requisições pendentes.");
        })

    },

    async handleFriendResponse(req,res) {
        let user = await findUser(req.userId,res);
        let friend = await User.findOne({email: req.body.friend});
        if(!user || !friend) return res;

        // Delete received from user
        let index = user.receivedFriendRequests.findIndex(e=>{
            return (e._id.equals(friend.id))
        });
        if (index != -1) user.receivedFriendRequests.splice(index);

        // Delete sent from friend
        index = friend.sentFriendRequests.findIndex(e=>{
            return (e._id.equals(user.id))
        });
        if (index != -1) friend.sentFriendRequests.splice(index);
        
        if (req.body.accept == true) {
            // Add friend on both sides
            //if(!friend) return res.status(404).send("Usuario ".concat(req.body.friend).concat(" não encontrado"));
            //if(friend.email === user.email) return res.status(400).send("Você nao pode ser seu amigo");
            user.friends.push(friend.id);
            friend.friends.push(user.id);
        }

        await User.findByIdAndUpdate(user.id,user,{new:true});
        await User.findByIdAndUpdate(friend.id,friend,{new:true});
        
        emitFriendshipUpdate(user.id);
        emitFriendshipUpdate(friend.id);

        return res.status(200).send(user.friends)

    },

    async cancelFriendRequest(req,res) {
        console.log('HEHOREHUAOISHIUASDHASUIDHASIUDHASIDUHSA')
        let user = await findUser(req.userId,res);
        let friend = await User.findOne({email: req.body.friend});
        if(!user || !friend) return res;

        // Delete sent from user
        let index = user.sentFriendRequests.findIndex(e=>{
            return (e._id.equals(friend.id))
        });
        if (index != -1) user.sentFriendRequests.splice(index);

        // Delete received from friend
        index = friend.receivedFriendRequests.findIndex(e=>{
            return (e._id.equals(user.id))
        });
        if (index != -1) friend.receivedFriendRequests.splice(index);

        await User.findByIdAndUpdate(user.id,user,{new:true});
        await User.findByIdAndUpdate(friend.id,friend,{new:true});

        emitFriendshipUpdate(user.id);
        emitFriendshipUpdate(friend.id);

        res.status(200).send("Solicitação cancelada!");
    },

    async addImage(req,res){
        const user = await findUser(req.userId,res);
        if(!user) return res;
        let image = req.body;
        user.image = image;
        return res.status(200).send(await User.findByIdAndUpdate(user.id,user,{new:true}));
    }
}
