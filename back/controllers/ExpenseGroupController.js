const mongoose = require("mongoose")

const ExpenseGroup = mongoose.model("ExpenseGroup")

module.exports = {
    async show(req, res) {
        const expenseGroup = await ExpenseGroup.findById(req.params.id)

        return res.json(expenseGroup)
    },

    async store(req, res) {
        const expenseGroup = await ExpenseGroup.create(req.body)

        return res.json(expenseGroup)
    },

    async update(req, res) {
        const expenseGroup = await ExpenseGroup.findByIdAndUpdate(req.params.id, req.body, { new: true })

        return res.json(expenseGroup)
    },
}
