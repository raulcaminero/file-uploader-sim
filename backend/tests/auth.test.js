import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../middleware/auth.js';

// Crear una app de prueba
const createTestApp = () => {
  const app = express();
  app.use(bodyParser.json());
  app.use(cookieParser());

  // Endpoint de login simplificado para pruebas
  app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Usuario y contraseña son requeridos'
      });
    }

    if (username === 'demo' && password === 'demo123') {
      const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
      res.cookie('token', token, { httpOnly: true });
      res.json({ success: true, token });
    } else {
      res.status(401).json({
        success: false,
        message: 'Credenciales incorrectas'
      });
    }
  });

  return app;
};

describe('Authentication Tests', () => {
  let app;

  beforeAll(() => {
    app = createTestApp();
  });

  test('POST /api/login with valid credentials should return token', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({ username: 'demo', password: 'demo123' })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeDefined();
    expect(response.headers['set-cookie']).toBeDefined();
  });

  test('POST /api/login with invalid credentials should return 401', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({ username: 'demo', password: 'wrong' })
      .expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('Credenciales incorrectas');
  });

  test('POST /api/login without username should return 400', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({ password: 'demo123' })
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('requeridos');
  });

  test('POST /api/login without password should return 400', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({ username: 'demo' })
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('requeridos');
  });

  test('POST /api/login with empty body should return 400', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({})
      .expect(400);

    expect(response.body.success).toBe(false);
  });
});
