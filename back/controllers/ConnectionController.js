// Register all the chat socket handlers
export const SocketServer = (server) => {

    const io = require("socket.io");

    io.on("connection", function(socket) {
        console.log("a user connected");
        console.log("It was this guy: %o", socket);
    });

    console.log("I ran the socketio script...");

};