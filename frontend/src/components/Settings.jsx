import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PinGate from './PinGate';
import ContactList from './ContactList';
import AddContactForm from './AddContactForm';

const Settings = ({ onFail, onLogout }) => {
  const [unlocked, setUnlocked] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const refreshContacts = () => setRefresh(r => r + 1);

  // Preferences state (persisted in localStorage)
  const [sosMessage, setSosMessage] = useState(() => localStorage.getItem('sos_message') || "I'm in danger, please send help, don't call. My location is:");
  const [checkinDefault, setCheckinDefault] = useState(() => Number(localStorage.getItem('checkin_default')) || 5);
  const [gbvContact, setGbvContact] = useState(() => localStorage.getItem('gbv_contact') || '');
  const [vibration, setVibration] = useState(() => localStorage.getItem('vibration') !== 'false');

  useEffect(() => { localStorage.setItem('sos_message', sosMessage); }, [sosMessage]);
  useEffect(() => { localStorage.setItem('checkin_default', checkinDefault); }, [checkinDefault]);
  useEffect(() => { localStorage.setItem('gbv_contact', gbvContact); }, [gbvContact]);
  useEffect(() => { localStorage.setItem('vibration', vibration); }, [vibration]);

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/login');
    } else {
      console.error('Logout failed:', result.error);
    }
  };

  if (!unlocked) {
    return <PinGate onSuccess={() => setUnlocked(true)} onFail={onFail || (() => setUnlocked(false))} />;
  }

  return (
    <div>
      <h2 style={{ fontSize: 20, marginBottom: 8 }}>Settings</h2>
      <div style={{ marginBottom: 16 }}>
        <strong>Emergency Contacts</strong>
        <ContactList key={refresh} />
        <AddContactForm onAdded={refreshContacts} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <strong>Preferences</strong>
        <div style={{ margin: '12px 0' }}>
          <label style={{ fontWeight: 500 }}>Custom SOS Message:</label>
          <textarea
            value={sosMessage}
            onChange={e => setSosMessage(e.target.value)}
            rows={2}
            style={{ width: '100%', borderRadius: 6, padding: 8, marginTop: 4, fontSize: 15, border: '1px solid #ccc' }}
          />
        </div>
        <div style={{ margin: '12px 0' }}>
          <label style={{ fontWeight: 500 }}>Check-In Timer Default:</label>
          <select
            value={checkinDefault}
            onChange={e => setCheckinDefault(Number(e.target.value))}
            style={{ marginLeft: 8, borderRadius: 6, padding: 4, fontSize: 15 }}
          >
            {[1,2,3,4,5,10,15].map(min => (
              <option key={min} value={min}>{min} min</option>
            ))}
          </select>
        </div>
        <div style={{ margin: '12px 0' }}>
          <label style={{ fontWeight: 500 }}>GBV Support Contact:</label>
          <input
            type="text"
            value={gbvContact}
            onChange={e => setGbvContact(e.target.value)}
            placeholder="e.g. 0800-GBV-HELP or NGO name"
            style={{ width: '100%', borderRadius: 6, padding: 8, marginTop: 4, fontSize: 15, border: '1px solid #ccc' }}
          />
        </div>
        <div style={{ margin: '12px 0' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              checked={vibration}
              onChange={e => setVibration(e.target.checked)}
            />
            Enable Vibration
          </label>
        </div>
        
        <div style={{ margin: '24px 0', paddingTop: '16px', borderTop: '1px solid #eee' }}>
          <button 
            onClick={handleLogout}
            style={{
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;