import { contractsData } from '../constants/contractsData';

/**
 * Get all contracts with pagination (Mock Data)
 */
export const getContracts = async (page = 1, limit = 20) => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = contractsData.slice(startIndex, endIndex);
      
      resolve({
        data: paginatedData,
        total: contractsData.length,
        page,
        limit
      });
    }, 300);
  });
};

/**
 * Get contract by ID (Mock Data)
 */
export const getContractById = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const contract = contractsData.find(c => c.id === id);
      if (contract) {
        resolve(contract);
      } else {
        reject(new Error('Không tìm thấy hợp đồng'));
      }
    }, 200);
  });
};

/**
 * Search contract by contractHashId (Mock Data)
 */
export const searchContractByHashId = async (contractHashId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const contract = contractsData.find(
        c => c.contractHashId.toLowerCase() === contractHashId.toLowerCase()
      );
      
      if (contract) {
        resolve({
          data: contract,
          status: 'success'
        });
      } else {
        reject(new Error(`Không tìm thấy hợp đồng với mã: ${contractHashId}`));
      }
    }, 200);
  });
};

/**
 * Create new contract (Mock Data)
 */
export const createContract = async (formData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newContract = {
        id: `550e8400-e29b-41d4-a716-${Date.now()}`,
        ...formData
      };
      
      // Thêm vào mock data
      contractsData.push(newContract);
      
      resolve({
        status: 'success',
        message: 'Successfully created contract - Hợp đồng đã được tạo thành công',
        data: newContract
      });
    }, 500);
  });
};

/**
 * Delete contract (Mock Data)
 */
export const deleteContract = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = contractsData.findIndex(c => c.id === id);
      if (index !== -1) {
        contractsData.splice(index, 1);
        resolve({
          status: 'success',
          message: 'Contract deleted successfully - Hợp đồng đã được xóa thành công'
        });
      } else {
        reject(new Error('Không tìm thấy hợp đồng để xóa'));
      }
    }, 300);
  });
};

export default {
  getContracts,
  getContractById,
  searchContractByHashId,
  createContract,
  deleteContract
};
