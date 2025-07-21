const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

/**
 * @swagger
 * tags:
 *   name: Contacts
 *   description: Contact management
 */

/**
 * @swagger
 * /api/contacts:
 *   get:
 *     summary: Get all contacts
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of contacts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contact'
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */
// Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const User = require('../models/User');
    const user = await User.findOne({ _id: decoded.userId });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

router.get('/', authenticate, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user._id });
    res.status(200).json(contacts);
  } catch (err) {
    console.error('Error fetching contacts:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @swagger
 * /api/contacts:
 *   post:
 *     summary: Create a new contact
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               relationship:
 *                 type: string
 *                 enum: [Family, Friend, Colleague, Other]
 *               isEmergencyContact:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       201:
 *         description: Contact created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Not authenticated
 */
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, phone, relationship, isEmergencyContact } = req.body;
    
    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone are required' });
    }

    const contact = new Contact({ 
      name, 
      phone, 
      relationship: relationship || 'Other',
      isEmergencyContact: isEmergencyContact || false,
      user: req.user._id
    });
    
    await contact.save();
    
    res.status(201).json({
      success: true,
      message: 'Contact created successfully',
      contact: {
        _id: contact._id,
        name: contact.name,
        phone: contact.phone,
        relationship: contact.relationship,
        isEmergencyContact: contact.isEmergencyContact
      }
    });
  } catch (err) {
    console.error('Error creating contact:', err);
    res.status(400).json({ 
      success: false,
      error: err.name === 'ValidationError' ? err.message : 'Invalid contact data'
    });
  }
});

/**
 * @swagger
 * /api/contacts/{id}:
 *   put:
 *     summary: Update a contact
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               relationship:
 *                 type: string
 *                 enum: [Family, Friend, Colleague, Other]
 *               isEmergencyContact:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Contact updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Contact not found
 */
router.put('/:id', async (req, res) => {
  try {
    const { name, phone, relationship } = req.body;
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { name, phone, relationship },
      { new: true }
    );
    if (!contact) return res.status(404).json({ error: 'Not found' });
    res.json(contact);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

/**
 * @swagger
 * /api/contacts/{id}:
 *   delete:
 *     summary: Delete a contact
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact ID
 *     responses:
 *       200:
 *         description: Contact deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Contact deleted
 *       400:
 *         description: Invalid ID format
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Contact not found
 */
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const contact = await Contact.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!contact) {
      return res.status(404).json({ 
        success: false,
        error: 'Contact not found or not authorized' 
      });
    }
    
    res.status(200).json({ 
      success: true,
      message: 'Contact deleted successfully' 
    });
  } catch (err) {
    console.error('Error deleting contact:', err);
    res.status(500).json({ 
      success: false,
      error: 'Server error while deleting contact' 
    });
  }
});

module.exports = router;