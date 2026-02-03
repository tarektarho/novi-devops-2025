/**
 * Tests for InMemoryItemsRepository
 */

import { InMemoryItemsRepository } from '../database';

describe('InMemoryItemsRepository', () => {
  let repository: InMemoryItemsRepository;

  beforeEach(() => {
    // Reset repository before each test to ensure clean state
    repository = InMemoryItemsRepository.getInstance();
    repository.reset();
  });

  describe('getAll', () => {
    it('should return all items', () => {
      const items = repository.getAll();
      expect(items).toHaveLength(3);
      expect(items[0]).toHaveProperty('id', 1);
      expect(items[0]).toHaveProperty('name', 'Item 1');
      expect(items[0]).toHaveProperty('description', 'First item');
      expect(items[0]).toHaveProperty('createdAt');
    });

    it('should return an array', () => {
      const items = repository.getAll();
      expect(Array.isArray(items)).toBe(true);
    });

    it('should return items with correct structure', () => {
      const items = repository.getAll();
      items.forEach(item => {
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('name');
        expect(item).toHaveProperty('description');
        expect(item).toHaveProperty('createdAt');
        expect(typeof item.id).toBe('number');
        expect(typeof item.name).toBe('string');
        expect(typeof item.description).toBe('string');
        expect(typeof item.createdAt).toBe('string');
      });
    });
  });

  describe('getById', () => {
    it('should return an item by id', () => {
      const item = repository.getById(1);
      expect(item).toBeDefined();
      expect(item?.id).toBe(1);
      expect(item?.name).toBe('Item 1');
      expect(item?.description).toBe('First item');
    });

    it('should return undefined for non-existent id', () => {
      const item = repository.getById(999);
      expect(item).toBeUndefined();
    });

    it('should return correct item for each valid id', () => {
      const item1 = repository.getById(1);
      const item2 = repository.getById(2);
      const item3 = repository.getById(3);

      expect(item1?.name).toBe('Item 1');
      expect(item2?.name).toBe('Item 2');
      expect(item3?.name).toBe('Item 3');
    });

    it('should return undefined for negative id', () => {
      const item = repository.getById(-1);
      expect(item).toBeUndefined();
    });

    it('should return undefined for zero', () => {
      const item = repository.getById(0);
      expect(item).toBeUndefined();
    });
  });

  describe('create', () => {
    it('should create a new item with name and description', () => {
      const newItem = repository.create({ name: 'New Item', description: 'New description' });

      expect(newItem).toBeDefined();
      expect(newItem.id).toBe(4);
      expect(newItem.name).toBe('New Item');
      expect(newItem.description).toBe('New description');
      expect(newItem.createdAt).toBeDefined();
      expect(typeof newItem.createdAt).toBe('string');
    });

    it('should create item without description (optional)', () => {
      const newItem = repository.create({ name: 'Item Without Description' });

      expect(newItem).toBeDefined();
      expect(newItem.name).toBe('Item Without Description');
      expect(newItem.description).toBe('');
    });

    it('should increment id for each new item', () => {
      const item1 = repository.create({ name: 'Item 1' });
      const item2 = repository.create({ name: 'Item 2' });
      const item3 = repository.create({ name: 'Item 3' });

      expect(item1.id).toBe(4);
      expect(item2.id).toBe(5);
      expect(item3.id).toBe(6);
    });

    it('should add the new item to the items array', () => {
      const initialCount = repository.getAll().length;
      repository.create({ name: 'Test Item', description: 'Test' });
      const finalCount = repository.getAll().length;

      expect(finalCount).toBe(initialCount + 1);
    });

    it('should have valid ISO timestamp', () => {
      const newItem = repository.create({ name: 'Time Test' });
      const date = new Date(newItem.createdAt);

      expect(date.toString()).not.toBe('Invalid Date');
      expect(newItem.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    it('should retrieve created item by id', () => {
      const created = repository.create({ name: 'Retrievable Item' });
      const retrieved = repository.getById(created.id);

      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(created.id);
      expect(retrieved?.name).toBe('Retrievable Item');
    });
  });

  describe('update', () => {
    it('should update an existing item', () => {
      const updated = repository.update(1, { name: 'Updated Item', description: 'Updated description' });

      expect(updated).toBeDefined();
      expect(updated?.id).toBe(1);
      expect(updated?.name).toBe('Updated Item');
      expect(updated?.description).toBe('Updated description');
      expect(updated?.updatedAt).toBeDefined();
    });

    it('should return null for non-existent id', () => {
      const updated = repository.update(999, { name: 'Not Found' });
      expect(updated).toBeNull();
    });

    it('should preserve id when updating', () => {
      const updated = repository.update(1, { name: 'New Name' });
      expect(updated?.id).toBe(1);
    });

    it('should update only name', () => {
      const original = repository.getById(1);
      const updated = repository.update(1, { name: 'Only Name Updated' });

      expect(updated?.name).toBe('Only Name Updated');
      expect(updated?.description).toBe(original?.description);
    });

    it('should update only description', () => {
      const original = repository.getById(1);
      const updated = repository.update(1, { description: 'Only Description Updated' });

      expect(updated?.name).toBe(original?.name);
      expect(updated?.description).toBe('Only Description Updated');
    });

    it('should add updatedAt timestamp', () => {
      const updated = repository.update(1, { name: 'Updated' });

      expect(updated?.updatedAt).toBeDefined();
      expect(typeof updated?.updatedAt).toBe('string');

      const date = new Date(updated!.updatedAt!);
      expect(date.toString()).not.toBe('Invalid Date');
    });

    it('should persist update in data store', () => {
      repository.update(1, { name: 'Persisted Update' });
      const retrieved = repository.getById(1);

      expect(retrieved?.name).toBe('Persisted Update');
    });

    it('should handle empty update object', () => {
      const original = repository.getById(1);
      const updated = repository.update(1, {});

      expect(updated?.name).toBe(original?.name);
      expect(updated?.description).toBe(original?.description);
      expect(updated?.updatedAt).toBeDefined();
    });
  });

  describe('remove', () => {
    it('should remove an item by id', () => {
      const result = repository.remove(1);

      expect(result).toBe(true);
      expect(repository.getById(1)).toBeUndefined();
    });

    it('should return false for non-existent id', () => {
      const result = repository.remove(999);
      expect(result).toBe(false);
    });

    it('should decrease items count after removal', () => {
      const initialCount = repository.getAll().length;
      repository.remove(1);
      const finalCount = repository.getAll().length;

      expect(finalCount).toBe(initialCount - 1);
    });

    it('should remove correct item', () => {
      repository.remove(2);

      expect(repository.getById(1)).toBeDefined();
      expect(repository.getById(2)).toBeUndefined();
      expect(repository.getById(3)).toBeDefined();
    });

    it('should not affect other items when removing', () => {
      const item1Before = repository.getById(1);
      const item3Before = repository.getById(3);

      repository.remove(2);

      const item1After = repository.getById(1);
      const item3After = repository.getById(3);

      expect(item1After).toEqual(item1Before);
      expect(item3After).toEqual(item3Before);
    });

    it('should allow removing multiple items', () => {
      expect(repository.remove(1)).toBe(true);
      expect(repository.remove(2)).toBe(true);
      expect(repository.remove(3)).toBe(true);

      expect(repository.getAll()).toHaveLength(0);
    });

    it('should return false when trying to remove same item twice', () => {
      expect(repository.remove(1)).toBe(true);
      expect(repository.remove(1)).toBe(false);
    });
  });

  describe('reset', () => {
    it('should reset items to initial state', () => {
      repository.create({ name: 'Extra Item' });
      repository.remove(1);
      repository.update(2, { name: 'Modified' });

      repository.reset();

      const items = repository.getAll();
      expect(items).toHaveLength(3);
      expect(items[0].id).toBe(1);
      expect(items[0].name).toBe('Item 1');
      expect(items[1].id).toBe(2);
      expect(items[1].name).toBe('Item 2');
      expect(items[2].id).toBe(3);
      expect(items[2].name).toBe('Item 3');
    });

    it('should reset next id counter', () => {
      repository.create({ name: 'Item 4' });
      repository.create({ name: 'Item 5' });

      repository.reset();

      const newItem = repository.create({ name: 'After Reset' });
      expect(newItem.id).toBe(4);
    });

    it('should restore all three default items', () => {
      repository.remove(1);
      repository.remove(2);
      repository.remove(3);

      repository.reset();

      expect(repository.getAll()).toHaveLength(3);
      expect(repository.getById(1)).toBeDefined();
      expect(repository.getById(2)).toBeDefined();
      expect(repository.getById(3)).toBeDefined();
    });

    it('should not retain any previous updates after reset', () => {
      repository.update(1, { name: 'Modified Name' });
      repository.reset();

      const item = repository.getById(1);
      expect(item?.name).toBe('Item 1');
    });
  });

  describe('Integration scenarios', () => {
    it('should handle complete CRUD workflow', () => {
      // Create
      const created = repository.create({ name: 'CRUD Test', description: 'Testing CRUD' });
      expect(created.id).toBe(4);

      // Read
      const read = repository.getById(created.id);
      expect(read?.name).toBe('CRUD Test');

      // Update
      const updated = repository.update(created.id, { name: 'CRUD Updated' });
      expect(updated?.name).toBe('CRUD Updated');

      // Delete
      const removed = repository.remove(created.id);
      expect(removed).toBe(true);
      expect(repository.getById(created.id)).toBeUndefined();
    });

    it('should maintain data consistency across operations', () => {
      const item1 = repository.create({ name: 'First' });
      const item2 = repository.create({ name: 'Second' });

      repository.update(item1.id, { description: 'Updated First' });
      repository.remove(item2.id);

      const allItems = repository.getAll();
      expect(allItems).toHaveLength(4); // 3 original + 1 remaining created

      const retrievedItem1 = repository.getById(item1.id);
      expect(retrievedItem1?.description).toBe('Updated First');
      expect(repository.getById(item2.id)).toBeUndefined();
    });

    it('should handle bulk operations', () => {
      const items = [];
      for (let i = 0; i < 10; i++) {
        items.push(repository.create({ name: `Bulk Item ${i}` }));
      }

      expect(repository.getAll()).toHaveLength(13); // 3 original + 10 new

      items.forEach(item => {
        repository.remove(item.id);
      });

      expect(repository.getAll()).toHaveLength(3); // back to original 3
    });
  });
});
