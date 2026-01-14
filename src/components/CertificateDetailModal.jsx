import { useState, useEffect } from 'react';
import { getCertificateById } from '@/services/certificateService';

const CertificateDetailModal = ({ certificateId, isOpen, onClose }) => {
    const [certificate, setCertificate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch dữ liệu chi tiết chứng chỉ
    useEffect(() => {
        if (isOpen && certificateId) {
            fetchCertificateDetail();
        }
    }, [isOpen, certificateId]);

    const fetchCertificateDetail = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getCertificateById(certificateId);
            setCertificate({
                id: response.ID,
                studentId: response.StudentID,
                name: response.Name,
                major: response.Major,
                issuedAt: response.IssuedAt,
                issuer: response.Issuer,
                signature: response.Signature
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Format ngày
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN');
    };

    // Format signature để hiển thị (truncate rất dài)
    const formatSignature = (sig) => {
        if (!sig) return '';
        return sig.substring(0, 60) + '...';
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
                {/* Modal Header */}
                <div className="sticky top-0 bg-white border-b border-[#E0E0E0] px-8 py-5 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-[#262662]">
                        Chi Tiết Chứng Chỉ
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
                    {!loading && !error && certificate && (
                        <div className="space-y-6">
                            {/* Section 1: Thông tin cơ bản */}
                            <div className="bg-gray-50 rounded-lg p-5">
                                <h3 className="text-sm font-bold text-[#262662] mb-4">THÔNG TIN CƠ BẢN</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-xs font-bold text-[#666666] mb-1">MÃ CHỨNG CHỈ</p>
                                        <p className="text-sm text-[#262626] break-all">{certificate.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-[#666666] mb-1">MÃ SINH VIÊN</p>
                                        <p className="text-sm text-[#262626]">{certificate.studentId}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-xs font-bold text-[#666666] mb-1">TÊN CHỨNG CHỈ</p>
                                        <p className="text-sm text-[#262626]">{certificate.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-[#666666] mb-1">NGÀNH HỌC</p>
                                        <p className="text-sm text-[#262626]">{certificate.major}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-[#666666] mb-1">CẤP BỞI</p>
                                        <p className="text-sm text-[#262626]">{certificate.issuer}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Thông tin ngày */}
                            <div className="bg-gray-50 rounded-lg p-5">
                                <h3 className="text-sm font-bold text-[#262662] mb-4">THÔNG TIN NGÀY</h3>
                                <div>
                                    <p className="text-xs font-bold text-[#666666] mb-1">NGÀY CẤP</p>
                                    <p className="text-sm text-[#262626]">{formatDate(certificate.issuedAt)}</p>
                                </div>
                            </div>

                            {/* Section 3: Chữ ký số */}
                            <div className="bg-gray-50 rounded-lg p-5">
                                <h3 className="text-sm font-bold text-[#262662] mb-4">CHỮ KÝ SỐ</h3>
                                <div className="bg-white p-4 rounded border border-[#E0E0E0] max-h-32 overflow-y-auto">
                                    <p className="text-xs text-gray-500 font-mono break-all leading-relaxed">
                                        {certificate.signature}
                                    </p>
                                </div>
                                <div className="mt-3 flex gap-2">
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(certificate.signature);
                                            alert('Đã sao chép chữ ký');
                                        }}
                                        className="px-4 py-2 text-sm font-medium text-[#262662] bg-white border border-[#E0E0E0] rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                                    >
                                        Sao chép
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="sticky bottom-0 bg-white border-t border-[#E0E0E0] px-8 py-4 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 text-[#262662] bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors cursor-pointer"
                    >
                        Đóng
                    </button>
                    <button
                        className="px-6 py-2 text-white bg-[#F1A027] hover:bg-[#d89020] rounded-lg font-medium transition-colors cursor-pointer"
                    >
                        In / Tải về
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CertificateDetailModal;
