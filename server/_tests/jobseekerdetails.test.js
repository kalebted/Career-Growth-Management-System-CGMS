import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import fs from 'fs-extra';
import path from 'path';
import app from '../app.js';
import User from '../models/User.js';
import JobSeekerDetails from '../models/JobSeekerDetails.js';

let mongoServer;
let token;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  await fs.ensureDir('./test-assets');
  await fs.writeFile('./test-assets/test-pic.jpg', 'fake image content');

  await request(app).post('/auth/register').send({
    name: 'Job Seeker',
    email: 'seeker@test.com',
    username: 'seeker',
    password: 'Pass@123',
    role: 'job_seeker',
  });

  const res = await request(app).post('/auth/login').send({
    email: 'seeker@test.com',
    password: 'Pass@123',
  });

  token = res.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  await fs.remove('./test-assets');
});

afterEach(async () => {
  await JobSeekerDetails.deleteMany({});
});

describe('Job Seeker Details (mounted at /job-seeker)', () => {
  it('should create new details at POST /job-seeker', async () => {
    const res = await request(app)
      .post('/job-seeker')
      .set('Authorization', `Bearer ${token}`)
      .send({
        full_name: 'John Test',
        address: '123 Main St',
        phone_number: '1234567890',
        job_field: 'Testing'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.details.full_name).toBe('John Test');
  });

  it('should update details and attach picture', async () => {
    await request(app)
      .post('/job-seeker')
      .set('Authorization', `Bearer ${token}`)
      .send({ full_name: 'Initial' });

    const res = await request(app)
      .post('/job-seeker')
      .set('Authorization', `Bearer ${token}`)
      .field('full_name', 'Updated Name')
      .attach('picture', './test-assets/test-pic.jpg');

    expect(res.statusCode).toBe(200);
    expect(res.body.details.full_name).toBe('Updated Name');
    expect(res.body.details.picture).toMatch(/\/assets\/images\//);
  });

  it('should fetch own details at GET /job-seeker', async () => {
    await request(app)
      .post('/job-seeker')
      .set('Authorization', `Bearer ${token}`)
      .send({ full_name: 'Fetch Test' });

    const res = await request(app)
      .get('/job-seeker')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.full_name).toBe('Fetch Test');
  });

  it('should return 404 when no details exist', async () => {
    const res = await request(app)
      .get('/job-seeker')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('No details found');
  });
});
