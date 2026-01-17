import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BasicFetch from './BasicFetch';
import * as postAPI from '../shared/api/postAPI';

vi.mock('../shared/api/postAPI');

describe('BasicFetch', () => {
  const mockPosts = [
    { id: 1, title: 'Post 1', body: 'Body 1', author: 'Alice' },
    { id: 2, title: 'Post 2', body: 'Body 2', author: 'Bob' },
    { id: 3, title: 'Post 3', body: 'Body 3', author: 'Charlie' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial loading', () => {
    it('should show loading state on mount', () => {
      vi.mocked(postAPI.postAPI.fetchPosts).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      render(<BasicFetch />);

      expect(screen.getByText('Loading posts...')).toBeInTheDocument();
      expect(screen.getByRole('status')).toBeInTheDocument(); // spinner
    });

    it('should fetch posts on mount', async () => {
      vi.mocked(postAPI.postAPI.fetchPosts).mockResolvedValue(mockPosts);

      render(<BasicFetch />);

      await waitFor(() => {
        expect(postAPI.postAPI.fetchPosts).toHaveBeenCalledWith(1, 5);
      });
    });

    it('should display posts after loading', async () => {
      vi.mocked(postAPI.postAPI.fetchPosts).mockResolvedValue(mockPosts);

      render(<BasicFetch />);

      await waitFor(() => {
        expect(screen.getByText('Post 1')).toBeInTheDocument();
        expect(screen.getByText('Post 2')).toBeInTheDocument();
        expect(screen.getByText('Post 3')).toBeInTheDocument();
      });
    });
  });

  describe('Rendering posts', () => {
    beforeEach(async () => {
      vi.mocked(postAPI.postAPI.fetchPosts).mockResolvedValue(mockPosts);
      render(<BasicFetch />);
      await waitFor(() => {
        expect(screen.getByText('Post 1')).toBeInTheDocument();
      });
    });

    it('should render component header', () => {
      expect(screen.getByText('Basic Fetch with useEffect')).toBeInTheDocument();
    });

    it('should display post titles', () => {
      expect(screen.getByText('Post 1')).toBeInTheDocument();
      expect(screen.getByText('Post 2')).toBeInTheDocument();
      expect(screen.getByText('Post 3')).toBeInTheDocument();
    });

    it('should display post bodies', () => {
      expect(screen.getByText(/Body 1/)).toBeInTheDocument();
      expect(screen.getByText(/Body 2/)).toBeInTheDocument();
      expect(screen.getByText(/Body 3/)).toBeInTheDocument();
    });

    it('should display post authors', () => {
      expect(screen.getByText(/Alice/)).toBeInTheDocument();
      expect(screen.getByText(/Bob/)).toBeInTheDocument();
      expect(screen.getByText(/Charlie/)).toBeInTheDocument();
    });

    it('should render refresh button', () => {
      expect(screen.getByRole('button', { name: /refresh posts/i })).toBeInTheDocument();
    });
  });

  describe('Refresh functionality', () => {
    it('should fetch posts when refresh button clicked', async () => {
      const user = userEvent.setup();
      vi.mocked(postAPI.postAPI.fetchPosts).mockResolvedValue(mockPosts);

      render(<BasicFetch />);

      await waitFor(() => {
        expect(screen.getByText('Post 1')).toBeInTheDocument();
      });

      vi.clearAllMocks();

      const refreshButton = screen.getByRole('button', { name: /refresh posts/i });
      await user.click(refreshButton);

      expect(postAPI.postAPI.fetchPosts).toHaveBeenCalledWith(1, 5);
    });

    it('should show loading state when refreshing', async () => {
      const user = userEvent.setup();
      vi.mocked(postAPI.postAPI.fetchPosts).mockResolvedValue(mockPosts);

      render(<BasicFetch />);

      await waitFor(() => {
        expect(screen.getByText('Post 1')).toBeInTheDocument();
      });

      vi.mocked(postAPI.postAPI.fetchPosts).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(mockPosts), 100))
      );

      const refreshButton = screen.getByRole('button', { name: /refresh posts/i });
      await user.click(refreshButton);

      expect(screen.getByText('Loading posts...')).toBeInTheDocument();
    });

    // it('should disable refresh button while loading', async () => {
    //   const user = userEvent.setup();
    //   vi.mocked(postAPI.postAPI.fetchPosts).mockResolvedValue(mockPosts);

    //   render(<BasicFetch />);

    //   await waitFor(() => {
    //     expect(screen.getByText('Post 1')).toBeInTheDocument();
    //   });

    //   vi.mocked(postAPI.postAPI.fetchPosts).mockImplementation(
    //     () => new Promise((resolve) => setTimeout(() => resolve(mockPosts), 100))
    //   );

    //   const refreshButton = screen.getByRole('button', { name: /refresh posts/i });
    //   await user.click(refreshButton);

    //   await waitFor(() => {
    //     expect(refreshButton).toBeDisabled();
    //   });
    // });
  });

  describe('Error handling', () => {
    it('should display error message when fetch fails', async () => {
      vi.mocked(postAPI.postAPI.fetchPosts).mockRejectedValue(new Error('Network error'));

      render(<BasicFetch />);

      await waitFor(() => {
        expect(screen.getByText('Failed to load posts')).toBeInTheDocument();
      });
    });

    it('should show retry button on error', async () => {
      vi.mocked(postAPI.postAPI.fetchPosts).mockRejectedValue(new Error('Network error'));

      render(<BasicFetch />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
      });
    });

    it('should retry fetch when retry button clicked', async () => {
      const user = userEvent.setup();
      vi.mocked(postAPI.postAPI.fetchPosts)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValue(mockPosts);

      render(<BasicFetch />);

      await waitFor(() => {
        expect(screen.getByText('Failed to load posts')).toBeInTheDocument();
      });

      const retryButton = screen.getByRole('button', { name: /retry/i });
      await user.click(retryButton);

      await waitFor(() => {
        expect(screen.getByText('Post 1')).toBeInTheDocument();
      });
    });

    it('should clear error when manually refreshing', async () => {
      const user = userEvent.setup();
      vi.mocked(postAPI.postAPI.fetchPosts)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValue(mockPosts);

      render(<BasicFetch />);

      await waitFor(() => {
        expect(screen.getByText('Failed to load posts')).toBeInTheDocument();
      });

      const retryButton = screen.getByRole('button', { name: /retry/i });
      await user.click(retryButton);

      await waitFor(() => {
        expect(screen.queryByText('Failed to load posts')).not.toBeInTheDocument();
      });
    });

    it('should not display posts when there is an error', async () => {
      vi.mocked(postAPI.postAPI.fetchPosts).mockRejectedValue(new Error('Network error'));

      render(<BasicFetch />);

      await waitFor(() => {
        expect(screen.getByText('Failed to load posts')).toBeInTheDocument();
      });

      expect(screen.queryByText('Post 1')).not.toBeInTheDocument();
    });
  });

  describe('Layout', () => {
    it('should use card layout', async () => {
      vi.mocked(postAPI.postAPI.fetchPosts).mockResolvedValue(mockPosts);

      const { container } = render(<BasicFetch />);

      await waitFor(() => {
        expect(screen.getByText('Post 1')).toBeInTheDocument();
      });

      const card = container.querySelector('.card');
      expect(card).toBeInTheDocument();
    });

    it('should display posts in grid layout', async () => {
      vi.mocked(postAPI.postAPI.fetchPosts).mockResolvedValue(mockPosts);

      const { container } = render(<BasicFetch />);

      await waitFor(() => {
        expect(screen.getByText('Post 1')).toBeInTheDocument();
      });

      const row = container.querySelector('.row');
      expect(row).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible loading indicator', () => {
      vi.mocked(postAPI.postAPI.fetchPosts).mockImplementation(
        () => new Promise(() => {})
      );

      render(<BasicFetch />);

      const spinner = screen.getByRole('status');
      expect(spinner).toBeInTheDocument();
    });

    it('should have accessible buttons', async () => {
      vi.mocked(postAPI.postAPI.fetchPosts).mockResolvedValue(mockPosts);

      render(<BasicFetch />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /refresh posts/i })).toBeInTheDocument();
      });
    });

    it('should use semantic headings', async () => {
      vi.mocked(postAPI.postAPI.fetchPosts).mockResolvedValue(mockPosts);

      render(<BasicFetch />);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /basic fetch/i })).toBeInTheDocument();
      });
    });
  });
});
