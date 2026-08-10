const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.broadcast.emit('system', 'A user joined the chat');
  
  socket.on('message', (msg) => {
    io.emit('message', msg);
  });

  socket.on('typing', () => {
    socket.broadcast.emit('typing');
  });

  socket.on('stop typing', () => {
    socket.broadcast.emit('stop typing');
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    socket.broadcast.emit('system', 'A user left the chat');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
