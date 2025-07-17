import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PinGate from '../components/PinGate';
import SOSButton from '../components/SOSButton';
import CheckinTimer from '../components/CheckinTimer';
import ContactList from '../components/ContactList';
import Journal from '../components/Journal';

// Mock localStorage for PinGate and Journal
beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

// --- PinGate ---
describe('PinGate', () => {
  it('sets a new PIN and security question', () => {
    const onSuccess = jest.fn();
    render(<PinGate onSuccess={onSuccess} />);
    fireEvent.change(screen.getByPlaceholderText(/new pin/i), { target: { value: '1234' } });
    fireEvent.change(screen.getByPlaceholderText(/security question/i), { target: { value: 'Pet?' } });
    fireEvent.change(screen.getByPlaceholderText(/answer/i), { target: { value: 'dog' } });
    fireEvent.click(screen.getByText(/set pin/i));
    expect(screen.getByText(/pin set/i)).toBeInTheDocument();
    // Should now show "Enter PIN"
    expect(screen.getByText(/enter pin/i)).toBeInTheDocument();
  });

  it('unlocks with correct PIN', () => {
    localStorage.setItem('app_pin', '1234');
    const onSuccess = jest.fn();
    render(<PinGate onSuccess={onSuccess} />);
    fireEvent.change(screen.getByPlaceholderText(/pin/i), { target: { value: '1234' } });
    fireEvent.click(screen.getByText(/unlock/i));
    expect(onSuccess).toHaveBeenCalled();
  });

  it('shows error on wrong PIN', () => {
    localStorage.setItem('app_pin', '1234');
    render(<PinGate onSuccess={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText(/pin/i), { target: { value: '0000' } });
    fireEvent.click(screen.getByText(/unlock/i));
    expect(screen.getByText(/incorrect pin/i)).toBeInTheDocument();
  });
});

// --- SOSButton ---
describe('SOSButton', () => {
  beforeEach(() => {
    // Mock geolocation
    global.navigator.geolocation = {
      getCurrentPosition: (success) => success({ coords: { latitude: 1, longitude: 2 } }),
    };
    // Mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
    );
    import.meta.env = { VITE_API_URL: '' };
  });

  it('renders and sends SOS', async () => {
    render(<SOSButton />);
    fireEvent.click(screen.getByText(/send sos/i));
    await waitFor(() => expect(screen.getByText(/sos sent/i)).toBeInTheDocument());
  });

  it('shows error if geolocation fails', async () => {
    global.navigator.geolocation = { getCurrentPosition: (s, err) => err() };
    render(<SOSButton />);
    fireEvent.click(screen.getByText(/send sos/i));
    await waitFor(() => expect(screen.getByText(/location error/i)).toBeInTheDocument());
  });
});

// --- CheckinTimer ---
describe('CheckinTimer', () => {
  beforeEach(() => {
    // Mock geolocation
    global.navigator.geolocation = {
      getCurrentPosition: (success) => success({ coords: { latitude: 1, longitude: 2 } }),
    };
    // Mock api
    jest.mock('../api/api', () => ({
      startCheckin: jest.fn(() => Promise.resolve({})),
      cancelCheckin: jest.fn(() => Promise.resolve({})),
      triggerCheckin: jest.fn(() => Promise.resolve({})),
    }));
  });

  it('renders and starts timer', async () => {
    render(<CheckinTimer />);
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: 5 } });
    fireEvent.click(screen.getByText(/start/i));
    await waitFor(() => expect(screen.getByText(/cancel/i)).toBeInTheDocument());
  });
});

// --- ContactList ---
describe('ContactList', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('shows contacts from API', async () => {
    jest.mock('../api/api', () => ({
      getContacts: jest.fn(() => Promise.resolve([
        { _id: '1', name: 'Alice', phone: '123', relationship: 'friend' },
      ])),
      deleteContact: jest.fn(() => Promise.resolve({})),
    }));
    render(<ContactList />);
    await waitFor(() => expect(screen.getByText(/alice/i)).toBeInTheDocument());
    expect(screen.getByText(/123/)).toBeInTheDocument();
    expect(screen.getByText(/friend/)).toBeInTheDocument();
  });

  it('shows "No contacts yet" if empty', async () => {
    jest.mock('../api/api', () => ({
      getContacts: jest.fn(() => Promise.resolve([])),
      deleteContact: jest.fn(() => Promise.resolve({})),
    }));
    render(<ContactList />);
    await waitFor(() => expect(screen.getByText(/no contacts yet/i)).toBeInTheDocument());
  });
});

// --- Journal ---
describe('Journal', () => {
  const settings = { background: 'lined', theme: 'light', font: 'Arial' };
  it('renders and saves a journal entry', () => {
    render(<Journal settings={settings} onToggleTheme={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText(/title/i), { target: { value: 'My Day' } });
    fireEvent.change(screen.getByPlaceholderText(/write your thoughts/i), { target: { value: 'It was good.' } });
    fireEvent.click(screen.getByText(/save/i));
    expect(screen.getByText(/my day/i)).toBeInTheDocument();
    expect(screen.getByText(/it was good/i)).toBeInTheDocument();
  });

  it('deletes a journal entry', () => {
    render(<Journal settings={settings} onToggleTheme={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText(/title/i), { target: { value: 'Delete Me' } });
    fireEvent.change(screen.getByPlaceholderText(/write your thoughts/i), { target: { value: 'To be deleted.' } });
    fireEvent.click(screen.getByText(/save/i));
    fireEvent.click(screen.getByLabelText(/delete entry/i));
    expect(screen.queryByText(/delete me/i)).not.toBeInTheDocument();
  });
});