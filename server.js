const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

io.on('connection', (socket) => {
    console.log('A user connected');

    // Listen for chat messages
    socket.on('chatMessage', (data) => {
        io.emit('chatMessage', { sender: socket.username, message: data.message });
    });

    // Listen for private messages
    socket.on('privateMessage', (data) => {
        const targetSocket = io.sockets.sockets[data.targetSocketId];
        if (targetSocket) {
            targetSocket.emit('privateMessage', { sender: socket.username, message: data.message });
        }
    });

    // Listen for username changes
    socket.on('changeUsername', (newUsername) => {
        socket.username = newUsername;
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`User ${socket.username} disconnected`);
    });
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});