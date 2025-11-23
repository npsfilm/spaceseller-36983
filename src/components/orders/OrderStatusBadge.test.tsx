import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import { OrderStatusBadge } from './OrderStatusBadge';
import { axe } from 'jest-axe';

describe('OrderStatusBadge', () => {
  it('renders draft status correctly', () => {
    render(<OrderStatusBadge status="draft" />);
    expect(screen.getByText('Entwurf')).toBeInTheDocument();
  });

  it('renders submitted status correctly', () => {
    render(<OrderStatusBadge status="submitted" />);
    expect(screen.getByText('Eingereicht')).toBeInTheDocument();
  });

  it('renders in_progress status correctly', () => {
    render(<OrderStatusBadge status="in_progress" />);
    expect(screen.getByText('In Bearbeitung')).toBeInTheDocument();
  });

  it('renders completed status correctly', () => {
    render(<OrderStatusBadge status="completed" />);
    expect(screen.getByText('Abgeschlossen')).toBeInTheDocument();
  });

  it('renders delivered status correctly', () => {
    render(<OrderStatusBadge status="delivered" />);
    expect(screen.getByText('Geliefert')).toBeInTheDocument();
  });

  it('renders cancelled status correctly', () => {
    render(<OrderStatusBadge status="cancelled" />);
    expect(screen.getByText('Storniert')).toBeInTheDocument();
  });

  it('applies correct variant for each status', () => {
    const { rerender, container } = render(<OrderStatusBadge status="draft" />);
    expect(container.querySelector('.bg-secondary')).toBeInTheDocument();

    rerender(<OrderStatusBadge status="submitted" />);
    rerender(<OrderStatusBadge status="in_progress" />);
    rerender(<OrderStatusBadge status="completed" />);
    rerender(<OrderStatusBadge status="delivered" />);
    rerender(<OrderStatusBadge status="cancelled" />);
  });

  it('matches snapshot for all statuses', () => {
    const statuses = ['draft', 'submitted', 'in_progress', 'completed', 'delivered', 'cancelled'] as const;
    
    statuses.forEach(status => {
      const { container } = render(<OrderStatusBadge status={status} />);
      expect(container).toMatchSnapshot();
    });
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<OrderStatusBadge status="submitted" />);
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
