const express = require('express');
const router = express.Router();
const Checkin = require('../models/Checkin');
const SOSEvent = require('../models/SOSEvent');

/**
 * @swagger
 * tags:
 *   name: Check-in
 *   description: User check-in functionality for safety monitoring
 */

/**
 * @swagger
 * /api/checkin/start:
 *   post:
 *     summary: Start a safety check-in timer
 *     tags: [Check-in]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - durationMinutes
 *               - location
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user starting the check-in
 *               durationMinutes:
 *                 type: integer
 *                 description: Duration in minutes before check-in expires
 *                 example: 60
 *               location:
 *                 type: object
 *                 required:
 *                   - lat
 *                   - lng
 *                 properties:
 *                   lat:
 *                     type: number
 *                     format: float
 *                   lng:
 *                     type: number
 *                     format: float
 *     responses:
 *       201:
 *         description: Check-in timer started successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Check-in started
 *                 checkin:
 *                   $ref: '#/components/schemas/Checkin'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Not authenticated
 */
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

/**
 * @swagger
 * /api/checkin/cancel:
 *   post:
 *     summary: Cancel an active check-in timer
 *     tags: [Check-in]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user canceling the check-in
 *     responses:
 *       200:
 *         description: Check-in cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Check-in cancelled
 *                 checkin:
 *                   $ref: '#/components/schemas/Checkin'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: No active check-in found
 */
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