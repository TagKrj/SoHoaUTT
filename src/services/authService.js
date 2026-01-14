import API_ENDPOINTS from '@/config/api';

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

export default { login, logout };
