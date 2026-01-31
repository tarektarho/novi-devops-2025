/**
 * Database Module Exports
 * Barrel file for easy imports
 */

// Interfaces
export type { Item, CreateItemData, UpdateItemData } from './interfaces/item.interface';

// Repositories
export { ItemsRepository } from './repositories/items.repository';
export { InMemoryItemsRepository } from './repositories/in-memory-items.repository';
