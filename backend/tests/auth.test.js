import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { app } from '../src/app.js';
import { connectDB } from '../src/config/db.js';
import { User } from '../src/models/User.js';
import { USER_ROLES, USER_STATUS } from '../src/config/constants.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.MONGODB_URI = uri;
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
  await connectDB();
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe('Auth flows', () => {
  it('signup returns token and user', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ fullName: 'Test User', email: 'user1@example.com', password: 'Password123' });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('user1@example.com');
  });

  it('login returns token and user', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({ fullName: 'Test User', email: 'user2@example.com', password: 'Password123' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user2@example.com', password: 'Password123' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('user2@example.com');
  });

  it('/auth/me returns current user with token', async () => {
    const signup = await request(app)
      .post('/api/auth/signup')
      .send({ fullName: 'Test User', email: 'user3@example.com', password: 'Password123' });

    const token = signup.body.token;
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe('user3@example.com');
  });
});

describe('Admin listing', () => {
  it('non-admin cannot list users', async () => {
    const signup = await request(app)
      .post('/api/auth/signup')
      .send({ fullName: 'User A', email: 'user4@example.com', password: 'Password123' });

    const token = signup.body.token;
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
  });

  it('admin can list users', async () => {
    // create a normal user
    await request(app)
      .post('/api/auth/signup')
      .send({ fullName: 'User B', email: 'user5@example.com', password: 'Password123' });

    // create admin directly
    const passwordHash = await bcrypt.hash('AdminPass123', 10);
    await User.create({
      fullName: 'Admin User',
      email: 'admin@example.com',
      passwordHash,
      role: USER_ROLES.ADMIN,
      status: USER_STATUS.ACTIVE,
    });

    // login admin
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'AdminPass123' });

    const adminToken = login.body.token;

    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.total).toBeGreaterThanOrEqual(1);
  });
});
