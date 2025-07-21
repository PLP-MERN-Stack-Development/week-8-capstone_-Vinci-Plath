const mongoose = require('mongoose');

const sosEventSchema = new mongoose.Schema({
  timestamp: { 
    type: Date, 
    default: Date.now,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    lat: { 
      type: Number,
      required: true
    },
    lng: { 
      type: Number,
      required: true
    }
  },
  status: { 
    type: String, 
    enum: ['triggered', 'acknowledged', 'resolved'],
    default: 'triggered',
    required: true
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

// Index for faster queries on common fields
sosEventSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model('SOSEvent', sosEventSchema);