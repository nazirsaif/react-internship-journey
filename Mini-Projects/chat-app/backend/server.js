const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/chat-app')
  .then(() => {
    console.log('Connected to MongoDB');
  }).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Message Model
const messageSchema = new mongoose.Schema({
  room: String,
  sender: String,
  text: String,
  timestamp: { type: Date, default: Date.now },
  readBy: { type: [String], default: [] },
});
const Message = mongoose.model('Message', messageSchema);

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  const broadcastRoomUsers = async (room) => {
    if (!room) return;
    const sockets = await io.in(room).fetchSockets();
    const users = sockets.map(s => ({ id: s.id, username: s.data.username }));
    io.to(room).emit('roomUsers', users);
  };

  socket.on('joinRoom', async ({ room, username }) => {
    const previousRooms = Array.from(socket.rooms).filter(r => r !== socket.id);
    
    // Leave previous rooms
    previousRooms.forEach(r => {
      socket.leave(r);
    });

    socket.join(room);
    socket.data.username = username;
    socket.data.room = room;
    console.log(`Socket ${socket.id} (${username}) joined room ${room}`);
    
    socket.broadcast.to(room).emit('system', `${username} joined ${room}`);

    for (const r of previousRooms) {
      await broadcastRoomUsers(r);
    }
    await broadcastRoomUsers(room);

    // Fetch message history for this room
    try {
      const messages = await Message.find({ room }).sort({ timestamp: -1 }).limit(50);
      socket.emit('messageHistory', messages.reverse());
    } catch (err) {
      console.error('Error fetching message history:', err);
    }
  });

  socket.on('chatMessage', async (data) => {
    const { room, sender, text } = data;
    
    // Save to MongoDB
    try {
      const newMessage = new Message({ room, sender, text });
      await newMessage.save();
      
      // Broadcast to room
      io.to(room).emit('chatMessage', newMessage);
    } catch (err) {
      console.error('Error saving message:', err);
    }
  });

  socket.on('typing', (room) => {
    socket.broadcast.to(room).emit('typing', socket.id);
  });

  socket.on('stopTyping', (room) => {
    socket.broadcast.to(room).emit('stopTyping', socket.id);
  });

  socket.on('markAsRead', async ({ messageId, username, room }) => {
    try {
      const msg = await Message.findById(messageId);
      if (msg && !msg.readBy.includes(username)) {
        msg.readBy.push(username);
        await msg.save();
        io.to(room).emit('messageUpdated', msg);
      }
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  });

  socket.on('disconnect', async () => {
    console.log('User disconnected:', socket.id);
    if (socket.data.room) {
      // Small delay to let socket actually leave the room in socket.io before fetching sockets
      setTimeout(async () => {
        await broadcastRoomUsers(socket.data.room);
      }, 0);
    }
  });
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
