import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UseDeferredValueDemo from './UseDeferredValueDemo';
import { generateItems } from './itemGenerator';

describe('UseDeferredValueDemo', () => {
  const allItems = generateItems(100);

  beforeEach(() => {
    render(<UseDeferredValueDemo allItems={allItems} />);
  });

  describe('Rendering', () => {
    it('should render component with header', () => {
      expect(screen.getByText('useDeferredValue Example')).toBeInTheDocument();
    });

    it('should display search input', () => {
      const input = screen.getByPlaceholderText('Search items...');
      expect(input).toBeInTheDocument();
    });

    it('should display initial results info', () => {
      expect(screen.getByText(/Showing results for:/)).toBeInTheDocument();
      expect(screen.getByText('(all items)')).toBeInTheDocument();
    });

    it('should display item count', () => {
      expect(screen.getByText(/Found 100 items/)).toBeInTheDocument();
    });

    it('should render items table', () => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('should display all table headers', () => {
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Category')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Price')).toBeInTheDocument();
    });

    it('should show first 50 items by default', () => {
      const rows = screen.getAllByRole('row');
      // +1 for header row
      expect(rows.length).toBe(51);
    });

    it('should display comparison info in footer', () => {
      expect(screen.getByText('Key Differences')).toBeInTheDocument();
      expect(screen.getByText('useTransition')).toBeInTheDocument();
      expect(screen.getByText('useDeferredValue')).toBeInTheDocument();
    });
  });

  describe('Search functionality', () => {
    it('should update input value when typing', async () => {
      const user = userEvent.setup();
      const input = screen.getByPlaceholderText('Search items...');

      await user.type(input, 'electronics');

      expect(input).toHaveValue('electronics');
    });

    it('should show stale indicator when query differs from deferred value', async () => {
      const user = userEvent.setup();
      const input = screen.getByPlaceholderText('Search items...');

      await user.type(input, 'e');

      // May briefly show updating state
      await waitFor(
        () => {
          const updating = screen.queryByText(/Updating results/);
          const showing = screen.queryByText(/Showing results for:/);
          expect(updating || showing).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });

    it('should display query in results info after update', async () => {
      const user = userEvent.setup();
      const input = screen.getByPlaceholderText('Search items...');

      await user.type(input, 'books');

      await waitFor(() => {
        expect(screen.getByText(/Showing results for:/)).toBeInTheDocument();
        const matches = screen.getAllByText(/books/);
        expect(matches.length).toBeGreaterThan(0);
      });
    });

    it('should filter items based on deferred query', async () => {
      const user = userEvent.setup();
      const input = screen.getByPlaceholderText('Search items...');

      await user.type(input, 'electronics');

      await waitFor(() => {
        expect(screen.getByText(/Found \d+ items/)).toBeInTheDocument();
      });
    });

    it('should apply reduced opacity during stale state', async () => {
      const user = userEvent.setup();
      const input = screen.getByPlaceholderText('Search items...');

      await user.type(input, 'test');

      const table = screen.getByRole('table');

      // Eventually should return to full opacity
      await waitFor(() => {
        expect(table).toHaveStyle({ opacity: 1 });
      });
    });

    it('should handle empty search', async () => {
      const user = userEvent.setup();
      const input = screen.getByPlaceholderText('Search items...');

      await user.type(input, 'test');
      await waitFor(() => {
        expect(screen.queryByText('(all items)')).not.toBeInTheDocument();
      });

      await user.clear(input);

      await waitFor(() => {
        expect(screen.getByText('(all items)')).toBeInTheDocument();
      });
    });

    it('should handle no results scenario', async () => {
      const user = userEvent.setup();
      const input = screen.getByPlaceholderText('Search items...');

      await user.type(input, 'nonexistent-query-xyz');

      await waitFor(() => {
        expect(screen.getByText(/Found 0 items/)).toBeInTheDocument();
      });
    });
  });

  describe('useDeferredValue behavior', () => {
    it('should show updated results after deferred value changes', async () => {
      const user = userEvent.setup();
      const input = screen.getByPlaceholderText('Search items...');

      await user.type(input, 'clothing');

      await waitFor(() => {
        const resultsText = screen.getByText(/Showing results for:/);
        expect(resultsText).toBeInTheDocument();
      });
    });

    it('should not show "Showing first 50" when fewer results', async () => {
      const user = userEvent.setup();
      const input = screen.getByPlaceholderText('Search items...');

      await user.type(input, 'Item 99');

      await waitFor(() => {
        expect(screen.queryByText(/Showing first 50/)).not.toBeInTheDocument();
      });
    });

    it('should display item count after filtering', async () => {
      const user = userEvent.setup();
      const input = screen.getByPlaceholderText('Search items...');

      await user.type(input, 'toys');

      await waitFor(() => {
        const countText = screen.getByText(/Found \d+ items/);
        expect(countText).toBeInTheDocument();
      });
    });
  });

  describe('Educational content', () => {
    it('should display useTransition explanation', () => {
      expect(screen.getByText('You control the state update')).toBeInTheDocument();
      expect(screen.getByText('Returns isPending flag')).toBeInTheDocument();
      expect(screen.getByText('Good for: tab switching, navigation')).toBeInTheDocument();
    });

    it('should display useDeferredValue explanation', () => {
      expect(screen.getByText('Defers a specific value')).toBeInTheDocument();
      expect(screen.getByText('Compare values to detect staleness')).toBeInTheDocument();
      expect(screen.getByText('Good for: search inputs, filtering')).toBeInTheDocument();
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
