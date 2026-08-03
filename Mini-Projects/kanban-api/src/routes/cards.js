const express = require('express');
const router = express.Router();
const Card = require('../models/Card');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// GET /cards - list all cards
router.get('/', async (req, res) => {
  try {
    const cards = await Card.find({ userId: req.user.id });
    // Transform _id to id to keep frontend compatibility or just return the doc.
    // The prompt says "update every card query so it filters strictly by req.user.id"
    // The previous array returned objects with `id`. Let's ensure `id` field is present.
    // We already defined `id` in the schema.
    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cards' });
  }
});

// POST /cards - create a card
router.post('/', async (req, res) => {
  const { id, title, columnId, description, labels, dueDate } = req.body;
  if (!id || !title || !columnId) {
    return res.status(400).json({ error: 'Missing required fields: id, title, columnId' });
  }
  
  try {
    const newCard = new Card({ 
      id, title, columnId, description, labels, dueDate, 
      userId: req.user.id 
    });
    await newCard.save();
    res.status(201).json(newCard);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create card' });
  }
});

// PATCH /cards/:id - update a card
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  try {
    const updatedCard = await Card.findOneAndUpdate(
      { id, userId: req.user.id },
      updates,
      { new: true }
    );
    
    if (!updatedCard) {
      return res.status(404).json({ error: 'Card not found' });
    }
    res.json(updatedCard);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update card' });
  }
});

// DELETE /cards/:id - delete a card
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const deletedCard = await Card.findOneAndDelete({ id, userId: req.user.id });
    
    if (!deletedCard) {
      return res.status(404).json({ error: 'Card not found' });
    }
    res.json(deletedCard);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete card' });
  }
});

module.exports = router;
