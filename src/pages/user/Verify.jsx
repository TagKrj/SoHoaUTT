import { useState, useRef } from 'react';
import MainLayout from '../../layouts/MainLayout';
import pdf from '../../assets/icons/pdf.svg';

const VerifyPage = () => {
    const [pdfFile, setPdfFile] = useState(null);
    const [certificateId, setCertificateId] = useState('');
    const [combinedPdfFile, setCombinedPdfFile] = useState(null);
    const [combinedId, setCombinedId] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const fileInputRef = useRef(null);
    const combinedFileInputRef = useRef(null);

    // Calculate SHA-256 hash from PDF file
    const calculateFileHash = async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    };

    // Handle PDF file selection for method 1
    const handlePdfFile = async (file) => {
        if (file && file.type === 'application/pdf') {
            if (file.size > 10 * 1024 * 1024) {
                alert('File quá lớn. Kích thước tối đa là 10MB');
                return;
            }
            setPdfFile(file);
        } else {
            alert('Vui lòng chọn file PDF');
        }
    };

    const handlePdfFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) handlePdfFile(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handlePdfFile(file);
    };

    const handleClickUpload = () => {
        fileInputRef.current?.click();
    };

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

    // Verify by PDF hash
    const handleVerifyPdf = async () => {
        if (!pdfFile) {
            alert('Vui lòng chọn file PDF');
            return;
        }

        setIsVerifying(true);
        try {
            const fileHash = await calculateFileHash(pdfFile);
            console.log('PDF Hash:', fileHash);

            // TODO: Call API to verify with hash
            // const response = await fetch('/api/verify/pdf', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ hash: fileHash })
            // });

            // Simulate API call
            setTimeout(() => {
                setIsVerifying(false);
                alert(`Xác thực với hash: ${fileHash.substring(0, 16)}...`);
            }, 1500);
        } catch (error) {
            console.error('Error:', error);
            alert('Có lỗi xảy ra khi xác thực');
            setIsVerifying(false);
        }
    };

    // Verify by certificate ID
    const handleVerifyId = async () => {
        if (!certificateId.trim()) {
            alert('Vui lòng nhập mã chứng chỉ');
            return;
        }

        setIsVerifying(true);
        try {
            console.log('Certificate ID:', certificateId);

            // TODO: Call API to verify with certificate ID
            // const response = await fetch('/api/verify/id', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ certificateId })
            // });

            // Simulate API call
            setTimeout(() => {
                setIsVerifying(false);
                alert(`Tìm kiếm chứng chỉ: ${certificateId}`);
            }, 1500);
        } catch (error) {
            console.error('Error:', error);
            alert('Có lỗi xảy ra khi xác thực');
            setIsVerifying(false);
        }
    };

    // Verify with combined method (PDF hash + ID)
    const handleVerifyCombined = async () => {
        if (!combinedPdfFile || !combinedId.trim()) {
            alert('Vui lòng chọn file PDF và nhập mã chứng chỉ');
            return;
        }

        setIsVerifying(true);
        try {
            const fileHash = await calculateFileHash(combinedPdfFile);
            console.log('Combined - PDF Hash:', fileHash);
            console.log('Combined - Certificate ID:', combinedId);

            // TODO: Call API to verify with both hash and ID
            // const response = await fetch('/api/verify/combined', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ 
            //         hash: fileHash,
            //         certificateId: combinedId 
            //     })
            // });

            // Simulate API call
            setTimeout(() => {
                setIsVerifying(false);
                alert(`Xác thực kép:\nHash: ${fileHash.substring(0, 16)}...\nID: ${combinedId}`);
            }, 1500);
        } catch (error) {
            console.error('Error:', error);
            alert('Có lỗi xảy ra khi xác thực');
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

                {/* Methods Section */}
                <div className="grid grid-cols-2 gap-6 mb-8 relative">
                    {/* Method 1: Upload PDF */}
                    <div className="bg-white rounded-lg shadow-sm border border-[#E0E0E0]">
                        {/* Header */}
                        <div className="p-8 border-b-2 border-[#F5F5F7]">
                            <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-full bg-[#F1A027] flex items-center justify-center shrink-0">
                                    <span className="text-base font-bold text-white">1</span>
                                </div>
                                <h2 className="text-lg font-bold text-[#262662] mt-1">Upload File PDF</h2>
                            </div>
                        </div>

                        {/* Upload Zone */}
                        <div className="p-8">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,application/pdf"
                                onChange={handlePdfFileSelect}
                                className="hidden"
                            />

                            {!pdfFile ? (
                                <div
                                    className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer ${isDragging
                                        ? 'border-[#F1A027] bg-[#FAFAFA]'
                                        : 'border-[#D1D5DB] bg-[#FAFAFA] hover:border-[#F1A027]'
                                        }`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={handleClickUpload}
                                >
                                    <div className="w-16 h-16 mx-auto mb-8 rounded-full bg-[rgba(241,160,39,0.1)] flex items-center justify-center">
                                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                                            <path d="M14 7V21M14 7L9 12M14 7L19 12M7 24H21" stroke="#F1A027" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <h3 className="text-[15px] text-[#262626] mb-2">
                                        Kéo thả file PDF chứng chỉ cần xác thực
                                    </h3>
                                    <p className="text-[13px] text-[#999999]">hoặc click để chọn file (Tối đa 10MB)</p>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleClickUpload();
                                        }}
                                        className="mt-6 px-6 py-2 bg-[#F1A027] text-white rounded-lg font-bold text-sm hover:bg-[#d89123] transition-colors inline-flex items-center gap-2"
                                    >
                                        <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
                                            <path d="M7 1V8M7 1L4 4M7 1L10 4M1 10H13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        Chọn file PDF
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="border border-[#E0E0E0] rounded-lg bg-[#F9FAFB] p-4 flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-lg bg-white border border-[#E0E0E0] flex items-center justify-center shrink-0">
                                            <img src={pdf} alt="" className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-[#262662] truncate">{pdfFile.name}</p>
                                            <p className="text-xs text-[#666666] mt-0.5">{formatFileSize(pdfFile.size)}</p>
                                        </div>
                                        <button
                                            onClick={() => setPdfFile(null)}
                                            className="w-8 h-8 rounded-lg bg-white border border-[#E0E0E0] flex items-center justify-center hover:border-red-500 hover:bg-red-50 transition-colors shrink-0"
                                        >
                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                <path d="M1 1L11 11M1 11L11 1" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Verify Button */}
                        <div className="px-8 pb-8">
                            <button
                                onClick={handleVerifyPdf}
                                disabled={!pdfFile || isVerifying}
                                className={`w-full py-3 rounded-lg font-bold text-[15px] transition-colors ${pdfFile && !isVerifying
                                    ? 'bg-[#D1D5DB] text-white hover:bg-[#b8bcc2] cursor-pointer'
                                    : 'bg-[#D1D5DB] text-white opacity-50 cursor-not-allowed'
                                    }`}
                            >
                                {isVerifying ? 'Đang xác thực...' : 'Xác thực ngay'}
                            </button>
                        </div>
                    </div>

                    {/* Divider - Positioned between cards */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-0.5 h-24 bg-gradient-to-b from-transparent via-[#E0E0E0] to-[#E0E0E0]"></div>
                            <div className="bg-[#F5F5F7] px-4 py-2 rounded-full shadow-md">
                                <span className="text-[13px] font-bold text-[#999999]">HOẶC</span>
                            </div>
                            <div className="w-0.5 h-24 bg-gradient-to-b from-[#E0E0E0] via-[#E0E0E0] to-transparent"></div>
                        </div>
                    </div>

                    {/* Method 2: Certificate ID */}
                    <div className="bg-white rounded-lg shadow-sm border border-[#E0E0E0]">
                        {/* Header */}
                        <div className="p-8 border-b-2 border-[#F5F5F7]">
                            <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-full bg-[#F1A027] flex items-center justify-center shrink-0">
                                    <span className="text-base font-bold text-white">2</span>
                                </div>
                                <h2 className="text-lg font-bold text-[#262662] mt-1">Nhập Mã Chứng Chỉ</h2>
                            </div>
                        </div>

                        {/* Input Form */}
                        <div className="p-8">
                            <div>
                                <label className="text-sm font-bold text-[#262662] block mb-2">
                                    Mã chứng chỉ
                                </label>
                                <input
                                    type="text"
                                    value={certificateId}
                                    onChange={(e) => setCertificateId(e.target.value)}
                                    placeholder="Nhập mã chứng chỉ..."
                                    className="w-full px-4 py-3 border-2 border-[#E0E0E0] rounded-lg text-sm focus:outline-none focus:border-[#F1A027] transition-colors"
                                />
                                <div className="flex items-start gap-2 mt-3">
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="mt-0.5 shrink-0">
                                        <circle cx="6" cy="6" r="5" stroke="#3B82F6" strokeWidth="1.5" />
                                        <path d="M6 4V6.5M6 8.5H6.005" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                    <p className="text-xs text-[#999999]">
                                        Mã chứng chỉ gồm chữ cái và số, không dấu
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Verify Button */}
                        <div className="px-8 pb-8">
                            <button
                                onClick={handleVerifyId}
                                disabled={!certificateId.trim() || isVerifying}
                                className={`w-full py-3 rounded-lg font-bold text-[15px] flex items-center justify-center gap-2 transition-colors ${certificateId.trim() && !isVerifying
                                    ? 'bg-[#F1A027] text-white hover:bg-[#d89123] cursor-pointer'
                                    : 'bg-[#F1A027] text-white opacity-50 cursor-not-allowed'
                                    }`}
                            >
                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                                    <circle cx="6" cy="6" r="5" stroke="white" strokeWidth="2" />
                                    <path d="M10 10L14 14" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                {isVerifying ? 'Đang xác thực...' : 'Tìm kiếm và xác thực'}
                            </button>
                        </div>
                    </div>
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
