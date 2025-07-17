import React from 'react';

const OnboardingOverlay = ({ onDismiss }) => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(30,30,40,0.85)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontFamily: 'Inter, sans-serif',
  }}>
    <div style={{
      background: 'rgba(255,255,255,0.07)',
      borderRadius: 16,
      padding: '32px 24px',
      maxWidth: 340,
      boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
      textAlign: 'center',
    }}>
      <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 16 }}>Welcome!</h2>
      <div style={{ fontSize: 16, marginBottom: 18, lineHeight: 1.6 }}>
        <div>• <b>Swipe right</b> for <span style={{ color: '#FFD700' }}>SOS & Check-In</span></div>
        <div>• <b>Swipe left</b> for <span style={{ color: '#8A2BE2' }}>Settings</span> (PIN-gated)</div>
        <div>• <b>Journal</b> is private and customizable</div>
      </div>
      <button
        onClick={onDismiss}
        style={{
          marginTop: 12,
          padding: '10px 32px',
          borderRadius: 8,
          border: 'none',
          background: '#FFD700',
          color: '#222',
          fontWeight: 700,
          fontSize: 16,
          cursor: 'pointer',
          boxShadow: '0 2px 8px #FFD70044',
        }}
      >
        Got it
      </button>
    </div>
  </div>
);

export default OnboardingOverlay; 