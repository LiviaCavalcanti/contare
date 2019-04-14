const express = require('express');
const mongoose = require('mongoose');

// Iniciando aplicacao
const app = express();

// Iniciando e conectando o DB
mongoose.connect('mongodb://localhost:27017/contare',{useNewUrlParser: true});

app.listen(3001);
