const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const SOSEvent = require('../models/SOSEvent');
const User = require('../models/User');

// Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.userId });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

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
// Input validation middleware
const validateSOSRequest = (req, res, next) => {
  const { location } = req.body;
  
  if (!location || typeof location !== 'object') {
    return res.status(400).json({ error: 'Location data is required' });
  }
  
  const { lat, lng } = location;
  if (lat === undefined || lng === undefined || 
      typeof lat !== 'number' || typeof lng !== 'number' ||
      isNaN(lat) || isNaN(lng)) {
    return res.status(400).json({ 
      error: 'Valid lat and lng numbers are required in location object' 
    });
  }
  
  next();
};

router.post('/', authenticate, validateSOSRequest, async (req, res) => {
  try {
    const { location } = req.body;
    const sosEvent = new SOSEvent({ 
      location,
      user: req.user._id  // Associate SOS event with the user
    });
    
    await sosEvent.save();
    
    // TODO: Integrate SMS sending here (stub for now)
    // In a real implementation, you would send SMS to emergency contacts here
    
    res.status(201).json({ 
      success: true,
      message: 'SOS alert triggered', 
      sosEvent: {
        _id: sosEvent._id,
        location: sosEvent.location,
        status: sosEvent.status,
        timestamp: sosEvent.timestamp
      }
    });
  } catch (err) {
    console.error('SOS Error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Could not trigger SOS',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

module.exports = router; 