const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
const express = require('express');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: '*',
    },
});

app.use(cors());

const users = {};

io.on('connection', socket => {
    console.log('A user connected:', socket.id);

    socket.on('new-user-joined', name => {
        console.log('New user:', name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });

    socket.on('disconnect', message => {
        console.log('User disconnected:', socket.id);
        socket.broadcast.emit('left', users[socket.id] );
        delete users[socket.id];
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


// const http = require('http');
// const express = require('express');
// const socketIo = require('socket.io');

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server);

// const users = {};
// console.log("Hi");
// io.on('connection', socket => {
//     console.log("Hello");
//     socket.on('new-user-joined', name => {
//         console.log("New user", name);
//         users[socket.id] = name;
//         socket.broadcast.emit('user-joined', name);
//     });

//     socket.on('send', message => {
//         socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
//     });
// });

// server.listen(3000, () => {
//     console.log('Server running on port 3000');
// });

// // const PORT = 3001; // Change the port here
// // server.listen(PORT, () => {
// //     console.log(`Server running on port ${PORT}`);
// // });