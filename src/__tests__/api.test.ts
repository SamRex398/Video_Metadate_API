import request from 'supertest';
import express from 'express';

// Mock prisma
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    video: {
      findMany: jest.fn().mockResolvedValue([{ id: 1, title: 'Mock Video' }]),
      create: jest.fn().mockResolvedValue({ id: 2, title: 'Created Video' }),
      update: jest.fn().mockResolvedValue({ id: 1, title: 'Updated Video' }),
      delete: jest.fn().mockResolvedValue({ id: 1, title: 'Deleted Video' }),
    },
  })),
}));

// Mock authMiddleware
jest.mock('../middleware/authMiddleware', () => {
  return {
    authMiddleware: (role: any) => (req: any, res: any, next: any) => {
      if (req.headers['authorization'] === 'Bearer admintoken') {
        req.user = { role: 'admin' };
        return next();
      }
      if (req.headers['authorization'] === 'Bearer usertoken') {
        req.user = { role: 'user' };
        return next();
      }
      return res.status(401).json({ message: 'Unauthorized' });
    },
    generateToken: (req: any, res: any) => {
      if (req.headers['authorization'] === 'Bearer validuser') {
        return res.json({ token: 'usertoken' });
      }
      return res.status(401).json({ message: 'Unauthorized' });
    },
  };
});

import videosRouter from '../routes/videos';
import authRouter from '../routes/auth';

const app = express();
app.use(express.json());
app.use('/videos', videosRouter);
app.use('/auth', authRouter);

describe('Auth API', () => {
  test('GET /auth/accesstoken returns 401 if not authenticated', async () => {
    const res = await request(app).get('/auth/accesstoken');
    expect(res.statusCode).toBe(401);
  });

  test('GET /auth/accesstoken returns token if authenticated', async () => {
    const res = await request(app)
      .get('/auth/accesstoken')
      .set('Authorization', 'Bearer validuser');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token', 'usertoken');
  });
});

describe('Videos API', () => {
  test('GET /videos with user token returns 200', async () => {
    const res = await request(app)
      .get('/videos')
      .set('Authorization', 'Bearer usertoken');
    expect(res.statusCode).toBe(200);
    expect(res.body[0]).toHaveProperty('title', 'Mock Video');
  });

  test('POST /videos/add with admin returns 201', async () => {
    const res = await request(app)
      .post('/videos/add')
      .set('Authorization', 'Bearer admintoken')
      .send({ title: 'Created Video' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('title', 'Created Video');
  });

  test('PUT /videos/:id with admin returns 200', async () => {
    const res = await request(app)
      .put('/videos/1')
      .set('Authorization', 'Bearer admintoken')
      .send({ title: 'Updated Video' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('title', 'Updated Video');
  });

  test('DELETE /videos/:id with admin returns 200', async () => {
    const res = await request(app)
      .delete('/videos/1')
      .set('Authorization', 'Bearer admintoken');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('title', 'Deleted Video');
  });
});
