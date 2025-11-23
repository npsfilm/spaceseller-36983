import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils';
import { OrderCard } from './OrderCard';
import { axe } from 'jest-axe';

describe('OrderCard', () => {
  const mockOrder = {
    id: '123',
    order_number: 'SS-2025-0001',
    created_at: '2025-01-15T10:00:00Z',
    status: 'submitted' as const,
    total_amount: 299.99,
    delivery_deadline: '2025-01-20T10:00:00Z',
    special_instructions: null,
    updated_at: '2025-01-15T10:00:00Z',
    user_id: 'user123',
  };

  it('renders order card with correct data', () => {
    render(<OrderCard order={mockOrder} />);
    
    expect(screen.getByText('SS-2025-0001')).toBeInTheDocument();
    expect(screen.getByText(/299,99/)).toBeInTheDocument();
  });

  it('displays formatted date correctly', () => {
    render(<OrderCard order={mockOrder} />);
    
    expect(screen.getByText(/15\.01\.2025/)).toBeInTheDocument();
  });

  it('renders order status badge', () => {
    render(<OrderCard order={mockOrder} />);
    
    expect(screen.getByText('Eingereicht')).toBeInTheDocument();
  });

  it('shows delivery deadline when available', () => {
    render(<OrderCard order={mockOrder} />);
    
    expect(screen.getByText(/Lieferung:/)).toBeInTheDocument();
    expect(screen.getByText(/20\.01\.2025/)).toBeInTheDocument();
  });

  it('renders with proper styling', () => {
    const { container } = render(<OrderCard order={mockOrder} />);
    
    const card = container.querySelector('.hover\\:shadow-lg');
    expect(card).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(<OrderCard order={mockOrder} />);
    expect(container).toMatchSnapshot();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<OrderCard order={mockOrder} />);
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });

  it('handles missing delivery deadline gracefully', () => {
    const orderWithoutDeadline = { ...mockOrder, delivery_deadline: null };
    render(<OrderCard order={orderWithoutDeadline} />);
    
    expect(screen.queryByText(/Lieferung:/)).not.toBeInTheDocument();
  });

  it('formats large amounts correctly', () => {
    const expensiveOrder = { ...mockOrder, total_amount: 9999.99 };
    render(<OrderCard order={expensiveOrder} />);
    
    expect(screen.getByText(/9\.999,99/)).toBeInTheDocument();
  });
});
