const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Configurar CORS para permitir conexiones desde cualquier lugar en la intranet
app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado\n ID asignado: " + socket.id);
    socket.on("message", (msg) => {
        console.log(msg);
        io.emit("message", msg);
    });
});

const PORT = process.env.PORT || 80;
server.listen(PORT, () => {
    console.log(`Servidor Socket.IO escuchando en el puerto ${PORT}`);
});
