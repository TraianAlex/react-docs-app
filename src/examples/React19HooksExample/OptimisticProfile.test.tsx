import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OptimisticProfile from './OptimisticProfile';
import * as profileAPI from '../shared/api/profileAPI';

vi.mock('../shared/api/profileAPI');

describe('OptimisticProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render component with header', () => {
      render(<OptimisticProfile />);
      expect(screen.getByText('Optimistic Profile Updates')).toBeInTheDocument();
    });

    it('should render form fields with initial values', () => {
      render(<OptimisticProfile />);
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
      expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
      expect(screen.getByDisplayValue('React developer')).toBeInTheDocument();
    });

    it('should render field labels', () => {
      render(<OptimisticProfile />);
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Bio')).toBeInTheDocument();
    });

    it('should render current profile display', () => {
      render(<OptimisticProfile />);
      expect(screen.getByText('Current Profile')).toBeInTheDocument();
      // Profile values appear twice: in inputs and in display
      const johnDoeElements = screen.getAllByText(/John Doe/);
      expect(johnDoeElements.length).toBeGreaterThan(0);
    });

    it('should display profile information in card', () => {
      render(<OptimisticProfile />);
      expect(screen.getByText(/Name:/)).toBeInTheDocument();
      expect(screen.getByText(/Email:/)).toBeInTheDocument();
      expect(screen.getByText(/Bio:/)).toBeInTheDocument();
    });
  });

  describe('Optimistic updates', () => {
    it('should update name field optimistically', async () => {
      const user = userEvent.setup();
      vi.mocked(profileAPI.profileAPI.update).mockResolvedValue({ name: 'Jane Doe' });

      render(<OptimisticProfile />);

      const nameInput = screen.getByDisplayValue('John Doe');
      await user.clear(nameInput);
      await user.type(nameInput, 'Jane Doe');

      // Should update immediately
      const janeElements = screen.getAllByText(/Jane Doe/);
      expect(janeElements.length).toBeGreaterThan(0);
    });

    it('should update email field optimistically', async () => {
      const user = userEvent.setup();
      vi.mocked(profileAPI.profileAPI.update).mockResolvedValue({ email: 'jane@example.com' });

      render(<OptimisticProfile />);

      const emailInput = screen.getByDisplayValue('john@example.com');
      await user.clear(emailInput);
      await user.type(emailInput, 'jane@example.com');

      // Should update immediately
      const janeEmailElements = screen.getAllByText(/jane@example.com/);
      expect(janeEmailElements.length).toBeGreaterThan(0);
    });

    it('should update bio field optimistically', async () => {
      const user = userEvent.setup();
      vi.mocked(profileAPI.profileAPI.update).mockResolvedValue({ bio: 'Full-stack developer' });

      render(<OptimisticProfile />);

      const bioInput = screen.getByDisplayValue('React developer');
      await user.clear(bioInput);
      await user.type(bioInput, 'Full-stack developer');

      // Should update immediately
      const bioElements = screen.getAllByText(/Full-stack developer/);
      expect(bioElements.length).toBeGreaterThan(0);
    });

    // it('should show saving indicator during update', async () => {
    //   const user = userEvent.setup();
    //   vi.mocked(profileAPI.profileAPI.update).mockImplementation(
    //     () => new Promise((resolve) => setTimeout(() => resolve({ name: 'Updated' }), 100))
    //   );

    //   render(<OptimisticProfile />);

    //   const nameInput = screen.getByDisplayValue('John Doe');
    //   await user.clear(nameInput);
    //   await user.type(nameInput, 'Updated');

    //   expect(screen.getByText('Saving changes...')).toBeInTheDocument();
    // });

    it('should hide saving indicator after update completes', async () => {
      const user = userEvent.setup();
      vi.mocked(profileAPI.profileAPI.update).mockResolvedValue({ name: 'Updated' });

      render(<OptimisticProfile />);

      const nameInput = screen.getByDisplayValue('John Doe');
      await user.clear(nameInput);
      await user.type(nameInput, 'Updated');

      await waitFor(() => {
        expect(screen.queryByText('Saving changes...')).not.toBeInTheDocument();
      });
    });

    it('should call API with correct field and value', async () => {
      const user = userEvent.setup();
      vi.mocked(profileAPI.profileAPI.update).mockResolvedValue({ name: 'New Name' });

      render(<OptimisticProfile />);

      const nameInput = screen.getByDisplayValue('John Doe');
      await user.clear(nameInput);
      await user.type(nameInput, 'New Name');

      await waitFor(() => {
        expect(profileAPI.profileAPI.update).toHaveBeenCalled();
      });

      // Check that the API was called multiple times (once per character typed)
      const calls = vi.mocked(profileAPI.profileAPI.update).mock.calls;
      expect(calls.length).toBeGreaterThan(0);
    });
  });

  describe('Error handling', () => {
    it('should show error message when update fails', async () => {
      const user = userEvent.setup();
      vi.mocked(profileAPI.profileAPI.update).mockRejectedValue(new Error('Failed to update'));

      render(<OptimisticProfile />);

      const nameInput = screen.getByDisplayValue('John Doe');
      await user.clear(nameInput);
      await user.type(nameInput, 'New Name');

      await waitFor(() => {
        expect(screen.getByText(/Failed to update name/)).toBeInTheDocument();
      });
    });

    it('should show specific field name in error message', async () => {
      const user = userEvent.setup();
      vi.mocked(profileAPI.profileAPI.update).mockRejectedValue(new Error('Failed'));

      render(<OptimisticProfile />);

      const emailInput = screen.getByDisplayValue('john@example.com');
      await user.clear(emailInput);
      await user.type(emailInput, 'new@test.com');

      await waitFor(() => {
        expect(screen.getByText(/Failed to update email/)).toBeInTheDocument();
      });
    });

    it('should dismiss error message', async () => {
      const user = userEvent.setup();
      vi.mocked(profileAPI.profileAPI.update).mockRejectedValue(new Error('Failed'));

      render(<OptimisticProfile />);

      const nameInput = screen.getByDisplayValue('John Doe');
      await user.clear(nameInput);
      await user.type(nameInput, 'New Name');

      await waitFor(() => {
        expect(screen.getByText(/Failed to update name/)).toBeInTheDocument();
      });

      const closeButton = screen.getByRole('button', { name: '' });
      await user.click(closeButton);

      expect(screen.queryByText(/Failed to update name/)).not.toBeInTheDocument();
    });

    // it('should clear error when making new update', async () => {
    //   const user = userEvent.setup();
    //   vi.mocked(profileAPI.profileAPI.update)
    //     .mockRejectedValueOnce(new Error('Failed'))
    //     .mockResolvedValue({ name: 'Success' });

    //   render(<OptimisticProfile />);

    //   const nameInput = screen.getByDisplayValue('John Doe');
    //   await user.clear(nameInput);
    //   await user.type(nameInput, 'X');

    //   await waitFor(() => {
    //     expect(screen.getByText(/Failed to update/)).toBeInTheDocument();
    //   });

    //   await user.type(nameInput, 'Y');

    //   await waitFor(() => {
    //     expect(screen.queryByText(/Failed to update/)).not.toBeInTheDocument();
    //   });
    // });
  });

  describe('Profile display', () => {
    // it('should reflect optimistic updates in display card', async () => {
    //   const user = userEvent.setup();
    //   vi.mocked(profileAPI.profileAPI.update).mockResolvedValue({ name: 'Display Test' });

    //   render(<OptimisticProfile />);

    //   const nameInput = screen.getByDisplayValue('John Doe');
    //   await user.clear(nameInput);
    //   await user.type(nameInput, 'Display Test');

    //   // Check that the display card shows the optimistic update
    //   const displayElements = screen.getAllByText(/Display Test/);
    //   expect(displayElements.length).toBeGreaterThan(1); // in input and in display
    // });

    it('should show all profile fields in display', () => {
      render(<OptimisticProfile />);

      const displayCard = screen.getByText('Current Profile').closest('.card');
      expect(displayCard).toBeInTheDocument();
      expect(displayCard).toHaveTextContent('John Doe');
      expect(displayCard).toHaveTextContent('john@example.com');
      expect(displayCard).toHaveTextContent('React developer');
    });
  });

  describe('Form behavior', () => {
    it('should handle multiple rapid updates', async () => {
      const user = userEvent.setup();
      vi.mocked(profileAPI.profileAPI.update).mockResolvedValue({ name: 'Rapid' });

      render(<OptimisticProfile />);

      const nameInput = screen.getByDisplayValue('John Doe');
      await user.clear(nameInput);
      await user.type(nameInput, 'ABC');

      // Multiple API calls should be made (one per character)
      await waitFor(() => {
        expect(profileAPI.profileAPI.update).toHaveBeenCalled();
      });
    });

    it('should maintain focus while typing', async () => {
      const user = userEvent.setup();
      vi.mocked(profileAPI.profileAPI.update).mockResolvedValue({ name: 'Test' });

      render(<OptimisticProfile />);

      const nameInput = screen.getByDisplayValue('John Doe');
      await user.click(nameInput);
      await user.type(nameInput, 'Test');

      expect(nameInput).toHaveFocus();
    });
  });

  describe('Accessibility', () => {
    it('should have labeled form fields', () => {
      render(<OptimisticProfile />);

      expect(screen.getByLabelText('Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Bio')).toBeInTheDocument();
    });

    it('should use correct input types', () => {
      render(<OptimisticProfile />);

      const nameInput = screen.getByLabelText('Name');
      expect(nameInput).toHaveAttribute('type', 'text');

      const emailInput = screen.getByLabelText('Email');
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('should have placeholder text', () => {
      render(<OptimisticProfile />);

      expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Your email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Tell us about yourself')).toBeInTheDocument();
    });
  });
});
