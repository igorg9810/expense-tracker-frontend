import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Loader from './Loader';

describe('Loader', () => {
  it('renders without crashing', () => {
    render(<Loader />);
    const container = document.querySelector('.table-loader-container');
    expect(container).toBeInTheDocument();
  });

  it('renders the correct number of rows by default', () => {
    render(<Loader />);
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(12);
  });

  it('renders custom number of rows', () => {
    render(<Loader rows={6} />);
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(6);
  });

  it('renders table headers', () => {
    render(<Loader />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
  });

  it('renders checkboxes in each row', () => {
    render(<Loader rows={3} />);
    const rows = screen.getAllByRole('row');
    rows.forEach((row) => {
      const checkboxes = row.querySelectorAll('.checkbox-placeholder');
      expect(checkboxes.length).toBeGreaterThan(0);
    });
  });

  it('renders avatar placeholders in each row', () => {
    render(<Loader rows={3} />);
    const avatars = document.querySelectorAll('.avatar-placeholder');
    expect(avatars).toHaveLength(3);
  });

  it('renders text placeholders in each row', () => {
    render(<Loader rows={3} />);
    const textPlaceholders = document.querySelectorAll('.text-placeholder');
    // Each row has 4 text placeholders (name, category, date, total)
    expect(textPlaceholders.length).toBe(12);
  });

  it('renders action icons in each row', () => {
    render(<Loader rows={3} />);
    const actionIcons = document.querySelectorAll('.action-icon');
    expect(actionIcons).toHaveLength(3);
  });

  it('applies custom className', () => {
    const customClass = 'custom-loader';
    render(<Loader className={customClass} />);
    const container = document.querySelector('.table-loader-container');
    expect(container).toHaveClass(customClass);
  });

  it('has accessible row labels', () => {
    render(<Loader rows={3} />);
    expect(screen.getByLabelText('Loading row 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Loading row 2')).toBeInTheDocument();
    expect(screen.getByLabelText('Loading row 3')).toBeInTheDocument();
  });
});
