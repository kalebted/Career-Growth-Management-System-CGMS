import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app.js';
import User from '../models/User.js';
import Experience from '../models/Experience.js';

let mongoServer;
let token;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
  await Experience.deleteMany({});
});

const registerAndLogin = async () => {
  await request(app).post('/auth/register').send({
    name: 'Tester',
    email: 'tester@example.com',
    username: 'tester',
    password: 'Test@1234',
    role: 'job_seeker'
  });

  const res = await request(app).post('/auth/login').send({
    email: 'tester@example.com',
    password: 'Test@1234'
  });

  return res.body.token;
};

describe('Experience Route Tests', () => {
  beforeEach(async () => {
    token = await registerAndLogin();
  });

  it('should add experience for authenticated user', async () => {
    const res = await request(app)
      .post('/job-seeker/experience')
      .set('Authorization', `Bearer ${token}`)
      .send({
        job_title: 'Developer',
        company: 'OpenAI',
        start_date: '2021-01-01',
        end_date: '2022-01-01',
        description: 'Built AI systems'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.exp.job_title).toBe('Developer');
  });

  it('should not add experience without token', async () => {
    const res = await request(app).post('/job-seeker/experience').send({
      job_title: 'Unauthorized Test',
      company: 'None',
      start_date: '2020-01-01',
      end_date: '2020-12-01'
    });

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe('Access Denied');
  });

  it('should get experiences for authenticated user', async () => {
    // Add one first
    await request(app)
      .post('/job-seeker/experience')
      .set('Authorization', `Bearer ${token}`)
      .send({
        job_title: 'Dev',
        company: 'Test Inc',
        start_date: '2020-01-01'
      });

    const res = await request(app)
      .get('/job-seeker/experience')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].company).toBe('Test Inc');
  });
});
