const mongoose = require('mongoose');

const checkinSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Checkin', checkinSchema); 