import { render, screen, fireEvent } from '@testing-library/react';
import Settings from '../Settings';

describe('Settings Component', () => {
  const mockSettings = {
    theme: 'light',
    checkInInterval: 15,
    enableLocation: true
  };

  const mockOnUpdateSettings = jest.fn();
  const mockOnLogout = jest.fn();

  beforeEach(() => {
    render(
      <Settings 
        settings={mockSettings} 
        onUpdateSettings={mockOnUpdateSettings}
        onLogout={mockOnLogout}
      />
    );
  });

  it('renders all settings sections', () => {
    expect(screen.getByText('Theme')).toBeInTheDocument();
    expect(screen.getByText('Check-in Interval')).toBeInTheDocument();
    expect(screen.getByText('Location Services')).toBeInTheDocument();
  });

  it('allows changing theme', () => {
    const themeSelect = screen.getByLabelText('Theme');
    fireEvent.change(themeSelect, { target: { value: 'dark' } });
    
    // Verify the callback was called with the new theme
    expect(mockOnUpdateSettings).toHaveBeenCalledWith({
      ...mockSettings,
      theme: 'dark'
    });
  });

  it('allows changing check-in interval', () => {
    const intervalInput = screen.getByLabelText('Check-in Interval (minutes)');
    fireEvent.change(intervalInput, { target: { value: '30' } });
    
    // Verify the callback was called with the new interval
    expect(mockOnUpdateSettings).toHaveBeenCalledWith({
      ...mockSettings,
      checkInInterval: 30
    });
  });

  it('calls onLogout when logout button is clicked', () => {
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);
    expect(mockOnLogout).toHaveBeenCalled();
  });
});
