import React, { useState } from 'react';

const PinGate = ({ onSuccess, onFail }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('app_pin') ? 'enter' : 'set';
  });
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [forgotAnswer, setForgotAnswer] = useState('');
  const [resetPin, setResetPin] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);

  // On first set, ask for security question/answer
  const handleSet = (e) => {
    e.preventDefault();
    if (pin.length < 4) {
      setError('PIN must be at least 4 digits');
      return;
    }
    if (!question.trim() || !answer.trim()) {
      setError('Security question and answer required');
      return;
    }
    localStorage.setItem('app_pin', pin);
    localStorage.setItem('app_sec_q', question);
    localStorage.setItem('app_sec_a', answer.toLowerCase());
    setPin('');
    setQuestion('');
    setAnswer('');
    setMode('enter');
    setError('PIN set! Please enter it to continue.');
  };

  // On PIN entry
  const handleEnter = (e) => {
    e.preventDefault();
    const savedPin = localStorage.getItem('app_pin');
    if (pin === savedPin) {
      setError('');
      setPin('');
      setFailedAttempts(0);
      onSuccess();
    } else {
      setError('Incorrect PIN');
      setFailedAttempts(f => {
        if (f + 1 >= 3) {
          setTimeout(() => {
            setFailedAttempts(0);
            setError('');
            if (onFail) onFail();
          }, 500);
        }
        return f + 1;
      });
    }
  };

  // Forgot PIN flow
  const handleForgot = (e) => {
    e.preventDefault();
    const savedAnswer = localStorage.getItem('app_sec_a');
    if (forgotAnswer.toLowerCase() === savedAnswer) {
      setShowForgot(false);
      setMode('reset');
      setForgotAnswer('');
      setError('Correct! Set a new PIN.');
    } else {
      setError('Incorrect answer');
    }
  };

  // Reset PIN after correct answer
  const handleReset = (e) => {
    e.preventDefault();
    if (resetPin.length < 4) {
      setError('PIN must be at least 4 digits');
      return;
    }
    localStorage.setItem('app_pin', resetPin);
    setResetPin('');
    setMode('enter');
    setError('PIN reset! Please enter it to continue.');
  };

  // Render logic
  if (mode === 'set') {
    return (
      <form onSubmit={handleSet} style={{ maxWidth: 240, margin: '0 auto', textAlign: 'center' }}>
        <h3>Set a PIN</h3>
        <input
          type="password"
          value={pin}
          onChange={e => setPin(e.target.value)}
          maxLength={8}
          style={{ padding: 8, fontSize: 18, letterSpacing: 8, textAlign: 'center', width: '100%', marginBottom: 8 }}
          autoFocus
          placeholder="New PIN"
        />
        <input
          type="text"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          style={{ padding: 8, width: '100%', marginBottom: 8 }}
          placeholder="Security question (e.g. Mother's maiden name)"
        />
        <input
          type="text"
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          style={{ padding: 8, width: '100%', marginBottom: 8 }}
          placeholder="Answer"
        />
        <button type="submit" style={{ padding: '8px 16px', borderRadius: 4, border: 'none', background: '#1976d2', color: 'white', fontWeight: 'bold' }}>
          Set PIN
        </button>
        {error && <div style={{ color: 'green', marginTop: 8 }}>{error}</div>}
      </form>
    );
  }

  if (showForgot) {
    const secQ = localStorage.getItem('app_sec_q') || 'Security question';
    return (
      <form onSubmit={handleForgot} style={{ maxWidth: 240, margin: '0 auto', textAlign: 'center' }}>
        <h3>Forgot PIN</h3>
        <div style={{ marginBottom: 8 }}>{secQ}</div>
        <input
          type="text"
          value={forgotAnswer}
          onChange={e => setForgotAnswer(e.target.value)}
          style={{ padding: 8, width: '100%', marginBottom: 8 }}
          placeholder="Answer"
          autoFocus
        />
        <button type="submit" style={{ padding: '8px 16px', borderRadius: 4, border: 'none', background: '#1976d2', color: 'white', fontWeight: 'bold' }}>
          Submit
        </button>
        <button type="button" style={{ marginLeft: 8, padding: '8px 16px', borderRadius: 4, border: 'none', background: '#888', color: 'white' }} onClick={() => { setShowForgot(false); setError(''); }}>
          Cancel
        </button>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      </form>
    );
  }

  if (mode === 'reset') {
    return (
      <form onSubmit={handleReset} style={{ maxWidth: 240, margin: '0 auto', textAlign: 'center' }}>
        <h3>Reset PIN</h3>
        <input
          type="password"
          value={resetPin}
          onChange={e => setResetPin(e.target.value)}
          maxLength={8}
          style={{ padding: 8, fontSize: 18, letterSpacing: 8, textAlign: 'center', width: '100%', marginBottom: 8 }}
          autoFocus
          placeholder="New PIN"
        />
        <button type="submit" style={{ padding: '8px 16px', borderRadius: 4, border: 'none', background: '#1976d2', color: 'white', fontWeight: 'bold' }}>
          Set New PIN
        </button>
        {error && <div style={{ color: 'green', marginTop: 8 }}>{error}</div>}
      </form>
    );
  }

  // Default: enter PIN
  return (
    <form onSubmit={handleEnter} style={{ maxWidth: 240, margin: '0 auto', textAlign: 'center' }}>
      <h3>Enter PIN</h3>
      <input
        type="password"
        value={pin}
        onChange={e => setPin(e.target.value)}
        maxLength={8}
        style={{ padding: 8, fontSize: 18, letterSpacing: 8, textAlign: 'center', width: '100%', marginBottom: 8 }}
        autoFocus
      />
      <button type="submit" style={{ padding: '8px 16px', borderRadius: 4, border: 'none', background: '#1976d2', color: 'white', fontWeight: 'bold' }}>
        Unlock
      </button>
      <button type="button" style={{ marginLeft: 8, padding: '8px 16px', borderRadius: 4, border: 'none', background: '#888', color: 'white' }} onClick={() => { setShowForgot(true); setError(''); }}>
        Forgot PIN?
      </button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </form>
  );
};

export default PinGate; 