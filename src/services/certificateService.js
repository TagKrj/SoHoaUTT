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

/**
 * Tạo chứng chỉ hàng loạt
 */
export const createCertificatesBatch = async (certificatesData, pdfFiles) => {
  try {
    // Prepare FormData
    const formData = new FormData();
    
    // Add certificatesJson as string
    const jsonString = JSON.stringify(certificatesData);
    console.log('Sending certificatesJson:', jsonString);
    formData.append('certificatesJson', jsonString);
    
    // Add all PDF files
    console.log('PDF files count:', pdfFiles.length);
    pdfFiles.forEach((file, index) => {
      console.log(`Adding PDF file ${index}:`, file.name);
      formData.append('pdfFiles', file);
    });

    console.log('Making request to:', API_ENDPOINTS.CERTIFICATES.CREATE_BATCH);

    const response = await fetch(API_ENDPOINTS.CERTIFICATES.CREATE_BATCH, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      body: formData
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    // Read response body once - không gọi 2 lần vì body stream sẽ hết
    const contentType = response.headers.get('content-type');
    let responseBody;
    
    if (contentType && contentType.includes('application/json')) {
      responseBody = await response.json();
    } else {
      const text = await response.text();
      responseBody = { message: text };
    }

    console.log('Response body:', responseBody);

    if (!response.ok) {
      const errorMsg = responseBody.message || responseBody.error || 'Lỗi tạo chứng chỉ hàng loạt';
      throw new Error(`Server error (${response.status}): ${errorMsg}`);
    }

    return responseBody;
  } catch (error) {
    console.error('Batch create error:', error);
    throw new Error(error.message);
  }
};

/**
 * Lấy metadata từ PDF file
 * @param {File} pdfFile - PDF file binary
 * @param {string} id - Certificate ID
 */
export const getMetadataFromPdf = async (pdfFile, id) => {
  try {
    if (!pdfFile || !id) {
      throw new Error('Vui lòng cung cấp PDF file và ID');
    }

    const formData = new FormData();
    formData.append('pdfFile', pdfFile);
    formData.append('id', id);

    console.log('Getting metadata from PDF:', pdfFile.name, 'ID:', id);

    const response = await fetch(API_ENDPOINTS.CERTIFICATES.GET_METADATA, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Lỗi lấy metadata: ${response.status}`);
    }

    const result = await response.json();
    console.log('Metadata result:', result);
    return result; // Returns { fileHash, metaJson }
  } catch (error) {
    console.error('Get metadata error:', error);
    throw new Error(error.message);
  }
};

export default { getCertificates, getCertificateById, createCertificate, deleteCertificate, createCertificatesBatch };
