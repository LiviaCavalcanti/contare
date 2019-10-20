import { API_URL } from "./index";
import openSocket from 'socket.io-client';

//Connecting To socket.io
var socket = openSocket(API_URL);

export const initializeConnection = function () {

    socket.emit("token", localStorage.getItem("token-contare"));

    socket.on("disconnect", function () {
        console.log("Disconnected...");
    });
    
    return socket;
}
