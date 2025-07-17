import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import Journal from './components/Journal';
import Settings from './components/Settings';
import ActionScreen from './components/ActionScreen';
import OnboardingOverlay from './components/OnboardingOverlay';

const NAV = {
  JOURNAL: 'journal',
  ACTION: 'action',
  SETTINGS: 'settings',
};

function App() {
  const [view, setView] = useState(NAV.JOURNAL);
  // Settings for theme, font, background (stubbed for now)
  const [settings, setSettings] = useState({
    theme: 'warm', // warm | dark
    font: 'Inter', // Inter | Nunito | Roboto Slab
    background: 'plain', // plain | lined | gradient
  });
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem('onboarding_dismissed'));

  const handleSettingsChange = (change) => {
    setSettings(prev => ({ ...prev, ...change }));
  };
  const handleDismissOnboarding = () => {
    localStorage.setItem('onboarding_dismissed', '1');
    setShowOnboarding(false);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (view === NAV.JOURNAL) setView(NAV.SETTINGS);
      else if (view === NAV.ACTION) setView(NAV.JOURNAL);
    },
    onSwipedRight: () => {
      if (view === NAV.JOURNAL) setView(NAV.ACTION);
      else if (view === NAV.SETTINGS) setView(NAV.JOURNAL);
    },
    trackMouse: true,
  });

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
      {view === NAV.JOURNAL && <Journal settings={settings} onToggleTheme={() => setSettings(s => ({ ...s, theme: s.theme === 'dark' ? 'warm' : 'dark' }))} />}
      {view === NAV.ACTION && <ActionScreen onReturn={() => setView(NAV.JOURNAL)} />}
      {view === NAV.SETTINGS && <Settings onFail={() => setView(NAV.JOURNAL)} onSettingsChange={handleSettingsChange} hideTheme font={settings.font} background={settings.background} />}
      {showOnboarding && <OnboardingOverlay onDismiss={handleDismissOnboarding} />}
    </div>
  );
}

export default App;
