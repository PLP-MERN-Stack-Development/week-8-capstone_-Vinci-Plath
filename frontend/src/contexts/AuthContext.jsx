import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/axiosConfig';

const AuthContext = createContext({
  user: null,
  token: null,
  loading: true,
  error: null,
  register: async () => {},
  login: async () => {},
  logout: () => {},
  isAuthenticated: () => false,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set auth token in axios headers
  const setAuthToken = (token) => {
    if (token) {
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    }
  };

  // Load user on mount or token change
  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        if (token) {
          setAuthToken(token);
          const response = await api.get('/auth/me');
          setUser(response.data.data);
        }
      } catch (err) {
        console.error('Error loading user', err);
        setError('Failed to load user');
        setToken(null);
        setUser(null);
        setAuthToken(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;
      
      setToken(token);
      setUser(user);
      setAuthToken(token);
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
const response = await api.post('/auth/login', credentials);
      const { token, user } = response.data;
      
      setToken(token);
      setUser(user);
      setAuthToken(token);
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setToken(null);
      setUser(null);
      setAuthToken(null);
      return { success: true };
    } catch (err) {
      console.error('Logout error', err);
      return { success: false, error: err.message };
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!token;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        register,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
