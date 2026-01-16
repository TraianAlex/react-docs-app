import { delay, randomFromArray } from '../utils';
import type { Post } from '../types';

export const postAPI = {
  async fetchPosts(page = 1, limit = 10): Promise<Post[]> {
    await delay(800);
    const start = (page - 1) * limit;
    return Array.from({ length: limit }, (_, i) => ({
      id: start + i + 1,
      title: `Post ${start + i + 1}`,
      body: `This is the content of post ${start + i + 1}. It contains some interesting information...`,
      author: randomFromArray(['Alice', 'Bob', 'Charlie', 'Diana']),
    }));
  },

  async searchPosts(query: string): Promise<Post[]> {
    await delay(500);
    return Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      title: `${query} - Result ${i + 1}`,
      body: `Search result for "${query}"...`,
      author: 'System',
    }));
  },

  async create(post: Omit<Post, 'id'>): Promise<Post> {
    await delay(800);
    return { ...post, id: Date.now() };
  },

  async update(id: number, updates: Partial<Post>): Promise<void> {
    await delay(600);
  },

  async delete(id: number): Promise<void> {
    await delay(500);
  },

  async likePost(postId: number, currentLikes: number): Promise<number> {
    await delay(1000);
    if (Math.random() > 0.9) throw new Error('Failed to like post');
    return currentLikes + 1;
  },
};
