import compression from 'compression';
import express from 'express';
import fs from 'fs';
import { Server } from 'http';
import https from 'https';
import path from 'path';
import socketio from 'socket.io';

const app = express();
const http = new Server(app);

const httpsServer = https.createServer({
  key: fs.readFileSync('/etc/letsencrypt/live/sacalerts.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/sacalerts.com/fullchain.pem'),
}, app);

const io = socketio(httpsServer);
const port = process.env.PORT || 3001;

const getRoomSockets = (roomName: string) => {
  const participants = [];
  if (io.sockets.adapter.rooms[roomName]) {
    Object.keys(io.sockets.adapter.rooms[roomName].sockets).forEach(socketId => {
      participants.push(io.sockets.connected[socketId])
    });
  }
  return participants;
}

app.use(compression());
app.use(express.static(path.join(__dirname, 'dist/client')))

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'dist/client/index.html'));
});

io.on('connection', function (socket) {
  socket.on('enter', async function (roomName, username) {
    username = username.substring(0, 20);
    console.log(`${new Date()}: ${username} entering ${roomName} with ${socket.id} socket`);
    (socket as any).username = username;
    (socket as any).roomName = roomName;

    // name update
    if (getRoomSockets(roomName).find(s => s.id === socket.id)) {
      console.log(`Updating name to ${username}`)
      const participants = getRoomSockets(roomName).map(socket => socket.username)
      getRoomSockets(roomName).forEach(socket => {
        io.to(socket.id).emit('roomUpdated', participants, socket.username);
      })
      return;
    }

    const room = io.sockets.adapter.rooms[roomName];
    if (room && room.length === 2) {
      console.log(`${roomName} is full`)
      return;
    }

    try {
      await new Promise((res, rej) => {
        socket.join(roomName, (err) => {
          if (err) { rej(err) }
          res()
        });
      });
    } catch (e) {
      console.log(`Failed to join ${roomName} socket channel`)
      return;
    }
    console.log(`Added socket to ${roomName} message channel`);

    const participants = getRoomSockets(roomName).map(socket => socket.username)
    console.log('emitting roomUpdated', participants)
    getRoomSockets(roomName).forEach(socket => {
      io.to(socket.id).emit('roomUpdated', participants, socket.username);
    })
    if (room && room.length === 2) {
      io.to(socket.id).emit('initialize');
    }
  });

  socket.on('disconnect', function () {
    const { username, roomName } = socket as any;
    console.log(`${new Date()}: ${username} leaving ${roomName}`);
    const participants = getRoomSockets(roomName).map(socket => socket.username)
    console.log('emitting roomUpdated', participants)
    getRoomSockets(roomName).forEach(socket => {
      io.to(socket.id).emit('roomUpdated', participants, socket.username);
    })
  });

  socket.on('signal', function (msg) {
    const { username, roomName } = socket as any;
    console.log(`${new Date()}: ${username}:${socket.id} signaled in ${roomName}`)
    const participants = getRoomSockets(roomName).filter(roomSocket => roomSocket.id !== socket.id)
    if (participants.length === 1) {
      console.log(`Routing signal to ${participants[0].username}:${participants[0].id} in ${roomName}`);
      io.to(participants[0].id).emit('signal', msg);
    }
  });
});

http.listen(port, function () {
  console.log('listening on *:' + port);
});

httpsServer.listen(3000, function () {
  console.log('https listening on *:' + 3000);
});
