import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserForm from './UserForm';
import type { User } from '../shared/types';

describe('UserForm', () => {
  const mockFormData = {
    name: 'Test User',
    email: 'test@example.com',
    role: 'User',
    status: 'active' as const,
  };

  const mockProps = {
    formData: mockFormData,
    editingUser: null,
    loading: false,
    onSubmit: vi.fn(),
    onCancel: vi.fn(),
    onChange: vi.fn(),
  };

  describe('Rendering', () => {
    it('should render form with all fields', () => {
      render(<UserForm {...mockProps} />);

      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/role/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    });

    it('should show "Create New User" header when not editing', () => {
      render(<UserForm {...mockProps} />);
      expect(screen.getByText('Create New User')).toBeInTheDocument();
    });

    it('should show "Edit User" header when editing', () => {
      const editingUser: User = {
        id: 1,
        name: 'John',
        email: 'john@example.com',
        role: 'Admin',
        status: 'active',
      };
      render(<UserForm {...mockProps} editingUser={editingUser} />);
      expect(screen.getByText('Edit User')).toBeInTheDocument();
    });

    it('should display form data in inputs', () => {
      render(<UserForm {...mockProps} />);

      expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
      expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();

      const roleSelect = screen.getByLabelText(/role/i) as HTMLSelectElement;
      expect(roleSelect.value).toBe('User');

      const statusSelect = screen.getByLabelText(/status/i) as HTMLSelectElement;
      expect(statusSelect.value).toBe('active');
    });

    it('should render all role options', () => {
      render(<UserForm {...mockProps} />);

      const roleSelect = screen.getByLabelText(/role/i) as HTMLSelectElement;
      const options = Array.from(roleSelect.options).map((opt) => opt.value);

      expect(options).toContain('User');
      expect(options).toContain('Admin');
      expect(options).toContain('Manager');
    });

    it('should render all status options', () => {
      render(<UserForm {...mockProps} />);

      const statusSelect = screen.getByLabelText(/status/i) as HTMLSelectElement;
      const options = Array.from(statusSelect.options).map((opt) => opt.value);

      expect(options).toContain('active');
      expect(options).toContain('inactive');
    });

    it('should have required attribute on name field', () => {
      render(<UserForm {...mockProps} />);
      const nameInput = screen.getByLabelText(/name/i);
      expect(nameInput).toHaveAttribute('required');
    });

    it('should have required attribute on email field', () => {
      render(<UserForm {...mockProps} />);
      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toHaveAttribute('required');
    });
  });

  describe('Form interactions', () => {
    it('should call onChange when name input changes', async () => {
      const user = userEvent.setup();
      render(<UserForm {...mockProps} />);

      const nameInput = screen.getByLabelText(/name/i);
      await user.clear(nameInput);
      await user.type(nameInput, 'New Name');

      expect(mockProps.onChange).toHaveBeenCalledWith('name', expect.any(String));
    });

    it('should call onChange when email input changes', async () => {
      const user = userEvent.setup();
      render(<UserForm {...mockProps} />);

      const emailInput = screen.getByLabelText(/email/i);
      await user.clear(emailInput);
      await user.type(emailInput, 'new@test.com');

      expect(mockProps.onChange).toHaveBeenCalledWith('email', expect.any(String));
    });

    it('should call onChange when role select changes', async () => {
      const user = userEvent.setup();
      render(<UserForm {...mockProps} />);

      const roleSelect = screen.getByLabelText(/role/i);
      await user.selectOptions(roleSelect, 'Admin');

      expect(mockProps.onChange).toHaveBeenCalledWith('role', 'Admin');
    });

    it('should call onChange when status select changes', async () => {
      const user = userEvent.setup();
      render(<UserForm {...mockProps} />);

      const statusSelect = screen.getByLabelText(/status/i);
      await user.selectOptions(statusSelect, 'inactive');

      expect(mockProps.onChange).toHaveBeenCalledWith('status', 'inactive');
    });

    it('should call onSubmit when form is submitted', async () => {
      const user = userEvent.setup();
      render(<UserForm {...mockProps} />);

      const submitButton = screen.getByRole('button', { name: /create user/i });
      await user.click(submitButton);

      expect(mockProps.onSubmit).toHaveBeenCalled();
    });

    it('should call onCancel when cancel button is clicked', async () => {
      const user = userEvent.setup();
      render(<UserForm {...mockProps} />);

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      expect(mockProps.onCancel).toHaveBeenCalled();
    });
  });

  describe('Loading state', () => {
    it('should disable submit button when loading', () => {
      render(<UserForm {...mockProps} loading={true} />);

      const submitButton = screen.getByRole('button', { name: /creating/i });
      expect(submitButton).toBeDisabled();
    });

    it('should show "Creating..." text when loading and not editing', () => {
      render(<UserForm {...mockProps} loading={true} />);
      expect(screen.getByText('Creating...')).toBeInTheDocument();
    });

    it('should show "Updating..." text when loading and editing', () => {
      const editingUser: User = {
        id: 1,
        name: 'John',
        email: 'john@example.com',
        role: 'Admin',
        status: 'active',
      };
      render(<UserForm {...mockProps} loading={true} editingUser={editingUser} />);
      expect(screen.getByText('Updating...')).toBeInTheDocument();
    });

    it('should show spinner when loading', () => {
      render(<UserForm {...mockProps} loading={true} />);
      const spinner = document.querySelector('.spinner-border');
      expect(spinner).toBeInTheDocument();
    });

    it('should not disable cancel button when loading', () => {
      render(<UserForm {...mockProps} loading={true} />);

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      expect(cancelButton).not.toBeDisabled();
    });
  });

  describe('Button text', () => {
    it('should show "Create User" button text when not editing', () => {
      render(<UserForm {...mockProps} />);
      expect(screen.getByRole('button', { name: /create user/i })).toBeInTheDocument();
    });

    it('should show "Update User" button text when editing', () => {
      const editingUser: User = {
        id: 1,
        name: 'John',
        email: 'john@example.com',
        role: 'Admin',
        status: 'active',
      };
      render(<UserForm {...mockProps} editingUser={editingUser} />);
      expect(screen.getByRole('button', { name: /update user/i })).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper form structure', () => {
      render(<UserForm {...mockProps} />);
      const form = screen.getByRole('button', { name: /create user/i }).closest('form');
      expect(form).toBeInTheDocument();
    });

    it('should have labels associated with inputs', () => {
      render(<UserForm {...mockProps} />);

      const nameInput = screen.getByLabelText(/name/i);
      expect(nameInput).toHaveAttribute('type', 'text');

      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('should have placeholder text', () => {
      render(<UserForm {...mockProps} />);

      expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
    });

    it('should have submit button type', () => {
      render(<UserForm {...mockProps} />);
      const submitButton = screen.getByRole('button', { name: /create user/i });
      expect(submitButton).toHaveAttribute('type', 'submit');
    });

    it('should have button type for cancel', () => {
      render(<UserForm {...mockProps} />);
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      expect(cancelButton).toHaveAttribute('type', 'button');
    });
  });
});
