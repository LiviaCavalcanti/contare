const mongoose = require("mongoose")

const User = mongoose.model("User")

module.exports = {
    async show(req, res) {
        const user = await User.findById(req.params.id)

        return res.json(user)
    },  

    async store(req, res) {
        const user = await User.create(req.body)

        return res.json(user)
    },

    async update(req, res) {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })

        return res.json(user)
    },
}
