import API_ENDPOINTS from '@/config/api';

/**
 * Lấy danh sách tất cả chứng chỉ
 */
export const getCertificates = async (page = 1, limit = 20, status = '', major = '') => {
  try {
    let url = API_ENDPOINTS.CERTIFICATES.LIST;
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    if (status) params.append('status', status);
    if (major) params.append('major', major);

    const queryString = params.toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });

    if (!response.ok) {
      throw new Error('Lỗi lấy danh sách chứng chỉ');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Lấy chi tiết chứng chỉ theo ID
 */
export const getCertificateById = async (id) => {
  try {
    const response = await fetch(API_ENDPOINTS.CERTIFICATES.GET_BY_ID(id), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });

    if (!response.ok) {
      throw new Error('Không tìm thấy chứng chỉ');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Xóa chứng chỉ
 */
export const deleteCertificate = async (id) => {
  try {
    const response = await fetch(API_ENDPOINTS.CERTIFICATES.DELETE(id), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });

    if (!response.ok) {
      throw new Error('Lỗi xóa chứng chỉ');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

export default { getCertificates, getCertificateById, deleteCertificate };
