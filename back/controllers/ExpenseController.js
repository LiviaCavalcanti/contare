const mongoose = require("mongoose");

const User = mongoose.model("User");
const Expense = mongoose.model("Expense");

module.exports = {
    async show(req, res) {
        const expense = await Expense.findById(req.params.id);

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

    },

    async update(req, res) {
        const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });

        return res.json(expense);
    },
};
