//npm install express
//npm install cors
//npm install socket.io@2.4.1
//npm install socket.io@latest
//node ./src/index.js
//composer require elephantio/elephant.io
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');
const express = require("express");
const cors = require("cors");

// Crear un servidor HTTP
// const server = http.createServer((req, res) => {
//   res.writeHead(200, { 'Content-Type': 'text/plain' });
//   res.end('Servidor WebSocket en funcionamiento');
// });

// const server = http.createServer((req, res) => {
//   // Define la ruta del archivo HTML
//   const filePath = path.join(__dirname, 'public/index.html');

//   // Lee el archivo HTML
//   fs.readFile(filePath, (err, data) => {
//     if (err) {
//       res.writeHead(500, { 'Content-Type': 'text/plain' });
//       res.end('Error al cargar la página');
//     } else {
//       // Configura el encabezado de la respuesta
//       res.writeHead(200, { 'Content-Type': 'text/html' });
//       // Envía el contenido del archivo HTML
//       res.end(data);
//     }
//   });
// });

const app = express();
const server = http.Server(app);
app.set("port", 3000);
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "./public")));

// Configurar socket.io
const io = socketIo(server,{
  cors: {
    origin: "http://localhost:3000", // Cambia esto al origen correcto
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

// Manejar conexiones de socket
io.on('connection', (socket) => {
  console.log(io.sockets.adapter.rooms['5353']);
  console.log('Cliente conectado');
  io.emit("upConnection", "Cliente conectado");
  //
  socket.on('joinRoom', (data) => {
      socket.join(data.room);
      console.log(`Usuario ${data.room} se ha unido al room ${data.room}`);
  });
  //
  socket.on('message', (data) => {
    console.log(data['room']);
    // console.log('Usuario ID:', data['message']['room']);
    // console.log('Mensaje recibido:', data['message']['data']);
    //
    io.to(data['room']).emit('message', data['data']);
    // Enviar una respuesta al cliente
    // socket.broadcast.emit('messageReceived', {message:data[0],socketId:socket.id});
  });
  //Manejar la desconexión del cliente
  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
    socket.broadcast.emit('downConnection', 'Cliente desconectado');
  });
});
// Iniciar el servidor en el puerto 3000
server.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000');
});
//
