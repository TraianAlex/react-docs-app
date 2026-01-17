import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OptimisticTodos from './OptimisticTodos';
import * as todoAPI from '../shared/api/todoAPI';

vi.mock('../shared/api/todoAPI');

describe('OptimisticTodos', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render component with header', () => {
      render(<OptimisticTodos />);
      expect(screen.getByText('Optimistic Todo List')).toBeInTheDocument();
    });

    it('should render initial todos', () => {
      render(<OptimisticTodos />);
      expect(screen.getByText('Learn React 19 hooks')).toBeInTheDocument();
      expect(screen.getByText('Build awesome features')).toBeInTheDocument();
    });

    it('should render add todo form', () => {
      render(<OptimisticTodos />);
      expect(screen.getByPlaceholderText('Add a new todo...')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add todo/i })).toBeInTheDocument();
    });

    it('should show completed todo with line-through', () => {
      render(<OptimisticTodos />);
      const completedTodo = screen.getByText('Learn React 19 hooks');
      expect(completedTodo).toHaveStyle({ textDecoration: 'line-through' });
    });

    it('should show incomplete todo without line-through', () => {
      render(<OptimisticTodos />);
      const incompleteTodo = screen.getByText('Build awesome features');
      expect(incompleteTodo).toHaveStyle({ textDecoration: 'none' });
    });

    it('should render checkboxes for all todos', () => {
      render(<OptimisticTodos />);
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes).toHaveLength(2);
    });

    it('should render delete buttons for all todos', () => {
      render(<OptimisticTodos />);
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      expect(deleteButtons).toHaveLength(2);
    });
  });

  describe('Adding todos', () => {
    it('should add todo optimistically', async () => {
      const user = userEvent.setup();
      vi.mocked(todoAPI.todoAPI.add).mockResolvedValue({
        id: 3,
        text: 'New todo',
        completed: false,
      });

      render(<OptimisticTodos />);

      const input = screen.getByPlaceholderText('Add a new todo...');
      await user.type(input, 'New todo');
      await user.click(screen.getByRole('button', { name: /add todo/i }));

      // Should appear immediately (optimistically)
      expect(screen.getByText('New todo')).toBeInTheDocument();
    });

    // it('should show pending indicator while saving', async () => {
    //   const user = userEvent.setup();
    //   vi.mocked(todoAPI.todoAPI.add).mockImplementation(
    //     () => new Promise((resolve) => setTimeout(() => resolve({ id: 3, text: 'New todo', completed: false }), 100))
    //   );

    //   render(<OptimisticTodos />);

    //   const input = screen.getByPlaceholderText('Add a new todo...');
    //   await user.type(input, 'New todo');
    //   await user.click(screen.getByRole('button', { name: /add todo/i }));

    //   // Should show pending badge
    //   await waitFor(() => {
    //     expect(screen.getByText('Saving...')).toBeInTheDocument();
    //   });
    //   expect(screen.getByText('New todo').closest('li')).toHaveStyle({ opacity: 0.6 });
    // });

    it('should remove pending state after successful save', async () => {
      const user = userEvent.setup();
      vi.mocked(todoAPI.todoAPI.add).mockResolvedValue({
        id: 3,
        text: 'New todo',
        completed: false,
      });

      render(<OptimisticTodos />);

      const input = screen.getByPlaceholderText('Add a new todo...');
      await user.type(input, 'New todo');
      await user.click(screen.getByRole('button', { name: /add todo/i }));

      await waitFor(() => {
        expect(screen.queryByText('Saving...')).not.toBeInTheDocument();
      });
    });

    it('should clear input after adding todo', async () => {
      const user = userEvent.setup();
      vi.mocked(todoAPI.todoAPI.add).mockResolvedValue({
        id: 3,
        text: 'New todo',
        completed: false,
      });

      render(<OptimisticTodos />);

      const input = screen.getByPlaceholderText('Add a new todo...');
      await user.type(input, 'New todo');
      await user.click(screen.getByRole('button', { name: /add todo/i }));

      expect(input).toHaveValue('');
    });

    it('should show error when add fails', async () => {
      const user = userEvent.setup();
      vi.mocked(todoAPI.todoAPI.add).mockRejectedValue(new Error('Failed to add todo'));

      render(<OptimisticTodos />);

      const input = screen.getByPlaceholderText('Add a new todo...');
      await user.type(input, 'New todo');
      await user.click(screen.getByRole('button', { name: /add todo/i }));

      await waitFor(() => {
        expect(screen.getByText(/Failed to add todo/)).toBeInTheDocument();
      });
    });

    it('should not add todo when input is empty', async () => {
      const user = userEvent.setup();
      render(<OptimisticTodos />);

      const addButton = screen.getByRole('button', { name: /add todo/i });
      await user.click(addButton);

      expect(todoAPI.todoAPI.add).not.toHaveBeenCalled();
    });

    it('should not add todo when input is only whitespace', async () => {
      const user = userEvent.setup();
      render(<OptimisticTodos />);

      const input = screen.getByPlaceholderText('Add a new todo...');
      await user.type(input, '   ');
      await user.click(screen.getByRole('button', { name: /add todo/i }));

      expect(todoAPI.todoAPI.add).not.toHaveBeenCalled();
    });

    it('should handle form submission via Enter key', async () => {
      const user = userEvent.setup();
      vi.mocked(todoAPI.todoAPI.add).mockResolvedValue({
        id: 3,
        text: 'New todo',
        completed: false,
      });

      render(<OptimisticTodos />);

      const input = screen.getByPlaceholderText('Add a new todo...');
      await user.type(input, 'New todo{Enter}');

      expect(todoAPI.todoAPI.add).toHaveBeenCalledWith('New todo');
    });
  });

  describe('Deleting todos', () => {
    it('should delete todo immediately', async () => {
      const user = userEvent.setup();
      vi.mocked(todoAPI.todoAPI.delete).mockResolvedValue();

      render(<OptimisticTodos />);

      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      await user.click(deleteButtons[1]);

      await waitFor(() => {
        expect(screen.queryByText('Build awesome features')).not.toBeInTheDocument();
      });
    });

    it('should call API delete method', async () => {
      const user = userEvent.setup();
      vi.mocked(todoAPI.todoAPI.delete).mockResolvedValue();

      render(<OptimisticTodos />);

      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      await user.click(deleteButtons[1]);

      await waitFor(() => {
        expect(todoAPI.todoAPI.delete).toHaveBeenCalledWith(2);
      });
    });

    it('should restore todo if delete fails', async () => {
      const user = userEvent.setup();
      vi.mocked(todoAPI.todoAPI.delete).mockRejectedValue(new Error('Failed to delete'));

      render(<OptimisticTodos />);

      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      await user.click(deleteButtons[1]);

      await waitFor(() => {
        expect(screen.getByText('Failed to delete todo')).toBeInTheDocument();
        expect(screen.getByText('Build awesome features')).toBeInTheDocument();
      });
    });

    // it('should disable delete button for pending todos', async () => {
    //   const user = userEvent.setup();
    //   vi.mocked(todoAPI.todoAPI.add).mockImplementation(
    //     () => new Promise((resolve) => setTimeout(() => resolve({ id: 3, text: 'New todo', completed: false }), 100))
    //   );

    //   render(<OptimisticTodos />);

    //   const input = screen.getByPlaceholderText('Add a new todo...');
    //   await user.type(input, 'New todo');
    //   await user.click(screen.getByRole('button', { name: /add todo/i }));

    //   await waitFor(() => {
    //     const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    //     const newTodoDeleteButton = deleteButtons[deleteButtons.length - 1];
    //     expect(newTodoDeleteButton).toBeDisabled();
    //   });
    // });
  });

  describe('Error handling', () => {
    it('should dismiss error message', async () => {
      const user = userEvent.setup();
      vi.mocked(todoAPI.todoAPI.add).mockRejectedValue(new Error('Failed'));

      render(<OptimisticTodos />);

      const input = screen.getByPlaceholderText('Add a new todo...');
      await user.type(input, 'New todo');
      await user.click(screen.getByRole('button', { name: /add todo/i }));

      await waitFor(() => {
        expect(screen.getByText(/Failed to add todo/)).toBeInTheDocument();
      });

      const closeButton = screen.getByRole('button', { name: '' }); // close button
      await user.click(closeButton);

      expect(screen.queryByText(/Failed to add todo/)).not.toBeInTheDocument();
    });

    it('should clear error when adding new todo', async () => {
      const user = userEvent.setup();
      vi.mocked(todoAPI.todoAPI.add).mockRejectedValueOnce(new Error('Failed'));

      render(<OptimisticTodos />);

      const input = screen.getByPlaceholderText('Add a new todo...');
      await user.type(input, 'New todo');
      await user.click(screen.getByRole('button', { name: /add todo/i }));

      await waitFor(() => {
        expect(screen.getByText(/Failed to add todo/)).toBeInTheDocument();
      });

      vi.mocked(todoAPI.todoAPI.add).mockResolvedValue({ id: 3, text: 'Another todo', completed: false });
      await user.type(input, 'Another todo');
      await user.click(screen.getByRole('button', { name: /add todo/i }));

      expect(screen.queryByText(/Failed to add todo/)).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible form elements', () => {
      render(<OptimisticTodos />);

      const input = screen.getByPlaceholderText('Add a new todo...');
      expect(input).toHaveAttribute('type', 'text');

      const button = screen.getByRole('button', { name: /add todo/i });
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('should have checkboxes for todos', () => {
      render(<OptimisticTodos />);
      const checkboxes = screen.getAllByRole('checkbox');
      checkboxes.forEach((checkbox) => {
        expect(checkbox).toBeInTheDocument();
      });
    });
  });
});
