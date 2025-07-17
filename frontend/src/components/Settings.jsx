import React, { useState, useRef, useEffect } from 'react';
import PinGate from './PinGate';
import ContactList from './ContactList';
import AddContactForm from './AddContactForm';

const Settings = ({ onFail }) => {
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
          <label style={{ fontWeight: 500 }}>Vibration Feedback:</label>
          <input
            type="checkbox"
            checked={vibration}
            onChange={e => setVibration(e.target.checked)}
            style={{ marginLeft: 8 }}
          />
          <span style={{ marginLeft: 8, fontSize: 14, color: '#888' }}>{vibration ? 'Enabled' : 'Disabled'}</span>
        </div>
      </div>
    </div>
  );
};

export default Settings; 