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
 * Tạo chứng chỉ mới
 */
export const createCertificate = async (formData) => {
  try {
    // Tạo FormData để gửi file và dữ liệu
    const data = new FormData();
    data.append('studentID', formData.studentId);
    data.append('name', formData.certificateName);
    data.append('major', formData.major);
    if (formData.metadata) {
      data.append('metadataJson', formData.metadata);
    }
    data.append('pdfFile', formData.pdfFile);

    const response = await fetch(API_ENDPOINTS.CERTIFICATES.CREATE, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      body: data
    });

    if (!response.ok) {
      throw new Error('Lỗi tạo chứng chỉ');
    }

    // Check content-type - API có thể trả về text hoặc JSON
    const contentType = response.headers.get('content-type');
    let result;
    
    if (contentType && contentType.includes('application/json')) {
      result = await response.json();
    } else {
      // Response là plain text
      const text = await response.text();
      result = { message: text };
    }

    return result;
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

export default { getCertificates, getCertificateById, createCertificate, deleteCertificate };
