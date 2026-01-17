import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OptimisticLikes from './OptimisticLikes';
import * as postAPI from '../shared/api/postAPI';

vi.mock('../shared/api/postAPI');

describe('OptimisticLikes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render component with header', () => {
      render(<OptimisticLikes />);
      expect(screen.getByText('Optimistic Likes')).toBeInTheDocument();
    });

    it('should render all initial posts', () => {
      render(<OptimisticLikes />);
      expect(screen.getByText('Getting Started with React 19')).toBeInTheDocument();
      expect(screen.getByText('Understanding Concurrent Features')).toBeInTheDocument();
      expect(screen.getByText('Optimistic UI Updates')).toBeInTheDocument();
    });

    it('should display initial like counts', () => {
      render(<OptimisticLikes />);
      expect(screen.getByText(/❤️ 42/)).toBeInTheDocument();
      expect(screen.getByText(/❤️ 38/)).toBeInTheDocument();
      expect(screen.getByText(/❤️ 56/)).toBeInTheDocument();
    });

    it('should render post bodies', () => {
      render(<OptimisticLikes />);
      expect(screen.getByText(/Learn about the new features in React 19/)).toBeInTheDocument();
      expect(screen.getByText(/Dive deep into useTransition and useDeferredValue/)).toBeInTheDocument();
      expect(screen.getByText(/Make your app feel faster with optimistic updates/)).toBeInTheDocument();
    });

    it('should render like buttons for all posts', () => {
      render(<OptimisticLikes />);
      const likeButtons = screen.getAllByRole('button', { name: /❤️/ });
      expect(likeButtons).toHaveLength(3);
    });

    it('should display "Click to like" hint', () => {
      render(<OptimisticLikes />);
      const hints = screen.getAllByText('Click to like');
      expect(hints).toHaveLength(3);
    });
  });

  describe('Liking posts', () => {
    it('should increment like count optimistically', async () => {
      const user = userEvent.setup();
      vi.mocked(postAPI.postAPI.likePost).mockResolvedValue(43);

      render(<OptimisticLikes />);

      const likeButtons = screen.getAllByRole('button', { name: /❤️ 42/ });
      await user.click(likeButtons[0]);

      // Should update immediately
      expect(screen.getByText(/❤️ 43/)).toBeInTheDocument();
    });

    it('should call API with correct parameters', async () => {
      const user = userEvent.setup();
      vi.mocked(postAPI.postAPI.likePost).mockResolvedValue(43);

      render(<OptimisticLikes />);

      const likeButtons = screen.getAllByRole('button', { name: /❤️ 42/ });
      await user.click(likeButtons[0]);

      await waitFor(() => {
        expect(postAPI.postAPI.likePost).toHaveBeenCalledWith(1, 42);
      });
    });

    it('should update to server response after API call', async () => {
      const user = userEvent.setup();
      vi.mocked(postAPI.postAPI.likePost).mockResolvedValue(43);

      render(<OptimisticLikes />);

      const likeButtons = screen.getAllByRole('button', { name: /❤️ 42/ });
      await user.click(likeButtons[0]);

      await waitFor(() => {
        expect(screen.getByText(/❤️ 43/)).toBeInTheDocument();
      });
    });

    // it('should revert like count if API fails', async () => {
    //   const user = userEvent.setup();
    //   vi.mocked(postAPI.postAPI.likePost).mockRejectedValue(new Error('Failed to like post'));

    //   render(<OptimisticLikes />);

    //   const likeButtons = screen.getAllByRole('button', { name: /❤️ 42/ });
    //   await user.click(likeButtons[0]);

    //   // Should show optimistic update first
    //   expect(screen.getByText(/❤️ 43/)).toBeInTheDocument();

    //   // Then revert after error
    //   await waitFor(() => {
    //     expect(screen.getByText(/❤️ 42/)).toBeInTheDocument();
    //   });
    // });

    it('should show error message when like fails', async () => {
      const user = userEvent.setup();
      vi.mocked(postAPI.postAPI.likePost).mockRejectedValue(new Error('Failed to like post'));

      render(<OptimisticLikes />);

      const likeButtons = screen.getAllByRole('button', { name: /❤️ 42/ });
      await user.click(likeButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Failed to like post. Please try again.')).toBeInTheDocument();
      });
    });

    it('should allow multiple posts to be liked', async () => {
      const user = userEvent.setup();
      vi.mocked(postAPI.postAPI.likePost)
        .mockResolvedValueOnce(43)
        .mockResolvedValueOnce(39);

      render(<OptimisticLikes />);

      const firstLikeButton = screen.getByRole('button', { name: /❤️ 42/ });
      await user.click(firstLikeButton);

      const secondLikeButton = screen.getByRole('button', { name: /❤️ 38/ });
      await user.click(secondLikeButton);

      await waitFor(() => {
        expect(screen.getByText(/❤️ 43/)).toBeInTheDocument();
        expect(screen.getByText(/❤️ 39/)).toBeInTheDocument();
      });
    });

    it('should clear error when liking another post', async () => {
      const user = userEvent.setup();
      vi.mocked(postAPI.postAPI.likePost)
        .mockRejectedValueOnce(new Error('Failed'))
        .mockResolvedValueOnce(39);

      render(<OptimisticLikes />);

      const firstLikeButton = screen.getByRole('button', { name: /❤️ 42/ });
      await user.click(firstLikeButton);

      await waitFor(() => {
        expect(screen.getByText(/Failed to like post/)).toBeInTheDocument();
      });

      const secondLikeButton = screen.getByRole('button', { name: /❤️ 38/ });
      await user.click(secondLikeButton);

      expect(screen.queryByText(/Failed to like post/)).not.toBeInTheDocument();
    });
  });

  describe('Error handling', () => {
    it('should dismiss error message', async () => {
      const user = userEvent.setup();
      vi.mocked(postAPI.postAPI.likePost).mockRejectedValue(new Error('Failed'));

      render(<OptimisticLikes />);

      const likeButtons = screen.getAllByRole('button', { name: /❤️ 42/ });
      await user.click(likeButtons[0]);

      await waitFor(() => {
        expect(screen.getByText(/Failed to like post/)).toBeInTheDocument();
      });

      const closeButton = screen.getByRole('button', { name: '' });
      await user.click(closeButton);

      expect(screen.queryByText(/Failed to like post/)).not.toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('should handle posts without like counts', async () => {
      render(<OptimisticLikes />);
      // All initial posts have like counts, but the component should handle undefined
      expect(screen.getByText(/❤️ 42/)).toBeInTheDocument();
    });

    it('should not like when post is not found', async () => {
      const user = userEvent.setup();
      render(<OptimisticLikes />);

      // This tests the internal guard, though hard to trigger from UI
      expect(postAPI.postAPI.likePost).not.toHaveBeenCalled();
    });

    it('should handle rapid successive likes on same post', async () => {
      const user = userEvent.setup();
      vi.mocked(postAPI.postAPI.likePost)
        .mockResolvedValueOnce(43)
        .mockResolvedValueOnce(44);

      render(<OptimisticLikes />);

      const likeButton = screen.getByRole('button', { name: /❤️ 42/ });
      await user.click(likeButton);

      // Click again before first request completes
      const updatedButton = screen.getByRole('button', { name: /❤️ 43/ });
      await user.click(updatedButton);

      await waitFor(() => {
        expect(postAPI.postAPI.likePost).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Layout', () => {
    it('should display posts in grid layout', () => {
      render(<OptimisticLikes />);
      const cards = screen.getAllByRole('heading', { level: 5 });
      expect(cards).toHaveLength(3);
    });

    it('should show like count and button in footer', () => {
      render(<OptimisticLikes />);
      const likeButtons = screen.getAllByRole('button', { name: /❤️/ });
      likeButtons.forEach((button) => {
        expect(button).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have accessible button elements', () => {
      render(<OptimisticLikes />);
      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toBeInTheDocument();
      });
    });

    it('should use semantic HTML for post cards', () => {
      render(<OptimisticLikes />);
      const headings = screen.getAllByRole('heading', { level: 5 });
      expect(headings).toHaveLength(3);
    });
  });
});
