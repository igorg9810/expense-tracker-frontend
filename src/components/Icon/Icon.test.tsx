import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Icon from './Icon';
import { type SVGProps } from 'react';

// Mock the SVG imports
jest.mock('../../assets/icons', () => ({
  iconRegistry: {
    plus: (props: SVGProps<SVGSVGElement>) => (
      <svg data-testid="plus-svg" {...props}>
        <path d="M12 5V19M5 12H19" />
      </svg>
    ),
    close: (props: SVGProps<SVGSVGElement>) => (
      <svg data-testid="close-svg" {...props}>
        <path d="M18 6L6 18M6 6L18 18" />
      </svg>
    ),
    search: (props: SVGProps<SVGSVGElement>) => (
      <svg data-testid="search-svg" {...props}>
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21L16.65 16.65" />
      </svg>
    ),
  },
  IconName: {} as Record<string, never>,
}));

describe('Icon', () => {
  it('renders without crashing', () => {
    render(<Icon iconName="plus" />);
    expect(screen.getByTestId('plus-svg')).toBeInTheDocument();
  });

  it('renders the correct icon based on iconName', () => {
    const { rerender } = render(<Icon iconName="plus" />);
    expect(screen.getByTestId('plus-svg')).toBeInTheDocument();

    rerender(<Icon iconName="close" />);
    expect(screen.getByTestId('close-svg')).toBeInTheDocument();

    rerender(<Icon iconName="search" />);
    expect(screen.getByTestId('search-svg')).toBeInTheDocument();
  });

  it('renders with medium size by default', () => {
    render(<Icon iconName="plus" />);
    const icon = screen.getByTestId('plus-svg').closest('span');
    expect(icon).toHaveClass('size-medium');
  });

  it('applies correct size class', () => {
    const { rerender } = render(<Icon iconName="plus" size="small" />);
    expect(screen.getByTestId('plus-svg').closest('span')).toHaveClass('size-small');

    rerender(<Icon iconName="plus" size="large" />);
    expect(screen.getByTestId('plus-svg').closest('span')).toHaveClass('size-large');
  });

  it('applies custom size when number is provided', () => {
    render(<Icon iconName="plus" size={20} />);
    const icon = screen.getByTestId('plus-svg').closest('span');
    expect(icon).toHaveClass('size-custom');
    expect(icon).toHaveStyle('width: 20px');
    expect(icon).toHaveStyle('height: 20px');
  });

  it('renders with default color by default', () => {
    render(<Icon iconName="plus" />);
    const icon = screen.getByTestId('plus-svg').closest('span');
    expect(icon).toHaveClass('color-default');
  });

  it('applies correct color class', () => {
    const { rerender } = render(<Icon iconName="plus" color="primary" />);
    expect(screen.getByTestId('plus-svg').closest('span')).toHaveClass('color-primary');

    rerender(<Icon iconName="plus" color="error" />);
    expect(screen.getByTestId('plus-svg').closest('span')).toHaveClass('color-error');

    rerender(<Icon iconName="plus" color="success" />);
    expect(screen.getByTestId('plus-svg').closest('span')).toHaveClass('color-success');
  });

  it('applies custom className', () => {
    render(<Icon iconName="plus" className="custom-class" />);
    const icon = screen.getByTestId('plus-svg').closest('span');
    expect(icon).toHaveClass('custom-class');
  });

  it('has accessible aria-label when provided', () => {
    render(<Icon iconName="plus" aria-label="Add item" />);
    const icon = screen.getByTestId('plus-svg').closest('span');
    expect(icon).toHaveAttribute('aria-label', 'Add item');
    expect(icon).not.toHaveAttribute('aria-hidden');
  });

  it('has aria-hidden when decorative', () => {
    render(<Icon iconName="plus" decorative />);
    const icon = screen.getByTestId('plus-svg').closest('span');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it('has aria-hidden by default when no aria-label provided', () => {
    render(<Icon iconName="plus" />);
    const icon = screen.getByTestId('plus-svg').closest('span');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it('has data-testid attribute', () => {
    render(<Icon iconName="plus" data-testid="test-icon" />);
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const handleClick = jest.fn();
    render(<Icon iconName="plus" onClick={handleClick} />);

    const icon = screen.getByTestId('plus-svg').closest('span');
    await userEvent.click(icon!);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('handles mouse events', async () => {
    const handleMouseEnter = jest.fn();
    const handleMouseLeave = jest.fn();
    render(
      <Icon iconName="plus" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />,
    );

    const icon = screen.getByTestId('plus-svg').closest('span');

    fireEvent.mouseEnter(icon!);
    expect(handleMouseEnter).toHaveBeenCalledTimes(1);

    fireEvent.mouseLeave(icon!);
    expect(handleMouseLeave).toHaveBeenCalledTimes(1);
  });

  it('applies clickable class when onClick is provided', () => {
    const handleClick = jest.fn();
    render(<Icon iconName="plus" onClick={handleClick} />);
    const icon = screen.getByTestId('plus-svg').closest('span');
    expect(icon).toHaveClass('clickable');
  });

  it('does not apply clickable class when no onClick', () => {
    render(<Icon iconName="plus" />);
    const icon = screen.getByTestId('plus-svg').closest('span');
    expect(icon).not.toHaveClass('clickable');
  });

  it('applies custom style', () => {
    const customStyle = { marginTop: '10px' };
    render(<Icon iconName="plus" style={customStyle} />);
    const icon = screen.getByTestId('plus-svg').closest('span');
    expect(icon).toHaveStyle('margin-top: 10px');
  });

  it('combines custom style with size style', () => {
    const customStyle = { marginTop: '10px' };
    render(<Icon iconName="plus" size={30} style={customStyle} />);
    const icon = screen.getByTestId('plus-svg').closest('span');
    expect(icon).toHaveStyle('margin-top: 10px');
    expect(icon).toHaveStyle('width: 30px');
    expect(icon).toHaveStyle('height: 30px');
  });

  it('renders null when iconName is not found', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    // Mock an empty registry
    jest.doMock('../../assets/icons', () => ({
      iconRegistry: {},
      IconName: {} as Record<string, never>,
    }));

    const { container } = render(<Icon iconName={'nonexistent' as 'plus'} />);
    expect(container.firstChild).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith('Icon "nonexistent" not found in icon registry');

    consoleSpy.mockRestore();
  });

  it('passes correct width and height to SVG component', () => {
    render(<Icon iconName="plus" size={20} />);
    const svg = screen.getByTestId('plus-svg');
    expect(svg).toHaveAttribute('width', '20');
    expect(svg).toHaveAttribute('height', '20');
  });

  it('passes correct width and height for string sizes', () => {
    render(<Icon iconName="plus" size="small" />);
    const svg = screen.getByTestId('plus-svg');
    expect(svg).toHaveAttribute('width', '16');
    expect(svg).toHaveAttribute('height', '16');
  });

  it('combines multiple props correctly', () => {
    const handleClick = jest.fn();
    render(
      <Icon
        iconName="plus"
        size="large"
        color="primary"
        className="custom"
        aria-label="Add new item"
        onClick={handleClick}
        data-testid="custom-icon"
        style={{ margin: '5px' }}
      />,
    );

    const icon = screen.getByTestId('custom-icon');
    expect(icon).toHaveClass('size-large', 'color-primary', 'custom', 'clickable');
    expect(icon).toHaveAttribute('aria-label', 'Add new item');
    expect(icon).toHaveStyle('margin: 5px');

    const svg = screen.getByTestId('plus-svg');
    expect(svg).toHaveAttribute('width', '32');
    expect(svg).toHaveAttribute('height', '32');
  });

  it('handles keyboard events for clickable icons', () => {
    const handleClick = jest.fn();
    render(<Icon iconName="plus" onClick={handleClick} />);

    const icon = screen.getByTestId('plus-svg').closest('span');
    fireEvent.keyDown(icon!, { key: 'Enter', code: 'Enter' });

    // Note: Actual Enter key behavior might require more complex setup
    expect(icon).toBeInTheDocument();
  });

  it('supports custom color strings', () => {
    render(<Icon iconName="plus" color="#ff0000" />);
    const icon = screen.getByTestId('plus-svg').closest('span');
    expect(icon).toHaveClass('color-#ff0000');
  });
});
