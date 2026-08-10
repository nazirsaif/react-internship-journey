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
});
const Message = mongoose.model('Message', messageSchema);

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinRoom', async (room) => {
    // Leave previous rooms (except the socket's own room)
    Array.from(socket.rooms).forEach(r => {
      if (r !== socket.id) socket.leave(r);
    });

    socket.join(room);
    console.log(`Socket ${socket.id} joined room ${room}`);
    
    socket.broadcast.to(room).emit('system', `A new user joined ${room}`);

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

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
