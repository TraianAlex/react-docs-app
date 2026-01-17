import { describe, it, expect, vi } from 'vitest';
import { todoAPI } from './todoAPI';

describe('todoAPI', () => {
  describe('add', () => {
    it('should add a new todo with generated ID', async () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
      const todo = await todoAPI.add('Test todo');

      expect(todo).toMatchObject({
        text: 'Test todo',
        completed: false,
      });
      expect(todo.id).toBeDefined();
      expect(typeof todo.id).toBe('number');
    });

    it('should generate unique IDs', async () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
      const todo1 = await todoAPI.add('First');
      const todo2 = await todoAPI.add('Second');

      expect(todo1.id).not.toBe(todo2.id);
    });

    it('should randomly fail ~5% of the time', async () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.96);

      await expect(todoAPI.add('Test')).rejects.toThrow('Failed to add todo');
    });

    it('should succeed when random is below threshold', async () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5);

      const todo = await todoAPI.add('Test');

      expect(todo.text).toBe('Test');
    });
  });

  describe('delete', () => {
    it('should resolve without error on success', async () => {
      await expect(todoAPI.delete(1)).resolves.toBeUndefined();
    });

    it('should randomly fail ~5% of the time', async () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.96);

      await expect(todoAPI.delete(1)).rejects.toThrow('Failed to delete todo');
    });

    it('should succeed when random is below threshold', async () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5);

      await expect(todoAPI.delete(1)).resolves.toBeUndefined();
    });
  });

  describe('update', () => {
    it('should return updated todo', async () => {
      const updated = await todoAPI.update(1, { text: 'Updated text' });

      expect(updated).toMatchObject({
        id: 1,
        text: 'Updated text',
      });
    });

    it('should handle partial updates', async () => {
      const updated = await todoAPI.update(1, { completed: true });

      expect(updated.id).toBe(1);
      expect(updated.completed).toBe(true);
    });

    it('should randomly fail ~5% of the time', async () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.96);

      await expect(todoAPI.update(1, { text: 'Test' })).rejects.toThrow('Failed to update todo');
    });

    it('should succeed when random is below threshold', async () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5);

      const updated = await todoAPI.update(1, { completed: true });

      expect(updated.completed).toBe(true);
    });
  });
});
