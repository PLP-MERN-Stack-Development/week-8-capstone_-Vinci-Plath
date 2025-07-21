const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn('No authentication token found in localStorage');
    return { 'Content-Type': 'application/json' };
  }
  return { 
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (response.status === 401) {
    // Token might be expired or invalid
    console.warn('Authentication failed - redirecting to login');
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('Authentication required');
  }
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Request failed');
  }
  
  return response.json();
};

// Helper function to make authenticated requests
const fetchWithAuth = async (url, options = {}) => {
  const headers = {
    ...getAuthHeaders(),
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers,
    credentials: 'include' // Important for cookies if using them
  };

  try {
    const response = await fetch(`${BASE}${url}`, config);
    return handleResponse(response);
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

const api = {
  // Contacts
  async getContacts() {
    return fetchWithAuth('/api/contacts', { method: 'GET' });
  },
  
  async addContact(contact) {
    return fetchWithAuth('/api/contacts', {
      method: 'POST',
      body: JSON.stringify(contact)
    });
  },
  
  async updateContact(id, contact) {
    return fetchWithAuth(`/api/contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(contact)
    });
  },
  
  async deleteContact(id) {
    return fetchWithAuth(`/api/contacts/${id}`, {
      method: 'DELETE'
    });
  },
  
  // Check-in
  async startCheckin({ userId, durationMinutes, location }) {
    return fetchWithAuth('/api/checkin/start', {
      method: 'POST',
      body: JSON.stringify({ userId, durationMinutes, location })
    });
  },
  
  async cancelCheckin({ userId }) {
    return fetchWithAuth('/api/checkin/cancel', {
      method: 'POST',
      body: JSON.stringify({ userId })
    });
  },
  
  async triggerCheckin({ userId, location }) {
    return fetchWithAuth('/api/checkin/trigger', {
      method: 'POST',
      body: JSON.stringify({ userId, location })
    });
  },
};

export default api; 