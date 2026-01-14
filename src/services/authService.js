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

export default { login };
