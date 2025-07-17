const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// Get all contacts
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new contact
router.post('/', async (req, res) => {
  try {
    const { name, phone, relationship } = req.body;
    const contact = new Contact({ name, phone, relationship });
    await contact.save();
    res.status(201).json(contact);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

// Update a contact by ID
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

// Delete a contact by ID
router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Contact deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid ID' });
  }
});

module.exports = router; 