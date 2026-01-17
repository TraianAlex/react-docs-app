import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserTable from './UserTable';
import type { User } from '../shared/types';

describe('UserTable', () => {
  const mockUsers: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Manager', status: 'inactive' },
  ];

  const mockProps = {
    users: mockUsers,
    loading: false,
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onToggleStatus: vi.fn(),
    onRefresh: vi.fn(),
  };

  describe('Rendering', () => {
    it('should render table with users', () => {
      render(<UserTable {...mockProps} />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    });

    it('should display user count in header', () => {
      render(<UserTable {...mockProps} />);
      expect(screen.getByText('Users (3)')).toBeInTheDocument();
    });

    it('should render table headers', () => {
      render(<UserTable {...mockProps} />);

      expect(screen.getByText('ID')).toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Role')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();
    });

    it('should display user emails', () => {
      render(<UserTable {...mockProps} />);

      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
      expect(screen.getByText('bob@example.com')).toBeInTheDocument();
    });

    it('should display user IDs', () => {
      render(<UserTable {...mockProps} />);

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('should render refresh button', () => {
      render(<UserTable {...mockProps} />);
      expect(screen.getByRole('button', { name: /refresh/i })).toBeInTheDocument();
    });

    it('should render edit buttons for all users', () => {
      render(<UserTable {...mockProps} />);
      const editButtons = screen.getAllByRole('button', { name: /edit/i });
      expect(editButtons).toHaveLength(3);
    });

    it('should render delete buttons for all users', () => {
      render(<UserTable {...mockProps} />);
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      expect(deleteButtons).toHaveLength(3);
    });
  });

  describe('Role badges', () => {
    it('should display Admin role with danger badge', () => {
      render(<UserTable {...mockProps} />);
      const adminBadge = screen.getByText('Admin');
      expect(adminBadge).toHaveClass('bg-danger');
    });

    it('should display Manager role with warning badge', () => {
      render(<UserTable {...mockProps} />);
      const managerBadge = screen.getByText('Manager');
      expect(managerBadge).toHaveClass('bg-warning');
    });

    it('should display User role with secondary badge', () => {
      render(<UserTable {...mockProps} />);
      const userBadge = screen.getByText('User');
      expect(userBadge).toHaveClass('bg-secondary');
    });
  });

  describe('Status buttons', () => {
    it('should show active status with success button', () => {
      render(<UserTable {...mockProps} />);
      const activeButtons = screen.getAllByRole('button', { name: /✓ Active/i });

      activeButtons.forEach((button) => {
        expect(button).toHaveClass('btn-success');
      });
    });

    it('should show inactive status with secondary button', () => {
      render(<UserTable {...mockProps} />);
      const inactiveButton = screen.getByRole('button', { name: /inactive/i });
      expect(inactiveButton).toHaveClass('btn-secondary');
    });

    it('should call onToggleStatus when status button clicked', async () => {
      const user = userEvent.setup();
      render(<UserTable {...mockProps} />);

      const statusButton = screen.getAllByRole('button', { name: /active/i })[0];
      await user.click(statusButton);

      expect(mockProps.onToggleStatus).toHaveBeenCalledWith(mockUsers[0]);
    });
  });

  describe('User interactions', () => {
    it('should call onEdit when edit button clicked', async () => {
      const user = userEvent.setup();
      render(<UserTable {...mockProps} />);

      const editButtons = screen.getAllByRole('button', { name: /edit/i });
      await user.click(editButtons[0]);

      expect(mockProps.onEdit).toHaveBeenCalledWith(mockUsers[0]);
    });

    it('should call onDelete when delete button clicked', async () => {
      const user = userEvent.setup();
      render(<UserTable {...mockProps} />);

      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      await user.click(deleteButtons[1]);

      expect(mockProps.onDelete).toHaveBeenCalledWith(2);
    });

    it('should call onRefresh when refresh button clicked', async () => {
      const user = userEvent.setup();
      render(<UserTable {...mockProps} />);

      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      await user.click(refreshButton);

      expect(mockProps.onRefresh).toHaveBeenCalled();
    });
  });

  describe('Loading state', () => {
    it('should show loading spinner when loading with no users', () => {
      render(<UserTable {...mockProps} users={[]} loading={true} />);

      expect(screen.getByText('Loading users...')).toBeInTheDocument();
      const spinner = document.querySelector('.spinner-border');
      expect(spinner).toBeInTheDocument();
    });

    it('should disable buttons when loading', () => {
      render(<UserTable {...mockProps} loading={true} />);

      const editButtons = screen.getAllByRole('button', { name: /edit/i });
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      const statusButtons = screen.getAllByRole('button', { name: /✓ Active|○ Inactive/i });
      const allButtons = screen.getAllByRole('button');
      const refreshButton = allButtons.find(btn => btn.className.includes('btn-outline-primary'));

      [...editButtons, ...deleteButtons, ...statusButtons].forEach((button) => {
        expect(button).toBeDisabled();
      });

      if (refreshButton) {
        expect(refreshButton).toBeDisabled();
      }
    });

    it('should show spinner in refresh button when loading', () => {
      render(<UserTable {...mockProps} loading={true} />);

      const refreshButton = screen.getByRole('button', { name: '' }); // spinner has no text
      const spinner = refreshButton.querySelector('.spinner-border');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('Empty state', () => {
    it('should show empty message when no users', () => {
      render(<UserTable {...mockProps} users={[]} />);
      expect(screen.getByText('No users found. Create your first user!')).toBeInTheDocument();
    });

    it('should not show table when no users', () => {
      render(<UserTable {...mockProps} users={[]} />);
      expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });

    it('should not show loading when empty and not loading', () => {
      render(<UserTable {...mockProps} users={[]} loading={false} />);
      expect(screen.queryByText('Loading users...')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should use semantic table structure', () => {
      render(<UserTable {...mockProps} />);

      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /name/i })).toBeInTheDocument();
    });

    it('should have accessible button labels', () => {
      render(<UserTable {...mockProps} />);

      const editButtons = screen.getAllByRole('button', { name: /edit/i });
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });

      expect(editButtons.length).toBeGreaterThan(0);
      expect(deleteButtons.length).toBeGreaterThan(0);
    });

    it('should use strong tag for names', () => {
      render(<UserTable {...mockProps} />);

      const johnName = screen.getByText('John Doe');
      expect(johnName.tagName).toBe('STRONG');
    });
  });

  describe('Data display', () => {
    it('should display ID in code tag', () => {
      render(<UserTable {...mockProps} />);

      const idElement = screen.getByText('1');
      expect(idElement.tagName).toBe('CODE');
    });

    it('should display all user data correctly', () => {
      render(<UserTable {...mockProps} />);

      mockUsers.forEach((user) => {
        expect(screen.getByText(user.name)).toBeInTheDocument();
        expect(screen.getByText(user.email)).toBeInTheDocument();
        expect(screen.getByText(user.role)).toBeInTheDocument();
      });
    });
  });
});
