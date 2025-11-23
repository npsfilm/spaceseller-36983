import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils';
import { ConfigurationCard } from './ConfigurationCard';
import { axe } from 'jest-axe';

describe('ConfigurationCard', () => {
  it('renders children correctly', () => {
    render(
      <ConfigurationCard>
        <div>Test Content</div>
      </ConfigurationCard>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <ConfigurationCard className="custom-class">
        <div>Content</div>
      </ConfigurationCard>
    );
    
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });

  it('applies selected styles when selected', () => {
    const { container } = render(
      <ConfigurationCard selected>
        <div>Content</div>
      </ConfigurationCard>
    );
    
    const card = container.querySelector('.border-primary');
    expect(card).toBeInTheDocument();
  });

  it('calls onClick when clicked and not disabled', () => {
    const handleClick = vi.fn();
    render(
      <ConfigurationCard onClick={handleClick}>
        <div>Content</div>
      </ConfigurationCard>
    );
    
    const card = screen.getByText('Content').closest('div');
    if (card?.parentElement) {
      fireEvent.click(card.parentElement);
      expect(handleClick).toHaveBeenCalled();
    }
  });

  it('does not call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(
      <ConfigurationCard onClick={handleClick} disabled>
        <div>Content</div>
      </ConfigurationCard>
    );
    
    const card = screen.getByText('Content').closest('div');
    if (card?.parentElement) {
      fireEvent.click(card.parentElement);
      expect(handleClick).not.toHaveBeenCalled();
    }
  });

  it('applies cursor-pointer when interactive', () => {
    const { container } = render(
      <ConfigurationCard onClick={() => {}}>
        <div>Content</div>
      </ConfigurationCard>
    );
    
    expect(container.querySelector('.cursor-pointer')).toBeInTheDocument();
  });

  it('applies cursor-not-allowed when disabled', () => {
    const { container } = render(
      <ConfigurationCard onClick={() => {}} disabled>
        <div>Content</div>
      </ConfigurationCard>
    );
    
    expect(container.querySelector('.cursor-not-allowed')).toBeInTheDocument();
  });

  it('applies hover styles when interactive', () => {
    const { container } = render(
      <ConfigurationCard onClick={() => {}}>
        <div>Content</div>
      </ConfigurationCard>
    );
    
    expect(container.querySelector('.hover\\:shadow-lg')).toBeInTheDocument();
  });

  it('applies opacity when disabled', () => {
    const { container } = render(
      <ConfigurationCard disabled>
        <div>Content</div>
      </ConfigurationCard>
    );
    
    expect(container.querySelector('.opacity-50')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(
      <ConfigurationCard selected>
        <div>Test Content</div>
      </ConfigurationCard>
    );
    expect(container).toMatchSnapshot();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <ConfigurationCard onClick={() => {}}>
        <div>Content</div>
      </ConfigurationCard>
    );
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
