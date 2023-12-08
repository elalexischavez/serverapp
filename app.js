const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const cors = require("cors")

app.use(cors());


io.on("connection", (socket) => {
    console.log("New client connected\n id asigned: " + socket.id);
    socket.on("message", (msg) => {
        console.log(msg);
        io.emit("message", msg);
    })
})

const PORT = process.env.PORT || 80;
server.listen(PORT, () => {
    console.log('Servidor Socket.IO escuchando en el puerto ${PORT}');
});