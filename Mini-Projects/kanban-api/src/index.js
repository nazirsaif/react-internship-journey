const express = require('express');
const cors = require('cors');
const cardsRouter = require('./routes/cards');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Artificial delay middleware (300-600ms)
app.use((req, res, next) => {
  const delay = Math.floor(Math.random() * 300) + 300;
  setTimeout(next, delay);
});

// Routes
app.use('/cards', cardsRouter);

// Basic error handling for invalid JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`kanban-api running on http://localhost:${PORT}`);
});
