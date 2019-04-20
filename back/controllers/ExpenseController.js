const mongoose = require("mongoose");

const Expense = mongoose.model("Expense");

module.exports = {
    async showALL(req, res) {
        
        return res.status(501).send("Not implemented yet!")
    },

    async showONE(req, res) {
        const expense = await Expense.findById(req.params.expID);

        return res.json(expense);
    },

    // Não funciona!
    async store(req, res) {
        // const user = User.findById(req.params.id);
        //
        // if(user == error){
        //   return res.send("Usuario nao existe!");
        //
        // }else{
        //   const expense = await Expense.create(req.body);
        //   user.expenses = user.expenses + expense.id;
        //   console.log(user.expenses);
        //   return res.json(expense);
        // }

        return res.status(501).send("Not implemented yet!");

    },

    async update(req, res) {
        const expense = await Expense.findByIdAndUpdate(req.params.expID, req.body, { new: true });

        return res.json(expense);
    },

    async delete(req,res){
        const expense = await Expense.findByIdAndDelete(req.params.expID);

        return res.json(expense);
    }
};
