import { describe, it, expect, vi } from 'vitest';
import { postAPI } from './postAPI';

describe('postAPI', () => {
  describe('fetchPosts', () => {
    it('should fetch posts with default pagination', async () => {
      const posts = await postAPI.fetchPosts();

      expect(posts).toHaveLength(10);
      expect(posts[0].id).toBe(1);
      expect(posts[9].id).toBe(10);
    });

    it('should fetch posts for specific page', async () => {
      const posts = await postAPI.fetchPosts(2, 10);

      expect(posts).toHaveLength(10);
      expect(posts[0].id).toBe(11);
      expect(posts[9].id).toBe(20);
    });

    it('should fetch with custom limit', async () => {
      const posts = await postAPI.fetchPosts(1, 5);

      expect(posts).toHaveLength(5);
      expect(posts[0].id).toBe(1);
      expect(posts[4].id).toBe(5);
    });

    it('should include all required post fields', async () => {
      const posts = await postAPI.fetchPosts(1, 1);

      expect(posts[0]).toHaveProperty('id');
      expect(posts[0]).toHaveProperty('title');
      expect(posts[0]).toHaveProperty('body');
      expect(posts[0]).toHaveProperty('author');
    });

    it('should assign random authors', async () => {
      const posts = await postAPI.fetchPosts(1, 10);
      const authors = posts.map((p) => p.author);
      const validAuthors = ['Alice', 'Bob', 'Charlie', 'Diana'];

      authors.forEach((author) => {
        expect(validAuthors).toContain(author);
      });
    });
  });

  describe('searchPosts', () => {
    it('should return search results with query in title', async () => {
      const results = await postAPI.searchPosts('React');

      expect(results).toHaveLength(5);
      results.forEach((result) => {
        expect(result.title).toContain('React');
      });
    });

    it('should return posts with System author', async () => {
      const results = await postAPI.searchPosts('test');

      results.forEach((result) => {
        expect(result.author).toBe('System');
      });
    });

    it('should include query in body', async () => {
      const query = 'testing';
      const results = await postAPI.searchPosts(query);

      results.forEach((result) => {
        expect(result.body).toContain(query);
      });
    });

    it('should return fixed number of results', async () => {
      const results = await postAPI.searchPosts('anything');

      expect(results).toHaveLength(5);
    });
  });

  describe('create', () => {
    it('should create a post with generated ID', async () => {
      const postData = {
        title: 'New Post',
        body: 'Content',
        author: 'Alice',
      };

      const created = await postAPI.create(postData);

      expect(created).toMatchObject(postData);
      expect(created.id).toBeDefined();
      expect(typeof created.id).toBe('number');
    });

    it('should generate unique IDs', async () => {
      const post1 = await postAPI.create({ title: 'Post 1', body: 'Body 1', author: 'Alice' });
      const post2 = await postAPI.create({ title: 'Post 2', body: 'Body 2', author: 'Bob' });

      expect(post1.id).not.toBe(post2.id);
    });
  });

  describe('update', () => {
    it('should resolve without error', async () => {
      await expect(postAPI.update(1, { title: 'Updated' })).resolves.toBeUndefined();
    });

    it('should handle partial updates', async () => {
      await expect(postAPI.update(1, { body: 'New body' })).resolves.toBeUndefined();
    });
  });

  describe('delete', () => {
    it('should resolve without error', async () => {
      await expect(postAPI.delete(1)).resolves.toBeUndefined();
    });
  });

  describe('likePost', () => {
    it('should increment like count', async () => {
      const newLikes = await postAPI.likePost(1, 10);

      expect(newLikes).toBe(11);
    });

    it('should work from zero likes', async () => {
      const newLikes = await postAPI.likePost(1, 0);

      expect(newLikes).toBe(1);
    });

    it('should randomly fail ~10% of the time', async () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.91);

      await expect(postAPI.likePost(1, 10)).rejects.toThrow('Failed to like post');
    });

    it('should succeed when random is below threshold', async () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5);

      const newLikes = await postAPI.likePost(1, 5);

      expect(newLikes).toBe(6);
    });
  });
});
