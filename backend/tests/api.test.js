const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { app } = require('./setup');
const User = require('../models/User');
const Contact = require('../models/Contact');

describe('API Integration Tests', () => {
  let contactId;
  let authToken;
  let testUser;

  // Helper function to create a test user and get auth token
  const createTestUser = async () => {
    // Clean up any existing test user
    await User.deleteOne({ email: 'api-test@example.com' });
    
    // Create user
    const user = new User({
      name: 'API Test User',
      email: 'api-test@example.com',
      password: 'password123',
      phone: '+1234567890'
    });
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'test-secret-key',
      { expiresIn: '1h' }
    );

    return { user, token };
  };

  beforeAll(async () => {
    // Create test user and get auth token
    const { user, token } = await createTestUser();
    testUser = user;
    authToken = token;
  });

  afterAll(async () => {
    // Clean up test data
    await User.deleteOne({ _id: testUser._id });
    await Contact.deleteMany({ user: testUser._id });
    await mongoose.connection.close();
  });

  // Health check
  it('GET /api/health should return 200', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  // Contacts CRUD
  it('POST /api/contacts should add a contact', async () => {
    const contactData = { 
      name: 'Test Contact', 
      phone: '1234567890', 
      relationship: 'friend',
      isEmergencyContact: true
    };
    
    const res = await request(app)
      .post('/api/contacts')
      .set('Authorization', `Bearer ${authToken}`)
      .send(contactData);
      
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.contact).toHaveProperty('_id');
    expect(res.body.contact.name).toBe(contactData.name);
    contactId = res.body.contact._id;
  });

  it('GET /api/contacts should list contacts', async () => {
    const res = await request(app)
      .get('/api/contacts')
      .set('Authorization', `Bearer ${authToken}`);
      
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    
    // Verify the contact we just created is in the list
    const contact = res.body.find(c => c._id === contactId);
    expect(contact).toBeDefined();
    expect(contact.name).toBe('Test Contact');
  });

  it('DELETE /api/contacts/:id should delete a contact', async () => {
    const res = await request(app)
      .delete(`/api/contacts/${contactId}`)
      .set('Authorization', `Bearer ${authToken}`);
      
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.message).toMatch(/deleted/i);
    
    // Verify the contact was actually deleted
    const deletedContact = await Contact.findById(contactId);
    expect(deletedContact).toBeNull();
  });

  // SOS
  it('POST /api/sos should trigger SOS alert', async () => {
    const res = await request(app)
      .post('/api/sos')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ 
        location: { 
          lat: 1.23, 
          lng: 4.56 
        } 
      });
      
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.message).toMatch(/sos/i);
    expect(res.body.sosEvent).toBeDefined();
    expect(res.body.sosEvent.location).toHaveProperty('lat', 1.23);
    expect(res.body.sosEvent.location).toHaveProperty('lng', 4.56);
  });

  // Check-in
  let checkinId;
  it('POST /api/checkin/start should start check-in timer', async () => {
    const res = await request(app)
      .post('/api/checkin/start')
      .send({ userId, durationMinutes: 10, location: { lat: 1.23, lng: 4.56 } });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch(/started/i);
    expect(res.body.checkin).toBeDefined();
    checkinId = res.body.checkin._id;
  });

  it('POST /api/checkin/cancel should cancel check-in', async () => {
    const res = await request(app)
      .post('/api/checkin/cancel')
      .send({ userId });
    expect([200, 404]).toContain(res.statusCode); // 200 if found, 404 if not
    if (res.statusCode === 200) {
      expect(res.body.message).toMatch(/cancel/i);
      expect(res.body.checkin).toBeDefined();
    } else {
      expect(res.body.error).toMatch(/no active check-in/i);
    }
  });

  // Optionally, test /api/checkin/trigger if you want
});