import request from 'supertest';
import app from '../../app';
import { pool } from '../../utils/db';

jest.mock('../../utils/db', () => ({
  pool: {
    getConnection: jest.fn().mockReturnThis(),
    query: jest.fn(),
    release: jest.fn(),
  },
}));

describe('Auth Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/login', () => {
    it('should return 400 if required fields are missing', async () => {
      const res = await request(app).post('/api/login').send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Todos los campos son requeridos');
    });

    it('should return 401 for invalid credentials', async () => {
      (pool.query as jest.Mock).mockResolvedValue([]);
      const res = await request(app)
        .post('/api/login')
        .send({ username: 'test', password: 'wrong', tipo_usuario: 'Paciente' });
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Usuario o contraseña incorrectos');
    });

    it('should return 200 for valid credentials', async () => {
      const mockUser = [{ id_usuario: 1, tipo_usuario: 'Paciente' }];
      (pool.query as jest.Mock).mockResolvedValue(mockUser);
      const res = await request(app)
        .post('/api/login')
        .send({ username: 'test', password: 'password', tipo_usuario: 'Paciente' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user).toEqual({ id: 1, tipo: 'Paciente' });
    });

    it('should return 500 for a server error', async () => {
      (pool.query as jest.Mock).mockRejectedValue(new Error('DB Error'));
      const res = await request(app)
        .post('/api/login')
        .send({ username: 'test', password: 'password', tipo_usuario: 'Paciente' });
      expect(res.status).toBe(500);
      expect(res.body.message).toBe('Error del servidor');
    });
  });
});
