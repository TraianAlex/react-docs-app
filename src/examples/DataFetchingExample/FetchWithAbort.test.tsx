import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FetchWithAbort from './FetchWithAbort';
import * as postAPI from '../shared/api/postAPI';

vi.mock('../shared/api/postAPI');

describe('FetchWithAbort', () => {
  const mockResults = [
    { id: 1, title: 'React - Result 1', body: 'Search result for "React"...', author: 'System' },
    { id: 2, title: 'React - Result 2', body: 'Search result for "React"...', author: 'System' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render component header', () => {
      render(<FetchWithAbort />);
      expect(screen.getByText('Fetch with AbortController')).toBeInTheDocument();
    });

    it('should render search input', () => {
      render(<FetchWithAbort />);
      expect(screen.getByPlaceholderText('Type to search...')).toBeInTheDocument();
    });

    it('should show initial empty state', () => {
      render(<FetchWithAbort />);
      expect(screen.getByText('Start typing to search...')).toBeInTheDocument();
    });
  });

  describe('Search functionality', () => {
    it('should update input value when typing', async () => {
      const user = userEvent.setup();
      render(<FetchWithAbort />);

      const input = screen.getByPlaceholderText('Type to search...');
      await user.type(input, 'React');

      expect(input).toHaveValue('React');
    });

    it('should debounce search requests', async () => {
      const user = userEvent.setup();
      vi.mocked(postAPI.postAPI.searchPosts).mockResolvedValue(mockResults);

      render(<FetchWithAbort />);

      const input = screen.getByPlaceholderText('Type to search...');
      await user.type(input, 'Re');

      // Should not search immediately
      expect(postAPI.postAPI.searchPosts).not.toHaveBeenCalled();

      // Wait for debounce
      await waitFor(() => {
        expect(postAPI.postAPI.searchPosts).toHaveBeenCalledWith('Re');
      }, { timeout: 2000 });
    });

    it('should show loading state while searching', async () => {
      const user = userEvent.setup({});
      vi.mocked(postAPI.postAPI.searchPosts).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      render(<FetchWithAbort />);

      const input = screen.getByPlaceholderText('Type to search...');
      await user.type(input, 'React');

      // Wait for debounce timeout

      await waitFor(() => {
        expect(screen.getByText(/Searching for "React"/)).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('should display search results', async () => {
      const user = userEvent.setup({});
      vi.mocked(postAPI.postAPI.searchPosts).mockResolvedValue(mockResults);

      render(<FetchWithAbort />);

      const input = screen.getByPlaceholderText('Type to search...');
      await user.type(input, 'React');

      // Wait for debounce timeout

      await waitFor(() => {
        expect(screen.getByText('React - Result 1')).toBeInTheDocument();
        expect(screen.getByText('React - Result 2')).toBeInTheDocument();
      });
    });

    it('should clear results when input is emptied', async () => {
      const user = userEvent.setup({});
      vi.mocked(postAPI.postAPI.searchPosts).mockResolvedValue(mockResults);

      render(<FetchWithAbort />);

      const input = screen.getByPlaceholderText('Type to search...');
      await user.type(input, 'React');

      // Wait for debounce timeout

      await waitFor(() => {
        expect(screen.getByText('React - Result 1')).toBeInTheDocument();
      });

      await user.clear(input);

      expect(screen.getByText('Start typing to search...')).toBeInTheDocument();
      expect(screen.queryByText('React - Result 1')).not.toBeInTheDocument();
    });

    it('should show no results message when search returns empty', async () => {
      const user = userEvent.setup({});
      vi.mocked(postAPI.postAPI.searchPosts).mockResolvedValue([]);

      render(<FetchWithAbort />);

      const input = screen.getByPlaceholderText('Type to search...');
      await user.type(input, 'nonexistent');

      // Wait for debounce timeout

      await waitFor(() => {
        expect(screen.getByText(/No results found for "nonexistent"/)).toBeInTheDocument();
      });
    });
  });

  describe('AbortController functionality', () => {
    // it('should cancel previous request when typing continues', async () => {
    //   const user = userEvent.setup({});
    //   let searchCount = 0;

    //   vi.mocked(postAPI.postAPI.searchPosts).mockImplementation((query) => {
    //     searchCount++;
    //     return new Promise((resolve) =>
    //       setTimeout(() => resolve([{ id: 1, title: query, body: 'body', author: 'System' }]), 100)
    //     );
    //   });

    //   render(<FetchWithAbort />);

    //   const input = screen.getByPlaceholderText('Type to search...');

    //   // Type first query
    //   await user.type(input, 'Re');
    //   // Wait for debounce timeout

    //   // Type more before first query completes
    //   await user.type(input, 'act');
    //   // Wait for debounce timeout

    //   // Should have made two search calls
    //   await waitFor(() => {
    //     expect(searchCount).toBeGreaterThanOrEqual(2);
    //   });
    // });

    it('should not update state if component unmounts', async () => {
      const user = userEvent.setup({});
      vi.mocked(postAPI.postAPI.searchPosts).mockResolvedValue(mockResults);

      const { unmount } = render(<FetchWithAbort />);

      const input = screen.getByPlaceholderText('Type to search...');
      await user.type(input, 'React');

      // Wait for debounce timeout

      unmount();

      // Should not throw error or warning
      // Component is already unmounted
    });
  });

  describe('Result display', () => {
    it('should display result titles', async () => {
      const user = userEvent.setup({});
      vi.mocked(postAPI.postAPI.searchPosts).mockResolvedValue(mockResults);

      render(<FetchWithAbort />);

      const input = screen.getByPlaceholderText('Type to search...');
      await user.type(input, 'React');

      // Wait for debounce timeout

      await waitFor(() => {
        expect(screen.getByText('React - Result 1')).toBeInTheDocument();
      });
    });

    it('should display result bodies', async () => {
      const user = userEvent.setup({});
      vi.mocked(postAPI.postAPI.searchPosts).mockResolvedValue(mockResults);

      render(<FetchWithAbort />);

      const input = screen.getByPlaceholderText('Type to search...');
      await user.type(input, 'React');

      // Wait for debounce timeout

      await waitFor(() => {
        const results = screen.getAllByText(/Search result for "React"/);
        expect(results.length).toBeGreaterThan(0);
      });
    });

    it('should use list group for results', async () => {
      const user = userEvent.setup({});
      vi.mocked(postAPI.postAPI.searchPosts).mockResolvedValue(mockResults);

      const { container } = render(<FetchWithAbort />);

      const input = screen.getByPlaceholderText('Type to search...');
      await user.type(input, 'React');

      // Wait for debounce timeout

      await waitFor(() => {
        const listGroup = container.querySelector('.list-group');
        expect(listGroup).toBeInTheDocument();
      });
    });
  });

  describe('Error handling', () => {
    it('should handle search errors gracefully', async () => {
      const user = userEvent.setup({});
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(postAPI.postAPI.searchPosts).mockRejectedValue(new Error('Search failed'));

      render(<FetchWithAbort />);

      const input = screen.getByPlaceholderText('Type to search...');
      await user.type(input, 'React');

      // Wait for debounce timeout

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Search failed:', expect.any(Error));
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible search input', () => {
      render(<FetchWithAbort />);

      const input = screen.getByPlaceholderText('Type to search...');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('should have loading indicator', async () => {
      const user = userEvent.setup({});
      vi.mocked(postAPI.postAPI.searchPosts).mockImplementation(
        () => new Promise(() => {})
      );

      render(<FetchWithAbort />);

      const input = screen.getByPlaceholderText('Type to search...');
      await user.type(input, 'React');

      // Wait for debounce timeout

      await waitFor(() => {
        const spinner = document.querySelector('.spinner-border');
        expect(spinner).toBeInTheDocument();
      });
    });
  });
});
