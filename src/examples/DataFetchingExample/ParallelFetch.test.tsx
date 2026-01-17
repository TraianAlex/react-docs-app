import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ParallelFetch from './ParallelFetch';
import * as postAPI from '../shared/api/postAPI';

vi.mock('../shared/api/postAPI');
vi.mock('../shared/utils', () => ({
  delay: vi.fn((ms: number) => Promise.resolve()),
}));

describe('ParallelFetch', () => {
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

      render(<ParallelFetch />);

      expect(screen.getByText('Loading all data in parallel...')).toBeInTheDocument();
    });

    it('should fetch all data on mount', async () => {
      vi.mocked(postAPI.postAPI.fetchPosts).mockResolvedValue(mockPosts);

      render(<ParallelFetch />);

      await waitFor(() => {
        expect(postAPI.postAPI.fetchPosts).toHaveBeenCalledWith(1, 3);
      });
    });

    it('should use Promise.all for parallel fetching', async () => {
      vi.mocked(postAPI.postAPI.fetchPosts).mockResolvedValue(mockPosts);

      render(<ParallelFetch />);

      await waitFor(() => {
        expect(postAPI.postAPI.fetchPosts).toHaveBeenCalled();
      });
    });
  });

  describe('Rendering', () => {
    it('should render component header', () => {
      vi.mocked(postAPI.postAPI.fetchPosts).mockImplementation(
        () => new Promise(() => {})
      );

      render(<ParallelFetch />);

      expect(screen.getByText('Parallel Data Fetching')).toBeInTheDocument();
    });

    it('should display description', () => {
      vi.mocked(postAPI.postAPI.fetchPosts).mockImplementation(
        () => new Promise(() => {})
      );

      render(<ParallelFetch />);

      expect(
        screen.getByText(/Fetch multiple resources simultaneously with Promise.all/)
      ).toBeInTheDocument();
    });
  });

  describe('Data display', () => {
    beforeEach(async () => {
      vi.mocked(postAPI.postAPI.fetchPosts).mockResolvedValue(mockPosts);
      render(<ParallelFetch />);

      await waitFor(() => {
        expect(screen.getByText('Post 1')).toBeInTheDocument();
      });
    });

    it('should display posts section', () => {
      expect(screen.getByText('Posts')).toBeInTheDocument();
    });

    it('should display users section', () => {
      expect(screen.getByText('Users')).toBeInTheDocument();
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

    it('should display user names', () => {
      expect(screen.getByText('User 1')).toBeInTheDocument();
      expect(screen.getByText('User 2')).toBeInTheDocument();
    });

    it('should display user emails', () => {
      expect(screen.getByText('user1@example.com')).toBeInTheDocument();
      expect(screen.getByText('user2@example.com')).toBeInTheDocument();
    });
  });

  describe('Error handling', () => {
    it('should display error message when fetch fails', async () => {
      vi.mocked(postAPI.postAPI.fetchPosts).mockRejectedValue(new Error('Network error'));

      render(<ParallelFetch />);

      await waitFor(() => {
        expect(screen.getByText('Failed to fetch data')).toBeInTheDocument();
      });
    });

    it('should show retry button on error', async () => {
      vi.mocked(postAPI.postAPI.fetchPosts).mockRejectedValue(new Error('Network error'));

      render(<ParallelFetch />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
      });
    });

    it('should retry fetch when retry button clicked', async () => {
      const user = userEvent.setup();
      vi.mocked(postAPI.postAPI.fetchPosts)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValue(mockPosts);

      render(<ParallelFetch />);

      await waitFor(() => {
        expect(screen.getByText('Failed to fetch data')).toBeInTheDocument();
      });

      const retryButton = screen.getByRole('button', { name: /retry/i });
      await user.click(retryButton);

      await waitFor(() => {
        expect(screen.getByText('Post 1')).toBeInTheDocument();
      });
    });

    it('should not display data when there is an error', async () => {
      vi.mocked(postAPI.postAPI.fetchPosts).mockRejectedValue(new Error('Network error'));

      render(<ParallelFetch />);

      await waitFor(() => {
        expect(screen.getByText('Failed to fetch data')).toBeInTheDocument();
      });

      expect(screen.queryByText('Post 1')).not.toBeInTheDocument();
      expect(screen.queryByText('User 1')).not.toBeInTheDocument();
    });
  });

  describe('Loading state', () => {
    it('should show spinner while loading', () => {
      vi.mocked(postAPI.postAPI.fetchPosts).mockImplementation(
        () => new Promise(() => {})
      );

      render(<ParallelFetch />);

      const spinner = document.querySelector('.spinner-border');
      expect(spinner).toBeInTheDocument();
    });

    it('should hide loading state after data loads', async () => {
      vi.mocked(postAPI.postAPI.fetchPosts).mockResolvedValue(mockPosts);

      render(<ParallelFetch />);

      await waitFor(() => {
        expect(screen.queryByText('Loading all data in parallel...')).not.toBeInTheDocument();
      });
    });

    it('should hide loading state on error', async () => {
      vi.mocked(postAPI.postAPI.fetchPosts).mockRejectedValue(new Error('Network error'));

      render(<ParallelFetch />);

      await waitFor(() => {
        expect(screen.queryByText('Loading all data in parallel...')).not.toBeInTheDocument();
      });
    });
  });

  describe('Layout', () => {
    it('should use two-column grid layout', async () => {
      vi.mocked(postAPI.postAPI.fetchPosts).mockResolvedValue(mockPosts);

      const { container } = render(<ParallelFetch />);

      await waitFor(() => {
        expect(screen.getByText('Post 1')).toBeInTheDocument();
      });

      const columns = container.querySelectorAll('.col-md-8, .col-md-4');
      expect(columns.length).toBe(2);
    });

    it('should display posts in larger column', async () => {
      vi.mocked(postAPI.postAPI.fetchPosts).mockResolvedValue(mockPosts);

      const { container } = render(<ParallelFetch />);

      await waitFor(() => {
        expect(screen.getByText('Post 1')).toBeInTheDocument();
      });

      const postsColumn = container.querySelector('.col-md-8');
      expect(postsColumn).toContainElement(screen.getByText('Posts'));
    });

    it('should display users in smaller column', async () => {
      vi.mocked(postAPI.postAPI.fetchPosts).mockResolvedValue(mockPosts);

      const { container } = render(<ParallelFetch />);

      await waitFor(() => {
        expect(screen.getByText('User 1')).toBeInTheDocument();
      });

      const usersColumn = container.querySelector('.col-md-4');
      expect(usersColumn).toContainElement(screen.getByText('Users'));
    });
  });

  describe('Accessibility', () => {
    it('should have accessible loading indicator', () => {
      vi.mocked(postAPI.postAPI.fetchPosts).mockImplementation(
        () => new Promise(() => {})
      );

      render(<ParallelFetch />);

      const spinner = document.querySelector('.spinner-border');
      expect(spinner).toBeInTheDocument();
    });

    it('should use semantic headings', async () => {
      vi.mocked(postAPI.postAPI.fetchPosts).mockResolvedValue(mockPosts);

      render(<ParallelFetch />);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /parallel data fetching/i })).toBeInTheDocument();
      });
    });

    it('should have section headings for posts and users', async () => {
      vi.mocked(postAPI.postAPI.fetchPosts).mockResolvedValue(mockPosts);

      render(<ParallelFetch />);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /posts/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /users/i })).toBeInTheDocument();
      });
    });
  });
});
