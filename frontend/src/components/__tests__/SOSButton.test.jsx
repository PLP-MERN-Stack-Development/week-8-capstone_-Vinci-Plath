import { render, screen, fireEvent } from '@testing-library/react';
import SOSButton from '../SOSButton';

const mockOnSOS = jest.fn();
const mockOnCancel = jest.fn();

const defaultProps = {
  isActive: false,
  onSOS: mockOnSOS,
  onCancel: mockOnCancel,
  countdown: 0,
};

describe('SOSButton Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the SOS button in inactive state', () => {
    render(<SOSButton {...defaultProps} />);
    const button = screen.getByRole('button', { name: /SOS/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-red-500');
  });

  it('calls onSOS when clicked in inactive state', () => {
    render(<SOSButton {...defaultProps} />);
    const button = screen.getByRole('button', { name: /SOS/i });
    fireEvent.click(button);
    expect(mockOnSOS).toHaveBeenCalledTimes(1);
  });

  it('renders in active state with countdown', () => {
    render(<SOSButton {...defaultProps} isActive={true} countdown={5} />);
    expect(screen.getByText(/5/)).toBeInTheDocument();
    expect(screen.getByText(/Cancel/)).toBeInTheDocument();
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(<SOSButton {...defaultProps} isActive={true} countdown={5} />);
    const cancelButton = screen.getByText(/Cancel/);
    fireEvent.click(cancelButton);
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });
});
