const BASE = import.meta.env.VITE_API_URL;

const api = {
  async getContacts() {
    const res = await fetch(`${BASE}/api/contacts`);
    if (!res.ok) throw new Error('Failed to fetch contacts');
    return res.json();
  },
  async addContact(contact) {
    const res = await fetch(`${BASE}/api/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contact),
    });
    if (!res.ok) throw new Error('Failed to add contact');
    return res.json();
  },
  async updateContact(id, contact) {
    const res = await fetch(`${BASE}/api/contacts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contact),
    });
    if (!res.ok) throw new Error('Failed to update contact');
    return res.json();
  },
  async deleteContact(id) {
    const res = await fetch(`${BASE}/api/contacts/${id}`, {
      method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete contact');
    return res.json();
  },
  async startCheckin({ userId, durationMinutes, location }) {
    const res = await fetch(`${BASE}/api/checkin/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, durationMinutes, location }),
    });
    if (!res.ok) throw new Error('Failed to start check-in');
    return res.json();
  },
  async cancelCheckin({ userId }) {
    const res = await fetch(`${BASE}/api/checkin/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    if (!res.ok) throw new Error('Failed to cancel check-in');
    return res.json();
  },
  async triggerCheckin({ userId, location }) {
    const res = await fetch(`${BASE}/api/checkin/trigger`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, location }),
    });
    if (!res.ok) throw new Error('Failed to trigger auto-SOS');
    return res.json();
  },
};

export default api; 