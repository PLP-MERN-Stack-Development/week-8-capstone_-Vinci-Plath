const mongoose = require('mongoose');

const sosEventSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  location: {
    lat: { type: Number },
    lng: { type: Number }
  },
  status: { type: String, default: 'triggered' }
});

module.exports = mongoose.model('SOSEvent', sosEventSchema); 