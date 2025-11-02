import { useState, useRef, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import pdf from '../../assets/icons/pdf.svg';

const BatchPage = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [jsonFile, setJsonFile] = useState(null);
    const [pdfFiles, setPdfFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isPdfDragging, setIsPdfDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [jsonData, setJsonData] = useState(null);
    const fileInputRef = useRef(null);
    const pdfInputRef = useRef(null);

    const steps = [
        { number: 1, label: 'Upload JSON' },
        { number: 2, label: 'Upload PDFs' },
        { number: 3, label: 'Xác nhận' },
        { number: 4, label: 'Hoàn tất' }
    ];

    // Handle paste event for JSON file
    useEffect(() => {
        const handlePaste = (e) => {
            if (currentStep === 1) {
                // JSON file paste
                const items = e.clipboardData?.items;
                if (!items) return;

                for (let i = 0; i < items.length; i++) {
                    const item = items[i];
                    if (item.type === 'application/json' || item.kind === 'file') {
                        const file = item.getAsFile();
                        if (file && file.name.endsWith('.json')) {
                            handleFile(file);
                            e.preventDefault();
                        }
                    }
                }
            } else if (currentStep === 2) {
                // PDF files paste
                const items = e.clipboardData?.items;
                if (!items) return;

                const newFiles = [];
                for (let i = 0; i < items.length; i++) {
                    const item = items[i];
                    if (item.kind === 'file') {
                        const file = item.getAsFile();
                        if (file && file.type === 'application/pdf') {
                            newFiles.push(file);
                        }
                    }
                }

                if (newFiles.length > 0) {
                    handlePdfFiles(newFiles);
                    e.preventDefault();
                }
            }
        };

        document.addEventListener('paste', handlePaste);
        return () => document.removeEventListener('paste', handlePaste);
    }, [currentStep]);

    const handleFile = (file) => {
        if (file && file.name.endsWith('.json')) {
            if (file.size > 10 * 1024 * 1024) {
                alert('File quá lớn. Kích thước tối đa là 10MB');
                return;
            }
            setJsonFile(file);
            // Read JSON file content
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    setJsonData(data);
                } catch (error) {
                    alert('File JSON không hợp lệ');
                    setJsonFile(null);
                }
            };
            reader.readAsText(file);
        } else {
            alert('Vui lòng chọn file JSON');
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
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
        if (file) handleFile(file);
    };

    const handleClickUpload = () => {
        fileInputRef.current?.click();
    };

    const handleDownloadTemplate = () => {
        // Download JSON template
        const template = {
            certificates: [
                {
                    studentId: "SV001",
                    studentName: "Nguyễn Văn A",
                    email: "nguyenvana@example.com",
                    certificateName: "Chứng chỉ CNTT",
                    major: "CNTT",
                    issueDate: "2024-01-01",
                    gpa: 3.5,
                    classification: "Giỏi"
                }
            ]
        };
        const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'certificate-template.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleNextStep = () => {
        if (currentStep === 1 && jsonFile) {
            setCurrentStep(2);
        } else if (currentStep === 2 && pdfFiles.length > 0) {
            setCurrentStep(3);
        } else if (currentStep < 4) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleConfirmSubmit = async () => {
        setIsProcessing(true);

        // Simulate API call
        setTimeout(() => {
            setIsProcessing(false);
            setCurrentStep(4);
        }, 2000);
    };

    const handleReset = () => {
        setCurrentStep(1);
        setJsonFile(null);
        setPdfFiles([]);
        setJsonData(null);
        setIsProcessing(false);
    };

    // PDF file handlers
    const handlePdfFiles = (files) => {
        const validFiles = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.type === 'application/pdf') {
                if (file.size > 5 * 1024 * 1024) {
                    alert(`File ${file.name} quá lớn. Kích thước tối đa là 5MB`);
                    continue;
                }
                validFiles.push(file);
            } else {
                alert(`File ${file.name} không phải file PDF`);
            }
        }

        if (validFiles.length > 0) {
            setPdfFiles(prev => [...prev, ...validFiles]);
        }
    };

    const handlePdfFileSelect = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            handlePdfFiles(files);
        }
    };

    const handlePdfDragOver = (e) => {
        e.preventDefault();
        setIsPdfDragging(true);
    };

    const handlePdfDragLeave = (e) => {
        e.preventDefault();
        setIsPdfDragging(false);
    };

    const handlePdfDrop = (e) => {
        e.preventDefault();
        setIsPdfDragging(false);
        const files = Array.from(e.dataTransfer.files || []);
        if (files.length > 0) {
            handlePdfFiles(files);
        }
    };

    const handleClickPdfUpload = () => {
        pdfInputRef.current?.click();
    };

    const handleRemovePdf = (index) => {
        setPdfFiles(prev => prev.filter((_, i) => i !== index));
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
                <div className="mb-6">
                    <h1 className="text-[28px] font-bold text-[#262662] leading-tight">Cấp Chứng Chỉ Hàng Loạt</h1>
                    <p className="text-sm text-[#666666] mt-3">Upload file JSON chứa danh sách chứng chỉ và các file PDF tương ứng</p>
                </div>

                {/* Step Indicator */}
                <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
                    <div className="relative">
                        {/* Progress Line */}
                        <div className="absolute top-6 left-0 right-0 h-0.5 bg-[#E0E0E0]" style={{ left: '84px', right: '84px' }}></div>

                        {/* Steps */}
                        <div className="relative flex justify-between items-start" style={{ paddingLeft: '32px', paddingRight: '32px' }}>
                            {steps.map((step, index) => (
                                <div key={step.number} className="flex flex-col items-center" style={{ width: index === 0 ? '100px' : index === 1 ? '100px' : index === 2 ? '64px' : '59px' }}>
                                    {/* Circle */}
                                    <div
                                        className={`w-12 h-12 rounded-full flex items-center justify-center border-[3px] transition-colors ${step.number < currentStep
                                            ? 'bg-[#10B981] border-[#10B981]'
                                            : step.number === currentStep
                                                ? 'bg-[#F1A027] border-[#F1A027]'
                                                : 'bg-white border-[#E0E0E0]'
                                            }`}
                                    >
                                        <span className={`text-lg font-bold ${step.number <= currentStep ? 'text-white' : 'text-[#999999]'
                                            }`}>
                                            {step.number}
                                        </span>
                                    </div>
                                    {/* Label */}
                                    <p className={`text-sm font-bold mt-4 ${step.number < currentStep
                                        ? 'text-[#10B981]'
                                        : step.number === currentStep
                                            ? 'text-[#F1A027]'
                                            : 'text-[#999999]'
                                        }`}>
                                        {step.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Step 1 Content */}
                {currentStep === 1 && (
                    <div className="bg-white rounded-lg shadow-sm border border-[#E0E0E0]">
                        {/* Card Header */}
                        <div className="p-8">
                            <div className="flex items-start gap-3 mb-1">
                                <div className="w-8 h-8 rounded-full bg-[#F1A027] flex items-center justify-center shrink-0">
                                    <span className="text-base font-bold text-white">1</span>
                                </div>
                                <h2 className="text-lg font-bold text-[#262662]">Upload file JSON chứa thông tin chứng chỉ</h2>
                            </div>
                            <p className="text-sm text-[#666666] ml-11">Tải lên file JSON chứa danh sách thông tin chứng chỉ cần cấp</p>
                        </div>

                        {/* Download Template Button */}
                        <div className="px-8">
                            <button
                                onClick={handleDownloadTemplate}
                                className="px-5 py-3 bg-[rgba(59,130,246,0.1)] border border-[#3B82F6] rounded-[7px] text-sm font-bold text-[#3B82F6] flex items-center gap-2 hover:bg-[rgba(59,130,246,0.2)] transition-colors cursor-pointer"
                            >
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M7 1V10M7 10L3 6M7 10L11 6M1 13H13" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Tải xuống mẫu JSON
                            </button>
                        </div>

                        {/* Upload Zone */}
                        <div className="p-8">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".json,application/json"
                                onChange={handleFileSelect}
                                className="hidden"
                            />

                            {!jsonFile ? (
                                <div
                                    className={`border-2 border-dashed rounded-[7px] p-12 text-center transition-colors cursor-pointer ${isDragging
                                        ? 'border-[#F1A027] bg-[#FFF8ED]'
                                        : 'border-[#D1D5DB] bg-white hover:border-[#F1A027] hover:bg-[#FFF8ED]'
                                        }`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={handleClickUpload}
                                >
                                    <div className="w-16 h-16 mx-auto mb-8 rounded-full bg-[rgba(241,160,39,0.1)] flex items-center justify-center">
                                        <img src={pdf} alt="" />
                                    </div>
                                    <h3 className="text-base font-bold text-[#262662] mb-2">Kéo thả file JSON vào đây hoặc nhấp để chọn</h3>
                                    <p className="text-sm text-[#666666] mb-1">Chỉ hỗ trợ file .json</p>
                                    <p className="text-xs text-[#999999]">Kích thước tối đa: 10MB</p>
                                </div>
                            ) : (
                                <div className="border border-[#E0E0E0] rounded-lg bg-[#F9FAFB] p-5 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-white border border-[#E0E0E0] flex items-center justify-center shrink-0">
                                        <svg width="23" height="24" viewBox="0 0 23 24" fill="none">
                                            <path d="M1 1V23H22V6L17 1H1Z" stroke="#F1A027" strokeWidth="2" />
                                            <path d="M17 1V6H22" stroke="#F1A027" strokeWidth="2" />
                                            <path d="M6 10H17M6 14H17M6 18H12" stroke="#F1A027" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-[#262662] truncate">{jsonFile.name}</p>
                                        <p className="text-[13px] text-[#666666] mt-1">{(jsonFile.size / 1024).toFixed(2)} KB</p>
                                    </div>
                                    <button
                                        onClick={() => setJsonFile(null)}
                                        className="w-9 h-9 rounded-lg bg-white border border-[#E0E0E0] flex items-center justify-center hover:border-red-500 hover:bg-red-50 transition-colors shrink-0"
                                    >
                                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                                            <path d="M1 1L12 12M1 12L12 1" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Continue Button */}
                        <div className="p-8 pt-0 flex justify-end">
                            <button
                                onClick={handleNextStep}
                                disabled={!jsonFile}
                                className={`px-6 py-3 rounded-lg font-bold text-[15px] flex items-center gap-2 transition-colors ${jsonFile
                                    ? 'bg-[#F1A027] text-white hover:bg-[#d89123] cursor-pointer'
                                    : 'bg-[#F1A027] text-white opacity-50 cursor-not-allowed'
                                    }`}
                            >
                                Tiếp tục
                                <svg width="15" height="13" viewBox="0 0 15 13" fill="none">
                                    <path d="M1 6.5H14M14 6.5L8 1M14 6.5L8 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2, 3, 4 Content - Placeholder */}
                {currentStep === 2 && (
                    <div className="bg-white rounded-lg shadow-sm border border-[#E0E0E0]">
                        {/* Card Header */}
                        <div className="p-8">
                            <div className="flex items-start gap-3 mb-1">
                                <div className="w-8 h-8 rounded-full bg-[#F1A027] flex items-center justify-center shrink-0">
                                    <span className="text-base font-bold text-white">2</span>
                                </div>
                                <h2 className="text-lg font-bold text-[#262662]">Upload các file PDF chứng chỉ</h2>
                            </div>
                            <p className="text-sm text-[#666666] ml-11">Tên file PDF phải khớp với trường "fileName" trong JSON</p>
                        </div>

                        {/* PDF Upload Zone */}
                        <div className="px-8 pb-8">
                            <input
                                ref={pdfInputRef}
                                type="file"
                                accept=".pdf,application/pdf"
                                multiple
                                onChange={handlePdfFileSelect}
                                className="hidden"
                            />

                            {pdfFiles.length === 0 ? (
                                <div
                                    className={`border-2 border-dashed rounded-[7px] p-12 text-center transition-colors cursor-pointer ${isPdfDragging
                                        ? 'border-[#F1A027] bg-[#FFF8ED]'
                                        : 'border-[#D1D5DB] bg-white hover:border-[#F1A027] hover:bg-[#FFF8ED]'
                                        }`}
                                    onDragOver={handlePdfDragOver}
                                    onDragLeave={handlePdfDragLeave}
                                    onDrop={handlePdfDrop}
                                    onClick={handleClickPdfUpload}
                                >
                                    <div className="w-16 h-16 mx-auto mb-8 rounded-full bg-[rgba(241,160,39,0.1)] flex items-center justify-center">
                                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                                            <path d="M14 7V21M14 7L9 12M14 7L19 12M7 24H21" stroke="#F1A027" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <h3 className="text-base font-bold text-[#262662] mb-2">Kéo thả file PDF vào đây hoặc nhấp để chọn</h3>
                                    <p className="text-sm text-[#666666] mb-1">Hỗ trợ chọn nhiều file cùng lúc</p>
                                    <p className="text-xs text-[#999999]">Chỉ hỗ trợ file .pdf - Kích thước mỗi file tối đa: 5MB</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {pdfFiles.map((file, index) => (
                                        <div key={index} className="border border-[#E0E0E0] rounded-lg bg-[#F9FAFB] p-5 flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-white border border-[#E0E0E0] flex items-center justify-center shrink-0">
                                                <img src={pdf} alt="" className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-[#262662] truncate">{file.name}</p>
                                                <p className="text-[13px] text-[#666666] mt-1">{formatFileSize(file.size)}</p>
                                            </div>
                                            <button
                                                onClick={() => handleRemovePdf(index)}
                                                className="w-9 h-9 rounded-lg bg-white border border-[#E0E0E0] flex items-center justify-center hover:border-red-500 hover:bg-red-50 transition-colors shrink-0"
                                            >
                                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                                                    <path d="M1 1L12 12M1 12L12 1" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="px-8 pb-8 flex justify-end gap-3">
                            <button
                                onClick={handlePrevStep}
                                className="px-6 py-3 bg-white border border-[#E0E0E0] rounded-lg font-bold text-[15px] text-[#262662] flex items-center gap-2 hover:bg-gray-50 transition-colors"
                            >
                                <svg width="15" height="13" viewBox="0 0 15 13" fill="none">
                                    <path d="M14 6.5H1M1 6.5L7 1M1 6.5L7 12" stroke="#262662" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Quay lại
                            </button>
                            {pdfFiles.length > 0 && (
                                <button
                                    onClick={handleClickPdfUpload}
                                    className="px-6 py-3 bg-white border border-[#E0E0E0] rounded-lg font-bold text-[15px] text-[#262662] flex items-center gap-2 hover:bg-gray-50 transition-colors"
                                >
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                        <path d="M7 1V13M1 7H13" stroke="#262662" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Thêm file
                                </button>
                            )}
                            <button
                                onClick={handleNextStep}
                                disabled={pdfFiles.length === 0}
                                className={`px-6 py-3 rounded-lg font-bold text-[15px] flex items-center gap-2 transition-colors ${pdfFiles.length > 0
                                    ? 'bg-[#F1A027] text-white hover:bg-[#d89123] cursor-pointer'
                                    : 'bg-[#F1A027] text-white opacity-50 cursor-not-allowed'
                                    }`}
                            >
                                Tiếp tục
                                <svg width="15" height="13" viewBox="0 0 15 13" fill="none">
                                    <path d="M1 6.5H14M14 6.5L8 1M14 6.5L8 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3, 4 Content - Placeholder */}
                {currentStep === 3 && (
                    <div className="bg-white rounded-lg shadow-sm border border-[#E0E0E0]">
                        {/* Card Header */}
                        <div className="p-8 border-b border-[#E0E0E0]">
                            <div className="flex items-start gap-3 mb-1">
                                <div className="w-8 h-8 rounded-full bg-[#F1A027] flex items-center justify-center shrink-0">
                                    <span className="text-base font-bold text-white">3</span>
                                </div>
                                <h2 className="text-lg font-bold text-[#262662]">Xác nhận thông tin</h2>
                            </div>
                            <p className="text-sm text-[#666666] ml-11">Kiểm tra lại thông tin trước khi cấp chứng chỉ hàng loạt</p>
                        </div>

                        {/* Summary Section */}
                        <div className="p-8 space-y-6">
                            {/* JSON File Info */}
                            <div>
                                <h3 className="text-base font-bold text-[#262662] mb-3">File JSON</h3>
                                <div className="border border-[#E0E0E0] rounded-lg bg-[#F9FAFB] p-5 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-white border border-[#E0E0E0] flex items-center justify-center shrink-0">
                                        <svg width="23" height="24" viewBox="0 0 23 24" fill="none">
                                            <path d="M1 1V23H22V6L17 1H1Z" stroke="#F1A027" strokeWidth="2" />
                                            <path d="M17 1V6H22" stroke="#F1A027" strokeWidth="2" />
                                            <path d="M6 10H17M6 14H17M6 18H12" stroke="#F1A027" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-[#262662] truncate">{jsonFile?.name}</p>
                                        <p className="text-[13px] text-[#666666] mt-1">
                                            {jsonData?.certificates?.length || 0} chứng chỉ • {formatFileSize(jsonFile?.size || 0)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* PDF Files Info */}
                            <div>
                                <h3 className="text-base font-bold text-[#262662] mb-3">File PDF ({pdfFiles.length})</h3>
                                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                    {pdfFiles.map((file, index) => (
                                        <div key={index} className="border border-[#E0E0E0] rounded-lg bg-[#F9FAFB] p-4 flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-white border border-[#E0E0E0] flex items-center justify-center shrink-0">
                                                <img src={pdf} alt="" className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-[#262662] truncate">{file.name}</p>
                                                <p className="text-xs text-[#666666] mt-0.5">{formatFileSize(file.size)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Certificate Preview */}
                            {jsonData?.certificates && (
                                <div>
                                    <h3 className="text-base font-bold text-[#262662] mb-3">Danh sách chứng chỉ</h3>
                                    <div className="border border-[#E0E0E0] rounded-lg overflow-hidden">
                                        <table className="w-full">
                                            <thead className="bg-[#F9FAFB] border-b border-[#E0E0E0]">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-bold text-[#666666] uppercase">STT</th>
                                                    <th className="px-4 py-3 text-left text-xs font-bold text-[#666666] uppercase">Mã SV</th>
                                                    <th className="px-4 py-3 text-left text-xs font-bold text-[#666666] uppercase">Họ và tên</th>
                                                    <th className="px-4 py-3 text-left text-xs font-bold text-[#666666] uppercase">Email</th>
                                                    <th className="px-4 py-3 text-left text-xs font-bold text-[#666666] uppercase">Tên chứng chỉ</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {jsonData.certificates.slice(0, 5).map((cert, index) => (
                                                    <tr key={index} className="border-b border-[#E0E0E0] last:border-0">
                                                        <td className="px-4 py-3 text-sm text-[#262662]">{index + 1}</td>
                                                        <td className="px-4 py-3 text-sm font-medium text-[#262662]">{cert.studentId}</td>
                                                        <td className="px-4 py-3 text-sm text-[#262662]">{cert.studentName}</td>
                                                        <td className="px-4 py-3 text-sm text-[#666666]">{cert.email}</td>
                                                        <td className="px-4 py-3 text-sm text-[#262662]">{cert.certificateName}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {jsonData.certificates.length > 5 && (
                                            <div className="bg-[#F9FAFB] px-4 py-3 text-center text-sm text-[#666666]">
                                                ... và {jsonData.certificates.length - 5} chứng chỉ khác
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="px-8 pb-8 flex justify-end gap-3">
                            <button
                                onClick={handlePrevStep}
                                className="px-6 py-3 bg-white border border-[#E0E0E0] rounded-lg font-bold text-[15px] text-[#262662] flex items-center gap-2 hover:bg-gray-50 transition-colors"
                                disabled={isProcessing}
                            >
                                <svg width="15" height="13" viewBox="0 0 15 13" fill="none">
                                    <path d="M14 6.5H1M1 6.5L7 1M1 6.5L7 12" stroke="#262662" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Quay lại
                            </button>
                            <button
                                onClick={handleConfirmSubmit}
                                disabled={isProcessing}
                                className={`px-6 py-3 rounded-lg font-bold text-[15px] flex items-center gap-2 transition-colors ${isProcessing
                                    ? 'bg-[#F1A027] text-white opacity-50 cursor-not-allowed'
                                    : 'bg-[#10B981] text-white hover:bg-[#0e9d6e] cursor-pointer'
                                    }`}
                            >
                                {isProcessing ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Đang xử lý...
                                    </>
                                ) : (
                                    <>
                                        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                                            <path d="M1 6L6 11L15 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        Xác nhận cấp chứng chỉ
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 4 - Success */}
                {currentStep === 4 && (
                    <div className="bg-white rounded-lg shadow-sm border border-[#E0E0E0]">
                        <div className="p-12 text-center">
                            {/* Success Icon */}
                            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#10B981] flex items-center justify-center">
                                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                                    <path d="M14 24L20 30L34 16" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>

                            {/* Success Message */}
                            <h2 className="text-2xl font-bold text-[#262662] mb-2">Cấp chứng chỉ thành công!</h2>
                            <p className="text-base text-[#666666] mb-8">
                                Đã cấp thành công {jsonData?.certificates?.length || 0} chứng chỉ
                            </p>

                            {/* Summary Stats */}
                            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
                                <div className="bg-[#F9FAFB] rounded-lg p-4 border border-[#E0E0E0]">
                                    <div className="text-3xl font-bold text-[#10B981] mb-1">
                                        {jsonData?.certificates?.length || 0}
                                    </div>
                                    <div className="text-sm text-[#666666]">Chứng chỉ đã cấp</div>
                                </div>
                                <div className="bg-[#F9FAFB] rounded-lg p-4 border border-[#E0E0E0]">
                                    <div className="text-3xl font-bold text-[#F1A027] mb-1">
                                        {pdfFiles.length}
                                    </div>
                                    <div className="text-sm text-[#666666]">File PDF</div>
                                </div>
                                <div className="bg-[#F9FAFB] rounded-lg p-4 border border-[#E0E0E0]">
                                    <div className="text-3xl font-bold text-[#3B82F6] mb-1">
                                        100%
                                    </div>
                                    <div className="text-sm text-[#666666]">Thành công</div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-center gap-3">
                                <button
                                    onClick={handleReset}
                                    className="px-6 py-3 bg-white border border-[#E0E0E0] rounded-lg font-bold text-[15px] text-[#262662] hover:bg-gray-50 transition-colors"
                                >
                                    Cấp thêm chứng chỉ
                                </button>
                                <button
                                    onClick={() => window.location.href = '/dashboard'}
                                    className="px-6 py-3 bg-[#262662] text-white rounded-lg font-bold text-[15px] hover:bg-[#1e1e4d] transition-colors"
                                >
                                    Về trang chủ
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {currentStep > 4 && (
                    <div className="bg-white rounded-lg shadow-sm border border-[#E0E0E0] p-8">
                        <div className="text-center py-12">
                            <h2 className="text-xl font-bold text-[#262662] mb-2">Bước {currentStep}</h2>
                            <p className="text-[#666666]">Nội dung của bước {currentStep} sẽ được thêm sau</p>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default BatchPage;
