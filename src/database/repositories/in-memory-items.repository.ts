/**
 * In-Memory Items Repository Implementation
 * Stores items in memory - suitable for development and testing
 * In production, replace with PostgreSQLItemsRepository or MongoDBItemsRepository
 */

import { ItemsRepository } from './items.repository';
import { Item, CreateItemData, UpdateItemData } from '../interfaces/item.interface';

/**
 * In-memory implementation of ItemsRepository
 * Singleton pattern to maintain consistent state
 */
export class InMemoryItemsRepository extends ItemsRepository {
  private static instance: InMemoryItemsRepository;
  private items: Item[];
  private nextId: number;

  private constructor() {
    super();
    this.items = this.getInitialData();
    this.nextId = 4;
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): InMemoryItemsRepository {
    if (!InMemoryItemsRepository.instance) {
      InMemoryItemsRepository.instance = new InMemoryItemsRepository();
    }
    return InMemoryItemsRepository.instance;
  }

  /**
   * Get initial data set
   */
  private getInitialData(): Item[] {
    return [
      { id: 1, name: 'Item 1', description: 'First item', createdAt: new Date().toISOString() },
      { id: 2, name: 'Item 2', description: 'Second item', createdAt: new Date().toISOString() },
      { id: 3, name: 'Item 3', description: 'Third item', createdAt: new Date().toISOString() }
    ];
  }

  /**
   * Get all items
   */
  public getAll(): Item[] {
    return this.items;
  }

  /**
   * Get item by ID
   */
  public getById(id: number): Item | undefined {
    return this.items.find(item => item.id === id);
  }

  /**
   * Create new item
   */
  public create(data: CreateItemData): Item {
    const newItem: Item = {
      id: this.nextId++,
      name: data.name,
      description: data.description || '',
      createdAt: new Date().toISOString()
    };
    this.items.push(newItem);
    return newItem;
  }

  /**
   * Update existing item
   */
  public update(id: number, data: UpdateItemData): Item | null {
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) return null;

    this.items[index] = {
      ...this.items[index],
      ...data,
      id: this.items[index].id,
      updatedAt: new Date().toISOString()
    };

    return this.items[index];
  }

  /**
   * Remove item
   */
  public remove(id: number): boolean {
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) return false;

    this.items.splice(index, 1);
    return true;
  }

  /**
   * Reset repository to initial state (for testing)
   */
  public reset(): void {
    this.items = this.getInitialData();
    this.nextId = 4;
  }
}
