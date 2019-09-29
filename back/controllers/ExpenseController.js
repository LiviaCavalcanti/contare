const mongoose = require("mongoose");
const Expense = mongoose.model("Expense");
const User = mongoose.model("User")
const Invitation = mongoose.model("Invitation")
const InvitationController = require("./InvitationController")

findUser = function(userId,res){
    return User.findById(userId, {password: 0}, function (err, user) {
        if (err) return res.status(500).send("Houve um problema ao encontrar o usuario");
        if (!user) return res.status(404).send("Nenhum usuário encontrado.");
        return user;
    })
}

module.exports = {
    
    async show(req, res) {
        return await Expense.findById(req.params.expID,function(err,exp){
            if(err) return res.status(500).send("Houve um erro ao procurar a despesa");
            if(!exp) return res.status(404).send("Despesa não encontrada")

            return res.status(200).send(exp);
        });
    },

    async store(req, res) {
        const user = await findUser(req.userId,res);
        if(!user) return res;
        else {
            let temp = await Expense.find({owner:user.id, title:req.body.title});
            if(temp.length > 0) {
                return res.status(400).
                send("Tarefa ".concat(req.body.title).
                    concat(" já existente na sua lista de tarefas.")
                )}
            else{
                var thisExpense = new Expense({
                    title: req.body.title,
                    description: req.body.description,
                    dueDate: req.body.dueDate,
                    owner: user.id,
                    totalValue: req.body.totalValue
                })
                    
                thisExpense.participants.push({
                    _id: user.id,
                    payValue:  req.body.listEmail[0].payValue,
                    name:user.name,
                    email:user.email,
                    status: false,
                    participantStatus: "ACTIVE",
                })
                thisExpense.participants.save;
                let newExpense = await Expense.create(thisExpense);
                
                if(req.body.listEmail.length > 1){
                    return await InvitationController.invite(req,res,user,newExpense);
                }
                return res.status(200).send(newExpense);
            }
        }
    },

    async update(req, res) {
        const expense = await Expense.findByIdAndUpdate(req.params.expID, req.body, 
            { new: true },function(err,exp){
                if(err) return res.status(500).send("Houve um erro ao procurar a despesa");
                if(!exp) return res.status(404).send("Despesa não encontrada");
                return exp;
            });
        
        if(!expense) return res;
        else return res.status(200).send(expense);
    },

    async delete(req,res){
        let thisExpense = await Expense.findById(req.params.expID,function(err,exp){
            if(err) return res.status(500).send("Houve um erro ao procurar a despesa");
            if(!exp) return res.status(404).send("Despesa não encontrada")
            return exp;
        });

        if(thisExpense === null) return res;
        else{
            await Invitation.deleteMany({expense:thisExpense.id});
            return res.status(200).send(await Expense.findByIdAndDelete(thisExpense.id));
        }
    }
};

