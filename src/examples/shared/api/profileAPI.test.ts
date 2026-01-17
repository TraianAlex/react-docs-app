import { describe, it, expect, vi } from 'vitest';
import { profileAPI } from './profileAPI';
import type { Profile } from '../types';

describe('profileAPI', () => {
  describe('update', () => {
    it('should return updated profile data', async () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5); // Ensure success

      const updates: Partial<Profile> = {
        name: 'Updated Name',
        email: 'updated@example.com',
      };

      const result = await profileAPI.update(updates);

      expect(result).toEqual(updates);
    });

    it('should handle single field update', async () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5); // Ensure success

      const updates: Partial<Profile> = {
        name: 'New Name',
      };

      const result = await profileAPI.update(updates);

      expect(result).toEqual({ name: 'New Name' });
    });

    it('should handle all fields update', async () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5); // Ensure success

      const updates: Profile = {
        name: 'Full Name',
        email: 'full@example.com',
        bio: 'Full bio text',
      };

      const result = await profileAPI.update(updates);

      expect(result).toEqual(updates);
    });

    it('should randomly fail ~10% of the time', async () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.91);

      await expect(profileAPI.update({ name: 'Test' })).rejects.toThrow(
        'Failed to update profile'
      );
    });

    it('should succeed when random is below threshold', async () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5);

      const result = await profileAPI.update({ name: 'Success' });

      expect(result.name).toBe('Success');
    });

    it('should handle empty updates', async () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5); // Ensure success

      const result = await profileAPI.update({});

      expect(result).toEqual({});
    });
  });
});
