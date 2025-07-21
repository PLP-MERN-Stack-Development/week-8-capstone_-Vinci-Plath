import React from 'react';
import { useNavigate } from 'react-router-dom';
import { List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import {
  Home as HomeIcon,
  EmojiNature as GrowIcon,
  MenuBook as LearnIcon,
  SelfImprovement as HealIcon,
  Bookmark as ReflectionsIcon
} from '@mui/icons-material';

const AffirmDrawer = ({ currentView, onNavigate, views }) => {
  const navigate = useNavigate();

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, view: views.HOME },
    { text: 'Grow', icon: <GrowIcon />, view: views.GROW },
    { text: 'Learn', icon: <LearnIcon />, view: views.LEARN },
    { text: 'Heal', icon: <HealIcon />, view: views.HEAL },
  ];

  return (
    <div className="space-y-1 px-2">
      {menuItems.map((item) => (
        <button
          key={item.view}
          onClick={() => onNavigate(item.view)}
          className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full ${
            currentView === item.view
              ? 'bg-indigo-50 text-indigo-700'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <span className={`mr-3 flex-shrink-0 h-6 w-6 ${
            currentView === item.view ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'
          }`}>
            {React.cloneElement(item.icon, { className: 'h-5 w-5' })}
          </span>
          {item.text}
        </button>
      ))}
    </div>
  );
};

export default AffirmDrawer;
