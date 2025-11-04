import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Logo from './Logo';

describe('Logo', () => {
  it('renders without crashing', () => {
    render(<Logo />);
    expect(screen.getByAltText(/YAET logo/i)).toBeInTheDocument();
  });
});
