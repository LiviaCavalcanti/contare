const findUser =  require("./UserController").findUser;
const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth.json");
const mongoose = require("mongoose");
const User = mongoose.model("User");

var connectedClients = {};
var connectedSockets = {};

module.exports = {

    initializeConnections(io) {
        io.on("connection", (socket) => {
            console.log("Someone connected here...");
        
            socket.on("token", (token) => {
                console.log("Received this token: ", token);
                let userId = jwt.decode(token, authConfig.secret).id;
                let user = User.findById(userId, {password: 0}, function (err, user) {
                    return user;
                })

                if (user) {
                    if (connectedClients[userId] == null) {
                        connectedClients[userId] = []
                    }
                    connectedClients[userId].push({
                        socket: socket,
                        sid: socket.id,
                        token: token
                    });
                    connectedSockets[socket.id] = userId;
                }

                console.log("List of connected clients: ", connectedClients);
            });
        
            socket.on("disconnect", (msg) => {
                console.log(msg);
                let uid = connectedSockets[socket.id];
                let cConns = connectedClients[uid];
                if (cConns) {
                    for (var i = 0; i < cConns.length; i++) {
                        if (cConns[i].socket.id == socket.id) {
                            cConns.splice(i);
                            i--;
                        }
                    }
                    connectedSockets[socket.id] = null;

                } else {
                    console.log("I did not find a socket with id ", socket.id);
                }
            });
        
        })
        
    }

}