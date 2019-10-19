import { API_URL } from "./index";
// const openSocket = require("socket.io-client");
import openSocket from 'socket.io-client';

//Connecting To socket.io
var socket = openSocket(API_URL);
// const socket = openSocket(myURL);

export const initializeConnection = function () {

    socket.on("disconnect",function(){
        //Setting Message On Disconnection
        console.log("Disconnected...");
    })
    
    socket.on("connection", function(socket) {
        console.log("Connected to server!!");
        console.log("It was this guy: %o", socket);
    });
    
}
