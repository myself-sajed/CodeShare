require('dotenv').config()
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const PORT = process.env.PORT || 3333;

// map all the users
const userSocketMap = {}

// get all users from a roomID
const getAllUsersFromRoom = (roomID) => {
    return Array.from(io.sockets.adapter.rooms.get(roomID) || []).map(socketID => {
        return {
            socketID,
            username: userSocketMap[socketID]
        }
    })
}

app.get('/', (req, res) => {
    res.send('Welcome to CodeShare by Shaikh Sajed')
})


io.on('connection', (socket) => {
    socket.on('join', ({ roomID, username }) => {


        userSocketMap[socket.id] = username;
        socket.join(roomID);
        const allClients = getAllUsersFromRoom(roomID);

        allClients.forEach(({ socketID }) => {
            io.to(socketID).emit('joined', {
                allClients,
                username,
                socketID: socket.id
            })
        })
    }

    );

    socket.on('disconnecting', () => {

        const rooms = [...socket.rooms];
        rooms.forEach((roomID) => {
            socket.in(roomID).emit('disconnected', {
                socketID: socket.id,
                username: userSocketMap[socket.id],
            });
        });
        delete userSocketMap[socket.id];
        socket.leave();
    })

    socket.on('leavemealone', (username) => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomID) => {
            socket.in(roomID).emit('left', {
                socketID: socket.id,
                username: username,
            });
        });
        delete userSocketMap[socket.id];
        socket.leave();
    })


    socket.on('code-change', ({ code, roomID }) => {
        socket.in(roomID).emit('code-change', {
            code,
            socketID: socket.id,
            username: userSocketMap[socket.id],
        })
    })

    socket.on('code-sync', ({ code, socketID }) => {
        socket.to(socketID).emit('code-sync', {
            code,
        })
    })
});




server.listen(PORT, () => {
    console.log(`Listening on Port : ${PORT}`);
});