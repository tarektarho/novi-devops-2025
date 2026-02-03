/**
 * Unit Tests for Middleware classes
 */

import { Request, Response, NextFunction } from 'express';
import { MetricsMiddleware, ErrorHandlerMiddleware, RequestLoggerMiddleware } from '../../middleware';
import { MetricsService } from '../../services/metrics.service';

// Mock console methods
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

describe('Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      method: 'GET',
      path: '/test',
      body: {},
      params: {},
      query: {}
    };

    mockResponse = {
      on: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      statusCode: 200
    };

    mockNext = jest.fn();
  });

  describe('MetricsMiddleware', () => {
    let metricsMiddleware: MetricsMiddleware;

    beforeEach(() => {
      metricsMiddleware = new MetricsMiddleware();
    });

    it('should be instantiated', () => {
      expect(metricsMiddleware).toBeDefined();
      expect(metricsMiddleware).toBeInstanceOf(MetricsMiddleware);
    });

    it('should call next function', () => {
      metricsMiddleware.handle(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it('should register finish event listener', () => {
      metricsMiddleware.handle(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.on).toHaveBeenCalledWith('finish', expect.any(Function));
    });

    it('should record metrics on response finish', () => {
      const recordRequestSpy = jest.spyOn(MetricsService.getInstance(), 'recordRequest');

      metricsMiddleware.handle(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Simulate finish event
      const finishCallback = (mockResponse.on as jest.Mock).mock.calls[0][1];
      finishCallback();

      expect(recordRequestSpy).toHaveBeenCalledWith('GET', '/test', 200);
    });

    it('should handle different HTTP methods', () => {
      const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

      methods.forEach(method => {
        mockRequest.method = method;
        metricsMiddleware.handle(
          mockRequest as Request,
          mockResponse as Response,
          mockNext
        );
      });

      expect(mockNext).toHaveBeenCalledTimes(methods.length);
    });

    it('should handle different status codes', () => {
      const statusCodes = [200, 201, 400, 404, 500];

      statusCodes.forEach(statusCode => {
        const freshResponse = {
          ...mockResponse,
          on: jest.fn(),
          statusCode: statusCode
        };

        metricsMiddleware.handle(
          mockRequest as Request,
          freshResponse as Response,
          mockNext
        );

        const finishCallback = (freshResponse.on as jest.Mock).mock.calls[0][1];
        finishCallback();
      });

      expect(mockNext).toHaveBeenCalledTimes(statusCodes.length);
    });
  });

  describe('ErrorHandlerMiddleware', () => {
    let errorHandler: ErrorHandlerMiddleware;
    let mockError: Error;

    beforeEach(() => {
      errorHandler = new ErrorHandlerMiddleware();
      mockError = new Error('Test error');
      console.error = jest.fn();
    });

    afterEach(() => {
      console.error = originalConsoleError;
    });

    it('should be instantiated', () => {
      expect(errorHandler).toBeDefined();
      expect(errorHandler).toBeInstanceOf(ErrorHandlerMiddleware);
    });

    it('should log error to console', () => {
      errorHandler.handle(
        mockError,
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(console.error).toHaveBeenCalled();
    });

    it('should send 500 status code', () => {
      errorHandler.handle(
        mockError,
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });

    it('should send error response', () => {
      errorHandler.handle(
        mockError,
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Something went wrong!'
        })
      );
    });

    it('should include error message in development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      errorHandler.handle(
        mockError,
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Something went wrong!',
          message: 'Test error'
        })
      );

      process.env.NODE_ENV = originalEnv;
    });

    it('should not include error message in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      errorHandler.handle(
        mockError,
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      const callArg = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(callArg.message).toBeUndefined();

      process.env.NODE_ENV = originalEnv;
    });

    it('should handle different error types', () => {
      const errors = [
        new Error('Standard error'),
        new TypeError('Type error'),
        new ReferenceError('Reference error')
      ];

      errors.forEach(error => {
        errorHandler.handle(
          error,
          mockRequest as Request,
          mockResponse as Response,
          mockNext
        );
      });

      expect(mockResponse.status).toHaveBeenCalledTimes(errors.length);
    });
  });

  describe('RequestLoggerMiddleware', () => {
    let requestLogger: RequestLoggerMiddleware;

    beforeEach(() => {
      requestLogger = new RequestLoggerMiddleware();
      console.log = jest.fn();
    });

    afterEach(() => {
      console.log = originalConsoleLog;
    });

    it('should be instantiated', () => {
      expect(requestLogger).toBeDefined();
      expect(requestLogger).toBeInstanceOf(RequestLoggerMiddleware);
    });

    it('should call next function', () => {
      requestLogger.handle(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it('should log request to console', () => {
      requestLogger.handle(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(console.log).toHaveBeenCalled();
    });

    it('should log method and path', () => {
      requestLogger.handle(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      const logMessage = (console.log as jest.Mock).mock.calls[0][0];
      expect(logMessage).toContain('GET');
      expect(logMessage).toContain('/test');
    });

    it('should log timestamp', () => {
      requestLogger.handle(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      const logMessage = (console.log as jest.Mock).mock.calls[0][0];
      expect(logMessage).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    it('should handle different HTTP methods', () => {
      const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

      methods.forEach(method => {
        mockRequest.method = method;
        requestLogger.handle(
          mockRequest as Request,
          mockResponse as Response,
          mockNext
        );

        const logMessage = (console.log as jest.Mock).mock.calls.slice(-1)[0][0];
        expect(logMessage).toContain(method);
      });
    });

    it('should handle different paths', () => {
      const paths = ['/', '/health', '/api/items', '/api/items/1'];

      paths.forEach(path => {
        //@ts-expect-error - Testing with mock path assignment
        mockRequest.path = path;
        requestLogger.handle(
          mockRequest as Request,
          mockResponse as Response,
          mockNext
        );

        const logMessage = (console.log as jest.Mock).mock.calls.slice(-1)[0][0];
        expect(logMessage).toContain(path);
      });
    });
  });
});
