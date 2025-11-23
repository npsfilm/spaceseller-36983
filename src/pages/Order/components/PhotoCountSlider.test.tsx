import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/utils';
import { PhotoCountSlider } from './PhotoCountSlider';
import { axe } from 'jest-axe';

describe('PhotoCountSlider', () => {
  const mockOnChange = vi.fn();

  it('renders current photo count', () => {
    render(<PhotoCountSlider photoCount={15} onPhotoCountChange={mockOnChange} />);
    
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('displays photo count in a badge', () => {
    const { container } = render(
      <PhotoCountSlider photoCount={20} onPhotoCountChange={mockOnChange} />
    );
    
    const badge = container.querySelector('.rounded-full');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('20');
  });

  it('uses primary color for badge', () => {
    const { container } = render(
      <PhotoCountSlider photoCount={10} onPhotoCountChange={mockOnChange} />
    );
    
    const badge = container.querySelector('.bg-primary');
    expect(badge).toBeInTheDocument();
  });

  it('renders slider component', () => {
    const { container } = render(
      <PhotoCountSlider photoCount={25} onPhotoCountChange={mockOnChange} />
    );
    
    const slider = container.querySelector('[role="slider"]');
    expect(slider).toBeInTheDocument();
  });

  it('has correct layout structure', () => {
    const { container } = render(
      <PhotoCountSlider photoCount={30} onPhotoCountChange={mockOnChange} />
    );
    
    const wrapper = container.querySelector('.max-w-2xl');
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveClass('flex', 'items-center', 'gap-4');
  });

  it('matches snapshot', () => {
    const { container } = render(
      <PhotoCountSlider photoCount={12} onPhotoCountChange={mockOnChange} />
    );
    expect(container).toMatchSnapshot();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <PhotoCountSlider photoCount={18} onPhotoCountChange={mockOnChange} />
    );
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });

  it('handles minimum value', () => {
    render(<PhotoCountSlider photoCount={6} onPhotoCountChange={mockOnChange} />);
    expect(screen.getByText('6')).toBeInTheDocument();
  });

  it('handles maximum value', () => {
    render(<PhotoCountSlider photoCount={50} onPhotoCountChange={mockOnChange} />);
    expect(screen.getByText('50')).toBeInTheDocument();
  });

  it('slider has correct aria attributes', () => {
    const { container } = render(
      <PhotoCountSlider photoCount={25} onPhotoCountChange={mockOnChange} />
    );
    
    const slider = container.querySelector('[role="slider"]');
    expect(slider).toHaveAttribute('aria-valuemin');
    expect(slider).toHaveAttribute('aria-valuemax');
    expect(slider).toHaveAttribute('aria-valuenow');
  });
});
