const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  columnId: { type: String, required: true },
  description: { type: String },
  labels: { type: [String], default: [] },
  dueDate: { type: Date },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Card', cardSchema);
