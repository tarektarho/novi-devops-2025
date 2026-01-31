/**
 * Item Domain Interfaces
 * Defines the structure of items in the system
 */

/**
 * Item entity
 */
export interface Item {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Data Transfer Object for creating a new item
 */
export interface CreateItemData {
  name: string;
  description?: string;
}

/**
 * Data Transfer Object for updating an existing item
 */
export interface UpdateItemData {
  name?: string;
  description?: string;
}
