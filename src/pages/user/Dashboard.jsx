import { useState, useRef } from 'react';
import MainLayout from '../../layouts/MainLayout';
import Pagination from '../../components/Pagination';
import DatePicker from '../../components/DatePicker';
import CertificateDetailModal from '../../components/CertificateDetailModal';
import useCertificates from '../../hooks/useCertificates';
import useVerify from '../../hooks/useVerify';
import {
    statsData,
    statusConfig,
    statusOptions,
    majorOptions
} from '../../constants/certificatesData';
import fileTextIcon from '../../assets/icons/file-text-icon.svg';
import checkmarkCircleIcon from '../../assets/icons/checkmark-circle-icon.svg';
import clockIcon from '../../assets/icons/clock-icon.svg';
import arrowUpIcon from '../../assets/icons/arrow-up-icon.svg';
import eyeIcon from '../../assets/icons/eye-icon.svg';
import downloadIcon from '../../assets/icons/download-icon.svg';
import trashIcon from '../../assets/icons/trash-icon.svg';
import pdf from '../../assets/icons/pdf.svg';

const DashboardPage = () => {
    const { certificates, loading, error, currentPage, pageSize, totalCount, goToPage, setPageSize, removeCertificate, filterCertificates } = useCertificates();
    const {
        pdfFile,
        setPdfFile,
        fileInputRef,
        handlePdfFileSelect,
        certificateId,
        setCertificateId,
        handleVerifyId,
        combinedPdfFile,
        setCombinedPdfFile,
        combinedId,
        setCombinedId,
        combinedFileInputRef,
        handleCombinedFileSelect,
        isDragging,
        handleDragOver,
        handleDragLeave,
        handleDrop,
        handleClickUpload,
        handleClickCombinedUpload,
        isVerifying,
        verifyResult,
        verifyError,
        handleVerifyCombined,
        formatFileSize,
    } = useVerify();

    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedMajor, setSelectedMajor] = useState('all');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [selectedCertificateId, setSelectedCertificateId] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    // Format ngày từ ISO string
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    // Truncate text với tooltip
    const TruncatedText = ({ text, maxLength = 50, fullText }) => {
        const [showTooltip, setShowTooltip] = useState(false);
        const displayText = text && text.length > maxLength ? text.substring(0, maxLength) + '...' : text;

        return (
            <div className="relative inline-block">
                <span
                    onMouseEnter={() => text && text.length > maxLength && setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    className={text && text.length > maxLength ? 'cursor-help' : ''}
                >
                    {displayText}
                </span>
                {showTooltip && (
                    <div className="absolute bottom-full left-0 bg-gray-900 text-white text-xs p-2 rounded whitespace-nowrap z-10 mb-1">
                        {fullText || text}
                    </div>
                )}
            </div>
        );
    };

    const handleStatusChange = (value) => {
        setSelectedStatus(value);
        filterCertificates(value === 'all' ? '' : value, selectedMajor === 'all' ? '' : selectedMajor);
    };

    const handleMajorChange = (value) => {
        setSelectedMajor(value);
        filterCertificates(selectedStatus === 'all' ? '' : selectedStatus, value === 'all' ? '' : value);
    };

    const handleDelete = async (id) => {
        try {
            await removeCertificate(id);
            setShowDeleteConfirm(null);
            alert('Xóa chứng chỉ thành công');
        } catch (err) {
            alert('Lỗi: ' + err.message);
        }
    };

    const handleViewDetail = (id) => {
        setSelectedCertificateId(id);
        setShowDetailModal(true);
    };

    const handleCloseModal = () => {
        setShowDetailModal(false);
    };

    const getStatusBadge = (status) => {
        const config = statusConfig[status] || statusConfig['pending'];
        return (
            <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl"
                style={{ backgroundColor: config.bg }}
            >
                <img
                    src={checkmarkCircleIcon}
                    alt=""
                    className="w-2 h-2"
                    style={{ filter: config.iconFilter }}
                />
                <span className="text-xs font-bold" style={{ color: config.text }}>
                    {config.label}
                </span>
            </div>
        );
    };

    return (
        <MainLayout userRole="USER">
            <div className="p-8 bg-gray-50 min-h-screen">
                {/* Page Header */}
                <div className="mb-6">
                    <h1 className="text-[28px] font-bold text-[#262662] leading-tight">Tổng Quan Chứng Chỉ</h1>
                    <p className="text-sm text-[#666666] mt-3">Quản lý và theo dõi chứng chỉ đã cấp trong hệ thống</p>
                </div>

                {/* Verify Section */}
                <div className="mb-8">
                    <div className="bg-white rounded-lg shadow-sm border border-[#E0E0E0]">
                        <div className="p-8 border-b-2 border-[#F5F5F7]">
                            <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-full bg-[#F1A027] flex items-center justify-center shrink-0">
                                    <span className="text-base font-bold text-white">1</span>
                                </div>
                                <h2 className="text-lg font-bold text-[#262662] mt-1">Lấy thông tin MetaData</h2>
                            </div>
                        </div>

                        <div className="p-8">
                            {/* PDF Upload */}
                            <div className="mb-6">
                                <label className="text-sm font-bold text-[#262662] block mb-3">
                                    File PDF chứng chỉ
                                </label>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf,application/pdf"
                                    onChange={handlePdfFileSelect}
                                    className="hidden"
                                />

                                {!pdfFile ? (
                                    <div
                                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${isDragging
                                            ? 'border-[#F1A027] bg-[#FAFAFA]'
                                            : 'border-[#D1D5DB] bg-[#FAFAFA] hover:border-[#F1A027]'
                                            }`}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        onClick={handleClickUpload}
                                    >
                                        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[rgba(241,160,39,0.1)] flex items-center justify-center">
                                            <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                                                <path d="M14 7V21M14 7L9 12M14 7L19 12M7 24H21" stroke="#F1A027" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                        <h3 className="text-[13px] text-[#262626] mb-1">
                                            Kéo thả file PDF hoặc click để chọn
                                        </h3>
                                        <p className="text-[12px] text-[#999999]">(Tối đa 10MB)</p>
                                    </div>
                                ) : (
                                    <div className="border border-[#E0E0E0] rounded-lg bg-[#F9FAFB] p-4 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-white border border-[#E0E0E0] flex items-center justify-center shrink-0">
                                            <img src={pdf} alt="" className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-[#262662] truncate">{pdfFile.name}</p>
                                            <p className="text-xs text-[#666666] mt-0.5">{formatFileSize(pdfFile.size)}</p>
                                        </div>
                                        <button
                                            onClick={() => setPdfFile(null)}
                                            className="w-8 h-8 rounded-lg bg-white border border-[#E0E0E0] flex items-center justify-center hover:border-red-500 hover:bg-red-50 transition-colors shrink-0"
                                            title="Xóa file"
                                        >
                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                <path d="M1 1L11 11M1 11L11 1" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* ID Input */}
                            <div className="mb-6">
                                <label className="text-sm font-bold text-[#262662] block mb-3">
                                    ID chứng chỉ
                                </label>
                                <input
                                    type="text"
                                    value={combinedId}
                                    onChange={(e) => setCombinedId(e.target.value)}
                                    placeholder="Nhập ID chứng chỉ cần xác thực..."
                                    className="w-full px-4 py-3 border-2 border-[#E0E0E0] rounded-lg text-sm focus:outline-none focus:border-[#F1A027] transition-colors"
                                />
                            </div>

                            {/* Get Metadata Button */}
                            <button
                                onClick={handleVerifyCombined}
                                disabled={!pdfFile || !combinedId.trim() || isVerifying}
                                className={`w-full py-3 rounded-lg font-bold text-[15px] flex items-center justify-center gap-2 transition-colors ${pdfFile && combinedId.trim() && !isVerifying
                                    ? 'bg-[#F1A027] text-white hover:bg-[#d89123] cursor-pointer'
                                    : 'bg-[#F1A027] text-white opacity-50 cursor-not-allowed'
                                    }`}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                {isVerifying ? 'Đang lấy thông tin...' : 'Lấy thông tin MetaData'}
                            </button>

                            {/* Results */}
                            {verifyResult && (
                                <div className="mt-6 p-4 bg-[rgba(16,185,129,0.1)] border-2 border-[#059669] rounded-lg">
                                    <div className="flex items-start gap-3 mb-4">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0 mt-0.5">
                                            <path d="M10 1C5.03 1 1 5.03 1 10C1 14.97 5.03 19 10 19C14.97 19 19 14.97 19 10C19 5.03 14.97 1 10 1ZM8 14L4 10L5.41 8.59L8 11.17L14.59 4.58L16 6L8 14Z" fill="#059669" />
                                        </svg>
                                        <h3 className="font-bold text-[#059669] text-sm">✓ Lấy thông tin thành công!</h3>
                                    </div>

                                    <div className="space-y-3">
                                        {/* File Hash */}
                                        <div>
                                            <p className="text-xs text-[#666666] mb-1 font-semibold">File Hash (SHA-256):</p>
                                            <div className="bg-white px-3 py-2 rounded border border-[#E0E0E0] break-all">
                                                <code className="text-xs font-mono text-[#262662]">{verifyResult.fileHash}</code>
                                            </div>
                                        </div>

                                        {/* MetaData */}
                                        <div>
                                            <p className="text-xs text-[#666666] mb-1 font-semibold">MetaData:</p>
                                            <div className="bg-white px-3 py-2 rounded border border-[#E0E0E0]">
                                                <code className="text-xs font-mono text-[#262662] break-all">{verifyResult.metaJson}</code>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            )}

                            {/* Error */}
                            {verifyError && (
                                <div className="mt-6 p-4 bg-[rgba(239,68,68,0.1)] border-2 border-[#EF4444] rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0 mt-0.5">
                                            <path d="M10 1C5.03 1 1 5.03 1 10C1 14.97 5.03 19 10 19C14.97 19 19 14.97 19 10C19 5.03 14.97 1 10 1ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z" fill="#EF4444" />
                                        </svg>
                                        <div>
                                            <h4 className="font-bold text-[#EF4444] text-sm">✗ Lấy thông tin thất bại</h4>
                                            <p className="text-xs text-[#666666] mt-1">{verifyError}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>


                {/* Table Section */}
                <div className="bg-white rounded-lg shadow-sm">
                    {/* Table Header */}
                    <div className="px-6 py-4 border-b border-[#E0E0E0]">
                        <h2 className="text-lg font-bold text-[#262662]">Danh sách chứng chỉ</h2>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="px-6 py-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Loading */}
                    {loading && (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[#F5F5F7]">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-[13px] font-bold text-[#666666] border-b border-[#E0E0E0]">MÃ CHỨNG CHỈ</th>
                                        <th className="px-6 py-4 text-left text-[13px] font-bold text-[#666666] border-b border-[#E0E0E0]">MÃ SINH VIÊN</th>
                                        <th className="px-6 py-4 text-left text-[13px] font-bold text-[#666666] border-b border-[#E0E0E0]">TÊN CHỨNG CHỈ</th>
                                        <th className="px-6 py-4 text-left text-[13px] font-bold text-[#666666] border-b border-[#E0E0E0]">NGÀNH HỌC</th>
                                        <th className="px-6 py-4 text-left text-[13px] font-bold text-[#666666] border-b border-[#E0E0E0]">NGÀY CẤP</th>
                                        <th className="px-6 py-4 text-left text-[13px] font-bold text-[#666666] border-b border-[#E0E0E0]">CẤP BỞI</th>
                                        <th className="px-6 py-4 text-left text-[13px] font-bold text-[#666666] border-b border-[#E0E0E0]">THAO TÁC</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[...Array(5)].map((_, index) => (
                                        <tr key={index} className="border-b border-[#F0F0F0]">
                                            <td className="px-6 py-3"><div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div></td>
                                            <td className="px-6 py-3"><div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div></td>
                                            <td className="px-6 py-3"><div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div></td>
                                            <td className="px-6 py-3"><div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div></td>
                                            <td className="px-6 py-3"><div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div></td>
                                            <td className="px-6 py-3"><div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div></td>
                                            <td className="px-6 py-3"><div className="flex gap-2">
                                                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                                                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                                                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                                            </div></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Table */}
                    {!loading && (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[#F5F5F7]">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-[13px] font-bold text-[#666666] border-b border-[#E0E0E0]">MÃ CHỨNG CHỈ</th>
                                        <th className="px-6 py-4 text-left text-[13px] font-bold text-[#666666] border-b border-[#E0E0E0]">MÃ SINH VIÊN</th>
                                        <th className="px-6 py-4 text-left text-[13px] font-bold text-[#666666] border-b border-[#E0E0E0]">TÊN CHỨNG CHỈ</th>
                                        <th className="px-6 py-4 text-left text-[13px] font-bold text-[#666666] border-b border-[#E0E0E0]">NGÀNH HỌC</th>
                                        <th className="px-6 py-4 text-left text-[13px] font-bold text-[#666666] border-b border-[#E0E0E0]">NGÀY CẤP</th>
                                        <th className="px-6 py-4 text-left text-[13px] font-bold text-[#666666] border-b border-[#E0E0E0]">CẤP BỞI</th>
                                        <th className="px-6 py-4 text-left text-[13px] font-bold text-[#666666] border-b border-[#E0E0E0]">THAO TÁC</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {certificates.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                                Không có chứng chỉ nào
                                            </td>
                                        </tr>
                                    ) : (
                                        certificates.map((cert) => (
                                            <tr key={cert.id} className="border-b border-[#F0F0F0] hover:bg-gray-50">
                                                <td className="px-6 py-3">
                                                    <TruncatedText text={cert.id} maxLength={20} fullText={cert.id} />
                                                </td>
                                                <td className="px-6 py-3 text-sm text-[#262626]">{cert.studentId}</td>
                                                <td className="px-6 py-3 text-sm text-[#262626]">
                                                    <TruncatedText text={cert.name} maxLength={30} fullText={cert.name} />
                                                </td>
                                                <td className="px-6 py-3 text-sm text-[#262626]">
                                                    <TruncatedText text={cert.major} maxLength={20} fullText={cert.major} />
                                                </td>
                                                <td className="px-6 py-3 text-sm text-[#262626]">{formatDate(cert.issuedAt)}</td>
                                                <td className="px-6 py-3">
                                                    <TruncatedText text={cert.issuer} maxLength={15} fullText={cert.issuer} />
                                                </td>
                                                <td className="px-6 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleViewDetail(cert.id)}
                                                            className="action-btn-view w-8 h-8 flex items-center justify-center border border-[#E0E0E0] rounded-[7px] hover:border-[#262662] transition-colors group cursor-pointer"
                                                            title="Xem chi tiết"
                                                        >
                                                            <img src={eyeIcon} alt="View" className="w-3.5 h-[10.89px] icon-gray" />
                                                        </button>
                                                        <button className="action-btn-download w-8 h-8 flex items-center justify-center border border-[#E0E0E0] rounded-[7px] hover:border-[#262662] transition-colors group cursor-pointer" title="Tải về">
                                                            <img src={downloadIcon} alt="Download" className="w-3.5 h-3.5 icon-gray" />
                                                        </button>
                                                        <button
                                                            onClick={() => setShowDeleteConfirm(cert.id)}
                                                            className="action-btn-delete w-8 h-8 flex items-center justify-center border border-[#E0E0E0] rounded-[7px] hover:border-red-500 transition-colors group cursor-pointer"
                                                            title="Xóa"
                                                        >
                                                            <img src={trashIcon} alt="Delete" className="w-3.5 h-4 icon-gray" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination Footer */}
                    {!loading && certificates.length > 0 && (
                        <div className="px-6 py-4 border-t border-[#E0E0E0] flex items-center justify-between">
                            <div className="text-sm text-[#666666]">
                                Hiển thị <span className="font-bold text-[#666666]">1-{Math.min(pageSize, certificates.length)}</span> trong tổng số <span className="font-bold text-[#666666]">{totalCount.toLocaleString()}</span> chứng chỉ
                            </div>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={Math.ceil(totalCount / pageSize)}
                                pageSize={pageSize}
                                onPageChange={goToPage}
                                onPageSizeChange={setPageSize}
                            />
                        </div>
                    )}
                </div>

                {/* Delete Confirm Dialog */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-80 shadow-xl">
                            <h2 className="text-lg font-bold text-[#262662] mb-3">
                                Xác nhận xóa
                            </h2>
                            <p className="text-sm text-[#666666] mb-6">
                                Bạn có chắc chắn muốn xóa chứng chỉ này?
                            </p>
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setShowDeleteConfirm(null)}
                                    className="px-4 py-2 text-[#666666] bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors cursor-pointer"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={() => handleDelete(showDeleteConfirm)}
                                    className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors cursor-pointer"
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Certificate Detail Modal */}
                <CertificateDetailModal
                    certificateId={selectedCertificateId}
                    isOpen={showDetailModal}
                    onClose={handleCloseModal}
                />
            </div>
        </MainLayout>
    );
};

export default DashboardPage;
