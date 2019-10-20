const mongoose = require("mongoose");

const Income = mongoose.model("Income");
const findUser = require("./UserController").findUser

const emitIncomeUpdate = require("./ConnectionController").emitIncomeUpdate;

module.exports = {

    async getAll(req, res) {
        const user = await findUser(req.userId,res);
        if(!user) return res;
        
        return await Income.find({ owner: user.id }, (err, incomes) => {
            if (err || !incomes) return res.status(500).send({ error: "Não foi possível encontrar as rendas do usuário." });
            return res.status(200).send(incomes);
        });
    },

    async get(req, res) {
        const user = await findUser(req.userId,res);
        if(!user) return res;

        return await Income.findOne({ _id: req.params.incomeId, owner: user.id }, (err, income) => {
            if (err || !income) return res.status(500).send({ error: "Não foi possível encontrar a renda." });
            return res.status(200).send(income);
        });
    },

    async create(req, res) {
        const user = await findUser(req.userId,res);
        if(!user) return res;
        emitIncomeUpdate(req.userId);
        return await Income.create({
            title: req.body.title,
            description: req.body.description,
            value: req.body.value,
            owner: user.id,
            receivedOn: req.body.receivedOn,
            canceledOn: req.body.canceledOn,
            periodicity: req.body.periodicity
        }, function(err, income) {
            if (err || !income) return res.status(500).send({ error: "Não foi possível criar a renda." });
            return res.status(200).send(income);
        });
    },

    async update(req, res) {
        const user = await findUser(req.userId,res);
        if(!user) return res;
        emitIncomeUpdate(req.userId);
        mongoose.set('useFindAndModify', false);
        return await Income.findOneAndUpdate({ _id: req.params.incomeId, owner: user.id }, req.body,{new:true}, (err, income) => {
            if (err || !income) return res.status(500).send({ error: "Não foi possível atualizar a renda." });
            return res.status(200).send(income);
        });
    },

    async delete(req, res) {
        const user = await findUser(req.userId,res);
        if(!user) return res;
        emitIncomeUpdate(req.userId);
        return await Income.findOneAndRemove({ _id: req.params.incomeId, owner: user.id }, (err, income) => {
            if (err || !income) return res.status(500).send({ error: "Não foi possível remover a renda." });
            return res.status(200).send(income);
        });
    }
};