import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import { AssignmentStatsCards } from './AssignmentStatsCards';
import { axe } from 'jest-axe';

describe('AssignmentStatsCards', () => {
  const mockStats = {
    pending: 5,
    accepted: 12,
    completed: 34,
    declined: 2,
    total: 53,
  };

  it('renders all stat cards', () => {
    render(<AssignmentStatsCards stats={mockStats} />);
    
    expect(screen.getByText('Ausstehend')).toBeInTheDocument();
    expect(screen.getByText('Angenommen')).toBeInTheDocument();
    expect(screen.getByText('Abgeschlossen')).toBeInTheDocument();
    expect(screen.getByText('Abgelehnt')).toBeInTheDocument();
  });

  it('displays correct values for each stat', () => {
    render(<AssignmentStatsCards stats={mockStats} />);
    
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('34')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders correct icons for each stat', () => {
    const { container } = render(<AssignmentStatsCards stats={mockStats} />);
    
    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBe(4);
  });

  it('displays correct descriptions', () => {
    render(<AssignmentStatsCards stats={mockStats} />);
    
    expect(screen.getByText('Warten auf Ihre Antwort')).toBeInTheDocument();
    expect(screen.getByText('Aktive Aufträge')).toBeInTheDocument();
    expect(screen.getByText('Diesen Monat')).toBeInTheDocument();
    expect(screen.getByText('Gesamt')).toBeInTheDocument();
  });

  it('handles zero values correctly', () => {
    const zeroStats = { pending: 0, accepted: 0, completed: 0, declined: 0, total: 0 };
    render(<AssignmentStatsCards stats={zeroStats} />);
    
    const zeros = screen.getAllByText('0');
    expect(zeros.length).toBe(4);
  });

  it('uses responsive grid layout', () => {
    const { container } = render(<AssignmentStatsCards stats={mockStats} />);
    
    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('md:grid-cols-4');
  });

  it('matches snapshot', () => {
    const { container } = render(<AssignmentStatsCards stats={mockStats} />);
    expect(container).toMatchSnapshot();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<AssignmentStatsCards stats={mockStats} />);
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
