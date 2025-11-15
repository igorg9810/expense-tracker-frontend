import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AuthLayout from './AuthLayout';

// Mock react-router-dom Outlet
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Outlet: jest.fn(() => <div data-testid="outlet">Route Content</div>),
}));

const renderAuthLayout = (children?: React.ReactNode) => {
  return render(
    <BrowserRouter>
      <AuthLayout>{children}</AuthLayout>
    </BrowserRouter>,
  );
};

describe('AuthLayout', () => {
  it('renders the auth layout with branding section', () => {
    renderAuthLayout();

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('ExpenseTracker');
    expect(screen.getByText('Take control of your finances')).toBeInTheDocument();
    expect(screen.getByText(/track expenses, set budgets/i)).toBeInTheDocument();
  });

  it('displays logo and logo icon', () => {
    renderAuthLayout();

    expect(screen.getAllByText('💰')[0]).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('ExpenseTracker');
  });

  it('shows feature highlights', () => {
    renderAuthLayout();

    expect(screen.getByText('Detailed Analytics')).toBeInTheDocument();
    expect(screen.getByText('Secure & Private')).toBeInTheDocument();
    expect(screen.getByText('Mobile Friendly')).toBeInTheDocument();

    expect(screen.getByText('📊')).toBeInTheDocument();
    expect(screen.getByText('🔒')).toBeInTheDocument();
    expect(screen.getByText('📱')).toBeInTheDocument();
  });

  it('renders the Outlet component for nested routes', () => {
    renderAuthLayout();

    expect(screen.getByTestId('outlet')).toBeInTheDocument();
    expect(screen.getByText('Route Content')).toBeInTheDocument();
  });

  it('renders children when provided instead of Outlet', () => {
    const TestChild = () => <div>Test Child Component</div>;

    renderAuthLayout(<TestChild />);

    expect(screen.getByText('Test Child Component')).toBeInTheDocument();
    // Should NOT render the outlet when children are provided
    expect(screen.queryByTestId('outlet')).not.toBeInTheDocument();
  });

  it('has proper layout structure with CSS classes', () => {
    const { container } = renderAuthLayout();

    // Check for main container
    const mainContainer = container.querySelector('.container');
    expect(mainContainer).toBeInTheDocument();

    // Check for background elements
    expect(container.querySelector('.background')).toBeInTheDocument();
    expect(container.querySelector('.backgroundPattern')).toBeInTheDocument();

    // Check for content areas
    expect(container.querySelector('.content')).toBeInTheDocument();
    expect(container.querySelector('.brandingSection')).toBeInTheDocument();
    expect(container.querySelector('.formSection')).toBeInTheDocument();
  });

  it('displays hero content correctly', () => {
    renderAuthLayout();

    const heroTitle = screen.getByText('Take control of your finances');
    const heroDescription = screen.getByText(/track expenses, set budgets/i);

    expect(heroTitle).toBeInTheDocument();
    expect(heroDescription).toBeInTheDocument();
  });

  it('renders all feature items with icons and text', () => {
    renderAuthLayout();

    const features = [
      { icon: '📊', text: 'Detailed Analytics' },
      { icon: '🔒', text: 'Secure & Private' },
      { icon: '📱', text: 'Mobile Friendly' },
    ];

    features.forEach((feature) => {
      expect(screen.getByText(feature.icon)).toBeInTheDocument();
      expect(screen.getByText(feature.text)).toBeInTheDocument();
    });
  });

  it('maintains proper semantic structure', () => {
    renderAuthLayout();

    // Check for proper heading hierarchy
    const mainHeading = screen.getByRole('heading', { level: 1 });
    const subHeading = screen.getByRole('heading', { level: 2 });

    expect(mainHeading).toHaveTextContent('ExpenseTracker');
    expect(subHeading).toHaveTextContent('Take control of your finances');
  });

  it('renders without children', () => {
    renderAuthLayout();

    // Should still render the basic layout structure
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('ExpenseTracker');
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  it('handles responsive design elements', () => {
    const { container } = renderAuthLayout();

    // Check that branding section exists (would be hidden on mobile via CSS)
    const brandingSection = container.querySelector('.brandingSection');
    expect(brandingSection).toBeInTheDocument();

    // Check that form section exists for the main content
    const formSection = container.querySelector('.formSection');
    expect(formSection).toBeInTheDocument();
  });
});
