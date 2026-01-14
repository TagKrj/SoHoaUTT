import API_ENDPOINTS from '@/config/api';

// Flag để prevent multiple refresh calls
let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

const notifyTokenRefresh = (token) => {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
};

/**
 * Refresh access token
 */
export const refreshToken = async () => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const refreshTokenValue = localStorage.getItem('refreshToken');

    if (!accessToken || !refreshTokenValue) {
      throw new Error('Không có token để refresh');
    }

    console.log('Refreshing token...');

    const response = await fetch(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        accessToken,
        refreshToken: refreshTokenValue
      })
    });

    if (!response.ok) {
      throw new Error('Refresh token thất bại');
    }

    const data = await response.json();
    
    // Update tokens
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);

    console.log('Token refreshed successfully');
    return data;
  } catch (error) {
    console.error('Refresh token error:', error);
    // Nếu refresh thất bại, xóa tokens và redirect login
    logout();
    throw error;
  }
};

/**
 * Fetch wrapper với auto-refresh
 */
export const fetchWithAutoRefresh = async (url, options = {}) => {
  try {
    let response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });

    // Nếu token hết hạn (401)
    if (response.status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          // Refresh token
          await refreshToken();
          isRefreshing = false;
          notifyTokenRefresh(localStorage.getItem('accessToken'));
        } catch (error) {
          isRefreshing = false;
          throw error;
        }
      } else {
        // Nếu đang refresh, chờ refresh xong rồi retry
        await new Promise(resolve => {
          subscribeTokenRefresh(() => resolve());
        });
      }

      // Retry request với token mới
      response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
    }

    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Đăng nhập
 */
export const login = async (email, password) => {
  try {
    const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Đăng nhập thất bại');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Lấy thông tin profile
 */
export const getProfile = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    
    const response = await fetch(API_ENDPOINTS.AUTH.PROFILE, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Lỗi lấy thông tin profile');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Đăng xuất
 */
export const logout = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    
    // Gọi API logout nếu cần
    await fetch(API_ENDPOINTS.AUTH.LOGOUT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    // Xóa tokens từ localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    return true;
  } catch (error) {
    // Vẫn xóa tokens ngay cả khi API call fail
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    return true;
  }
};

export default { login, getProfile, logout, refreshToken, fetchWithAutoRefresh };
