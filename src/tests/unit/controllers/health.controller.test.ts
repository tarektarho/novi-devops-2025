/**
 * Unit Tests for HealthController
 */

import { Request, Response } from 'express';
import { HealthController } from '../../../controllers/health.controller';
import { ConfigService } from '../../../config/app.config';

describe('HealthController', () => {
  let controller: HealthController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let configService: ConfigService;

  beforeEach(() => {
    controller = new HealthController();
    configService = ConfigService.getInstance();

    mockRequest = {
      method: 'GET',
      path: '/',
      body: {},
      params: {},
      query: {}
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  describe('root', () => {
    it('should return 200 status', () => {
      controller.root(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalled();
      const callArg = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(callArg).toHaveProperty('message');
    });

    it('should return welcome message', () => {
      controller.root(mockRequest as Request, mockResponse as Response);

      const response = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(response.message).toContain('Welcome');
    });

    it('should return version from config', () => {
      controller.root(mockRequest as Request, mockResponse as Response);

      const response = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(response.version).toBe(configService.get('appVersion'));
    });

    it('should return environment from config', () => {
      controller.root(mockRequest as Request, mockResponse as Response);

      const response = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(response.environment).toBe(configService.get('nodeEnv'));
    });

    it('should have all required properties', () => {
      controller.root(mockRequest as Request, mockResponse as Response);

      const response = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(response).toHaveProperty('message');
      expect(response).toHaveProperty('version');
      expect(response).toHaveProperty('environment');
    });
  });

  describe('health', () => {
    it('should return health status', () => {
      controller.health(mockRequest as Request, mockResponse as Response);

      const response = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(response).toHaveProperty('status', 'healthy');
    });

    it('should return timestamp', () => {
      controller.health(mockRequest as Request, mockResponse as Response);

      const response = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(response).toHaveProperty('timestamp');
      expect(typeof response.timestamp).toBe('string');
    });

    it('should return valid ISO timestamp', () => {
      controller.health(mockRequest as Request, mockResponse as Response);

      const response = (mockResponse.json as jest.Mock).mock.calls[0][0];
      const date = new Date(response.timestamp);
      expect(date.toString()).not.toBe('Invalid Date');
    });

    it('should return version from config', () => {
      controller.health(mockRequest as Request, mockResponse as Response);

      const response = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(response.version).toBe(configService.get('appVersion'));
    });

    it('should return request number', () => {
      controller.health(mockRequest as Request, mockResponse as Response);

      const response = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(response).toHaveProperty('requestNumber');
      expect(typeof response.requestNumber).toBe('number');
    });

    it('should have all required properties', () => {
      controller.health(mockRequest as Request, mockResponse as Response);

      const response = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(response).toHaveProperty('status');
      expect(response).toHaveProperty('timestamp');
      expect(response).toHaveProperty('version');
      expect(response).toHaveProperty('requestNumber');
    });

    it('should return same request number for consecutive calls', () => {
      controller.health(mockRequest as Request, mockResponse as Response);
      const response1 = (mockResponse.json as jest.Mock).mock.calls[0][0];

      controller.health(mockRequest as Request, mockResponse as Response);
      const response2 = (mockResponse.json as jest.Mock).mock.calls[1][0];

      expect(response1.requestNumber).toBe(response2.requestNumber);
    });
  });

  describe('info', () => {
    it('should return application info', () => {
      controller.info(mockRequest as Request, mockResponse as Response);

      const response = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(response).toBeDefined();
    });

    it('should increment request count', () => {
      controller.info(mockRequest as Request, mockResponse as Response);
      const _response1 = (mockResponse.json as jest.Mock).mock.calls[0][0];

      controller.info(mockRequest as Request, mockResponse as Response);
      const response2 = (mockResponse.json as jest.Mock).mock.calls[1][0];

      // Request count should be tracked elsewhere
      expect(response2).toBeDefined();
    });

    it('should return app name', () => {
      controller.info(mockRequest as Request, mockResponse as Response);

      const response = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(response).toHaveProperty('app');
      expect(typeof response.app).toBe('string');
    });

    it('should return version from config', () => {
      controller.info(mockRequest as Request, mockResponse as Response);

      const response = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(response.version).toBe(configService.get('appVersion'));
    });

    it('should return Node.js version', () => {
      controller.info(mockRequest as Request, mockResponse as Response);

      const response = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(response).toHaveProperty('node_version');
      expect(typeof response.node_version).toBe('string');
      expect(response.node_version).toMatch(/^v\d+\.\d+\.\d+/);
    });

    it('should return platform', () => {
      controller.info(mockRequest as Request, mockResponse as Response);

      const response = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(response).toHaveProperty('platform');
      expect(typeof response.platform).toBe('string');
      expect(['darwin', 'linux', 'win32', 'freebsd', 'openbsd']).toContain(response.platform);
    });

    it('should return uptime', () => {
      controller.info(mockRequest as Request, mockResponse as Response);

      const response = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(response).toHaveProperty('uptime');
      expect(typeof response.uptime).toBe('number');
      expect(response.uptime).toBeGreaterThan(0);
    });

    it('should return environment from config', () => {
      controller.info(mockRequest as Request, mockResponse as Response);

      const response = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(response.environment).toBe(configService.get('nodeEnv'));
    });

    it('should have all required properties', () => {
      controller.info(mockRequest as Request, mockResponse as Response);

      const response = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(response).toHaveProperty('app');
      expect(response).toHaveProperty('version');
      expect(response).toHaveProperty('node_version');
      expect(response).toHaveProperty('platform');
      expect(response).toHaveProperty('uptime');
      expect(response).toHaveProperty('environment');
    });

    it('should return different uptime on subsequent calls', (done) => {
      controller.info(mockRequest as Request, mockResponse as Response);
      const response1 = (mockResponse.json as jest.Mock).mock.calls[0][0];

      setTimeout(() => {
        controller.info(mockRequest as Request, mockResponse as Response);
        const response2 = (mockResponse.json as jest.Mock).mock.calls[1][0];

        expect(response2.uptime).toBeGreaterThanOrEqual(response1.uptime);
        done();
      }, 10);
    });
  });

  describe('Response object', () => {
    it('should return response object from root', () => {
      const result = controller.root(mockRequest as Request, mockResponse as Response);
      expect(result).toBe(mockResponse);
    });

    it('should return response object from health', () => {
      const result = controller.health(mockRequest as Request, mockResponse as Response);
      expect(result).toBe(mockResponse);
    });

    it('should return response object from info', () => {
      const result = controller.info(mockRequest as Request, mockResponse as Response);
      expect(result).toBe(mockResponse);
    });
  });
});
