import React, { useState } from 'react';
import api from '../api/api';

const AddContactForm = ({ onAdded }) => {
  const [form, setForm] = useState({ name: '', phone: '', relationship: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.addContact(form);
      setForm({ name: '', phone: '', relationship: '' });
      if (onAdded) onAdded();
    } catch {
      setError('Failed to add contact');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, marginTop: 8 }}>
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Name"
        required
        style={{ flex: 1, padding: 6, borderRadius: 4, border: '1px solid #ccc' }}
      />
      <input
        name="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder="Phone"
        required
        style={{ flex: 1, padding: 6, borderRadius: 4, border: '1px solid #ccc' }}
      />
      <input
        name="relationship"
        value={form.relationship}
        onChange={handleChange}
        placeholder="Relationship"
        style={{ flex: 1, padding: 6, borderRadius: 4, border: '1px solid #ccc' }}
      />
      <button type="submit" disabled={loading} style={{ padding: '6px 12px', borderRadius: 4, border: 'none', background: '#1976d2', color: 'white' }}>
        {loading ? 'Adding...' : 'Add'}
      </button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </form>
  );
};

export default AddContactForm; 