const mongoose = require("mongoose")
const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth");

const User = mongoose.model("User");
const Invitation = mongoose.model("Invitation");

createInvitation = function (userFrom, userTo, expense) {
    return new Invitation({
        from: userFrom,
        to: userTo.id,
        expirationDate: new Date(Date.now() + Math.pow(1.728,8)), //Dois dias após a criação da despesa
        expense: expense
    })
}

module.exports = {
    
    async invite(req,res){
        var token = req.headers['x-access-token'];
        if (!token) return res.status(401).send({ user: {}, message: "Nenhum token foi fornecido." });
        
        jwt.verify(token, authConfig.secret, function(err, decoded) {
        
            if (err) return res.status(500).send({ user: {}, message: "Falha ao autenticar token." });

            User.findById(decoded.id, 
                { password: 0 }, 
                async function (err, userFrom) {
                    if (err) return res.status(500).send("Houve um problema ao encontrar o usuario");
                    if (!userFrom) return res.status(404).send("Nenhum usuário encontrado.");
                    let t = req.body.participants
                    
                    if(t <= 0) return res.sendStatus(200)

                    let thisEmail = req.body.participants.pop()
                    User.findOne({email:thisEmail},async function(err,userTo){
                        if (err) return res.status(500).send("Houve um problema ao encontrar o usuario");
                        if (!userTo) return res.status(404).send("Nenhum usuário ".concat(thisEmail).concat(" encontrado."));

                        let newInvitation = await Invitation.create(createInvitation(userFrom,userTo,req.body.expense))
                        userTo.invitations.push(newInvitation.id)
                        userTo.invitations.save
                        await User.findByIdAndUpdate(userTo.id,userTo,{new:true})
                    })
                }
            )
        })
    }
};
