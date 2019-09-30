const mongoose = require("mongoose");
const Expense = mongoose.model("Expense");
const Invitation = mongoose.model("Invitation")
const InvitationController = require("./InvitationController")
const findUser = require("./UserController").findUser;

function findExpenseById(expenseId, res){
   return Expense.findById(expenseId,function(err,exp){
        if(err) return res.status(500).send("Houve um erro ao procurar a despesa");
        if(!exp) return res.status(404).send("Despesa não encontrada")
        return exp;
    })
}

module.exports = {

    async findExpenseById(expenseId,res){
        return findExpenseById(expenseId,res);
    },
    
    async show(req, res) {
        const exp = await findExpenseById(req.params.expID,res);
        if(!exp) return res;
        return res.status(200).send(exp);
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
        var expense = await findExpenseById(req.params.expID,res);
        if(!expense) return res; 
        else expense = await Expense.findByIdAndUpdate(expense.id, req.body, { new: true });
        return res.status(200).send(expense);
    },

    async delete(req,res){
        const expense = await findExpenseById(req.params.expID,res);

        if(!expense) return res;
        else{
            const reportInvites = await Invitation.deleteMany({expense:expense.id});
            return res.status(200).send({
                                 "Expense":await Expense.findByIdAndDelete(expense.id),
                                 "Deleted Invites":reportInvites
                                });
        }
    }
};

