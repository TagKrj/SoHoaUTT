import { useState } from 'react';
import { createContract } from '@/services/contractService';

const CreateContractModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        contractHashId: '',
        totalContractValue: '',
        initialEscrowPledge: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleReset = () => {
        setFormData({
            contractHashId: '',
            totalContractValue: '',
            initialEscrowPledge: ''
        });
        setError('');
        setSuccess('');
    };

    const handleCancel = () => {
        handleReset();
        onClose();
    };

    const handleSubmit = async () => {
        // Validation
        setError('');
        setSuccess('');

        if (!formData.contractHashId.trim()) {
            setError('Vui lòng nhập mã hash hợp đồng');
            return;
        }

        if (!formData.totalContractValue || isNaN(formData.totalContractValue)) {
            setError('Vui lòng nhập giá trị hợp đồng hợp lệ');
            return;
        }

        if (!formData.initialEscrowPledge || isNaN(formData.initialEscrowPledge)) {
            setError('Vui lòng nhập tiền escrow hợp lệ');
            return;
        }

        try {
            setLoading(true);

            const payload = {
                contractHashId: formData.contractHashId.trim(),
                totalContractValue: parseInt(formData.totalContractValue),
                initialEscrowPledge: parseInt(formData.initialEscrowPledge),
                executionStartTimestamp: Date.now()
            };

            const response = await createContract(payload);

            setSuccess('✓ ' + response.message);
            handleReset();

            // Call callback to refresh list
            if (onSuccess) {
                onSuccess();
            }

            // Đóng modal sau 1.5 giây
            setTimeout(() => {
                onClose();
            }, 1500);

        } catch (err) {
            setError(err.message || 'Lỗi khi tạo hợp đồng');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl shadow-xl">
                {/* Modal Header */}
                <div className="bg-white rounded-t-lg border-b border-[#E0E0E0] px-8 py-5 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-[#262662]">
                        Tạo Hợp Đồng Mới
                    </h2>
                    <button
                        onClick={handleCancel}
                        className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Modal Content */}
                <div className="px-8 py-6">
                    {/* Success Message */}
                    {success && (
                        <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg mb-6">
                            {success}
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <div className="space-y-5">
                        {/* Mã Hash Hợp Đồng */}
                        <div>
                            <label className="block text-sm font-bold text-[#262662] mb-2">
                                Mã Hash Hợp Đồng <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="contractHashId"
                                value={formData.contractHashId}
                                onChange={handleInputChange}
                                placeholder="VD: 2111/HOABINH/HĐXL"
                                className="w-full px-4 py-3 border-2 border-[#E0E0E0] rounded-lg text-sm focus:outline-none focus:border-[#F1A027] transition-colors"
                                disabled={loading}
                            />
                        </div>

                        {/* Giá Trị Hợp Đồng */}
                        <div>
                            <label className="block text-sm font-bold text-[#262662] mb-2">
                                Giá Trị Hợp Đồng (VND) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="totalContractValue"
                                value={formData.totalContractValue}
                                onChange={handleInputChange}
                                placeholder="VD: 1000000000"
                                className="w-full px-4 py-3 border-2 border-[#E0E0E0] rounded-lg text-sm focus:outline-none focus:border-[#F1A027] transition-colors"
                                disabled={loading}
                            />
                            <p className="text-xs text-[#666666] mt-1">
                                {formData.totalContractValue && !isNaN(formData.totalContractValue)
                                    ? new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND'
                                    }).format(formData.totalContractValue)
                                    : ''
                                }
                            </p>
                        </div>

                        {/* Tiền Escrow Thửa Đầu */}
                        <div>
                            <label className="block text-sm font-bold text-[#262662] mb-2">
                                Tiền Escrow Thửa Đầu (VND) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="initialEscrowPledge"
                                value={formData.initialEscrowPledge}
                                onChange={handleInputChange}
                                placeholder="VD: 200000000"
                                className="w-full px-4 py-3 border-2 border-[#E0E0E0] rounded-lg text-sm focus:outline-none focus:border-[#F1A027] transition-colors"
                                disabled={loading}
                            />
                            <p className="text-xs text-[#666666] mt-1">
                                {formData.initialEscrowPledge && !isNaN(formData.initialEscrowPledge)
                                    ? new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND'
                                    }).format(formData.initialEscrowPledge)
                                    : ''
                                }
                            </p>
                        </div>
                    </div>

                    {/* Tỷ lệ Escrow preview */}
                    {formData.totalContractValue && formData.initialEscrowPledge && (
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm text-[#262662] font-bold mb-2">TỶ LỆ ESCROW</p>
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                <div
                                    className="bg-[#F1A027] h-2 rounded-full"
                                    style={{
                                        width: `${((formData.initialEscrowPledge / formData.totalContractValue) * 100)}%`
                                    }}
                                ></div>
                            </div>
                            <p className="text-xs text-[#666666]">
                                {((formData.initialEscrowPledge / formData.totalContractValue) * 100).toFixed(2)}% của giá trị hợp đồng
                            </p>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="bg-white border-t rounded-b-lg border-[#E0E0E0] px-8 py-4 flex justify-end gap-3">
                    <button
                        onClick={handleCancel}
                        disabled={loading}
                        className="h-10 px-6 bg-white border border-[#E0E0E0] rounded-lg font-bold text-sm text-[#666666] hover:border-[#262662] transition-colors cursor-pointer disabled:opacity-50"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`h-10 px-8 bg-[#F1A027] rounded-lg font-bold text-sm text-white flex items-center gap-2 transition-colors cursor-pointer ${loading
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-[#d89123]'
                            }`}
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Đang tạo...
                            </>
                        ) : (
                            <>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                Tạo Hợp Đồng
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateContractModal;
