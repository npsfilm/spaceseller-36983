import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils';
import { ConfigurationActions } from './ConfigurationActions';
import { axe } from 'jest-axe';

describe('ConfigurationActions', () => {
  it('renders back button when onBack is provided', () => {
    render(<ConfigurationActions onBack={() => {}} onNext={() => {}} />);
    
    expect(screen.getByText('Zurück')).toBeInTheDocument();
  });

  it('does not render back button when onBack is not provided', () => {
    render(<ConfigurationActions onNext={() => {}} />);
    
    expect(screen.queryByText('Zurück')).not.toBeInTheDocument();
  });

  it('renders next button when onNext is provided', () => {
    render(<ConfigurationActions onNext={() => {}} />);
    
    expect(screen.getByText('Weiter')).toBeInTheDocument();
  });

  it('renders submit button when onSubmit is provided', () => {
    render(<ConfigurationActions onSubmit={() => {}} />);
    
    expect(screen.getByText('Bestellung aufgeben')).toBeInTheDocument();
  });

  it('calls onBack when back button is clicked', () => {
    const handleBack = vi.fn();
    render(<ConfigurationActions onBack={handleBack} onNext={() => {}} />);
    
    fireEvent.click(screen.getByText('Zurück'));
    expect(handleBack).toHaveBeenCalled();
  });

  it('calls onNext when next button is clicked', () => {
    const handleNext = vi.fn();
    render(<ConfigurationActions onNext={handleNext} />);
    
    fireEvent.click(screen.getByText('Weiter'));
    expect(handleNext).toHaveBeenCalled();
  });

  it('calls onSubmit when submit button is clicked', () => {
    const handleSubmit = vi.fn();
    render(<ConfigurationActions onSubmit={handleSubmit} />);
    
    fireEvent.click(screen.getByText('Bestellung aufgeben'));
    expect(handleSubmit).toHaveBeenCalled();
  });

  it('disables next button when disableNext is true', () => {
    render(<ConfigurationActions onNext={() => {}} disableNext />);
    
    const button = screen.getByText('Weiter');
    expect(button).toBeDisabled();
  });

  it('disables submit button when disableSubmit is true', () => {
    render(<ConfigurationActions onSubmit={() => {}} disableSubmit />);
    
    const button = screen.getByText('Bestellung aufgeben');
    expect(button).toBeDisabled();
  });

  it('uses custom labels when provided', () => {
    render(
      <ConfigurationActions
        onBack={() => {}}
        onNext={() => {}}
        backLabel="Previous"
        nextLabel="Continue"
      />
    );
    
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Continue')).toBeInTheDocument();
  });

  it('uses custom submit label when provided', () => {
    render(
      <ConfigurationActions
        onSubmit={() => {}}
        submitLabel="Confirm Order"
      />
    );
    
    expect(screen.getByText('Confirm Order')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <ConfigurationActions onNext={() => {}} className="custom-class" />
    );
    
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });

  it('renders icons for buttons', () => {
    const { container } = render(
      <ConfigurationActions onBack={() => {}} onNext={() => {}} />
    );
    
    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThanOrEqual(2);
  });

  it('uses justify-between layout', () => {
    const { container } = render(
      <ConfigurationActions onNext={() => {}} />
    );
    
    expect(container.querySelector('.justify-between')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(
      <ConfigurationActions
        onBack={() => {}}
        onNext={() => {}}
        onSubmit={() => {}}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <ConfigurationActions onBack={() => {}} onNext={() => {}} />
    );
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });

  it('buttons are keyboard accessible', () => {
    render(<ConfigurationActions onBack={() => {}} onNext={() => {}} />);
    
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toBeInTheDocument();
    });
  });
});
