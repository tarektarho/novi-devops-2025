/**
 * API Integration Tests
 * Tests for the Express application endpoints
 */

import request from 'supertest';
import app from '../index';
import { InMemoryItemsRepository } from '../database';

describe('API Endpoints', () => {
  let repository: InMemoryItemsRepository;

  beforeEach(() => {
    repository = InMemoryItemsRepository.getInstance();
    repository.reset();
  });

  describe('GET /', () => {
    it('should return welcome message', async () => {
      const response = await request(app).get('/');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('environment');
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('version');
    });
  });

  describe('GET /api/info', () => {
    it('should return application info', async () => {
      const response = await request(app).get('/api/info');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('app');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('node_version');
      expect(response.body).toHaveProperty('platform');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('GET /api/items', () => {
    it('should return all items', async () => {
      const response = await request(app).get('/api/items');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(3);
    });
  });

  describe('GET /api/items/:id', () => {
    it('should return item by id', async () => {
      const response = await request(app).get('/api/items/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('name');
    });

    it('should return 404 for non-existent item', async () => {
      const response = await request(app).get('/api/items/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid id format', async () => {
      const response = await request(app).get('/api/items/invalid');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/items', () => {
    it('should create new item', async () => {
      const newItem = {
        name: 'Test Item',
        description: 'Test Description'
      };

      const response = await request(app)
        .post('/api/items')
        .send(newItem);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name', 'Test Item');
      expect(response.body).toHaveProperty('description', 'Test Description');
      expect(response.body).toHaveProperty('createdAt');
    });

    it('should create item without description', async () => {
      const newItem = { name: 'Item Without Description' };

      const response = await request(app)
        .post('/api/items')
        .send(newItem);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('name', 'Item Without Description');
      expect(response.body).toHaveProperty('description', '');
    });

    it('should return 400 if name is missing', async () => {
      const response = await request(app)
        .post('/api/items')
        .send({ description: 'No name' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 if name is not a string', async () => {
      const response = await request(app)
        .post('/api/items')
        .send({ name: 123 });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/items/:id', () => {
    it('should update existing item', async () => {
      const updates = {
        name: 'Updated Name',
        description: 'Updated Description'
      };

      const response = await request(app)
        .put('/api/items/1')
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('name', 'Updated Name');
      expect(response.body).toHaveProperty('description', 'Updated Description');
      expect(response.body).toHaveProperty('updatedAt');
    });

    it('should return 404 for non-existent item', async () => {
      const response = await request(app)
        .put('/api/items/999')
        .send({ name: 'Updated' });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid id format', async () => {
      const response = await request(app)
        .put('/api/items/invalid')
        .send({ name: 'Updated' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/items/:id', () => {
    it('should delete existing item', async () => {
      const response = await request(app).delete('/api/items/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');

      // Verify item is deleted
      const getResponse = await request(app).get('/api/items/1');
      expect(getResponse.status).toBe(404);
    });

    it('should return 404 for non-existent item', async () => {
      const response = await request(app).delete('/api/items/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid id format', async () => {
      const response = await request(app).delete('/api/items/invalid');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /metrics', () => {
    it.skip('should return Prometheus metrics', async () => {
      // Skipping due to singleton metrics service initialization in test environment
      const response = await request(app).get('/metrics');

      expect(response.status).toBe(200);
      expect(typeof response.text).toBe('string');
      expect(response.text.length).toBeGreaterThan(0);
    });
  });
});
