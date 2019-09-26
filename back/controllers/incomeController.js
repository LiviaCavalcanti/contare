const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth");
const Income = mongoose.model("Income");
const User = mongoose.model("User");

function checkUser(req, res, callback) {
    let token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ error: "Nenhum token foi fornecido." });

    jwt.verify(token, authConfig.secret, function(err, decoded) {
        if (err) return res.status(500).send({ error: "Falha ao validar token." });
        User.findById(decoded.id, (err, user) => {
            if (err) return res.status(500).send("Houve um problema ao procurar usuário.");
            if (!user) return res.status(403).send("Nenhum usuário encontrado.");

            callback(user._id);
        });
    });
}

module.exports = {

    getAll(req, res) {
        checkUser(req, res, userId => {
            Income.find({ owner: userId }, (err, incomes) => {
                if (err) res.status(500).send({ error: "Não foi possível encontrar as rendas do usuário." });
                res.send(incomes);
            });
        });
    },

    get(req, res) {
        checkUser(req, res, userId => {
            Income.findOne({ _id: req.params.incomeId, owner: userId }, (err, income) => {
                if (err) res.status(500).send({ error: "Não foi possível encontrar a renda." });
                res.send(income);
            });
        });
    },

    create(req, res) {
        checkUser(req, res, userId => {
            Income.create({
                title: req.body.title,
                description: req.body.description,
                value: req.body.value,
                owner: userId,
                receivedOn: req.body.receivedOn,
                canceledOn: req.body.canceledOn,
                periodicity: req.body.periodicity
            }, function(err, income) {
                if (err) res.status(500).send({ error: "Não foi possível criar a renda." });
                res.send(income);
            });
        });
    },

    update(req, res) {
        checkUser(req, res, userId => {
            mongoose.set('useFindAndModify', false);
            Income.findOneAndUpdate({ _id: req.params.incomeId, owner: userId }, req.body, (err, income) => {
                if (err) res.status(500).send({ error: "Não foi possível atualizar a renda." });
                res.send(income);
            });
        });
    },

    delete(req, res) {
        checkUser(req, res, userId => {
            Income.findOneAndRemove({ _id: req.params.incomeId, owner: userId }, (err, income) => {
                if (err) res.status(500).send({ error: "Não foi possível remover a renda." });
                res.send(income);
            });
        });
    }

};