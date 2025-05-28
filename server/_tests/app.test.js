// __tests__/app.test.js
import request from 'supertest';
import app from '../app.js';

describe('API Root Test', () => {
  it('should return Hello World', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Hello World!');
  });
});
