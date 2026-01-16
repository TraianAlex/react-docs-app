import { delay } from '../utils';
import type { Profile } from '../types';

export const profileAPI = {
  async update(updates: Partial<Profile>): Promise<Partial<Profile>> {
    await delay(1000);
    if (Math.random() > 0.9) throw new Error('Failed to update profile');
    return updates;
  },
};
