import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import { PhotographyHeader } from './PhotographyHeader';
import { axe } from 'jest-axe';

describe('PhotographyHeader', () => {
  it('renders the title correctly', () => {
    render(<PhotographyHeader />);
    
    expect(screen.getByText('Wählen Sie Ihr Fotografie-Paket')).toBeInTheDocument();
  });

  it('renders the description correctly', () => {
    render(<PhotographyHeader />);
    
    expect(
      screen.getByText('Professionelle Immobilienfotografie für aussagekräftige Exposés')
    ).toBeInTheDocument();
  });

  it('renders the camera icon', () => {
    const { container } = render(<PhotographyHeader />);
    
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('applies correct icon styling', () => {
    const { container } = render(<PhotographyHeader />);
    
    const icon = container.querySelector('.text-primary');
    expect(icon).toBeInTheDocument();
  });

  it('uses centered text layout', () => {
    const { container } = render(<PhotographyHeader />);
    
    expect(container.querySelector('.text-center')).toBeInTheDocument();
  });

  it('renders heading with correct size', () => {
    render(<PhotographyHeader />);
    
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveClass('text-4xl');
  });

  it('renders description with muted styling', () => {
    const { container } = render(<PhotographyHeader />);
    
    const description = container.querySelector('.text-muted-foreground');
    expect(description).toBeInTheDocument();
  });

  it('icon container has correct dimensions', () => {
    const { container } = render(<PhotographyHeader />);
    
    const iconContainer = container.querySelector('.w-20.h-20');
    expect(iconContainer).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(<PhotographyHeader />);
    expect(container).toMatchSnapshot();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<PhotographyHeader />);
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });

  it('uses semantic HTML structure', () => {
    render(<PhotographyHeader />);
    
    const heading = screen.getByRole('heading');
    expect(heading.tagName).toBe('H2');
  });
});
