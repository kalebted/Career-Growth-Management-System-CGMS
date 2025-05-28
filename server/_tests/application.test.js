import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app.js';
import User from '../models/User.js';
import JobPosting from '../models/jobPosting.js';
import CV from '../models/cv.js';
import Skills from '../models/skills.js';
import Application from '../models/Application.js';

let mongoServer;
let recruiterToken, seekerToken;
let jobId, cvId, appId, skillId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Create skill
  const skill = await Skills.create({ skill_name: 'JavaScript' });
  skillId = skill._id;

  // Register recruiter
  await request(app).post('/auth/register').send({
    name: 'Recruiter',
    email: 'recruiter@example.com',
    username: 'recruiter',
    password: 'Pass@123',
    role: 'recruiter',
  });
  const recruiterRes = await request(app).post('/auth/login').send({
    email: 'recruiter@example.com',
    password: 'Pass@123',
  });
  recruiterToken = recruiterRes.body.token;

  // Create job
  const jobRes = await request(app)
    .post('/jobs')
    .set('Authorization', `Bearer ${recruiterToken}`)
    .send({
      job_title: 'Backend Developer',
      job_description: 'Build APIs',
      requirements: ['Node.js'],
      required_skills: [{ skill: skillId, proficiency_level: 'expert' }],
      location: 'Remote',
      work_type: 'full-time',
      work_mode: 'remote',
      application_deadline: '2025-12-01',
      hiring_process: ['review', 'interview', 'offer'],
    });
  jobId = jobRes.body.job._id;

  // Register job seeker
  await request(app).post('/auth/register').send({
    name: 'Seeker',
    email: 'seeker@example.com',
    username: 'seeker',
    password: 'Pass@123',
    role: 'job_seeker',
  });
  const seekerRes = await request(app).post('/auth/login').send({
    email: 'seeker@example.com',
    password: 'Pass@123',
  });
  seekerToken = seekerRes.body.token;

  // Upload dummy CV
  const cv = await CV.create({
    user: seekerRes.body.user._id,
    file_path: 'dummy.pdf',
  });
  cvId = cv._id;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Application.deleteMany({});
});

describe('Job Application Tests', () => {
  it('should allow a job seeker to apply to a job', async () => {
    const res = await request(app)
      .post('/applications')
      .set('Authorization', `Bearer ${seekerToken}`)
      .send({
        jobId,
        cvId,
        cover_letter: 'Excited to apply',
        skills: [{ skill: skillId, applicant_proficiency: 'expert' }],
        experience: ['Worked at XYZ'],
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.application.job).toBe(jobId);
    appId = res.body.application._id;
  });

  it('should not allow duplicate application', async () => {
    await Application.create({ job: jobId, user: (await User.findOne({ email: 'seeker@example.com' }))._id, applied_cv: cvId });

    const res = await request(app)
      .post('/applications')
      .set('Authorization', `Bearer ${seekerToken}`)
      .send({ jobId, cvId });

    expect(res.statusCode).toBe(409);
  });

  it('should fetch applications for recruiter', async () => {
    const res = await request(app)
      .get(`/applications/job/${jobId}`)
      .set('Authorization', `Bearer ${recruiterToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should allow seeker to get their applications', async () => {
    const res = await request(app)
      .get('/applications/my')
      .set('Authorization', `Bearer ${seekerToken}`);

    expect(res.statusCode).toBe(200);
  });

  it('should update application phase', async () => {
    const application = await Application.create({
      job: jobId,
      user: (await User.findOne({ email: 'seeker@example.com' }))._id,
      applied_cv: cvId,
    });

    const res = await request(app)
      .put(`/applications/${application._id}/phase`)
      .set('Authorization', `Bearer ${recruiterToken}`)
      .send({ phase: 'interview' });

    expect(res.statusCode).toBe(200);
    expect(res.body.application.current_phase).toBe('interview');
  });

  it('should allow seeker to delete (withdraw) their application', async () => {
    const application = await Application.create({
      job: jobId,
      user: (await User.findOne({ email: 'seeker@example.com' }))._id,
      applied_cv: cvId,
    });

    const res = await request(app)
      .delete(`/applications/${application._id}`)
      .set('Authorization', `Bearer ${seekerToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/withdrawn/i);
  });
});
