import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import DatePicker from '../../components/DatePicker';
import useCertificates from '../../hooks/useCertificates';
import student from '../../assets/icons/student.svg';
import sun from '../../assets/icons/sun.svg';
import meta from '../../assets/icons/meta.svg';
import i from '../../assets/icons/i.svg';
import pdf from '../../assets/icons/pdf.svg';
import cloud from '../../assets/icons/cloud.svg';

const CertificatePage = () => {
    const navigate = useNavigate();
    const { createNew, loading, error } = useCertificates();

    const [formData, setFormData] = useState({
        studentId: '',
        certificateName: '',
        major: '',
        metadata: ''
    });
    const [editorMode, setEditorMode] = useState('json'); // 'json' or 'visual'
    const [pdfFile, setPdfFile] = useState(null);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState('');
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    // Handle paste event
    useEffect(() => {
        const handlePaste = (e) => {
            const items = e.clipboardData?.items;
            if (!items) return;

            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                if (item.type === 'application/pdf' || item.kind === 'file') {
                    const file = item.getAsFile();
                    if (file && file.type === 'application/pdf') {
                        handleFile(file);
                        e.preventDefault();
                    }
                }
            }
        };

        document.addEventListener('paste', handlePaste);
        return () => document.removeEventListener('paste', handlePaste);
    }, []);

    const handleFile = (file) => {
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

    const handleRemoveFile = () => {
        setPdfFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = () => {
        // Search student logic
        console.log('Searching for student:', formData.studentId);
    };

    const handleCancel = () => {
        setFormData({
            studentId: '',
            certificateName: '',
            major: '',
            metadata: ''
        });
        setPdfFile(null);
        setSubmitError('');
        setSubmitSuccess('');
    };

    const handleSubmit = async () => {
        // Validation
        setSubmitError('');
        setSubmitSuccess('');

        if (!formData.studentId || !formData.certificateName || !formData.major) {
            alert('Vui lòng điền đầy đủ thông tin chứng chỉ');
            return;
        }

        if (!pdfFile) {
            alert('Vui lòng upload file PDF');
            return;
        }

        try {
            // Prepare data for API
            const certificateData = {
                studentId: formData.studentId,
                certificateName: formData.certificateName,
                major: formData.major,
                metadata: formData.metadata,
                pdfFile: pdfFile
            };

            // Call service
            const response = await createNew(certificateData);

            // Show alert success
            alert(`✓ ${response.message}`);

            // Reset form immediately
            handleCancel();

        } catch (err) {
            alert(err.message || 'Lỗi khi cấp chứng chỉ');
        }
    };

    return (
        <MainLayout userRole="USER">
            <div className="p-8 bg-gray-50 min-h-screen">
                {/* Page Header */}
                <div className="mb-6">
                    <h1 className="text-[28px] font-bold text-[#262662] leading-tight">Cấp Chứng Chỉ Mới</h1>
                    <p className="text-sm text-[#666666] mt-3">Điền thông tin sinh viên và chứng chỉ để cấp chứng chỉ mới</p>
                </div>

                {/* Form Container */}
                <div className="bg-white rounded-lg shadow-sm">

                    {/* Section 1: Thông tin chứng chỉ */}
                    <div className="p-10">
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-2">
                                <img src={student} alt="" />
                                <h2 className="text-lg font-bold text-[#262662]">Thông tin chứng chỉ</h2>
                            </div>
                            <p className="text-[13px] text-[#666666]">Nhập thông tin sinh viên và chi tiết chứng chỉ</p>
                        </div>

                        <div className="grid grid-cols-2 gap-5 gap-y-6">
                            {/* Student ID - Col 1 */}
                            <div>
                                <label className="block text-sm font-bold text-[#262662] mb-2">
                                    Mã sinh viên <span className="text-[#EF4444]">*</span>
                                </label>
                                <div className="relative">
                                    <svg className="absolute left-3.5 top-4 w-[18px] h-3.5" viewBox="0 0 18 14" fill="none">
                                        <path d="M1 7H17M1 1H17M1 13H17" stroke="#999999" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                    <input
                                        type="text"
                                        name="studentId"
                                        value={formData.studentId}
                                        onChange={handleInputChange}
                                        className="w-full h-12 pl-12 pr-4 bg-white border border-[#E0E0E0] rounded-[7px] text-[15px] text-[#262626] focus:outline-none focus:ring-2 focus:ring-[#F1A027]/30 focus:border-[#F1A027] focus:shadow-lg focus:shadow-[#F1A027]/5 transition-all"
                                        placeholder='SV2021001'
                                    />
                                </div>
                            </div>

                            {/* Ngành Học - Col 2 */}
                            <div>
                                <label className="block text-sm font-bold text-[#262662] mb-2">
                                    Ngành học <span className="text-[#EF4444]">*</span>
                                </label>
                                <div className="relative">
                                    <svg className="absolute left-3.5 top-4 w-[18px] h-3.5" viewBox="0 0 18 14" fill="none">
                                        <path d="M1 7H17M1 1H17M1 13H17" stroke="#999999" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                    <input
                                        type="text"
                                        name="major"
                                        value={formData.major}
                                        onChange={handleInputChange}
                                        className="w-full h-12 pl-12 pr-4 bg-white border border-[#E0E0E0] rounded-[7px] text-[15px] text-[#262626] focus:outline-none focus:ring-2 focus:ring-[#F1A027]/30 focus:border-[#F1A027] focus:shadow-lg focus:shadow-[#F1A027]/5 transition-all"
                                        placeholder='VD: Công nghệ thông tin'
                                    />
                                </div>
                            </div>

                            {/* Certificate Name - Col 1-2 */}
                            <div className="col-span-2">
                                <label className="block text-sm font-bold text-[#262662] mb-2">
                                    Tên chứng chỉ <span className="text-[#EF4444]">*</span>
                                </label>
                                <div className="relative">
                                    <svg className="absolute left-3.5 top-[15px] w-[18px] h-6" viewBox="0 0 18 24" fill="none">
                                        <path d="M1 1H17V23L9 18L1 23V1Z" stroke="#999999" strokeWidth="2" />
                                    </svg>
                                    <input
                                        type="text"
                                        name="certificateName"
                                        value={formData.certificateName}
                                        onChange={handleInputChange}
                                        className="w-full h-12 pl-12 pr-4 bg-white border border-[#E0E0E0] rounded-[7px] text-[15px] text-[#262626] focus:outline-none focus:ring-2 focus:ring-[#F1A027]/30 focus:border-[#F1A027] focus:shadow-lg focus:shadow-[#F1A027]/5 transition-all"
                                        placeholder='Chứng chỉ Tốt nghiệp'
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Metadata */}
                    <div className="p-10">
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-2">
                                <img src={meta} alt="" />
                                <h2 className="text-lg font-bold text-[#262662]">Thông tin bổ sung</h2>
                            </div>
                            <p className="text-[13px] text-[#666666]">Thêm thông tin metadata dạng JSON (không bắt buộc)</p>
                        </div>

                        {/* Editor Controls */}
                        {/* <div className="flex gap-2 mb-5">
                            <button
                                onClick={() => setEditorMode('json')}
                                className={`h-[33px] px-4 py-5 rounded-[7px] font-bold text-[13px] flex items-center gap-2 transition-colors cursor-pointer ${editorMode === 'json'
                                    ? 'bg-[#262662] border border-[#262662] text-white'
                                    : 'bg-[#F5F5F7] border border-[#E0E0E0] text-[#666666]'
                                    }`}
                            >
                                <svg width="13" height="10" viewBox="0 0 13 10" fill="none">
                                    <path d="M3 0L0 5L3 10M10 0L13 5L10 10M8 0L5 10" stroke={editorMode === 'json' ? '#FFFFFF' : '#666666'} strokeWidth="2" />
                                </svg>
                                <span style={{ color: editorMode === 'json' ? '#FFFFFF' : '#666666' }}>JSON Editor</span>
                            </button>
                            <button
                                onClick={() => setEditorMode('visual')}
                                className={`h-[33px] px-4 py-5 rounded-[7px] font-bold text-[13px] flex items-center gap-2 transition-colors cursor-pointer ${editorMode === 'visual'
                                    ? 'bg-[#262662] border border-[#262662] text-white'
                                    : 'bg-[#F5F5F7] border border-[#E0E0E0] text-[#666666]'
                                    }`}
                            >
                                <svg width="13" height="11" viewBox="0 0 13 11" fill="none">
                                    <path d="M1 1H12M1 5.5H12M1 10H12" stroke={editorMode === 'visual' ? '#FFFFFF' : '#666666'} strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                <span style={{ color: editorMode === 'visual' ? '#FFFFFF' : '#666666' }}>Visual Editor</span>
                            </button>
                            <button className="h-[33px] px-4 py-5 bg-white border border-[#F1A027] rounded-[7px] font-bold text-[13px] flex items-center gap-2 text-[#F1A027] hover:bg-[#FFF8ED] transition-colors cursor-pointer">
                                <svg width="13" height="17" viewBox="0 0 13 17" fill="none">
                                    <path d="M1 1V16H12V4L9 1H1Z" stroke="#F1A027" strokeWidth="2" />
                                    <path d="M9 1V4H12" stroke="#F1A027" strokeWidth="2" />
                                </svg>
                                Load Template
                            </button>
                        </div> */}

                        {/* Metadata Textarea */}
                        <div>
                            <textarea
                                name="metadata"
                                value={formData.metadata}
                                onChange={handleInputChange}
                                rows={10}
                                className="w-full p-4 bg-[#F9FAFB] border border-[#E0E0E0] rounded-[7px] text-[15px] text-[#262626] font-mono focus:outline-none focus:ring-2 focus:ring-[#F1A027]/30 focus:border-[#F1A027] focus:shadow-lg focus:shadow-[#F1A027]/5 transition-all"
                                placeholder='{\n  "key": "value"\n}'
                            />
                            <div className="flex gap-3 mt-4 text-[13px] text-[#3B82F6] items-center ">
                                <img src={i} alt="" />
                                <span>Nhập dữ liệu JSON hợp lệ. Để trống nếu không cần thiết.</span>
                            </div>
                        </div>
                    </div>

                    <div className='px-10'>
                        <div className='border-b border border-[#ebebeb]'></div>
                    </div>
                    {/* Section 3: PDF Upload */}
                    <div className="p-10">
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-2">
                                <img src={pdf} alt="" />
                                <h2 className="text-lg font-bold text-[#262662]">File chứng chỉ PDF</h2>
                            </div>
                            <p className="text-[13px] text-[#666666]">Upload file PDF chứng chỉ gốc (bắt buộc)</p>
                        </div>

                        {/* Hidden file input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,application/pdf"
                            onChange={handleFileSelect}
                            className="hidden"
                        />

                        {!pdfFile ? (
                            /* Upload Zone */
                            <div
                                className={`border-2 border-dashed rounded-lg bg-[#FAFAFA] p-12 text-center transition-colors cursor-pointer ${isDragging
                                    ? 'border-[#F1A027] bg-[#FFF8ED]'
                                    : 'border-[#D1D5DB] hover:border-[#F1A027] hover:bg-[#FFF8ED]'
                                    }`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={handleClickUpload}
                            >
                                <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(to bottom right, rgba(241, 160, 39, 0.1), rgba(216, 143, 31, 0.1))' }}>
                                    <img src={cloud} alt="" />
                                </div>
                                <h3 className="text-base font-bold text-[#262662] mb-2">Kéo thả file PDF hoặc click để chọn</h3>
                                <p className="text-sm text-[#666666] mb-3">Hỗ trợ file PDF với chất lượng cao</p>
                                <p className="text-xs text-[#999999]">Kích thước tối đa: 10MB • Có thể dán (Ctrl+V hoặc Cmd+V)</p>
                            </div>
                        ) : (
                            /* File Preview */
                            <div className="border border-[#E0E0E0] rounded-lg bg-[#F9FAFB] p-5 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-white border border-[#E0E0E0] flex items-center justify-center shrink-0">
                                    <svg width="23" height="24" viewBox="0 0 23 24" fill="none">
                                        <path d="M1 1V23H22V6L17 1H1Z" stroke="#EF4444" strokeWidth="2" />
                                        <path d="M17 1V6H22" stroke="#EF4444" strokeWidth="2" />
                                        <path d="M6 10H17M6 14H17M6 18H12" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-[#262662] truncate">{pdfFile.name}</p>
                                    <p className="text-[13px] text-[#666666] mt-1">{formatFileSize(pdfFile.size)}</p>
                                </div>
                                <button
                                    onClick={handleRemoveFile}
                                    className="w-9 h-9 rounded-lg bg-white border border-[#E0E0E0] flex items-center justify-center hover:border-red-500 hover:bg-red-50 transition-colors shrink-0 cursor-pointer"
                                >
                                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                                        <path d="M1 1L12 12M1 12L12 1" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>

                    <div className='px-10'>
                        <div className='border-b border border-[#ebebeb]'></div>
                    </div>

                    {/* Form Actions */}
                    <div className="p-10 flex justify-end gap-3">
                        <button
                            onClick={handleCancel}
                            disabled={loading}
                            className="h-12 px-8 bg-white border border-[#E0E0E0] rounded-[7px] font-bold text-[15px] text-[#666666] flex items-center gap-2 hover:border-[#262662] transition-colors cursor-pointer disabled:opacity-50"
                        >
                            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                                <path d="M1 1L12 12M1 12L12 1" stroke="#666666" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            Hủy
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="h-12 px-8 bg-[#F1A027] rounded-[7px] font-bold text-[15px] text-white flex items-center gap-2 hover:bg-[#d89123] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Đang xử lý...
                                </>
                            ) : (
                                <>
                                    <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
                                        <path d="M1 5.5L5 9.5L14 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Cấp Chứng Chỉ
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default CertificatePage;
