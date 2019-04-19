const mongoose = require("mongoose")

const ExpenseGroup = mongoose.model("ExpenseGroup")

module.exports = {
    
    async showALL(req, res) {

       return res.status(501).send("Not implemented yet!");
    },

    
    async showONE(req, res) {
        const expenseGroup = await ExpenseGroup.findById(req.params.grpID)

        return res.json(expenseGroup)
    },

    async store(req, res) {

        return res.status(501).send("Not implemented yet!");
    },

    async update(req, res) {
        const expenseGroup = await ExpenseGroup.findByIdAndUpdate(req.params.grpID, req.body, { new: true })

        return res.json(expenseGroup)

        return res.status(501).send("Not implemented yet!");
    },

    async delete(req,res){
        
        const expenseGroup = await ExpenseGroup.findByIdAndDelete(req.params.grpID);

        return res.json(expenseGroup);
    }
}
