/**
 * Unit Tests for MetricsController
 */

import { Request, Response } from 'express';
import { MetricsController } from '../../../controllers/metrics.controller';
import { MetricsService } from '../../../services/metrics.service';

describe('MetricsController', () => {
  let controller: MetricsController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let metricsService: MetricsService;

  beforeEach(() => {
    jest.restoreAllMocks();
    controller = new MetricsController();
    metricsService = MetricsService.getInstance();

    mockRequest = {};

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };
  });

  describe('getMetrics', () => {
    it('should return metrics successfully', async () => {
      await controller.getMetrics(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should set correct content type', async () => {
      await controller.getMetrics(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.set).toHaveBeenCalledWith(
        'Content-Type',
        metricsService.getContentType()
      );
    });

    it('should send metrics string', async () => {
      await controller.getMetrics(mockRequest as Request, mockResponse as Response);

      const sentData = (mockResponse.send as jest.Mock).mock.calls[0][0];
      expect(typeof sentData).toBe('string');
      expect(sentData.length).toBeGreaterThan(0);
    });

    it('should include Prometheus format headers', async () => {
      await controller.getMetrics(mockRequest as Request, mockResponse as Response);

      const metrics = (mockResponse.send as jest.Mock).mock.calls[0][0];
      expect(metrics).toContain('# HELP');
      expect(metrics).toContain('# TYPE');
    });

    it('should handle errors gracefully', async () => {
      jest.spyOn(metricsService, 'getMetrics').mockRejectedValue(new Error('Metrics error'));

      await controller.getMetrics(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should return error response on failure', async () => {
      jest.spyOn(metricsService, 'getMetrics').mockRejectedValue(new Error('Service unavailable'));

      await controller.getMetrics(mockRequest as Request, mockResponse as Response);

      const errorResponse = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(errorResponse).toHaveProperty('error');
    });

    it('should call MetricsService getMetrics', async () => {
      const getMetricsSpy = jest.spyOn(metricsService, 'getMetrics');

      await controller.getMetrics(mockRequest as Request, mockResponse as Response);

      expect(getMetricsSpy).toHaveBeenCalled();
    });

    it('should call MetricsService getContentType', async () => {
      const getContentTypeSpy = jest.spyOn(metricsService, 'getContentType');

      await controller.getMetrics(mockRequest as Request, mockResponse as Response);

      expect(getContentTypeSpy).toHaveBeenCalled();
    });

    it('should return metrics containing http_requests_total', async () => {
      await controller.getMetrics(mockRequest as Request, mockResponse as Response);

      const metrics = (mockResponse.send as jest.Mock).mock.calls[0][0];
      expect(metrics).toContain('http_requests_total');
    });

    it('should return metrics containing process_uptime_seconds', async () => {
      await controller.getMetrics(mockRequest as Request, mockResponse as Response);

      const metrics = (mockResponse.send as jest.Mock).mock.calls[0][0];
      expect(metrics).toContain('process_uptime_seconds');
    });

    it('should handle multiple consecutive calls', async () => {
      await controller.getMetrics(mockRequest as Request, mockResponse as Response);
      await controller.getMetrics(mockRequest as Request, mockResponse as Response);
      await controller.getMetrics(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.send).toHaveBeenCalledTimes(3);
    });

    it('should return Promise', () => {
      const result = controller.getMetrics(mockRequest as Request, mockResponse as Response);
      expect(result).toBeInstanceOf(Promise);
    });

    it('should set headers before sending metrics', async () => {
      const callOrder: string[] = [];

      (mockResponse.set as jest.Mock).mockImplementation(() => {
        callOrder.push('set');
        return mockResponse;
      });

      (mockResponse.send as jest.Mock).mockImplementation(() => {
        callOrder.push('send');
        return mockResponse;
      });

      await controller.getMetrics(mockRequest as Request, mockResponse as Response);

      expect(callOrder[0]).toBe('set');
      expect(callOrder[1]).toBe('send');
    });

    it('should propagate error message', async () => {
      const errorMessage = 'Custom metrics error';
      jest.spyOn(metricsService, 'getMetrics').mockRejectedValue(new Error(errorMessage));

      await controller.getMetrics(mockRequest as Request, mockResponse as Response);

      const errorResponse = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(errorResponse.message).toBe(errorMessage);
    });
  });

  describe('Error Scenarios', () => {
    it('should handle service timeout', async () => {
      jest.spyOn(metricsService, 'getMetrics').mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => reject(new Error('Timeout')), 100);
        });
      });

      await controller.getMetrics(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });

    it('should handle undefined error', async () => {
      jest.spyOn(metricsService, 'getMetrics').mockRejectedValue(undefined);

      await controller.getMetrics(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });

    it('should handle null error', async () => {
      jest.spyOn(metricsService, 'getMetrics').mockRejectedValue(null);

      await controller.getMetrics(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
  });
});
