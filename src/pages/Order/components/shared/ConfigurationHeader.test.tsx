import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import { ConfigurationHeader } from './ConfigurationHeader';
import { Camera } from 'lucide-react';
import { axe } from 'jest-axe';

describe('ConfigurationHeader', () => {
  const defaultProps = {
    icon: Camera,
    title: 'Select Package',
    description: 'Choose the photography package that fits your needs',
  };

  it('renders title correctly', () => {
    render(<ConfigurationHeader {...defaultProps} />);
    expect(screen.getByText('Select Package')).toBeInTheDocument();
  });

  it('renders description correctly', () => {
    render(<ConfigurationHeader {...defaultProps} />);
    expect(screen.getByText(/Choose the photography package/)).toBeInTheDocument();
  });

  it('renders icon with correct styling', () => {
    const { container } = render(<ConfigurationHeader {...defaultProps} />);
    
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('w-10', 'h-10', 'text-primary');
  });

  it('renders icon container with correct size', () => {
    const { container } = render(<ConfigurationHeader {...defaultProps} />);
    
    const iconContainer = container.querySelector('.w-20.h-20');
    expect(iconContainer).toBeInTheDocument();
  });

  it('applies custom className to wrapper', () => {
    const { container } = render(
      <ConfigurationHeader {...defaultProps} className="custom-wrapper" />
    );
    
    expect(container.querySelector('.custom-wrapper')).toBeInTheDocument();
  });

  it('applies custom iconClassName', () => {
    const { container } = render(
      <ConfigurationHeader {...defaultProps} iconClassName="custom-icon-class" />
    );
    
    const icon = container.querySelector('.custom-icon-class');
    expect(icon).toBeInTheDocument();
  });

  it('applies custom titleClassName', () => {
    const { container } = render(
      <ConfigurationHeader {...defaultProps} titleClassName="custom-title-class" />
    );
    
    expect(container.querySelector('.custom-title-class')).toBeInTheDocument();
  });

  it('applies custom descriptionClassName', () => {
    const { container } = render(
      <ConfigurationHeader {...defaultProps} descriptionClassName="custom-desc-class" />
    );
    
    expect(container.querySelector('.custom-desc-class')).toBeInTheDocument();
  });

  it('uses text-center layout', () => {
    const { container } = render(<ConfigurationHeader {...defaultProps} />);
    
    expect(container.querySelector('.text-center')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(<ConfigurationHeader {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<ConfigurationHeader {...defaultProps} />);
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });

  it('uses semantic heading tags', () => {
    render(<ConfigurationHeader {...defaultProps} />);
    
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Select Package');
  });
});
