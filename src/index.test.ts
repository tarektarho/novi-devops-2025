import request from 'supertest';
import { app, server } from './index';

describe('API Endpoints', () => {
  afterAll((done) => {
    server.close(done);
  });

  describe('GET /', () => {
    it('should return welcome message', async () => {
      const response = await request(app).get('/');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Welcome to NOVI Status API');
      expect(response.body).toHaveProperty('endpoints');
    });
  });

  describe('GET /status', () => {
    it('should return status information', async () => {
      const response = await request(app).get('/status');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('service', 'novi-status-api');
      expect(response.body).toHaveProperty('status', 'running');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('timestamp');
    });

    it('should return valid timestamp', async () => {
      const response = await request(app).get('/status');
      const timestamp = new Date(response.body.timestamp);

      expect(timestamp.toString()).not.toBe('Invalid Date');
    });
  });

  describe('GET /health', () => {
    it('should return health check information', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('environment');
    });

    it('should return numeric uptime', async () => {
      const response = await request(app).get('/health');

      expect(typeof response.body.uptime).toBe('number');
      expect(response.body.uptime).toBeGreaterThanOrEqual(0);
    });
  });

  describe('GET /invalid-endpoint', () => {
    it('should return 404 for invalid endpoint', async () => {
      const response = await request(app).get('/invalid-endpoint');

      expect(response.status).toBe(404);
    });
  });
});
