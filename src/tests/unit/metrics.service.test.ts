/**
 * Unit Tests for MetricsService
 */

import { MetricsService } from '../../services/metrics.service';

describe('MetricsService', () => {
  let metricsService: MetricsService;

  beforeEach(() => {
    metricsService = MetricsService.getInstance();
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = MetricsService.getInstance();
      const instance2 = MetricsService.getInstance();

      expect(instance1).toBe(instance2);
    });

    it('should maintain state across instances', () => {
      const instance1 = MetricsService.getInstance();
      const instance2 = MetricsService.getInstance();

      expect(instance1).toBe(instance2);
    });
  });

  describe('recordRequest', () => {
    it('should record HTTP request without errors', () => {
      expect(() => {
        metricsService.recordRequest('GET', '/test', 200);
      }).not.toThrow();
    });

    it('should accept different HTTP methods', () => {
      expect(() => {
        metricsService.recordRequest('GET', '/test', 200);
        metricsService.recordRequest('POST', '/test', 201);
        metricsService.recordRequest('PUT', '/test', 200);
        metricsService.recordRequest('DELETE', '/test', 204);
        metricsService.recordRequest('PATCH', '/test', 200);
      }).not.toThrow();
    });

    it('should accept different status codes', () => {
      expect(() => {
        metricsService.recordRequest('GET', '/test', 200);
        metricsService.recordRequest('GET', '/test', 404);
        metricsService.recordRequest('GET', '/test', 500);
        metricsService.recordRequest('POST', '/test', 201);
        metricsService.recordRequest('POST', '/test', 400);
      }).not.toThrow();
    });

    it('should accept different endpoints', () => {
      expect(() => {
        metricsService.recordRequest('GET', '/', 200);
        metricsService.recordRequest('GET', '/health', 200);
        metricsService.recordRequest('GET', '/api/items', 200);
        metricsService.recordRequest('GET', '/api/items/1', 200);
      }).not.toThrow();
    });

    it('should handle multiple consecutive requests', () => {
      expect(() => {
        for (let i = 0; i < 100; i++) {
          metricsService.recordRequest('GET', '/test', 200);
        }
      }).not.toThrow();
    });
  });

  describe('getMetrics', () => {
    it('should return metrics as string', async () => {
      const metrics = await metricsService.getMetrics();

      expect(typeof metrics).toBe('string');
      expect(metrics.length).toBeGreaterThan(0);
    });

    it('should return Prometheus format metrics', async () => {
      metricsService.recordRequest('GET', '/test', 200);
      const metrics = await metricsService.getMetrics();

      expect(metrics).toContain('# HELP');
      expect(metrics).toContain('# TYPE');
    });

    it('should include http_requests_total metric', async () => {
      metricsService.recordRequest('GET', '/test', 200);
      const metrics = await metricsService.getMetrics();

      expect(metrics).toContain('http_requests_total');
    });

    it('should include process_uptime_seconds metric', async () => {
      const metrics = await metricsService.getMetrics();

      expect(metrics).toContain('process_uptime_seconds');
    });

    it('should include default Node.js metrics', async () => {
      const metrics = await metricsService.getMetrics();

      // Check for common default metrics
      expect(
        metrics.includes('process_cpu') ||
        metrics.includes('nodejs_') ||
        metrics.includes('process_')
      ).toBe(true);
    });

    it('should return updated metrics after recording requests', async () => {
      const metricsBefore = await metricsService.getMetrics();

      metricsService.recordRequest('POST', '/api/items', 201);

      const metricsAfter = await metricsService.getMetrics();

      expect(metricsAfter).not.toBe(metricsBefore);
      expect(metricsAfter.length).toBeGreaterThanOrEqual(metricsBefore.length);
    });
  });

  describe('getContentType', () => {
    it('should return content type string', () => {
      const contentType = metricsService.getContentType();

      expect(typeof contentType).toBe('string');
      expect(contentType.length).toBeGreaterThan(0);
    });

    it('should return Prometheus content type', () => {
      const contentType = metricsService.getContentType();

      expect(contentType).toContain('text/plain');
    });

    it('should return consistent content type', () => {
      const contentType1 = metricsService.getContentType();
      const contentType2 = metricsService.getContentType();

      expect(contentType1).toBe(contentType2);
    });
  });

  describe('Integration', () => {
    it('should handle complete metrics workflow', async () => {
      // Record multiple requests
      metricsService.recordRequest('GET', '/api/items', 200);
      metricsService.recordRequest('POST', '/api/items', 201);
      metricsService.recordRequest('GET', '/api/items/1', 404);

      // Get metrics
      const metrics = await metricsService.getMetrics();

      // Verify metrics contain expected data
      expect(metrics).toBeTruthy();
      expect(metrics.length).toBeGreaterThan(0);
      expect(metrics).toContain('http_requests_total');
    });

    it('should maintain metrics across service calls', async () => {
      metricsService.recordRequest('GET', '/test1', 200);
      const metrics1 = await metricsService.getMetrics();

      metricsService.recordRequest('GET', '/test2', 200);
      const metrics2 = await metricsService.getMetrics();

      // Second metrics should be different (accumulated)
      expect(metrics2).not.toBe(metrics1);
    });
  });
});
