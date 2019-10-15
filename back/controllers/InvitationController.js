const mongoose = require("mongoose")
const findUser = require("./UserController").findUser;

const User = mongoose.model("User");
const Invitation = mongoose.model("Invitation");
const Expense = mongoose.model("Expense")

function findInviteById(invitationId, res){
    return Invitation.findById(invitationId,async function(err,invitation){
        if(err) return res.status(404).send("Houve um problema ao encontrar o convite")
        if(!invitation) return res.status(404).send("Este convite não foi encontrado.")
        return invitation;
    })
}

module.exports = {
    
    async invite(req,res,userFrom,newExpense){
        let emailsParticipantes = req.body.listEmail;
            
        for(let i = 1; i < emailsParticipantes.length;i++){
            User.findOne({email:emailsParticipantes[i].email},async function(err,userTo){
                await Invitation.create({
                    from:userFrom,
                    to:userTo.id,
                    expense:newExpense.id,
                    participationValue: req.body.listEmail[i].payValue
                })
                await newExpense.participants.push({
                    _id:userTo.id,
                    payValue:  req.body.listEmail[i].payValue,
                    name:userTo.name,
                    email:userTo.email,
                    status: false,
                    participantStatus:"WAITING"
                })
                await newExpense.participants.save;
                await Expense.findByIdAndUpdate(newExpense.id,newExpense,{new:true})
            })
        }
        return res.status(200).send("Convites Enviados");
    },
        
    async accept(req,res){
        const user = await findUser(req.userId,res);
        if(!user) return res;

        var invitation = await findInviteById(req.body.invitationId,res);
        if(!invitation) return res;
    
        var exp = await Expense.findById(invitation.expense);
        if(!exp) return res.status(404).send("Despesa não encontrada");

        exp.participants.find(p => p.id === user.id).participantStatus = "ACTIVE";
        await exp.participants.save;

        exp = await Expense.findByIdAndUpdate(exp.id,exp,{new:true})
        invitation = await Invitation.findByIdAndRemove(invitation.id);
        
        return res.status(200).send({"Expense":exp,"Invitation":invitation});
    },

    async refuse(req,res){
        const user = await findUser(req.userId,res);
        if(!user) return res;

        var invitation = await findInviteById(req.body.invitationId);
        if(!invitation) return res;

        var exp = await Expense.findById(invitation.expense)
        if(!exp) return res.status(404).send("Despesa não encontrada");

        exp.participants.find(p => p.id === user.id).participantStatus = "REFUSED";
        await exp.participants.save;

        exp = await Expense.findByIdAndUpdate(exp.id,exp,{new:true});
        invitation = await Invitation.findByIdAndRemove(invitation.id);

        return res.status(200).send({"Expense":exp,"Invitation":invitation});
    }
}
