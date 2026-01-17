import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CRUDOverview from './CRUDOverview';

describe('CRUDOverview', () => {
  describe('Rendering', () => {
    it('should render component', () => {
      render(<CRUDOverview />);
      expect(screen.getByText('CRUD Operations Overview')).toBeInTheDocument();
    });

    it('should display Create section', () => {
      render(<CRUDOverview />);
      expect(screen.getByText('Create')).toBeInTheDocument();
      expect(screen.getByText('Add new users with the form above')).toBeInTheDocument();
    });

    it('should display Read section', () => {
      render(<CRUDOverview />);
      expect(screen.getByText('Read')).toBeInTheDocument();
      expect(screen.getByText('View all users in the table')).toBeInTheDocument();
    });

    it('should display Update section', () => {
      render(<CRUDOverview />);
      expect(screen.getByText('Update')).toBeInTheDocument();
      expect(screen.getByText('Edit users or toggle their status')).toBeInTheDocument();
    });

    it('should display Delete section', () => {
      render(<CRUDOverview />);
      expect(screen.getByText('Delete')).toBeInTheDocument();
      expect(screen.getByText('Remove users with confirmation')).toBeInTheDocument();
    });
  });

  describe('Layout', () => {
    it('should use card layout', () => {
      const { container } = render(<CRUDOverview />);
      const card = container.querySelector('.card');
      expect(card).toBeInTheDocument();
    });

    it('should have card header', () => {
      const { container } = render(<CRUDOverview />);
      const cardHeader = container.querySelector('.card-header');
      expect(cardHeader).toBeInTheDocument();
    });

    it('should have card body', () => {
      const { container } = render(<CRUDOverview />);
      const cardBody = container.querySelector('.card-body');
      expect(cardBody).toBeInTheDocument();
    });

    it('should use row layout for sections', () => {
      const { container } = render(<CRUDOverview />);
      const row = container.querySelector('.row');
      expect(row).toBeInTheDocument();
    });

    it('should have equal width columns', () => {
      const { container } = render(<CRUDOverview />);
      const columns = container.querySelectorAll('.col-md-3');
      expect(columns).toHaveLength(4);
    });
  });

  describe('Content', () => {
    it('should display all CRUD operations', () => {
      render(<CRUDOverview />);

      const operations = ['Create', 'Read', 'Update', 'Delete'];
      operations.forEach((operation) => {
        expect(screen.getByText(operation)).toBeInTheDocument();
      });
    });

    it('should use heading tags for operation names', () => {
      render(<CRUDOverview />);

      const createHeading = screen.getByText('Create');
      expect(createHeading.tagName).toBe('H6');
    });

    it('should display descriptions with muted text', () => {
      const { container } = render(<CRUDOverview />);
      const descriptions = container.querySelectorAll('.text-muted');
      expect(descriptions.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('Accessibility', () => {
    it('should use semantic HTML', () => {
      render(<CRUDOverview />);

      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);
    });

    it('should have descriptive text for each operation', () => {
      render(<CRUDOverview />);

      expect(screen.getByText(/Add new users/)).toBeInTheDocument();
      expect(screen.getByText(/View all users/)).toBeInTheDocument();
      expect(screen.getByText(/Edit users/)).toBeInTheDocument();
      expect(screen.getByText(/Remove users/)).toBeInTheDocument();
    });
  });

  describe('Snapshot', () => {
    it('should render consistently', () => {
      const { container } = render(<CRUDOverview />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
