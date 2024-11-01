const http = require('http');
const { Server } = require('socket.io');

// Create an HTTP server
const server = http.createServer();

// Initialize Socket.IO
const io = new Server(server, { cors: { origin: '*' } });

const users = {}
// Listen for connections
io.on('connection', socket => {
    socket.on('new-user', user => {
        users[socket.id] = user
        socket.broadcast.emit('user-connected', user);
    })
    socket.on('send-chat-message', message => {
        socket.broadcast.emit('chat-message', {message: message, name:users[socket.id]});
    });
    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id]);
        delete users[socket.id]
    });
});

// Start the server on port 3000
server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
