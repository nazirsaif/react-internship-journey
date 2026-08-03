const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const User = require('../models/User');

const testEmail = 'test@example.com';
const testPassword = 'password123';

beforeAll(async () => {
  // Wait for the connection to be established if it isn't already
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
});

afterAll(async () => {
  // Clean up user
  await User.deleteMany({ email: testEmail });
  await mongoose.connection.close();
});

describe('Authentication API', () => {
  let userToken = '';

  it('should sign up a new user successfully', async () => {
    // Delete if already exists from previous failed test
    await User.deleteMany({ email: testEmail });

    const res = await request(app)
      .post('/auth/signup')
      .send({ email: testEmail, password: testPassword });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
    userToken = res.body.accessToken;
  });

  it('should fail to sign up with a duplicate email', async () => {
    const res = await request(app)
      .post('/auth/signup')
      .send({ email: testEmail, password: testPassword });
    
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should login successfully', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: testEmail, password: testPassword });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
  });

  it('should fail to login with wrong password', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: testEmail, password: 'wrongpassword' });
    
    expect(res.statusCode).toEqual(401);
    expect(res.body.error).toEqual('Invalid credentials');
  });

  it('should reject unauthenticated requests to /cards with 401', async () => {
    const res = await request(app).get('/cards');
    expect(res.statusCode).toEqual(401);
  });

  it('should allow authenticated requests to /cards', async () => {
    const res = await request(app)
      .get('/cards')
      .set('Authorization', `Bearer ${userToken}`);
    
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });
});
