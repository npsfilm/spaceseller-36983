import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import { StatCard } from './StatCard';
import { Package } from 'lucide-react';
import { axe } from 'jest-axe';

describe('StatCard', () => {
  const defaultProps = {
    title: 'Total Orders',
    value: 42,
    icon: Package,
    gradient: 'bg-gradient-to-br from-primary to-primary/80',
  };

  it('renders the stat card with correct values', () => {
    render(<StatCard {...defaultProps} />);
    
    expect(screen.getByText('Total Orders')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders with prefix for currency', () => {
    render(<StatCard {...defaultProps} value={1250.50} prefix="€" />);
    
    expect(screen.getByText(/€/)).toBeInTheDocument();
    expect(screen.getByText(/1\.250,50/)).toBeInTheDocument();
  });

  it('formats numbers with German locale', () => {
    render(<StatCard {...defaultProps} value={1000} />);
    
    expect(screen.getByText('1.000')).toBeInTheDocument();
  });

  it('renders icon with correct styling', () => {
    const { container } = render(<StatCard {...defaultProps} />);
    
    const iconContainer = container.querySelector('.bg-gradient-to-br');
    expect(iconContainer).toBeInTheDocument();
  });

  it('applies hover animation classes', () => {
    const { container } = render(<StatCard {...defaultProps} />);
    
    const card = container.querySelector('.group');
    expect(card).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(<StatCard {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<StatCard {...defaultProps} />);
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });

  it('handles zero value correctly', () => {
    render(<StatCard {...defaultProps} value={0} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('handles large numbers correctly', () => {
    render(<StatCard {...defaultProps} value={999999} />);
    expect(screen.getByText('999.999')).toBeInTheDocument();
  });
});
