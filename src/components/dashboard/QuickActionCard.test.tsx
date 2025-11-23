import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import { QuickActionCard } from './QuickActionCard';
import { ShoppingCart } from 'lucide-react';
import { axe } from 'jest-axe';

describe('QuickActionCard', () => {
  const defaultProps = {
    label: 'New Order',
    icon: ShoppingCart,
    href: '/order',
    gradient: 'from-primary to-primary/80',
  };

  it('renders the quick action card with correct label', () => {
    render(<QuickActionCard {...defaultProps} />);
    
    expect(screen.getByText('New Order')).toBeInTheDocument();
  });

  it('renders as a link with correct href', () => {
    render(<QuickActionCard {...defaultProps} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/order');
  });

  it('renders icon correctly', () => {
    const { container } = render(<QuickActionCard {...defaultProps} />);
    
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('applies gradient classes to button', () => {
    const { container } = render(<QuickActionCard {...defaultProps} />);
    
    const button = container.querySelector('.bg-gradient-to-r');
    expect(button).toBeInTheDocument();
  });

  it('renders with animation delay when index is provided', () => {
    const { container } = render(<QuickActionCard {...defaultProps} index={2} />);
    
    expect(container.firstChild).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(<QuickActionCard {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<QuickActionCard {...defaultProps} />);
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });

  it('button is keyboard accessible', () => {
    render(<QuickActionCard {...defaultProps} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });
});
