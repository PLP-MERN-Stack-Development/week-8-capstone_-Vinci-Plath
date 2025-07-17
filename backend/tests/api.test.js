const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');

describe('API Integration Tests', () => {
  let contactId;
  let userId = new mongoose.Types.ObjectId().toString();

  beforeAll(async () => {
    // Optionally connect to a test DB here
  });

  afterAll(async () => {
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
    const res = await request(app)
      .post('/api/contacts')
      .send({ name: 'Test User', phone: '1234567890', relationship: 'friend' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    contactId = res.body._id;
  });

  it('GET /api/contacts should list contacts', async () => {
    const res = await request(app).get('/api/contacts');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some(c => c._id === contactId)).toBe(true);
  });

  it('DELETE /api/contacts/:id should delete a contact', async () => {
    const res = await request(app).delete(`/api/contacts/${contactId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });

  // SOS
  it('POST /api/sos should trigger SOS alert', async () => {
    const res = await request(app)
      .post('/api/sos')
      .send({ location: { lat: 1.23, lng: 4.56 } });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch(/sos/i);
    expect(res.body.sosEvent).toBeDefined();
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