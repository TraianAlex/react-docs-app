import { delay } from '../utils';
import type { User } from '../types';

export const userAPI = {
  defaultUsers: [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin',
      status: 'active',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'User',
      status: 'active',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      role: 'User',
      status: 'inactive',
    },
    {
      id: 4,
      name: 'Alex Johnson',
      email: 'alex@example.com',
      role: 'Manager',
      status: 'active',
    },
  ] as User[],

  async getAll(): Promise<User[]> {
    await delay(300);
    const users = localStorage.getItem('users');
    try {
      const parsed = JSON.parse(users || '[]') as User[] | null;
      if (!Array.isArray(parsed) || parsed.length === 0) {
        localStorage.setItem('users', JSON.stringify(this.defaultUsers));
        return this.defaultUsers;
      }
      return parsed;
    } catch (error) {
      console.warn('Invalid users cache, resetting to defaults.', error);
      localStorage.setItem('users', JSON.stringify(this.defaultUsers));
      return this.defaultUsers;
    }
  },

  async getById(id: number): Promise<User | null> {
    await delay(200);
    const users = await this.getAll();
    return users.find((u) => u.id === id) || null;
  },

  async create(user: Omit<User, 'id'>): Promise<User> {
    await delay(500);
    const users = await this.getAll();
    const newUser: User = { ...user, id: users.length + 1 };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return newUser;
  },

  async update(id: number, updates: Partial<User>): Promise<User> {
    await delay(500);
    const users = await this.getAll();
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) throw new Error('User not found');
    users[index] = { ...users[index], ...updates };
    localStorage.setItem('users', JSON.stringify(users));
    return users[index];
  },

  async delete(id: number): Promise<void> {
    await delay(400);
    const users = await this.getAll();
    const filtered = users.filter((u) => u.id !== id);
    localStorage.setItem('users', JSON.stringify(filtered));
  },
};
