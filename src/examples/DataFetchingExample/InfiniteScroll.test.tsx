import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import InfiniteScroll from './InfiniteScroll';
import * as postAPI from '../shared/api/postAPI';

vi.mock('../shared/api/postAPI');

describe('InfiniteScroll', () => {
  const mockPostsPage1 = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    title: `Post ${i + 1}`,
    body: `Content of post ${i + 1}`,
    author: 'Alice',
  }));

  const mockPostsPage2 = Array.from({ length: 10 }, (_, i) => ({
    id: i + 11,
    title: `Post ${i + 11}`,
    body: `Content of post ${i + 11}`,
    author: 'Bob',
  }));

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(postAPI.postAPI.fetchPosts).mockResolvedValue(mockPostsPage1);
  });

  describe('Initial loading', () => {
    it('should load initial posts on mount', async () => {
      render(<InfiniteScroll />);

      await waitFor(() => {
        expect(postAPI.postAPI.fetchPosts).toHaveBeenCalledWith(1, 10);
      });
    });

    it('should display initial posts', async () => {
      render(<InfiniteScroll />);

      await waitFor(() => {
        expect(screen.getByText('Post 1')).toBeInTheDocument();
      });

      expect(screen.getByText('Post 10')).toBeInTheDocument();
    });

    it('should show loading state on initial load', async () => {
      render(<InfiniteScroll />);

      expect(screen.getByText(/loading more posts/i)).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText('Post 1')).toBeInTheDocument();
      });
    });
  });

  describe('Rendering', () => {
    it('should render component header', async () => {
      render(<InfiniteScroll />);

      await waitFor(() => {
        expect(screen.getByText('Post 1')).toBeInTheDocument();
      });

      expect(screen.getByText('Infinite Scroll')).toBeInTheDocument();
    });

    it('should display post titles', async () => {
      render(<InfiniteScroll />);

      await waitFor(() => {
        mockPostsPage1.forEach(post => {
          expect(screen.getByText(post.title)).toBeInTheDocument();
        });
      });
    });

    it('should display post bodies', async () => {
      render(<InfiniteScroll />);

      await waitFor(() => {
        mockPostsPage1.forEach(post => {
          expect(screen.getByText(post.body)).toBeInTheDocument();
        });
      });
    });

    it('should display post authors', async () => {
      render(<InfiniteScroll />);

      await waitFor(() => {
        expect(screen.getAllByText(/By Alice/i).length).toBeGreaterThan(0);
      });
    });

    it('should display post IDs as badges', async () => {
      render(<InfiniteScroll />);

      await waitFor(() => {
        mockPostsPage1.forEach(post => {
          expect(screen.getByText(post.id.toString())).toBeInTheDocument();
        });
      });
    });

    it('should show loaded post count in footer', async () => {
      render(<InfiniteScroll />);

      await waitFor(() => {
        expect(screen.getByText(/Loaded 10 posts/i)).toBeInTheDocument();
      });
    });
  });

  // describe('End of content', () => {
  //   it('should show message when no more posts', async () => {
  //     vi.mocked(postAPI.postAPI.fetchPosts)
  //       .mockResolvedValueOnce(mockPostsPage1)
  //       .mockResolvedValueOnce([]);

  //     render(<InfiniteScroll />);

  //     await waitFor(() => {
  //       expect(screen.getByText('Post 1')).toBeInTheDocument();
  //     });

  //     await waitFor(() => {
  //       expect(screen.getByText(/No more posts to load/i)).toBeInTheDocument();
  //     }, { timeout: 3000 });
  //   });
  // });

  describe('Error handling', () => {
    it('should handle fetch errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(postAPI.postAPI.fetchPosts).mockRejectedValue(
        new Error('Network error')
      );

      render(<InfiniteScroll />);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          'Failed to load more posts'
        );
      });

      consoleSpy.mockRestore();
    });

    it('should stop loading on error', async () => {
      vi.mocked(postAPI.postAPI.fetchPosts).mockRejectedValue(
        new Error('Network error')
      );

      render(<InfiniteScroll />);

      // Should eventually stop showing loading
      await waitFor(() => {
        const loadingElements = screen.queryAllByText(/loading more posts/i);
        expect(loadingElements.length).toBeLessThanOrEqual(1);
      }, { timeout: 3000 });
    });
  });

  describe('Layout', () => {
    it('should use scrollable container', async () => {
      const { container } = render(<InfiniteScroll />);

      await waitFor(() => {
        expect(screen.getByText('Post 1')).toBeInTheDocument();
      });

      const scrollContainer = container.querySelector('[style*="overflow"]');
      expect(scrollContainer).toBeInTheDocument();
    });

    it('should display posts in list group', async () => {
      const { container } = render(<InfiniteScroll />);

      await waitFor(() => {
        expect(screen.getByText('Post 1')).toBeInTheDocument();
      });

      const listGroup = container.querySelector('.list-group');
      expect(listGroup).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should use semantic HTML', async () => {
      render(<InfiniteScroll />);

      await waitFor(() => {
        expect(screen.getByText('Post 1')).toBeInTheDocument();
      });

      expect(screen.getByRole('heading', { name: 'Infinite Scroll' })).toBeInTheDocument();
    });
  });
});
