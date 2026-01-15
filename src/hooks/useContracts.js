import { useState, useEffect, useCallback } from 'react';
import { getContracts, deleteContract, searchContractByHashId } from '@/services/contractService';

export const useContracts = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * Format currency
   */
  const formatCurrency = (value) => {
    if (!value) return '0 VND';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  /**
   * Fetch danh sách hợp đồng
   */
  const fetchContracts = useCallback(async (page = 1, limit = 20) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getContracts(page, limit);
      
      // Map dữ liệu từ API
      const mappedData = response.data.map(contract => ({
        id: contract.id,
        contractHashId: contract.contractHashId,
        totalContractValue: contract.totalContractValue,
        initialEscrowPledge: contract.initialEscrowPledge,
        totalContractValueFormatted: formatCurrency(contract.totalContractValue),
        initialEscrowPledgeFormatted: formatCurrency(contract.initialEscrowPledge)
      }));

      setContracts(mappedData);
      setCurrentPage(page);
      setTotalCount(response.data.length);
    } catch (err) {
      setError(err.message);
      setContracts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Load contracts khi component mount
   */
  useEffect(() => {
    fetchContracts(1, pageSize);
  }, [pageSize, fetchContracts]);

  /**
   * Tìm kiếm hợp đồng theo mã hash
   */
  const searchContracts = useCallback(async (hashId) => {
    if (!hashId.trim()) {
      // Reset nếu input trống
      setSearchQuery('');
      fetchContracts(1, pageSize);
      return;
    }

    setLoading(true);
    setError(null);
    setSearchQuery(hashId);
    try {
      const response = await searchContractByHashId(hashId);
      
      if (response.data) {
        const contract = response.data;
        const mapped = {
          id: contract.id,
          contractHashId: contract.contractHashId,
          totalContractValue: contract.totalContractValue,
          initialEscrowPledge: contract.initialEscrowPledge,
          totalContractValueFormatted: formatCurrency(contract.totalContractValue),
          initialEscrowPledgeFormatted: formatCurrency(contract.initialEscrowPledge)
        };
        setContracts([mapped]);
        setTotalCount(1);
      } else {
        setContracts([]);
        setTotalCount(0);
      }
    } catch (err) {
      setError(err.message);
      setContracts([]);
    } finally {
      setLoading(false);
    }
  }, [pageSize, fetchContracts]);

  /**
   * Xóa hợp đồng
   */
  const removeContract = useCallback(async (id) => {
    try {
      await deleteContract(id);
      setContracts(prev => prev.filter(contract => contract.id !== id));
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  /**
   * Go to specific page
   */
  const goToPage = useCallback((page) => {
    if (searchQuery) {
      // Nếu đang search, không cần pagination
      return;
    }
    fetchContracts(page, pageSize);
  }, [pageSize, searchQuery, fetchContracts]);

  /**
   * Set page size
   */
  const setPageSizeHandle = useCallback((newSize) => {
    setPageSize(newSize);
    fetchContracts(1, newSize);
  }, [fetchContracts]);

  /**
   * Calculate total pages
   */
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    contracts,
    loading,
    error,
    currentPage,
    pageSize,
    totalCount,
    totalPages,
    searchQuery,
    goToPage,
    setPageSize: setPageSizeHandle,
    removeContract,
    searchContracts,
    refetch: () => fetchContracts(currentPage, pageSize),
    formatCurrency
  };
};

export default useContracts;
