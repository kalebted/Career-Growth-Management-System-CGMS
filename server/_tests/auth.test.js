import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app.js';
import User from '../models/User.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe('Auth API Tests', () => {
  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        username: 'testuser',
        password: 'Test@1234',
        role: 'job_seeker',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('test@example.com');
  });

  it('should not login with incorrect password', async () => {
    // First register the user
    await request(app).post('/auth/register').send({
      name: 'Test User',
      email: 'test@example.com',
      username: 'testuser',
      password: 'CorrectPassword',
      role: 'job_seeker',
    });

    
    const res = await request(app).post('/auth/login').send({
      email: 'test@example.com',
      password: 'WrongPassword',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe('Invalid credentials.');
  });
});
