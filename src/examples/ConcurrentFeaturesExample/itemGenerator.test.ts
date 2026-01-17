import { describe, it, expect } from 'vitest';
import { generateItems, expensiveFilter } from './itemGenerator';

describe('itemGenerator', () => {
  describe('generateItems', () => {
    it('should generate correct number of items', () => {
      const items = generateItems(10);

      expect(items).toHaveLength(10);
    });

    it('should generate items with sequential IDs', () => {
      const items = generateItems(5);

      expect(items[0].id).toBe(0);
      expect(items[1].id).toBe(1);
      expect(items[4].id).toBe(4);
    });

    it('should generate items with correct structure', () => {
      const items = generateItems(1);

      expect(items[0]).toHaveProperty('id');
      expect(items[0]).toHaveProperty('name');
      expect(items[0]).toHaveProperty('description');
      expect(items[0]).toHaveProperty('category');
      expect(items[0]).toHaveProperty('price');
    });

    it('should rotate through categories', () => {
      const items = generateItems(8);
      const categories = items.map((item) => item.category);

      expect(categories[0]).toBe('electronics');
      expect(categories[1]).toBe('clothing');
      expect(categories[2]).toBe('books');
      expect(categories[3]).toBe('toys');
      expect(categories[4]).toBe('electronics');
    });

    it('should generate names with correct format', () => {
      const items = generateItems(3);

      expect(items[0].name).toBe('Item 1');
      expect(items[1].name).toBe('Item 2');
      expect(items[2].name).toBe('Item 3');
    });

    it('should generate descriptions with correct format', () => {
      const items = generateItems(2);

      expect(items[0].description).toBe('Description for item 1');
      expect(items[1].description).toBe('Description for item 2');
    });

    it('should generate prices in valid range', () => {
      const items = generateItems(50);

      items.forEach((item) => {
        expect(item.price).toBeGreaterThanOrEqual(10);
        expect(item.price).toBeLessThan(1010);
      });
    });

    it('should handle generating zero items', () => {
      const items = generateItems(0);

      expect(items).toHaveLength(0);
    });

    it('should handle large number of items', () => {
      const items = generateItems(10000);

      expect(items).toHaveLength(10000);
      expect(items[9999].id).toBe(9999);
    });
  });

  describe('expensiveFilter', () => {
    const testItems = generateItems(100);

    it('should return all items when query is empty', () => {
      const filtered = expensiveFilter(testItems, '');

      expect(filtered).toHaveLength(100);
    });

    it('should filter by name', () => {
      const filtered = expensiveFilter(testItems, 'Item 1');

      expect(filtered.length).toBeGreaterThan(0);
      filtered.forEach((item) => {
        expect(item.name.toLowerCase()).toContain('item 1');
      });
    });

    it('should filter by description', () => {
      const filtered = expensiveFilter(testItems, 'description');

      expect(filtered.length).toBeGreaterThan(0);
      filtered.forEach((item) => {
        expect(item.description.toLowerCase()).toContain('description');
      });
    });

    it('should filter by category', () => {
      const filtered = expensiveFilter(testItems, 'electronics');

      expect(filtered.length).toBeGreaterThan(0);
      filtered.forEach((item) => {
        expect(item.category.toLowerCase()).toContain('electronics');
      });
    });

    it('should be case insensitive', () => {
      const filtered1 = expensiveFilter(testItems, 'ELECTRONICS');
      const filtered2 = expensiveFilter(testItems, 'electronics');
      const filtered3 = expensiveFilter(testItems, 'ElEcTrOnIcS');

      expect(filtered1.length).toBe(filtered2.length);
      expect(filtered2.length).toBe(filtered3.length);
    });

    it('should return empty array when no matches found', () => {
      const filtered = expensiveFilter(testItems, 'nonexistent-query-xyz');

      expect(filtered).toHaveLength(0);
    });

    it('should filter by partial match', () => {
      const filtered = expensiveFilter(testItems, 'item');

      expect(filtered.length).toBeGreaterThan(0);
      filtered.forEach((item) => {
        expect(item.name.toLowerCase()).toContain('item');
      });
    });

    it('should handle special characters in query', () => {
      const filtered = expensiveFilter(testItems, 'Item 10');

      expect(filtered.length).toBeGreaterThan(0);
    });

    it('should take at least 20ms to execute', () => {
      const start = Date.now();
      expensiveFilter(testItems, 'test');
      const elapsed = Date.now() - start;

      expect(elapsed).toBeGreaterThanOrEqual(18); // slight margin for variance
    });
  });
});
