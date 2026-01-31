/**
 * Unit Tests for BaseController
 */

import { Response } from 'express';
import { BaseController } from '../../../controllers/base.controller';

// Create a concrete implementation of the abstract BaseController for testing
class TestController extends BaseController {
  public testOk<T>(res: Response, data: T, statusCode?: number) {
    return this.ok(res, data, statusCode);
  }

  public testCreated<T>(res: Response, data: T) {
    return this.created(res, data);
  }

  public testFail(res: Response, message: string, statusCode?: number) {
    return this.fail(res, message, statusCode);
  }

  public testNotFound(res: Response, message?: string) {
    return this.notFound(res, message);
  }

  public testServerError(res: Response, error: Error | string) {
    return this.serverError(res, error);
  }
}

describe('BaseController', () => {
  let controller: TestController;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    controller = new TestController();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  describe('ok', () => {
    it('should return 200 status by default', () => {
      const data = { message: 'Success' };
      controller.testOk(mockResponse as Response, data);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(data);
    });

    it('should accept custom status code', () => {
      const data = { message: 'Custom success' };
      controller.testOk(mockResponse as Response, data, 202);

      expect(mockResponse.status).toHaveBeenCalledWith(202);
      expect(mockResponse.json).toHaveBeenCalledWith(data);
    });

    it('should handle different data types', () => {
      const testCases = [
        { data: 'string' },
        { data: 123 },
        { data: { object: 'value' } },
        { data: ['array', 'items'] },
        { data: true },
        { data: null }
      ];

      testCases.forEach(({ data }) => {
        controller.testOk(mockResponse as Response, data);
        expect(mockResponse.json).toHaveBeenCalledWith(data);
      });
    });

    it('should return response object', () => {
      const result = controller.testOk(mockResponse as Response, { test: 'data' });
      expect(result).toBe(mockResponse);
    });
  });

  describe('created', () => {
    it('should return 201 status', () => {
      const data = { id: 1, name: 'New Item' };
      controller.testCreated(mockResponse as Response, data);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(data);
    });

    it('should handle various data types', () => {
      const testData = [
        { id: 1, name: 'Item 1' },
        { message: 'Created successfully' },
        ['item1', 'item2']
      ];

      testData.forEach(data => {
        controller.testCreated(mockResponse as Response, data);
        expect(mockResponse.json).toHaveBeenCalledWith(data);
      });
    });

    it('should return response object', () => {
      const result = controller.testCreated(mockResponse as Response, { test: 'data' });
      expect(result).toBe(mockResponse);
    });
  });

  describe('fail', () => {
    it('should return 400 status by default', () => {
      const message = 'Validation failed';
      controller.testFail(mockResponse as Response, message);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: message });
    });

    it('should accept custom status code', () => {
      const message = 'Unauthorized';
      controller.testFail(mockResponse as Response, message, 401);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: message });
    });

    it('should handle different error messages', () => {
      const messages = [
        'Invalid input',
        'Missing required field',
        'Validation error',
        'Bad request'
      ];

      messages.forEach(message => {
        controller.testFail(mockResponse as Response, message);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: message });
      });
    });

    it('should return response object', () => {
      const result = controller.testFail(mockResponse as Response, 'Error');
      expect(result).toBe(mockResponse);
    });
  });

  describe('notFound', () => {
    it('should return 404 status', () => {
      controller.testNotFound(mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });

    it('should use default message if not provided', () => {
      controller.testNotFound(mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Resource not found'
      });
    });

    it('should use custom message if provided', () => {
      const customMessage = 'Item not found';
      controller.testNotFound(mockResponse as Response, customMessage);

      expect(mockResponse.json).toHaveBeenCalledWith({
        error: customMessage
      });
    });

    it('should handle different not found messages', () => {
      const messages = [
        'User not found',
        'Item not found',
        'Page not found',
        'Resource does not exist'
      ];

      messages.forEach(message => {
        controller.testNotFound(mockResponse as Response, message);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: message });
      });
    });

    it('should return response object', () => {
      const result = controller.testNotFound(mockResponse as Response);
      expect(result).toBe(mockResponse);
    });
  });

  describe('serverError', () => {
    it('should return 500 status', () => {
      const error = new Error('Internal error');
      controller.testServerError(mockResponse as Response, error);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });

    it('should handle Error object', () => {
      const error = new Error('Test error');
      controller.testServerError(mockResponse as Response, error);

      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Internal server error',
        message: 'Test error'
      });
    });

    it('should handle string error', () => {
      const errorMessage = 'Something went wrong';
      controller.testServerError(mockResponse as Response, errorMessage);

      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Internal server error',
        message: errorMessage
      });
    });

    it('should extract message from Error object', () => {
      const errors = [
        new Error('Database error'),
        new TypeError('Type error'),
        new ReferenceError('Reference error')
      ];

      errors.forEach(error => {
        controller.testServerError(mockResponse as Response, error);
        expect(mockResponse.json).toHaveBeenCalledWith({
          error: 'Internal server error',
          message: error.message
        });
      });
    });

    it('should return response object', () => {
      const result = controller.testServerError(mockResponse as Response, 'Error');
      expect(result).toBe(mockResponse);
    });
  });

  describe('Chaining', () => {
    it('should allow method chaining', () => {
      const result = controller.testOk(mockResponse as Response, { test: 'data' });
      expect(result).toBe(mockResponse);
    });

    it('should maintain response object through chain', () => {
      controller.testOk(mockResponse as Response, { test: 'data' });
      expect(mockResponse.status).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty objects', () => {
      controller.testOk(mockResponse as Response, {});
      expect(mockResponse.json).toHaveBeenCalledWith({});
    });

    it('should handle empty arrays', () => {
      controller.testOk(mockResponse as Response, []);
      expect(mockResponse.json).toHaveBeenCalledWith([]);
    });

    it('should handle empty error messages', () => {
      controller.testFail(mockResponse as Response, '');
      expect(mockResponse.json).toHaveBeenCalledWith({ error: '' });
    });

    it('should handle undefined in serverError as string', () => {
      controller.testServerError(mockResponse as Response, '');
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Internal server error',
        message: ''
      });
    });
  });
});
