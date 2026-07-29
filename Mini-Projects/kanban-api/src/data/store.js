// Simple in-memory store for cards
let cards = [
  { id: '1', title: 'Task 1', columnId: 'todo' },
  { id: '2', title: 'Task 2', columnId: 'todo' }
];

module.exports = {
  getAllCards: () => cards,
  getCardById: (id) => cards.find(c => c.id === id),
  addCard: (card) => {
    cards.push(card);
    return card;
  },
  updateCard: (id, updates) => {
    const index = cards.findIndex(c => c.id === id);
    if (index !== -1) {
      cards[index] = { ...cards[index], ...updates };
      return cards[index];
    }
    return null;
  },
  deleteCard: (id) => {
    const index = cards.findIndex(c => c.id === id);
    if (index !== -1) {
      const deletedCard = cards[index];
      cards.splice(index, 1);
      return deletedCard;
    }
    return null;
  }
};
