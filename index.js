const io = require('socket.io')(5000, {
    cors: {
        origin: "*"
    }
});
console.log("Server is running on port 5000");

const users = {};

io.on('connection', socket => {
    console.log('New client connected:', socket.id);

    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });

    socket.on('image message', imageData => {
        if (imageData) {
            socket.broadcast.emit('image message', imageData); // Broadcast the image to all clients
        } else {
            console.error("Received null image data from client.");
        }
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
});
