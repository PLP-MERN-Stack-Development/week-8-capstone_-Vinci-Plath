import React, { useState, useRef } from 'react';
import api from '../api/api';

const getUserId = () => {
  // For demo: use a localStorage-based pseudo-user
  let id = localStorage.getItem('user_id');
  if (!id) {
    id = 'user_' + Math.random().toString(36).slice(2, 10);
    localStorage.setItem('user_id', id);
  }
  return id;
};

const CheckinTimer = () => {
  const [duration, setDuration] = useState(10); // minutes
  const [status, setStatus] = useState('idle'); // idle | running | expired | cancelled | error | sos
  const [expiresAt, setExpiresAt] = useState(null);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(null);
  const timerRef = useRef();

  const getLocation = () => new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject('Geolocation not supported');
    navigator.geolocation.getCurrentPosition(
      pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => reject('Location error')
    );
  });

  const startTimer = async () => {
    setError('');
    setStatus('running');
    try {
      const location = await getLocation();
      const userId = getUserId();
      const res = await api.startCheckin({ userId, durationMinutes: duration, location });
      setExpiresAt(new Date(Date.now() + duration * 60000));
      setCountdown(duration * 60);
      timerRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setStatus('expired');
            triggerSOS();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError('Failed to start check-in');
      setStatus('error');
    }
  };

  const cancelTimer = async () => {
    setError('');
    setStatus('cancelled');
    clearInterval(timerRef.current);
    try {
      const userId = getUserId();
      await api.cancelCheckin({ userId });
    } catch {
      setError('Failed to cancel');
    }
  };

  const triggerSOS = async () => {
    setStatus('sos');
    try {
      const userId = getUserId();
      const location = await getLocation();
      await api.triggerCheckin({ userId, location });
    } catch {
      setError('Failed to trigger SOS');
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <h2 style={{ fontSize: 20, marginBottom: 8 }}>Check-in Timer</h2>
      {status === 'idle' && (
        <form onSubmit={e => { e.preventDefault(); startTimer(); }} style={{ display: 'flex', gap: 8 }}>
          <input
            type="number"
            min={1}
            max={120}
            value={duration}
            onChange={e => setDuration(Number(e.target.value))}
            style={{ width: 60, padding: 6, borderRadius: 4, border: '1px solid #ccc' }}
          />
          <span>minutes</span>
          <button type="submit" style={{ padding: '6px 12px', borderRadius: 4, border: 'none', background: '#1976d2', color: 'white' }}>
            Start
          </button>
        </form>
      )}
      {status === 'running' && (
        <div>
          <div style={{ fontSize: 32, margin: '16px 0' }}>{formatTime(countdown)}</div>
          <button onClick={cancelTimer} style={{ padding: '6px 12px', borderRadius: 4, border: 'none', background: '#888', color: 'white' }}>
            Cancel
          </button>
        </div>
      )}
      {status === 'cancelled' && <div style={{ color: 'orange', marginTop: 16 }}>Check-in cancelled.</div>}
      {status === 'expired' && <div style={{ color: 'red', marginTop: 16 }}>Timer expired! SOS triggered.</div>}
      {status === 'sos' && <div style={{ color: 'red', marginTop: 16 }}>SOS sent due to missed check-in.</div>}
      {status === 'error' && <div style={{ color: 'red', marginTop: 16 }}>{error}</div>}
    </div>
  );
};

export default CheckinTimer; 