import React, { useEffect, useState } from 'react';
import api from '../api/api';

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchContacts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getContacts();
      setContacts(data);
    } catch (err) {
      setError('Failed to load contacts');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this contact?')) return;
    try {
      await api.deleteContact(id);
      setContacts(contacts.filter(c => c._id !== id));
    } catch {
      alert('Failed to delete');
    }
  };

  if (loading) return <div>Loading contacts...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!contacts.length) return <div>No contacts yet.</div>;

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {contacts.map(c => (
        <li key={c._id} style={{ background: '#f5f5f5', margin: '8px 0', padding: 8, borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>
            <strong>{c.name}</strong> <span style={{ color: '#888' }}>{c.relationship && `(${c.relationship})`}</span><br />
            <span style={{ fontSize: 13 }}>{c.phone}</span>
          </span>
          <button onClick={() => handleDelete(c._id)} style={{ background: 'none', border: 'none', color: 'red', fontWeight: 'bold', fontSize: 16, cursor: 'pointer' }}>✕</button>
        </li>
      ))}
    </ul>
  );
};

export default ContactList; 