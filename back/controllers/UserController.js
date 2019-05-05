const mongoose = require("mongoose")
const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth");
const JSON = require('circular-json');

const Expense = mongoose.model("Expense");
const User = mongoose.model("User")

module.exports = {
    async show(req, res) {
        
        var token = req.headers['x-access-token'];
        if (!token) return res.status(401).send({ user: {}, message: "Nenhum token foi fornecido." });
        
        jwt.verify(token, authConfig.secret, function(err, decoded) {
        
            if (err) return res.status(500).send({ user: {}, message: "Falha ao autenticar token." });
        
            User.findById(decoded.id, 
                { password: 0 }, 
                function (err, user) {
                    if (err) return res.status(500).send("Houve um problema ao encontrar o usuario");
                    if (!user) return res.status(404).send("Nenhum usuário encontrado.");
                    res.status(200).send(user);
                }
            )
        })
    },

    async update(req, res) {
        var token = req.headers['x-access-token'];
        if (!token) return res.status(401).send({ user: {}, message: "Nenhum token foi fornecido." });
        
        jwt.verify(token, authConfig.secret, function(err, decoded) {
        
            if (err) return res.status(500).send({ user: {}, message: "Falha ao autenticar token." });
            User.findByIdAndUpdate(decoded.id, 
                req.body, 
                {new: true},
                function (err, newUser) {
                    if (err) return res.status(500).send("Houve um problema ao encontrar o usuario");
                    if (!newUser) return res.status(404).send("Nenhum usuário encontrado.");
                    res.status(200).send(newUser);
                }
            )
        })
    },

    async indexExpenses(req, res){
        var token = req.headers['x-access-token'];
        if (!token) return res.status(401).send({ user: {}, message: "Nenhum token foi fornecido." });
        
        jwt.verify(token, authConfig.secret, function(err, decoded) {
        
            if (err) return res.status(500).send({ user: {}, message: "Falha ao autenticar token." });

            // return res.json(await Expense.find({ owner: req.params.id  }))

            User.findById(decoded.id, 
                { password: 0 }, 
                async function (err, user) {
                    if (err) return res.status(500).send("Houve um problema ao encontrar o usuario");
                    if (!user) return res.status(404).send("Nenhum usuário encontrado.");                
                    
                    return res.json(await Expense.find({ owner: decoded.id  }))
                        
                }
            )
        })
    }
}