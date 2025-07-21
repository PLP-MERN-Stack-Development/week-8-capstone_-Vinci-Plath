const request = require('supertest');
const { app } = require('./setup');
const User = require('../models/User');
const SOSEvent = require('../models/SOSEvent');

let authToken;
let userId;

// Helper function to create test user and get auth token
const createTestUser = async () => {
  try {
    // First, clean up any existing test user
    await User.deleteOne({ email: 'sos@test.com' });
    
    // Create user directly in the database to avoid password hashing issues
    const user = new User({
      name: 'SOS Test User',
      email: 'sos@test.com',
      password: 'password123',
      phone: '+1234567890'
    });
    await user.save();

    // Generate JWT token directly to avoid login issues
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'test-secret-key',
      { expiresIn: '1h' }
    );

    return {
      token,
      userId: user._id.toString()
    };
  } catch (error) {
    console.error('Error creating test user:', error);
    throw error;
  }
};

describe('SOS API', () => {
  beforeAll(async () => {
    try {
      // Create test user and get auth token
      const { token, userId: id } = await createTestUser();
      authToken = token;
      userId = id;
      
      if (!authToken) {
        throw new Error('Failed to get authentication token');
      }
    } catch (error) {
      console.error('Test setup error:', error);
      throw error;
    }
  });

  afterEach(async () => {
    // Clean up test data after each test
    await SOSEvent.deleteMany({});
  });

  describe('POST /api/sos', () => {
    it('should create a new SOS event with valid location data', async () => {
      const sosData = {
        location: {
          lat: 34.7818,
          lng: 32.0853
        }
      };

      console.log('Using auth token:', authToken?.substring(0, 10) + '...');
      
      const res = await request(app)
        .post('/api/sos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(sosData);

      console.log('Response status:', res.statusCode);
      console.log('Response body:', JSON.stringify(res.body, null, 2));
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('message', 'SOS alert triggered');
      expect(res.body).toHaveProperty('sosEvent');
      expect(res.body.sosEvent).toHaveProperty('location');
      expect(res.body.sosEvent.location).toHaveProperty('lat', 34.7818);
      expect(res.body.sosEvent.location).toHaveProperty('lng', 32.0853);
      expect(res.body.sosEvent).toHaveProperty('status', 'triggered');
    });

    it('should return 401 without authentication', async () => {
      const res = await request(app)
        .post('/api/sos')
        .send({
          location: {
            lat: 34.7818,
            lng: 32.0853
          }
        });

      expect(res.statusCode).toEqual(401);
    });

    it('should return 400 with missing location data', async () => {
      const res = await request(app)
        .post('/api/sos')
        .set('Authorization', `Bearer ${authToken}`) // Include auth token
        .send({});

      console.log('Missing location response:', {
        status: res.statusCode,
        body: res.body
      });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 with invalid location format', async () => {
      const res = await request(app)
        .post('/api/sos')
        .set('Authorization', `Bearer ${authToken}`) // Include auth token
        .send({
          location: {
            // Missing required lat/lng
            invalid: 'data'
          }
        });

      console.log('Invalid format response:', {
        status: res.statusCode,
        body: res.body
      });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  // Note: The following tests are commented out as they test endpoints that don't exist yet
  // Uncomment and implement these when the corresponding endpoints are implemented
  /*
  describe('GET /api/sos/active', () => {
    it('should get active SOS events', async () => {
      // First create an active SOS event
      await SOSEvent.create({
        location: { lat: 34.7818, lng: 32.0853 },
        status: 'triggered'
      });

      const res = await request(app)
        .get('/api/sos/active')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty('status', 'triggered');
    });
  });
  */
});
