import { useState, useEffect, useCallback } from 'react';
import { getCertificates, deleteCertificate, createCertificate } from '@/services/certificateService';

export const useCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  /**
   * Fetch danh sách chứng chỉ
   */
  const fetchCertificates = useCallback(async (page = 1, limit = 20, status = '', major = '') => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCertificates(page, limit, status, major);
      
      // Map dữ liệu từ API
      const mappedData = response.result.map(cert => ({
        id: cert.ID,
        studentId: cert.StudentID,
        name: cert.Name,
        major: cert.Major,
        issuedAt: cert.IssuedAt,
        issuer: cert.Issuer,
        signature: cert.Signature
      }));

      setCertificates(mappedData);
      setCurrentPage(page);
      setTotalCount(response.result.length);
    } catch (err) {
      setError(err.message);
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Load certificates khi component mount
   */
  useEffect(() => {
    fetchCertificates(1, pageSize);
  }, [pageSize, fetchCertificates]);

  /**
   * Tạo chứng chỉ mới
   */
  const createNew = useCallback(async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createCertificate(formData);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Xóa chứng chỉ
   */
  const removeCertificate = useCallback(async (id) => {
    try {
      await deleteCertificate(id);
      setCertificates(prev => prev.filter(cert => cert.id !== id));
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  /**
   * Thay đổi trang
   */
  const goToPage = useCallback((page) => {
    fetchCertificates(page, pageSize);
  }, [pageSize, fetchCertificates]);

  /**
   * Lọc theo status hoặc major
   */
  const filterCertificates = useCallback((status = '', major = '') => {
    fetchCertificates(1, pageSize, status, major);
  }, [pageSize, fetchCertificates]);

  return {
    certificates,
    loading,
    error,
    currentPage,
    pageSize,
    totalCount,
    fetchCertificates,
    createNew,
    removeCertificate,
    goToPage,
    filterCertificates,
    setPageSize
  };
};

export default useCertificates;
