import React, { useState, useRef } from 'react';
import Lottie from 'lottie-react';
import goldSignal from './sos-gold-signal.json'; // Replace with your Lottie file
import api from '../api/api';

const getUserId = () => {
  let id = localStorage.getItem('user_id');
  if (!id) {
    id = 'user_' + Math.random().toString(36).slice(2, 10);
    localStorage.setItem('user_id', id);
  }
  return id;
};

const getLocation = () => new Promise((resolve, reject) => {
  if (!navigator.geolocation) return reject('Geolocation not supported');
  navigator.geolocation.getCurrentPosition(
    pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
    () => reject('Location error')
  );
});

const SOSButton = ({ onSOS, loading }) => {
  const [pressed, setPressed] = useState(false);
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 48,
      position: 'relative',
      width: 140,
      height: 140,
    }}>
      {/* CSS Pulse */}
      <span style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 120,
        height: 120,
        background: '#FFD70055',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1,
        animation: 'sos-pulse 1.2s infinite cubic-bezier(0.66, 0, 0, 1)',
        pointerEvents: 'none',
      }} />
      <button
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        onClick={onSOS}
        disabled={loading}
        style={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: '#FFD700',
          boxShadow: pressed ? '0 0 32px 8px #FFD70088' : '0 0 16px 4px #FFD70055',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: pressed ? 'scale(0.95)' : 'scale(1)',
          transition: 'box-shadow 0.2s, transform 0.1s',
          border: 'none',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: 28,
          letterSpacing: 2,
          textShadow: '0 2px 8px #FFD700',
          opacity: loading ? 0.6 : 1,
          pointerEvents: loading ? 'none' : 'auto',
          zIndex: 2,
          position: 'relative',
          cursor: 'pointer',
        }}
        aria-label="Send SOS"
        title="Send SOS"
      >
        SOS
      </button>
      {/* Add this to your global CSS or in a <style> tag */}
      <style>
        {`@keyframes sos-pulse {
          0% { box-shadow: 0 0 0 0 #FFD70055; }
          70% { box-shadow: 0 0 0 20px #FFD70000; }
          100% { box-shadow: 0 0 0 0 #FFD70000; }
        }`}
      </style>
    </div>
  );
};

const CheckinButton = ({ onCheckin, running, countdown, onCancel, loading }) => {
  const [pressed, setPressed] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 8 }}>
      <button
        style={{
          width: 200,
          height: 54,
          borderRadius: 18,
          background: '#8A2BE2',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: 22,
          border: 'none',
          boxShadow: pressed ? '0 0 24px 6px #8A2BE288' : '0 0 12px 2px #8A2BE255',
          transform: pressed ? 'scale(0.97)' : 'scale(1)',
          transition: 'box-shadow 0.2s, transform 0.1s',
          outline: 'none',
          position: 'relative',
          opacity: loading ? 0.6 : 1,
          pointerEvents: loading ? 'none' : 'auto',
          marginTop: 16,
          marginBottom: 8,
          letterSpacing: 1,
          textAlign: 'center',
          cursor: 'pointer',
        }}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        onClick={running ? onCancel : onCheckin}
        disabled={loading}
      >
        {running ? `Cancel (${countdown})` : 'Check-In'}
      </button>
    </div>
  );
};

const ActionScreen = ({ onReturn }) => {
  const [sosSent, setSosSent] = useState(false);
  const [checkinRunning, setCheckinRunning] = useState(false);
  const [countdown, setCountdown] = useState(5 * 60); // 5 min default
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const timerRef = useRef();

  // Auto-return after SOS or check-in
  React.useEffect(() => {
    if (sosSent) {
      setTimeout(() => onReturn && onReturn(), 1200);
    }
    if (checkinRunning && countdown === 0) {
      setTimeout(() => onReturn && onReturn(), 1200);
    }
  }, [sosSent, checkinRunning, countdown, onReturn]);

  // Countdown logic
  React.useEffect(() => {
    if (checkinRunning && countdown > 0) {
      timerRef.current = setTimeout(() => setCountdown(c => c - 1), 1000);
    }
    if (!checkinRunning) {
      clearTimeout(timerRef.current);
      setCountdown(5 * 60);
    }
    return () => clearTimeout(timerRef.current);
  }, [checkinRunning, countdown]);

  const handleSOS = async () => {
    setLoading(true);
    setError('');
    try {
      const location = await getLocation();
      await api.sos ? api.sos({ location }) : fetch(`${import.meta.env.VITE_API_URL}/api/sos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location }),
      });
      setSosSent(true);
    } catch (err) {
      setError('Failed to send SOS');
    }
    setLoading(false);
  };

  const handleCheckin = async () => {
    setLoading(true);
    setError('');
    try {
      const location = await getLocation();
      const userId = getUserId();
      await api.startCheckin({ userId, durationMinutes: 5, location });
      setCheckinRunning(true);
    } catch (err) {
      setError('Failed to start check-in');
    }
    setLoading(false);
  };

  const handleCancel = async () => {
    setLoading(true);
    setError('');
    try {
      const userId = getUserId();
      await api.cancelCheckin({ userId });
      setCheckinRunning(false);
    } catch (err) {
      setError('Failed to cancel check-in');
    }
    setLoading(false);
  };

  // Auto-SOS on check-in expiry
  React.useEffect(() => {
    if (checkinRunning && countdown === 0) {
      (async () => {
        setLoading(true);
        try {
          const userId = getUserId();
          const location = await getLocation();
          await api.triggerCheckin({ userId, location });
        } catch (err) {
          setError('Failed to trigger auto-SOS');
        }
        setLoading(false);
      })();
    }
  }, [checkinRunning, countdown]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fff',
        padding: '32px 8px',
      }}
    >
      <SOSButton onSOS={handleSOS} loading={loading} />
      <CheckinButton onCheckin={handleCheckin} running={checkinRunning} countdown={formatTime(countdown)} onCancel={handleCancel} loading={loading} />
      {error && <div style={{ color: 'red', marginTop: 16 }}>{error}</div>}
      {sosSent && <div style={{ color: '#FFD700', fontWeight: 'bold', marginTop: 24, fontSize: 20 }}>SOS Sent!</div>}
      {checkinRunning && countdown === 0 && <div style={{ color: '#8A2BE2', fontWeight: 'bold', marginTop: 24, fontSize: 20 }}>Check-in expired! SOS triggered.</div>}
      <div style={{ color: '#888', fontSize: 14, marginTop: 40 }}>Swipe left/right to return</div>
    </div>
  );
};

export default ActionScreen; 