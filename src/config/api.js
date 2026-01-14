
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const API_ENDPOINTS = {
  // ==================== AUTH ====================
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh-token`,
    PROFILE: `${API_BASE_URL}/auth/profile`,
  },

  // ==================== CERTIFICATES ====================
  CERTIFICATES: {
    // Lấy danh sách tất cả chứng chỉ
    LIST: `${API_BASE_URL}/cert/getall`,
    
    // Lấy chi tiết chứng chỉ theo ID
    GET_BY_ID: (id) => `${API_BASE_URL}/cert/read/${id}`,
    
    // Tạo chứng chỉ đơn lẻ
    CREATE: `${API_BASE_URL}/cert/createCertificate`,
    
    // Cấp nhiều chứng chỉ cùng lúc (JSON metadata + PDF files)
    CREATE_BATCH: `${API_BASE_URL}/cert/createCertificatesBatch`,

     // Lấy metadata thông tin chứng chỉ
    GET_METADATA: `${API_BASE_URL}/cert/getMetadata`,
    
    // Cập nhật thông tin chứng chỉ
    UPDATE: (id) => `${API_BASE_URL}/cert/updateCertificate/${id}`,
    
    // Xóa chứng chỉ theo ID
    DELETE: (id) => `${API_BASE_URL}/cert/deleteCertificate/${id}`,
    
    // ========== VERIFY (Xác thực) ==========
    
    // Xác thực chứng chỉ theo ID
    VERIFY_BY_ID: (id) => `${API_BASE_URL}/cert/verifyByID/${id}`,
    
    // Xác thực chứng chỉ theo Hash
    VERIFY_BY_HASH: (hash) => `${API_BASE_URL}/cert/verifyByHash/${hash}`,
    
   
  },

};

export default API_ENDPOINTS;