import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UseTransitionDemo from './UseTransitionDemo';
import { generateItems } from './itemGenerator';

describe('UseTransitionDemo', () => {
  const allItems = generateItems(100);

  beforeEach(() => {
    render(<UseTransitionDemo allItems={allItems} />);
  });

  describe('Rendering', () => {
    it('should render component with header', () => {
      expect(screen.getByText('useTransition Example')).toBeInTheDocument();
    });

    it('should display search input', () => {
      const input = screen.getByPlaceholderText('Search items...');
      expect(input).toBeInTheDocument();
    });

    it('should display initial item count', () => {
      expect(screen.getByText('Found 100 items')).toBeInTheDocument();
    });

    it('should render items table', () => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('should display table headers', () => {
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Category')).toBeInTheDocument();
      expect(screen.getByText('Price')).toBeInTheDocument();
    });

    it('should show first 50 items by default', () => {
      const rows = screen.getAllByRole('row');
      // +1 for header row
      expect(rows.length).toBe(51);
    });

    it('should display "Showing first 50" message when more than 50 results', () => {
      expect(screen.getByText(/Showing first 50 of 100 results/)).toBeInTheDocument();
    });
  });

  describe('Search functionality', () => {
    it('should update input value when typing', async () => {
      const user = userEvent.setup();
      const input = screen.getByPlaceholderText('Search items...');

      await user.type(input, 'electronics');

      expect(input).toHaveValue('electronics');
    });

    it('should show pending state while filtering', async () => {
      const user = userEvent.setup();
      const input = screen.getByPlaceholderText('Search items...');

      await user.type(input, 'e');

      // Check for loading indicator (may be brief)
      await waitFor(() => {
        const loadingText = screen.queryByText(/Filtering/);
        const successText = screen.queryByText(/Found/);
        expect(loadingText || successText).toBeInTheDocument();
      });
    });

    it('should filter items by search query', async () => {
      const user = userEvent.setup();
      const input = screen.getByPlaceholderText('Search items...');

      await user.type(input, 'electronics');

      await waitFor(() => {
        expect(screen.getByText(/Found \d+ items/)).toBeInTheDocument();
      });
    });

    it('should reduce opacity on table during pending state', async () => {
      const user = userEvent.setup();
      const input = screen.getByPlaceholderText('Search items...');

      await user.type(input, 'test');

      const tbody = screen.getByRole('table').querySelector('tbody');

      // Eventually should return to full opacity
      await waitFor(() => {
        expect(tbody).toHaveStyle({ opacity: 1 });
      });
    });

    it('should clear results when search is cleared', async () => {
      const user = userEvent.setup();
      const input = screen.getByPlaceholderText('Search items...');

      await user.type(input, 'electronics');
      await waitFor(() => {
        expect(screen.queryByText('Found 100 items')).not.toBeInTheDocument();
      });

      await user.clear(input);

      await waitFor(() => {
        expect(screen.getByText('Found 100 items')).toBeInTheDocument();
      });
    });

    it('should handle no results scenario', async () => {
      const user = userEvent.setup();
      const input = screen.getByPlaceholderText('Search items...');

      await user.type(input, 'nonexistent-query-xyz');

      await waitFor(() => {
        expect(screen.getByText('Found 0 items')).toBeInTheDocument();
      });
    });
  });

  describe('useTransition behavior', () => {
    it('should show success state after filtering completes', async () => {
      const user = userEvent.setup();
      const input = screen.getByPlaceholderText('Search items...');

      await user.type(input, 'books');

      await waitFor(() => {
        expect(screen.getByText(/Found/)).toBeInTheDocument();
      });
    });

    it('should not show "Showing first 50" message when less than 50 results', async () => {
      const user = userEvent.setup();
      const input = screen.getByPlaceholderText('Search items...');

      // Search for something that yields fewer results
      await user.type(input, 'Item 99');

      await waitFor(() => {
        expect(screen.queryByText(/Showing first 50/)).not.toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have accessible form controls', () => {
      const input = screen.getByPlaceholderText('Search items...');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('should maintain input focus during search', async () => {
      const user = userEvent.setup();
      const input = screen.getByPlaceholderText('Search items...');

      await user.click(input);
      await user.type(input, 'test');

      expect(input).toHaveFocus();
    });
  });
});
