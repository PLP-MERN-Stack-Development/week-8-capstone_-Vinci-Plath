import React, { useState, useEffect } from 'react';
import { Drawer, useMediaQuery, useTheme } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import AffirmDrawer from './AffirmDrawer';
import AffirmHubHome from './AffirmHubHome';
import Grow from './Grow';
import Learn from './Learn';
import Heal from './Heal';
import SavedReflections from './SavedReflections';

const AFFIRM_VIEWS = {
  HOME: 'home',
  GROW: 'grow',
  LEARN: 'learn',
  HEAL: 'heal',
  REFLECTIONS: 'reflections'
};

const AffirmHub = ({ settings = {}, onToggleTheme }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentView, setCurrentView] = useState(AFFIRM_VIEWS.HOME);
  const [savedReflections, setSavedReflections] = useState([]);

  // Load saved reflections from localStorage on component mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('affirm_reflections')) || [];
    setSavedReflections(saved);
  }, []);

  // Save reflection to localStorage
  const saveReflection = (reflection) => {
    const newReflection = {
      id: Date.now(),
      text: reflection,
      date: new Date().toISOString()
    };
    const updatedReflections = [...savedReflections, newReflection];
    localStorage.setItem('affirm_reflections', JSON.stringify(updatedReflections));
    setSavedReflections(updatedReflections);
  };

  // Toggle drawer
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  // Render the current view
  const renderView = () => {
    switch (currentView) {
      case AFFIRM_VIEWS.GROW:
        return <Grow />;
      case AFFIRM_VIEWS.LEARN:
        return <Learn />;
      case AFFIRM_VIEWS.HEAL:
        return <Heal />;
      case AFFIRM_VIEWS.REFLECTIONS:
        return <SavedReflections reflections={savedReflections} />;
      case AFFIRM_VIEWS.HOME:
      default:
        return (
          <AffirmHubHome 
            onSaveReflection={saveReflection}
            onViewReflections={() => setCurrentView(AFFIRM_VIEWS.REFLECTIONS)}
          />
        );
    }
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Fixed to the left */}
      <div className="w-64 bg-white border-r border-gray-200 h-full fixed left-0 top-0 z-10">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-indigo-600">Affirm Hub</h1>
        </div>
        <div className="p-4">
          <AffirmDrawer 
            currentView={currentView}
            onNavigate={setCurrentView}
            views={AFFIRM_VIEWS}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-6">
        {renderView()}
      </div>
    </div>
  );
};

export default AffirmHub;
