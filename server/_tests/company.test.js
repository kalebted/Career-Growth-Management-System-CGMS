import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import path from 'path';
import fs from 'fs-extra';
import app from '../app.js';
import User from '../models/User.js';
import Company from '../models/Company.js';

let mongoServer;
let token, companyId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Register and login a recruiter
  await request(app).post('/auth/register').send({
    name: 'Company Admin',
    email: 'admin@example.com',
    username: 'admin',
    password: 'Pass@123',
    role: 'recruiter',
  });

  const res = await request(app).post('/auth/login').send({
    email: 'admin@example.com',
    password: 'Pass@123',
  });

  token = res.body.token;

  // Create fake image file for logo upload
  const logoPath = path.resolve('./test-assets');
  await fs.ensureDir(logoPath);
  await fs.writeFile(`${logoPath}/test-logo.png`, 'fake image content');
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  await fs.remove('./test-assets');
});

afterEach(async () => {
  await Company.deleteMany({});
});

describe('Company Management Tests', () => {
  it('should create a company with logo upload and JSON fields', async () => {
    const res = await request(app)
      .post('/companies')
      .set('Authorization', `Bearer ${token}`)
      .field('name', 'Test Company')
      .field('industry', 'Tech')
      .field('profile', 'Innovative software provider')
      .field('description', 'We build solutions.')
      .field('contacts', JSON.stringify({ email: 'info@test.com', phone: '1234567890' }))
      .field('locations', JSON.stringify(['New York', 'San Francisco']))
      .field('website', 'https://test.com')
      .field('founded_date', '2020-01-01')
      .field('employees_count', '150')
      .attach('logo', './test-assets/test-logo.png');

    expect(res.statusCode).toBe(201);
    expect(res.body.company.name).toBe('Test Company');
    expect(res.body.company.logo).toContain('/assets/logos/');
    companyId = res.body.company._id;
  });

  it('should fetch all companies', async () => {
    await Company.create({ name: 'X Corp', industry: 'Finance' });
    const res = await request(app).get('/companies');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should fetch a company by ID', async () => {
    const company = await Company.create({ name: 'SoloTech', industry: 'AI' });
    const res = await request(app).get(`/companies/${company._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('SoloTech');
  });

  it('should update a company', async () => {
    const company = await Company.create({ name: 'Updatable', industry: 'Retail' });

    const res = await request(app)
      .put(`/companies/${company._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ description: 'Updated description' });

    expect(res.statusCode).toBe(200);
    expect(res.body.company.description).toBe('Updated description');
  });

  it('should delete a company', async () => {
    const company = await Company.create({ name: 'DeleteMe', industry: 'Health' });

    const res = await request(app)
      .delete(`/companies/${company._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Company deleted');
  });
});
