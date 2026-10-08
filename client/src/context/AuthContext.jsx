import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('govdesk_token') || null);
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState([]);
  const [comparedServices, setComparedServices] = useState([]);

  useEffect(() => {
    if (token) {
      fetchCurrentUser();
      fetchSavedServices();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
      }
    } catch (err) {
      console.warn('Session expired or invalid token:', err.message);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedServices = async () => {
    try {
      const res = await api.get('/services/saved/my');
      if (res.data.success) {
        setSavedIds(res.data.saved_services.map(s => s.id));
      }
    } catch (err) {
      // Ignore
    }
  };

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('govdesk_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
      return { success: false, message: res.data.message || 'Invalid email or password.' };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (err.code === 'ERR_NETWORK' ? 'Cannot reach the server. Make sure the backend is running.' : 'Login failed. Please try again.');
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      if (res.data.success) {
        localStorage.setItem('govdesk_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
      return { success: false, message: res.data.message || 'Registration failed.' };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (err.code === 'ERR_NETWORK' ? 'Cannot reach the server. Make sure the backend is running.' : 'Registration failed. Please try again.');
      return { success: false, message };
    }
  };

  const loginWithDemo = async (role = 'citizen') => {
    const credentials = role === 'admin' 
      ? { email: 'admin@govdesk.in', password: 'admin123' }
      : { email: 'citizen@govdesk.in', password: 'citizen123' };
    return await login(credentials.email, credentials.password);
  };

  const logout = () => {
    localStorage.removeItem('govdesk_token');
    setToken(null);
    setUser(null);
    setSavedIds([]);
  };

  const updateProfile = async (updates) => {
    const res = await api.put('/auth/profile', updates);
    if (res.data.success) {
      setUser(res.data.user);
      return { success: true, user: res.data.user };
    }
    return { success: false };
  };

  const toggleSave = async (serviceId) => {
    if (!user) {
      alert('Please login to bookmark schemes to your citizen profile.');
      return false;
    }
    try {
      const res = await api.post('/services/save', { service_id: serviceId });
      if (res.data.success) {
        if (res.data.is_saved) {
          setSavedIds(prev => [...prev, serviceId]);
        } else {
          setSavedIds(prev => prev.filter(id => id !== serviceId));
        }
        return res.data.is_saved;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const addToCompare = (service) => {
    if (comparedServices.find(s => s.id === service.id)) return;
    if (comparedServices.length >= 3) {
      alert('You can compare a maximum of 3 schemes simultaneously.');
      return;
    }
    setComparedServices(prev => [...prev, service]);
  };

  const removeFromCompare = (serviceId) => {
    setComparedServices(prev => prev.filter(s => s.id !== serviceId));
  };

  const clearCompare = () => {
    setComparedServices([]);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      loginWithDemo,
      logout,
      updateProfile,
      savedIds,
      toggleSave,
      comparedServices,
      addToCompare,
      removeFromCompare,
      clearCompare,
      isAdmin: user?.role === 'admin' || user?.role === 'superadmin'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
