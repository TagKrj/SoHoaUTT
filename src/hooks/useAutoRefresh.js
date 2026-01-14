import { useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { refreshToken } from '@/services/authService';

export const useAutoRefresh = () => {
  const checkAndRefreshToken = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) return;

      // Decode token để lấy expiration time
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;
      
      // Nếu token sắp hết hạn trong 5 phút, refresh ngay
      const timeUntilExpiry = decoded.exp - now;
      console.log('🔍 Token check:', {
        timeUntilExpiry: Math.round(timeUntilExpiry),
        expiresAt: new Date(decoded.exp * 1000),
        needsRefresh: timeUntilExpiry < 300
      });
      
      if (timeUntilExpiry < 300) { // 5 minutes
        console.log('🔄 Token sắp hết hạn, refreshing...');
        await refreshToken();
        console.log('✅ Token refreshed successfully');
      }
    } catch (error) {
      console.error('Auto refresh check error:', error);
    }
  }, []);

  useEffect(() => {
    // Check token khi app mount
    checkAndRefreshToken();

    // Check token mỗi 1 phút
    const interval = setInterval(() => {
      checkAndRefreshToken();
    }, 60000); // 1 minute

    return () => clearInterval(interval);
  }, [checkAndRefreshToken]);

  return { checkAndRefreshToken };
};

export default useAutoRefresh;
