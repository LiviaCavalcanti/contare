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
            console.log("Someone connected...");
        
            socket.on("token", (token) => {
                let userId = jwt.decode(token, authConfig.secret).id;
                let user = User.findById(userId, {password: 0}, function (err, user) {
                    if (user) {
                        console.log("New confirmed connection from %s.", user.email)
                    }
                    return user;
                })

                if (user) {
                    if (connectedClients[userId] == null) {
                        connectedClients[userId] = []
                    }
                    if (connectedSockets[socket.id] == null) {
                        connectedClients[userId].push({
                            socket: socket,
                            sid: socket.id,
                            token: token
                        });
                        connectedSockets[socket.id] = userId;
                    }
                }
            });
        
            socket.on("disconnect", (msg) => {
                console.log("Someone disconnected... (%s)", msg)
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
            userSockets.forEach(userConn => {
                userConn.socket.emit("updateprofile", user);
            });
        } else {
            console.error("Tentando atualizar user sem sockets vinculados...");
        }
    },

    emitIncomeUpdate(userId) {
        let userSockets = connectedClients[userId];
        if (userSockets) {
            userSockets.forEach(userConn => {
                userConn.socket.emit("updateincome");
            });
        }
    },

    emitExpenseUpdate(userId) {
        let userSockets = connectedClients[userId];
        if (userSockets) {
            userSockets.forEach(userConn => {
                userConn.socket.emit("updateexpense");
            });
        }
    }

}