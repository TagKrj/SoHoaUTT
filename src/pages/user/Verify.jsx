import { useState, useRef } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { getMetadataFromPdf } from '../../services/certificateService';
import pdf from '../../assets/icons/pdf.svg';

const VerifyPage = () => {
    const [combinedPdfFile, setCombinedPdfFile] = useState(null);
    const [combinedId, setCombinedId] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [verifyResult, setVerifyResult] = useState(null);
    const [verifyError, setVerifyError] = useState(null);
    const combinedFileInputRef = useRef(null);

    // Handle PDF file for combined method
    const handleCombinedPdfFile = async (file) => {
        if (file && file.type === 'application/pdf') {
            if (file.size > 10 * 1024 * 1024) {
                alert('File quá lớn. Kích thước tối đa là 10MB');
                return;
            }
            setCombinedPdfFile(file);
        } else {
            alert('Vui lòng chọn file PDF');
        }
    };

    const handleCombinedFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) handleCombinedPdfFile(file);
    };

    const handleClickCombinedUpload = () => {
        combinedFileInputRef.current?.click();
    };

    // Verify with combined method (PDF + ID)
    const handleVerifyCombined = async () => {
        if (!combinedPdfFile || !combinedId.trim()) {
            alert('Vui lòng chọn file PDF và nhập mã chứng chỉ');
            return;
        }

        setIsVerifying(true);
        setVerifyResult(null);
        setVerifyError(null);

        try {
            const metadata = await getMetadataFromPdf(combinedPdfFile, combinedId);
            console.log('API Response:', metadata);

            setVerifyResult({
                fileHash: metadata.fileHash,
                metaJson: metadata.metaJson,
                certificateId: combinedId,
                fileName: combinedPdfFile.name
            });
        } catch (error) {
            console.error('Verify error:', error);
            setVerifyError(error.message);
            alert(`❌ Lỗi: ${error.message}`);
        } finally {
            setIsVerifying(false);
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    };

    return (
        <MainLayout userRole="USER">
            <div className="p-8 bg-gray-50 min-h-screen">
                {/* Page Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-[28px] font-bold text-[#262662] mb-3">Xác Thực Chứng Chỉ</h1>
                    <p className="text-[15px] text-[#666666]">Kiểm tra tính xác thực của chứng chỉ từ file PDF hoặc mã số chứng chỉ</p>
                </div>

                {/* Combined Method - Recommended */}
                <div className="bg-gradient-to-br from-[rgba(16,185,129,0.05)] to-[rgba(16,185,129,0.02)] border-2 border-[rgba(16,185,129,0.2)] rounded-lg mt-8">
                    {/* Badge */}
                    <div className="p-6 pb-0">
                        <div className="inline-flex items-center gap-2 bg-[rgba(16,185,129,0.15)] px-4 py-2 rounded-full">
                            <svg width="13" height="12" viewBox="0 0 13 12" fill="none">
                                <path d="M6.5 1L8 4L11.5 4.5L9 7L9.5 10.5L6.5 9L3.5 10.5L4 7L1.5 4.5L5 4L6.5 1Z" fill="#059669" stroke="#059669" strokeWidth="1.5" strokeLinejoin="round" />
                            </svg>
                            <span className="text-xs font-bold text-[#059669]">KHUYẾN NGHỊ</span>
                        </div>
                    </div>

                    <div className="p-6 pt-4">
                        <h2 className="text-base font-bold text-[#262662] mb-2">Xác Thực Kép - Bảo Mật Cao Nhất</h2>
                        <p className="text-sm text-[#666666] mb-6">
                            Sử dụng cả file PDF và mã chứng chỉ để đảm bảo độ chính xác tuyệt đối. Phương thức này giúp phát hiện các trường hợp giả mạo tinh vi nhất.
                        </p>

                        {/* Inputs */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            {/* PDF Input */}
                            <div>
                                <label className="text-sm font-semibold text-[#262662] block mb-2">
                                    File PDF chứng chỉ
                                </label>
                                <input
                                    ref={combinedFileInputRef}
                                    type="file"
                                    accept=".pdf,application/pdf"
                                    onChange={handleCombinedFileSelect}
                                    className="hidden"
                                />
                                <button
                                    onClick={handleClickCombinedUpload}
                                    className="w-full px-6 py-2 bg-[#F1A027] text-white rounded-lg font-bold text-sm hover:bg-[#d89123] transition-colors flex items-center justify-center gap-2"
                                >
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                        <path d="M7 1V10M7 1L4 4M7 1L10 4M1 13H13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Chọn file PDF
                                </button>
                                {combinedPdfFile && (
                                    <p className="text-xs text-[#059669] mt-2 truncate">✓ {combinedPdfFile.name}</p>
                                )}
                            </div>

                            {/* ID Input */}
                            <div>
                                <label className="text-sm font-bold text-[#262662] block mb-2">
                                    Mã chứng chỉ
                                </label>
                                <input
                                    type="text"
                                    value={combinedId}
                                    onChange={(e) => setCombinedId(e.target.value)}
                                    placeholder="Nhập mã chứng chỉ..."
                                    className="w-full px-4 py-2 border-2 border-[#E0E0E0] rounded-lg text-sm focus:outline-none focus:border-[#059669] transition-colors"
                                />
                            </div>
                        </div>

                        {/* Verify Button */}
                        <button
                            onClick={handleVerifyCombined}
                            disabled={!combinedPdfFile || !combinedId.trim() || isVerifying}
                            className={`w-full py-3 rounded-lg font-bold text-[15px] transition-colors ${combinedPdfFile && combinedId.trim() && !isVerifying
                                ? 'bg-[#F1A027] text-white hover:bg-[#d89123] cursor-pointer'
                                : 'bg-[#F1A027] text-white opacity-50 cursor-not-allowed'
                                }`}
                        >
                            {isVerifying ? 'Đang xác thực...' : 'Xác thực với bảo mật cao'}
                        </button>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default VerifyPage;
