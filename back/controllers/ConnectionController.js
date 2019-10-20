const findUserById =  require("./UserController").findUserById;
const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth.json");
const mongoose = require("mongoose");
const User = mongoose.model("User");

var connectedClients = {};
var connectedSockets = {};
var socketio

module.exports = {

    initializeConnections(io) {

        socketio = io;

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
                    console.error("I did not find a socket with id ", socket.id);
                }
            });
        
        })
        
    }, // End of initialize connections

    emitUserProfileUpdate(userId, user) {
        let userSockets = connectedClients[userId];
        if (userSockets !== "undefined" && user !== "undefined") {
            // let user = findUserById(userId);
            console.log("Firing profile update messages to user ", user);
            userSockets.forEach(userConn => {
                userConn.socket.emit("updateprofile", user);
                console.log("Just sent a signal to user " + user.name +
                            " at socket " + userConn.socket.id);
            });
        } else {
            console.error("Tentando atualizar user sem sockets vinculados...");
        }
    }

}