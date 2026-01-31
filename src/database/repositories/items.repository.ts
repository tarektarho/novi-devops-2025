/**
 * Items Repository Interface
 * Defines the contract for item data access
 * Following Repository Pattern for abstraction over data source
 */

import { Item, CreateItemData, UpdateItemData } from '../interfaces/item.interface';

/**
 * Abstract repository for items
 * Implementations can use different data sources (in-memory, PostgreSQL, MongoDB, etc.)
 */
export abstract class ItemsRepository {
  /**
   * Get all items
   * @returns All items in the repository
   */
  abstract getAll(): Item[];

  /**
   * Get item by ID
   * @param id - Item identifier
   * @returns Item if found, undefined otherwise
   */
  abstract getById(id: number): Item | undefined;

  /**
   * Create new item
   * @param data - Item creation data
   * @returns Created item with generated ID
   */
  abstract create(data: CreateItemData): Item;

  /**
   * Update existing item
   * @param id - Item identifier
   * @param data - Updated item data
   * @returns Updated item if found, null otherwise
   */
  abstract update(id: number, data: UpdateItemData): Item | null;

  /**
   * Remove item
   * @param id - Item identifier
   * @returns true if item was removed, false if not found
   */
  abstract remove(id: number): boolean;

  /**
   * Reset repository to initial state (for testing)
   */
  abstract reset(): void;
}
