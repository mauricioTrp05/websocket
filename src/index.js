const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    console.log('a user connected');
    //
    socket.on('joinRoom', (data) => {
        socket.join(data.room);
        console.log(`Usuario ${data.room} se ha unido al room ${data.room}`);
    });
    // Manejar el inicio de sesión del usuario
    socket.on('login', (userID) => {
        // Unir al usuario a un room específico
        socket.join(userID);
        console.log(`Usuario Login ${userID} se ha unido a su room personal`);
    });
    //
    socket.on('message', (data) => {
        console.log(data);
        //
        io.to(data.room).emit('message', data.data);
    });
    //
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});