/**
 * Items Controller
 * Handles CRUD operations for items following REST principles
 * Uses Repository Pattern for data access abstraction
 */

import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { ItemsRepository, InMemoryItemsRepository } from '../database';

export class ItemsController extends BaseController {
  private repository: ItemsRepository;

  constructor(repository?: ItemsRepository) {
    super();
    // Dependency Injection: allows passing different repository implementations
    this.repository = repository || InMemoryItemsRepository.getInstance();
  }

  /**
   * Get all items
   * GET /api/items
   */
  public getAll = (req: Request, res: Response): Response => {
    try {
      const items = this.repository.getAll();
      return this.ok(res, items);
    } catch (error) {
      return this.serverError(res, error as Error);
    }
  };

  /**
   * Get item by ID
   * GET /api/items/:id
   */
  public getById = (req: Request, res: Response): Response => {
    try {
      const id = parseInt(req.params.id, 10);

      if (isNaN(id)) {
        return this.fail(res, 'Invalid ID format');
      }

      const item = this.repository.getById(id);

      if (!item) {
        return this.notFound(res, 'Item not found');
      }

      return this.ok(res, item);
    } catch (error) {
      return this.serverError(res, error as Error);
    }
  };

  /**
   * Create new item
   * POST /api/items
   */
  public create = (req: Request, res: Response): Response => {
    try {
      const { name, description } = req.body;

      if (!name || typeof name !== 'string') {
        return this.fail(res, 'Name is required and must be a string');
      }

      if (description && typeof description !== 'string') {
        return this.fail(res, 'Description must be a string');
      }

      const newItem = this.repository.create({ name, description });
      return this.created(res, newItem);
    } catch (error) {
      return this.serverError(res, error as Error);
    }
  };

  /**
   * Update item
   * PUT /api/items/:id
   */
  public update = (req: Request, res: Response): Response => {
    try {
      const id = parseInt(req.params.id, 10);

      if (isNaN(id)) {
        return this.fail(res, 'Invalid ID format');
      }

      const { name, description } = req.body;

      if (name && typeof name !== 'string') {
        return this.fail(res, 'Name must be a string');
      }

      if (description && typeof description !== 'string') {
        return this.fail(res, 'Description must be a string');
      }

      const updatedItem = this.repository.update(id, { name, description });

      if (!updatedItem) {
        return this.notFound(res, 'Item not found');
      }

      return this.ok(res, updatedItem);
    } catch (error) {
      return this.serverError(res, error as Error);
    }
  };

  /**
   * Delete item
   * DELETE /api/items/:id
   */
  public delete = (req: Request, res: Response): Response => {
    try {
      const id = parseInt(req.params.id, 10);

      if (isNaN(id)) {
        return this.fail(res, 'Invalid ID format');
      }

      const success = this.repository.remove(id);

      if (!success) {
        return this.notFound(res, 'Item not found');
      }

      return this.ok(res, { message: 'Item deleted successfully' });
    } catch (error) {
      return this.serverError(res, error as Error);
    }
  };
}
