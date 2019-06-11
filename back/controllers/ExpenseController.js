const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth");
const Expense = mongoose.model("Expense");
const User = mongoose.model("User")
const Invitation = mongoose.model("Invitation")

const InvitationController = require("./InvitationController")

module.exports = {
    
    async show(req, res) {

        const expense = await Expense.findById(req.params.expID);

        return res.json(expense);
    },

    async store(req, res) {

        var token = req.headers['x-access-token'];
        if (!token) return res.status(401).send({ user: {}, message: "Nenhum token foi fornecido." });
        
        jwt.verify(token, authConfig.secret, function(err, decoded) {
        
            if (err) return res.status(500).send({ user: {}, message: "Falha ao autenticar token." });

            User.findById(decoded.id, 
                { password: 0 }, 
                async function (err, user) {
                    if (err) return res.status(500).send("Houve um problema ao encontrar o usuario");
                    if (!user) return res.status(404).send("Nenhum usuário encontrado.");                
                    Expense.find({owner:user._id}, async function(err,tempExpenses){
                        if( tempExpenses.find(function(exp1){return exp1.title == req.body.title})!=undefined){
                            return res.status(400).send("Tarefa ".concat(req.body.title).concat(" já existente na sua lista de tarefas."))
                        }else{
                            
                            var thisExpense = new Expense({
                                title: req.body.title,
                                description: req.body.description,
                                dueDate: req.body.dueDate,
                                owner: user._id,
                                totalValue: req.body.totalValue

                            })
                             
                            thisExpense.participants.push({
                                _id: user._id,
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
                            
                            return res.json(newExpense);

                        }
                    })
                })
            })
    },

    async update(req, res) {
        var token = req.headers['x-access-token'];
        if (!token) return res.status(401).send({ user: {}, message: "Nenhum token foi fornecido." });
        
        jwt.verify(token, authConfig.secret, function(err, decoded) {
        
            if (err) return res.status(500).send({ user: {}, message: "Falha ao autenticar token." });

          User.findById(decoded.id, 
                { password: 0 }, 
                async function (err, user) {
                    if (err) return res.status(500).send("Houve um problema ao encontrar o usuario");
                    if (!user) return res.status(404).send("Nenhum usuário encontrado.");                
                    
                    const expense = await Expense.findByIdAndUpdate(req.params.expID, req.body, { new: true });
                    return res.json(expense);
                }
            )
        })
    },

    async delete(req,res){
        var token = req.headers['x-access-token'];
        if (!token) return res.status(401).send({ user: {}, message: "Nenhum token foi fornecido." });
        
        jwt.verify(token, authConfig.secret, function(err, decoded) {
        
            if (err) return res.status(500).send({ user: {}, message: "Falha ao autenticar token." });

          User.findById(decoded.id, 
                { password: 0 }, 
                async function (err, user) {
                    if (err) return res.status(500).send("Houve um problema ao encontrar o usuario");
                    if (!user) return res.status(404).send("Nenhum usuário encontrado.");                
                    
                    const expense = await Expense.findByIdAndDelete(req.params.expID);
                    
                    for(let i = 0;i<expense.participants.length; i++){
                        if(expense.participants[i].participantStatus == "WAITING"){
                            await Invitation.findOneAndDelete({expense:expense.id})
                        }
                    }
                    return res.json(expense);
                }
            )
        })
    }
};

