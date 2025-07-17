const express = require('express');
const router = express.Router();
const SOSEvent = require('../models/SOSEvent');

// POST /api/sos - Trigger SOS alert
router.post('/', async (req, res) => {
  try {
    const { location } = req.body; // { lat, lng }
    const sosEvent = new SOSEvent({ location });
    await sosEvent.save();
    // TODO: Integrate SMS sending here (stub for now)
    res.status(201).json({ message: 'SOS alert triggered', sosEvent });
  } catch (err) {
    res.status(400).json({ error: 'Could not trigger SOS' });
  }
});

module.exports = router; 