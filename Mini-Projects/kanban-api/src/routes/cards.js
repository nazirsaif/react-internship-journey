const express = require('express');
const router = express.Router();
const store = require('../data/store');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// GET /cards - list all cards
router.get('/', (req, res) => {
  res.json(store.getAllCards());
});

// POST /cards - create a card
router.post('/', (req, res) => {
  const { id, title, columnId, description, labels, dueDate } = req.body;
  if (!id || !title || !columnId) {
    return res.status(400).json({ error: 'Missing required fields: id, title, columnId' });
  }
  const newCard = store.addCard({ id, title, columnId, description, labels, dueDate });
  res.status(201).json(newCard);
});

// PATCH /cards/:id - update a card
router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const updatedCard = store.updateCard(id, updates);
  
  if (!updatedCard) {
    return res.status(404).json({ error: 'Card not found' });
  }
  res.json(updatedCard);
});

// DELETE /cards/:id - delete a card
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const deletedCard = store.deleteCard(id);
  
  if (!deletedCard) {
    return res.status(404).json({ error: 'Card not found' });
  }
  res.json(deletedCard);
});

module.exports = router;
