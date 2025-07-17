import React, { useState } from 'react';

const SOSButton = () => {
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [error, setError] = useState('');

  const handleSOS = async () => {
    setStatus('sending');
    setError('');
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      setStatus('error');
      return;
    }
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const location = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/sos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ location }),
        });
        if (!res.ok) throw new Error('SOS failed');
        setStatus('success');
      } catch (err) {
        setError('SOS failed');
        setStatus('error');
      }
    }, (err) => {
      setError('Location error');
      setStatus('error');
    });
  };

  return (
    <div>
      <button
        style={{ background: 'red', color: 'white', fontWeight: 'bold', fontSize: 18, border: 'none', borderRadius: 8, padding: '16px 32px', opacity: status === 'sending' ? 0.5 : 1 }}
        onClick={handleSOS}
        disabled={status === 'sending' || status === 'success'}
      >
        {status === 'idle' && 'Send SOS'}
        {status === 'sending' && 'Sending...'}
        {status === 'success' && 'SOS Sent!'}
        {status === 'error' && 'Try Again'}
      </button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      {status === 'success' && <div style={{ color: 'green', marginTop: 8 }}>Help is on the way.</div>}
    </div>
  );
};

export default SOSButton; 