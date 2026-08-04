const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const authRouter = require('./routes/auth');
const cardsRouter = require('./routes/cards');

const app = express();
const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(cookieParser());
app.use(express.json());

// Artificial delay middleware (300-600ms)
app.use((req, res, next) => {
  const delay = Math.floor(Math.random() * 300) + 300;
  setTimeout(next, delay);
});

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Kanban API is running!' });
});
app.use('/auth', authRouter);
app.use('/cards', cardsRouter);

// Basic error handling for invalid JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }
  next();
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`kanban-api running on http://localhost:${PORT}`);
  });
}

module.exports = app;
