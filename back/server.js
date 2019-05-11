const express = require('express');
const mongoose = require('mongoose');
const requireDir = require('require-dir');
mongoose.Promise = global.Promise;
var cors = require('cors')

// Iniciando aplicacao
const app = express();
app.use(cors())
app.use(express.json());

// Iniciando e conectando o DB
mongoose.connect('mongodb://localhost:27017/contare',{useNewUrlParser: true});
requireDir("./models")

app.use("/contare", require("./route"));
app.listen(8080);
