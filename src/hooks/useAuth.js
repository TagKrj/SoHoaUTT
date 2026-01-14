import { useState, useEffect } from 'react';
import { login, logout, getProfile } from '@/services/authService';

const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  /**
   * Lấy thông tin profile từ API
   */
  const fetchProfile = async () => {
    try {
      const response = await getProfile();
      const userData = response.user;
      setUser({
        id: userData.id,
        name: userData.name,
        role: userData.role,
        username: userData.username
      });
      return userData;
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.message);
      return null;
    }
  };

  /**
   * Load profile khi component mount nếu đã login
   */
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token && !user) {
      fetchProfile();
    }
  }, []);

  const handleLogin = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await login(email, password);

      // Lưu tokens vào localStorage
      localStorage.setItem(TOKEN_KEY, response.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));

      // Set user data
      setUser({
        id: response.user.id,
        name: response.user.name,
        role: response.user.role,
        username: response.user.username
      });

      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setError(null);
    try {
      await logout();
      setUser(null);
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    user,
    handleLogin,
    handleLogout,
    fetchProfile
  };
};

export default useAuth;
