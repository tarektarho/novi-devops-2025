/**
 * Unit Tests for ItemsController
 */

import { Request, Response } from 'express';
import { ItemsController } from '../../../controllers/items.controller';
import { InMemoryItemsRepository, Item } from '../../../database';

describe('ItemsController', () => {
  let controller: ItemsController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let repository: InMemoryItemsRepository;

  beforeEach(() => {
    repository = InMemoryItemsRepository.getInstance();
    repository.reset();
    controller = new ItemsController();
    jest.restoreAllMocks();

    mockRequest = {
      params: {},
      body: {},
      query: {}
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  describe('getAll', () => {
    it('should return all items', () => {
      controller.getAll(mockRequest as Request, mockResponse as Response);

      const response = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(Array.isArray(response)).toBe(true);
      expect(response).toHaveLength(3);
    });

    it('should return items with correct structure', () => {
      controller.getAll(mockRequest as Request, mockResponse as Response);

      const items = (mockResponse.json as jest.Mock).mock.calls[0][0];
      items.forEach((item: Item) => {
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('name');
        expect(item).toHaveProperty('description');
        expect(item).toHaveProperty('createdAt');
      });
    });

    it('should return empty array if no items', () => {
      repository.remove(1);
      repository.remove(2);
      repository.remove(3);

      controller.getAll(mockRequest as Request, mockResponse as Response);

      const response = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(response).toHaveLength(0);
    });

    it('should handle errors gracefully', () => {
      jest.spyOn(repository, 'getAll').mockImplementation(() => {
        throw new Error('Database error');
      });

      controller.getAll(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getById', () => {
    it('should return item by valid id', () => {
      mockRequest.params = { id: '1' };

      controller.getById(mockRequest as Request, mockResponse as Response);

      const response = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(response).toHaveProperty('id', 1);
      expect(response).toHaveProperty('name', 'Item 1');
    });

    it('should return 404 for non-existent id', () => {
      mockRequest.params = { id: '999' };

      controller.getById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      const response = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(response).toHaveProperty('error', 'Item not found');
    });

    it('should return 400 for invalid id format', () => {
      mockRequest.params = { id: 'invalid' };

      controller.getById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      const response = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(response).toHaveProperty('error', 'Invalid ID format');
    });

    it('should return 400 for non-numeric id', () => {
      mockRequest.params = { id: 'abc' };

      controller.getById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it('should handle errors gracefully', () => {
      mockRequest.params = { id: '1' };
      jest.spyOn(repository, 'getById').mockImplementation(() => {
        throw new Error('Database error');
      });

      controller.getById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
  });

  describe('create', () => {
    it('should create new item with name and description', () => {
      mockRequest.body = { name: 'New Item', description: 'New description' };

      controller.create(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      const response = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(response).toHaveProperty('id');
      expect(response).toHaveProperty('name', 'New Item');
      expect(response).toHaveProperty('description', 'New description');
    });

    it('should create item without description', () => {
      mockRequest.body = { name: 'Item Without Description' };

      controller.create(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      const response = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(response).toHaveProperty('name', 'Item Without Description');
      expect(response).toHaveProperty('description', '');
    });

    it('should return 400 if name is missing', () => {
      mockRequest.body = { description: 'No name' };

      controller.create(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      const response = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(response.error).toContain('Name is required');
    });

    it('should return 400 if name is not a string', () => {
      mockRequest.body = { name: 123 };

      controller.create(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      const response = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(response.error).toContain('must be a string');
    });

    it('should return 400 if description is not a string', () => {
      mockRequest.body = { name: 'Valid Name', description: 123 };

      controller.create(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it('should handle errors gracefully', () => {
      mockRequest.body = { name: 'Test' };
      jest.spyOn(repository, 'create').mockImplementation(() => {
        throw new Error('Database error');
      });

      controller.create(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
  });

  describe('update', () => {
    it('should update existing item', () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { name: 'Updated Name', description: 'Updated description' };

      controller.update(mockRequest as Request, mockResponse as Response);

      const response = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(response).toHaveProperty('id', 1);
      expect(response).toHaveProperty('name', 'Updated Name');
      expect(response).toHaveProperty('description', 'Updated description');
    });

    it('should update only name', () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { name: 'Only Name Updated' };

      controller.update(mockRequest as Request, mockResponse as Response);

      const response = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(response).toHaveProperty('name', 'Only Name Updated');
    });

    it('should update only description', () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { description: 'Only Description Updated' };

      controller.update(mockRequest as Request, mockResponse as Response);

      const response = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(response).toHaveProperty('description', 'Only Description Updated');
    });

    it('should return 404 for non-existent item', () => {
      mockRequest.params = { id: '999' };
      mockRequest.body = { name: 'Updated' };

      controller.update(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });

    it('should return 400 for invalid id format', () => {
      mockRequest.params = { id: 'invalid' };
      mockRequest.body = { name: 'Updated' };

      controller.update(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 if name is not a string', () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { name: 123 };

      controller.update(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 if description is not a string', () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { description: 123 };

      controller.update(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it('should handle errors gracefully', () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { name: 'Test' };
      jest.spyOn(repository, 'update').mockImplementation(() => {
        throw new Error('Database error');
      });

      controller.update(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
  });

  describe('delete', () => {
    it('should delete existing item', () => {
      mockRequest.params = { id: '1' };

      controller.delete(mockRequest as Request, mockResponse as Response);

      const response = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(response).toHaveProperty('message', 'Item deleted successfully');
    });

    it('should return 404 for non-existent item', () => {
      mockRequest.params = { id: '999' };

      controller.delete(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      const response = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(response).toHaveProperty('error', 'Item not found');
    });

    it('should return 400 for invalid id format', () => {
      mockRequest.params = { id: 'invalid' };

      controller.delete(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it('should actually remove the item', () => {
      mockRequest.params = { id: '1' };

      controller.delete(mockRequest as Request, mockResponse as Response);

      // Verify the item was deleted
      const allItems = repository.getAll();
      const deletedItem = allItems.find(item => item.id === 1);
      expect(deletedItem).toBeUndefined();
    });

    it('should handle errors gracefully', () => {
      mockRequest.params = { id: '1' };
      jest.spyOn(repository, 'remove').mockImplementation(() => {
        throw new Error('Database error');
      });

      controller.delete(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
  });

  describe('Integration', () => {
    it('should handle complete CRUD workflow', () => {
      // Reset mock before integration test
      mockResponse.json = jest.fn().mockReturnThis();

      // Create
      mockRequest.body = { name: 'CRUD Test', description: 'Testing' };
      controller.create(mockRequest as Request, mockResponse as Response);
      const created = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(created).toHaveProperty('id');

      // Read
      mockRequest.params = { id: created.id.toString() };
      controller.getById(mockRequest as Request, mockResponse as Response);
      const read = (mockResponse.json as jest.Mock).mock.calls[1][0];
      expect(read.name).toBe('CRUD Test');

      // Update
      mockRequest.body = { name: 'CRUD Updated' };
      controller.update(mockRequest as Request, mockResponse as Response);
      const updated = (mockResponse.json as jest.Mock).mock.calls[2][0];
      expect(updated.name).toBe('CRUD Updated');

      // Delete
      controller.delete(mockRequest as Request, mockResponse as Response);
      const deleteResponse = (mockResponse.json as jest.Mock).mock.calls[3][0];
      expect(deleteResponse).toHaveProperty('message');
    });
  });
});
