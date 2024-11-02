const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

// Create an HTTP server
const server = http.createServer();

// Initialize Socket.IO with CORS to allow all origins
const io = new Server(server, { cors: { origin: '*' } });

const users = {};

// Listen for connections
io.on('connection', (socket) => {
    socket.on('new-user', (user) => {
        users[socket.id] = user;
        socket.broadcast.emit('user-connected', user);
    });

    socket.on('send-chat-message', (message) => {
        socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] });
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id]);
        delete users[socket.id];
    });
});

// Use Render's dynamically assigned PORT or 3000 if running locally
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
