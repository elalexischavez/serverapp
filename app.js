const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(cors());

let clients = {};

io.on("connection", (socket) => {
  console.log(`Nuevo cliente conectado. ID asignado: ${socket.id}`);

  // Almacena la información del nuevo cliente
  clients[socket.id] = { id: socket.id, location: null };

  // Envía la información de todos los clientes a un cliente recién conectado
  Object.keys(clients).forEach((clientId) => {
    io.to(socket.id).emit("message", clients[clientId]);
  });

  // Escucha la ubicación del cliente
  socket.on("message", (msg) => {
    console.log(`Mensaje recibido de ${socket.id}:`, msg);

    // Actualiza la ubicación del cliente en el servidor
    clients[socket.id].location = msg.location;

    // Emitir la información del cliente a todos los clientes
    io.emit("message", clients[socket.id]);
  });

  // Manejar desconexiones de clientes
  socket.on("disconnect", () => {
    console.log(`Cliente desconectado. ID: ${socket.id}`);
    // Elimina la información del cliente desconectado
    delete clients[socket.id];
  });
});

const PORT = process.env.PORT || 80;
server.listen(PORT, () => {
  console.log(`Servidor Socket.IO escuchando en el puerto ${PORT}`);
});
