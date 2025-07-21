import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AffirmHub from './components/AffirmHub/AffirmHub';
import Settings from './components/Settings';
import ActionScreen from './components/ActionScreen';
import OnboardingOverlay from './components/OnboardingOverlay';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';
import './App.css';

const NAV = {
  AFFIRM_HUB: 'affirm-hub',
  ACTION: 'action',
  SETTINGS: 'settings',
};

// Main app content that requires authentication
const AppContent = () => {
  const { user, loading, logout: authLogout } = useAuth();
  const location = useLocation();
  const [view, setView] = useState(NAV.AFFIRM_HUB);
  const [settings, setSettings] = useState({
    theme: 'warm',
    font: 'Inter',
    background: 'plain',
  });
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem('onboarding_dismissed'));

  const handleLogout = async () => {
    try {
      await authLogout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Reset view when location changes
  useEffect(() => {
    setView(NAV.AFFIRM_HUB);
  }, [location]);

  const handleSettingsChange = (change) => {
    setSettings(prev => ({ ...prev, ...change }));
  };

  const handleDismissOnboarding = () => {
    localStorage.setItem('onboarding_dismissed', '1');
    setShowOnboarding(false);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (view === NAV.AFFIRM_HUB) setView(NAV.SETTINGS);
      else if (view === NAV.ACTION) setView(NAV.AFFIRM_HUB);
    },
    onSwipedRight: () => {
      if (view === NAV.AFFIRM_HUB) setView(NAV.ACTION);
      else if (view === NAV.SETTINGS) setView(NAV.AFFIRM_HUB);
    },
    trackMouse: true,
  });

  // If not authenticated, redirect to login
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div
      {...handlers}
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: settings.font,
        background: settings.theme === 'dark' ? '#222' : '#fff',
        color: settings.theme === 'dark' ? '#fff' : '#222',
        transition: 'background 0.3s',
        position: 'relative',
      }}
    >
      {view === NAV.AFFIRM_HUB && (
        <AffirmHub 
          settings={settings} 
          onToggleTheme={() => setSettings(s => ({ ...s, theme: s.theme === 'dark' ? 'warm' : 'dark' }))} 
        />
      )}
      {view === NAV.ACTION && <ActionScreen onReturn={() => setView(NAV.AFFIRM_HUB)} />}
      {view === NAV.SETTINGS && (
        <Settings 
          onFail={() => setView(NAV.AFFIRM_HUB)} 
          onSettingsChange={handleSettingsChange} 
          hideTheme 
          font={settings.font} 
          background={settings.background} 
          onLogout={handleLogout}
        />
      )}
      {showOnboarding && <OnboardingOverlay onDismiss={handleDismissOnboarding} />}
    </div>
  );
};

// Main App component with routing
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <ProtectedRoute>
              <AppContent />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
