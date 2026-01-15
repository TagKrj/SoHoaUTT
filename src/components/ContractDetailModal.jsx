import { useState, useEffect } from 'react';
import { getContractById } from '@/services/contractService';

const ContractDetailModal = ({ contractId, isOpen, onClose }) => {
    const [contract, setContract] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch dữ liệu chi tiết hợp đồng
    useEffect(() => {
        if (isOpen && contractId) {
            fetchContractDetail();
        }
    }, [isOpen, contractId]);

    const fetchContractDetail = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getContractById(contractId);
            setContract({
                id: response.id,
                contractHashId: response.contractHashId,
                totalContractValue: response.totalContractValue,
                initialEscrowPledge: response.initialEscrowPledge,
                totalContractValueFormatted: formatCurrency(response.totalContractValue),
                initialEscrowPledgeFormatted: formatCurrency(response.initialEscrowPledge)
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Format currency
    const formatCurrency = (value) => {
        if (!value) return '0 VND';
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
                {/* Modal Header */}
                <div className="sticky top-0 bg-white border-b border-[#E0E0E0] px-8 py-5 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-[#262662]">
                        Chi Tiết Hợp Đồng
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Modal Content */}
                <div className="px-8 py-6">
                    {/* Loading State */}
                    {loading && (
                        <div className="py-8 text-center">
                            <div className="inline-block animate-spin">
                                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                </svg>
                            </div>
                            <p className="mt-3 text-gray-600">Đang tải thông tin...</p>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Data Display */}
                    {!loading && !error && contract && (
                        <div className="space-y-6">
                            {/* Section 1: Thông tin cơ bản */}
                            <div className="bg-gray-50 rounded-lg p-5">
                                <h3 className="text-sm font-bold text-[#262662] mb-4">THÔNG TIN CƠ BẢN</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-xs font-bold text-[#666666] mb-1">MÃ HỢP ĐỒNG</p>
                                        <p className="text-sm text-[#262626] break-all">{contract.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-[#666666] mb-1">MÃ HASH HỢP ĐỒNG</p>
                                        <p className="text-sm text-[#262626]">{contract.contractHashId}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Thông tin tài chính */}
                            <div className="bg-gray-50 rounded-lg p-5">
                                <h3 className="text-sm font-bold text-[#262662] mb-4">THÔNG TIN TÀI CHÍNH</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-xs font-bold text-[#666666] mb-1">GIÁ TRỊ HỢP ĐỒNG</p>
                                        <p className="text-sm font-semibold text-[#F1A027]">
                                            {contract.totalContractValueFormatted}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-[#666666] mb-1">TIỀN ESCROW THỬA ĐẦU</p>
                                        <p className="text-sm font-semibold text-[#10B981]">
                                            {contract.initialEscrowPledgeFormatted}
                                        </p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-xs font-bold text-[#666666] mb-2">TỶ LỆ ESCROW</p>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-[#F1A027] h-2 rounded-full"
                                                style={{
                                                    width: `${((contract.initialEscrowPledge / contract.totalContractValue) * 100)}%`
                                                }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-[#666666] mt-1">
                                            {((contract.initialEscrowPledge / contract.totalContractValue) * 100).toFixed(2)}%
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Raw Data */}
                            <div className="bg-gray-50 rounded-lg p-5">
                                <h3 className="text-sm font-bold text-[#262662] mb-3">DỮ LIỆU JSON</h3>
                                <pre className="bg-white p-3 rounded border border-[#E0E0E0] text-xs overflow-x-auto">
                                    {JSON.stringify(contract, null, 2)}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContractDetailModal;
