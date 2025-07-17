const express = require('express');
const router = express.Router();
const Checkin = require('../models/Checkin');
const SOSEvent = require('../models/SOSEvent');

// POST /api/checkin/start - Start a check-in timer
router.post('/start', async (req, res) => {
  try {
    const { userId, durationMinutes, location } = req.body;
    const expiresAt = new Date(Date.now() + durationMinutes * 60000);
    const checkin = new Checkin({ userId, expiresAt });
    await checkin.save();
    res.status(201).json({ message: 'Check-in started', checkin });
  } catch (err) {
    res.status(400).json({ error: 'Could not start check-in' });
  }
});

// POST /api/checkin/cancel - Cancel a check-in timer
router.post('/cancel', async (req, res) => {
  try {
    const { userId } = req.body;
    const checkin = await Checkin.findOneAndUpdate(
      { userId, active: true },
      { active: false },
      { new: true }
    );
    if (!checkin) return res.status(404).json({ error: 'No active check-in found' });
    res.json({ message: 'Check-in cancelled', checkin });
  } catch (err) {
    res.status(400).json({ error: 'Could not cancel check-in' });
  }
});

// POST /api/checkin/trigger - Trigger auto-SOS if timer expired (stub)
router.post('/trigger', async (req, res) => {
  try {
    const { userId, location } = req.body;
    const checkin = await Checkin.findOne({ userId, active: true });
    if (!checkin || checkin.expiresAt > new Date()) {
      return res.status(400).json({ error: 'No expired check-in to trigger SOS' });
    }
    checkin.active = false;
    await checkin.save();
    // Log SOS event
    const sosEvent = new SOSEvent({ location, status: 'auto-triggered' });
    await sosEvent.save();
    res.status(201).json({ message: 'Auto-SOS triggered', sosEvent });
  } catch (err) {
    res.status(400).json({ error: 'Could not trigger auto-SOS' });
  }
});

module.exports = router; 