import { delay } from '../utils';
import type { Todo } from '../types';

export const todoAPI = {
  async add(text: string): Promise<Todo> {
    await delay(800);
    if (Math.random() > 0.95) throw new Error('Failed to add todo');
    return { id: Date.now(), text, completed: false };
  },

  // eslint-disable-next-line no-unused-vars
  async delete(id: number): Promise<void> {
    await delay(500);
    if (Math.random() > 0.95) throw new Error('Failed to delete todo');
  },

  async update(id: number, updates: Partial<Todo>): Promise<Todo> {
    await delay(600);
    if (Math.random() > 0.95) throw new Error('Failed to update todo');
    return { id, ...updates } as Todo;
  },
};
