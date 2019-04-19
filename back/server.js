const express = require('express');
const mongoose = require('mongoose');
const requireDir = require('require-dir');

// Iniciando aplicacao
const app = express();
app.use(express.json());

// Iniciando e conectando o DB
mongoose.connect('mongodb://localhost:27017/contare',{useNewUrlParser: true});
requireDir("./models")

app.use("/contare", require("./route"));
app.listen(3001);
