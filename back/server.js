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
const mongooseConfig = {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}

mongoose.connect('mongodb://localhost:27017/contare', mongooseConfig)
    .then((msg) => {
        console.log("Connection to mongo successful!");
    })
    .catch((error) => {
        console.error("Error on Mongoose connection! Error message: " + error)
    })
requireDir("./models")

app.use("/contare", require("./route"));
// app.listen(process.env.PORT || 8080); // replaced by socket.io implementation

// Socket.io implementation
var port = process.env.PORT || 8080;
// This gives socketio access to the server port
var io = require('socket.io').listen(app.listen(port));

var connectionController = require("./controllers/ConnectionController");
connectionController.initializeConnections(io);

module.exports = app