const express = require('express');
const router = express.Router();
const SOSEvent = require('../models/SOSEvent');

/**
 * @swagger
 * tags:
 *   name: SOS
 *   description: Emergency SOS functionality
 */

/**
 * @swagger
 * /api/sos:
 *   post:
 *     summary: Trigger an SOS alert
 *     tags: [SOS]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - location
 *             properties:
 *               location:
 *                 type: object
 *                 required:
 *                   - lat
 *                   - lng
 *                 properties:
 *                   lat:
 *                     type: number
 *                     format: float
 *                     example: 34.0522
 *                   lng:
 *                     type: number
 *                     format: float
 *                     example: -118.2437
 *     responses:
 *       201:
 *         description: SOS alert triggered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: SOS alert triggered
 *                 sosEvent:
 *                   $ref: '#/components/schemas/SOSEvent'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Not authenticated
 */
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