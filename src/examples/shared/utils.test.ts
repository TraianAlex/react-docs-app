import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { delay, generateId, randomFromArray } from './utils';

describe('utils', () => {
  describe('delay', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should resolve after the specified time', async () => {
      const promise = delay(1000);

      vi.advanceTimersByTime(999);
      expect(promise).not.toHaveProperty('fulfilled');

      vi.advanceTimersByTime(1);
      await promise;
      expect(promise).resolves.toBeUndefined();
    });

    it('should resolve with undefined', async () => {
      const promise = delay(100);
      vi.advanceTimersByTime(100);
      const result = await promise;
      expect(result).toBeUndefined();
    });

    it('should handle zero delay', async () => {
      const promise = delay(0);
      vi.advanceTimersByTime(0);
      await expect(promise).resolves.toBeUndefined();
    });
  });

  describe('generateId', () => {
    it('should generate a numeric ID', () => {
      const id = generateId();
      expect(typeof id).toBe('number');
    });

    // it('should generate different IDs when called multiple times', async () => {
    //   const id1 = generateId();
    //   await new Promise(resolve => setTimeout(resolve, 10));
    //   const id2 = generateId();
    //   await new Promise(resolve => setTimeout(resolve, 10));
    //   const id3 = generateId();
    //   // Since Date.now() changes with delays, IDs should be different
    //   expect(id1).not.toBe(id2);
    //   expect(id2).not.toBe(id3);
    // });

    it('should generate IDs based on current timestamp', () => {
      const beforeTime = Date.now();
      const id = generateId();
      const afterTime = Date.now();

      expect(id).toBeGreaterThanOrEqual(beforeTime);
      expect(id).toBeLessThanOrEqual(afterTime);
    });
  });

  describe('randomFromArray', () => {
    it('should return an element from the array', () => {
      const array = [1, 2, 3, 4, 5];
      const result = randomFromArray(array);
      expect(array).toContain(result);
    });

    it('should work with string arrays', () => {
      const array = ['apple', 'banana', 'cherry'];
      const result = randomFromArray(array);
      expect(array).toContain(result);
    });

    it('should work with object arrays', () => {
      const array = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ];
      const result = randomFromArray(array);
      expect(array).toContain(result);
    });

    it('should return the only element for single-element arrays', () => {
      const array = [42];
      const result = randomFromArray(array);
      expect(result).toBe(42);
    });

    it('should handle arrays with different types', () => {
      const array: (string | number | boolean)[] = ['test', 123, true];
      const result = randomFromArray(array);
      expect(array).toContain(result);
    });
  });
});
