import { describe, it, expect, beforeEach, vi } from 'vitest';
import { userAPI } from './userAPI';
import type { User } from '../types';

describe('userAPI', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return default users when localStorage is empty', async () => {
      const users = await userAPI.getAll();

      expect(users).toHaveLength(3);
      expect(users[0]).toMatchObject({
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Admin',
        status: 'active',
      });
    });

    it('should save default users to localStorage on first load', async () => {
      await userAPI.getAll();

      const storedUsers = localStorage.getItem('users');
      expect(storedUsers).toBeTruthy();

      const parsed = JSON.parse(storedUsers!);
      expect(parsed).toHaveLength(3);
    });

    it('should return users from localStorage when available', async () => {
      const customUsers: User[] = [
        { id: 99, name: 'Custom User', email: 'custom@test.com', role: 'User', status: 'active' },
      ];
      localStorage.setItem('users', JSON.stringify(customUsers));

      const users = await userAPI.getAll();

      expect(users).toEqual(customUsers);
    });

    it('should include artificial delay', async () => {
      const start = Date.now();
      await userAPI.getAll();
      const elapsed = Date.now() - start;

      expect(elapsed).toBeGreaterThanOrEqual(280); // accounting for slight variance
    });
  });

  describe('getById', () => {
    it('should return a user by ID', async () => {
      const user = await userAPI.getById(1);

      expect(user).toMatchObject({
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
      });
    });

    it('should return null when user does not exist', async () => {
      const user = await userAPI.getById(999);

      expect(user).toBeNull();
    });

    it('should work with custom users in localStorage', async () => {
      const customUsers: User[] = [
        { id: 100, name: 'Test User', email: 'test@test.com', role: 'Admin', status: 'active' },
      ];
      localStorage.setItem('users', JSON.stringify(customUsers));

      const user = await userAPI.getById(100);

      expect(user).toMatchObject({
        id: 100,
        name: 'Test User',
      });
    });
  });

  describe('create', () => {
    it('should create a new user with generated ID', async () => {
      const newUserData = {
        name: 'New User',
        email: 'new@example.com',
        role: 'User',
        status: 'active' as const,
      };

      const createdUser = await userAPI.create(newUserData);

      expect(createdUser).toMatchObject(newUserData);
      expect(createdUser.id).toBeDefined();
      expect(typeof createdUser.id).toBe('number');
    });

    it('should add user to localStorage', async () => {
      const newUserData = {
        name: 'New User',
        email: 'new@example.com',
        role: 'User',
        status: 'active' as const,
      };

      await userAPI.create(newUserData);

      const users = await userAPI.getAll();
      const foundUser = users.find((u) => u.email === 'new@example.com');

      expect(foundUser).toBeDefined();
      expect(foundUser?.name).toBe('New User');
    });

    it('should maintain existing users when creating new one', async () => {
      const initialUsers = await userAPI.getAll();
      const initialCount = initialUsers.length;

      await userAPI.create({
        name: 'Another User',
        email: 'another@example.com',
        role: 'Manager',
        status: 'inactive',
      });

      const updatedUsers = await userAPI.getAll();
      expect(updatedUsers.length).toBe(initialCount + 1);
    });
  });

  describe('update', () => {
    it('should update an existing user', async () => {
      const updates = { name: 'Updated Name', role: 'Manager' };
      const updatedUser = await userAPI.update(1, updates);

      expect(updatedUser.name).toBe('Updated Name');
      expect(updatedUser.role).toBe('Manager');
      expect(updatedUser.id).toBe(1);
    });

    it('should persist updates to localStorage', async () => {
      await userAPI.update(1, { name: 'Updated Name' });

      const users = await userAPI.getAll();
      const updatedUser = users.find((u) => u.id === 1);

      expect(updatedUser?.name).toBe('Updated Name');
    });

    it('should throw error when user not found', async () => {
      await expect(userAPI.update(999, { name: 'Test' })).rejects.toThrow('User not found');
    });

    it('should only update provided fields', async () => {
      const originalUser = await userAPI.getById(1);
      await userAPI.update(1, { name: 'New Name' });

      const updatedUser = await userAPI.getById(1);

      expect(updatedUser?.name).toBe('New Name');
      expect(updatedUser?.email).toBe(originalUser?.email);
      expect(updatedUser?.role).toBe(originalUser?.role);
    });
  });

  describe('delete', () => {
    it('should remove user from storage', async () => {
      const initialUsers = await userAPI.getAll();
      expect(initialUsers.some((u) => u.id === 1)).toBe(true);

      await userAPI.delete(1);

      const updatedUsers = await userAPI.getAll();
      expect(updatedUsers.some((u) => u.id === 1)).toBe(false);
    });

    it('should not affect other users', async () => {
      const initialUsers = await userAPI.getAll();
      const initialCount = initialUsers.length;

      await userAPI.delete(1);

      const updatedUsers = await userAPI.getAll();
      expect(updatedUsers.length).toBe(initialCount - 1);
      expect(updatedUsers.some((u) => u.id === 2)).toBe(true);
      expect(updatedUsers.some((u) => u.id === 3)).toBe(true);
    });

    it('should handle deleting non-existent user gracefully', async () => {
      await expect(userAPI.delete(999)).resolves.toBeUndefined();
    });
  });
});
