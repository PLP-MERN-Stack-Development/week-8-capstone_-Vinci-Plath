import React, { useState, useEffect } from 'react';

const getDateTime = () => {
  const now = new Date();
  return now.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
};

const linedBg = {
  background: 'repeating-linear-gradient(180deg, #f5f5f5, #f5f5f5 28px, #e0e0e0 29px, #f5f5f5 30px)',
};
const gradientBg = {
  background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
};

const loadEntries = () => {
  try {
    return JSON.parse(localStorage.getItem('journal_entries')) || [];
  } catch {
    return [];
  }
};

const saveEntries = (entries) => {
  localStorage.setItem('journal_entries', JSON.stringify(entries));
};

const defaultSettings = {
  theme: 'light',
  background: 'plain',
  fontSize: 'medium'
};

const Journal = ({ settings = defaultSettings, onToggleTheme }) => {
  // Ensure settings has all required properties
  const safeSettings = { ...defaultSettings, ...settings };
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [dateTime, setDateTime] = useState(getDateTime());
  const [entries, setEntries] = useState(loadEntries());

  useEffect(() => {
    const timer = setInterval(() => setDateTime(getDateTime()), 10000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    saveEntries(entries);
  }, [entries]);

  let bgStyle = {};
  if (safeSettings.background === 'lined') bgStyle = linedBg;
  else if (safeSettings.background === 'gradient') bgStyle = gradientBg;

  const isDark = safeSettings.theme === 'dark';

  const handleSave = () => {
    if (!text.trim() && !title.trim()) return;
    const entry = {
      id: Date.now(),
      title: title.trim(),
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };
    setEntries([entry, ...entries]);
    setText('');
    setTitle('');
  };

  const handleDelete = (id) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        ...bgStyle,
        transition: 'background 0.3s',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 8px',
      }}
    >
      {/* Top bar: date/time and theme toggle */}
      <div style={{
        width: '100%',
        maxWidth: 440,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
      }}>
        <span style={{ color: '#A9A9A9', fontSize: 15 }}>{dateTime}</span>
        <button
          onClick={onToggleTheme}
          style={{
            background: 'none',
            border: 'none',
            fontSize: 28,
            cursor: 'pointer',
            color: isDark ? '#FFD700' : '#222',
          }}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? '🌙' : '☀️'}
        </button>
      </div>
      {/* Main journal card */}
      <div
        style={{
          width: '100%',
          maxWidth: 440,
          background: isDark ? 'rgba(34,34,34,0.98)' : 'rgba(255,255,255,0.98)',
          borderRadius: 18,
          boxShadow: '0 4px 32px rgba(0,0,0,0.10)',
          padding: '32px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Title (optional)"
          style={{
            width: '100%',
            fontSize: 18,
            fontFamily: settings.font,
            background: isDark ? 'rgba(44,44,44,0.95)' : 'rgba(245,245,245,0.95)',
            border: '1.5px solid #e0e0e0',
            borderRadius: 10,
            padding: 12,
            marginBottom: 12,
            color: isDark ? '#fff' : '#222',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            outline: 'none',
            transition: 'background 0.2s',
          }}
        />
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Write your thoughts or affirmations..."
          style={{
            width: '100%',
            minHeight: 100,
            fontSize: 18,
            fontFamily: settings.font,
            background: isDark ? 'rgba(44,44,44,0.95)' : 'rgba(245,245,245,0.95)',
            border: '1.5px solid #e0e0e0',
            borderRadius: 10,
            padding: 16,
            resize: 'vertical',
            color: isDark ? '#fff' : '#222',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            outline: 'none',
            transition: 'background 0.2s',
          }}
        />
        <button
          onClick={handleSave}
          style={{
            marginTop: 16,
            padding: '10px 32px',
            borderRadius: 8,
            border: 'none',
            background: '#1976d2',
            color: '#fff',
            fontWeight: 700,
            fontSize: 16,
            cursor: 'pointer',
            boxShadow: '0 2px 8px #1976d244',
            alignSelf: 'flex-end',
          }}
        >
          Save
        </button>
        {/* List of past entries */}
        {entries.length > 0 && (
          <div style={{ width: '100%', marginTop: 32 }}>
            <h3 style={{ fontSize: 17, color: '#888', marginBottom: 12, fontWeight: 600 }}>Entries</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {entries.map(entry => (
                <li key={entry.id} style={{
                  background: isDark ? '#222' : '#f5f5f5',
                  borderRadius: 8,
                  marginBottom: 14,
                  padding: '12px 14px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                }}>
                  <span style={{ fontSize: 13, color: '#A9A9A9', marginBottom: 4 }}>{new Date(entry.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                  {entry.title && (
                    <span style={{ fontWeight: 700, fontSize: 17, marginBottom: 2 }}>{entry.title}</span>
                  )}
                  <span style={{ fontSize: 16 }}>{entry.text}</span>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      background: 'none',
                      border: 'none',
                      color: '#d32f2f',
                      fontWeight: 700,
                      fontSize: 18,
                      cursor: 'pointer',
                    }}
                    aria-label="Delete entry"
                    title="Delete entry"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Journal; 