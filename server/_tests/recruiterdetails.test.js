import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import fs from 'fs-extra';
import app from '../app.js';
import User from '../models/User.js';
import RecruiterDetails from '../models/recruiterDetails.js';

let mongoServer;
let token;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  await fs.ensureDir('./test-assets');
  await fs.writeFile('./test-assets/recruiter-pic.jpg', 'fake image');

  await request(app).post('/auth/register').send({
    name: 'Recruiter',
    email: 'recruiter@test.com',
    username: 'recruiter1',
    password: 'Pass@123',
    role: 'recruiter',
  });

  const res = await request(app).post('/auth/login').send({
    email: 'recruiter@test.com',
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
  await RecruiterDetails.deleteMany({});
});

describe('Recruiter Details API', () => {
  it('should create recruiter profile', async () => {
    const res = await request(app)
      .post('/recruiter')
      .set('Authorization', `Bearer ${token}`)
      .send({
        location: 'Remote',
        contact_info: { email: 'hr@company.com', phone: '1234567890' }
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.details.location).toBe('Remote');
  });

  it('should update recruiter profile with picture', async () => {
    await request(app)
      .post('/recruiter')
      .set('Authorization', `Bearer ${token}`)
      .send({ location: 'Initial' });

    const res = await request(app)
      .post('/recruiter')
      .set('Authorization', `Bearer ${token}`)
      .field('location', 'Updated Location')
      .field('contact_info[email]', 'new@domain.com')
      .attach('picture', './test-assets/recruiter-pic.jpg');

    expect(res.statusCode).toBe(200);
    expect(res.body.details.location).toBe('Updated Location');
    expect(res.body.details.picture).toMatch(/\/assets\/images\//);
  });

  it('should fetch own recruiter details', async () => {
    await request(app)
      .post('/recruiter')
      .set('Authorization', `Bearer ${token}`)
      .send({ location: 'Query Test' });

    const res = await request(app)
      .get('/recruiter')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.location).toBe('Query Test');
  });

  it('should return 404 if profile not found', async () => {
    const res = await request(app)
      .get('/recruiter')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('No recruiter profile found');
  });
});
