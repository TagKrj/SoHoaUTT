import { useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import Pagination from '../../components/Pagination';
import DatePicker from '../../components/DatePicker';
import CertificateDetailModal from '../../components/CertificateDetailModal';
import useCertificates from '../../hooks/useCertificates';
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

const DashboardPage = () => {
    const { certificates, loading, error, currentPage, pageSize, totalCount, goToPage, setPageSize, removeCertificate, filterCertificates } = useCertificates();
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
        setSelectedCertificateId(null);
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

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-5 mb-8">
                    {/* Stat Card 1 */}
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(241, 160, 39, 0.1)' }}>
                                <img src={fileTextIcon} alt="" className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[13px] text-[#666666] mb-2">Tổng chứng chỉ</p>
                                <h3 className="text-[28px] font-bold text-[#262662] mb-2">{statsData.total.toLocaleString()}</h3>
                                <div className="flex items-center gap-1 text-xs text-[#10B981]">
                                    <img src={arrowUpIcon} alt="" className="w-3 h-3.5" style={{ filter: 'invert(55%) sepia(86%) saturate(434%) hue-rotate(94deg) brightness(101%) contrast(96%)' }} />
                                    <span>{statsData.totalTrend}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stat Card 2 */}
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                                <img src={checkmarkCircleIcon} alt="" className="w-5 h-5" style={{ filter: 'invert(55%) sepia(86%) saturate(434%) hue-rotate(94deg) brightness(101%) contrast(96%)' }} />
                            </div>
                            <div className="flex-1">
                                <p className="text-[13px] text-[#666666] mb-2">Đã cấp tháng này</p>
                                <h3 className="text-[28px] font-bold text-[#262662] mb-2">{statsData.monthlyIssued}</h3>
                                <div className="flex items-center gap-1 text-xs text-[#10B981]">
                                    <img src={arrowUpIcon} alt="" className="w-3 h-3.5" style={{ filter: 'invert(55%) sepia(86%) saturate(434%) hue-rotate(94deg) brightness(101%) contrast(96%)' }} />
                                    <span>{statsData.monthlyTrend}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stat Card 3 */}
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                                <img src={clockIcon} alt="" className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[13px] text-[#666666] mb-2">Chờ xác thực</p>
                                <h3 className="text-[28px] font-bold text-[#262662] mb-2">{statsData.pending}</h3>
                                <div className="flex items-center gap-1.5 text-xs text-[#262626]">
                                    <div className="w-[11.14px] h-[1.71px] bg-[#262626]"></div>
                                    <span>{statsData.pendingTrend}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stat Card 4 */}
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                                <img src={checkmarkCircleIcon} alt="" className="w-5 h-5" style={{ filter: 'invert(44%) sepia(96%) saturate(1691%) hue-rotate(201deg) brightness(100%) contrast(92%)' }} />
                            </div>
                            <div className="flex-1">
                                <p className="text-[13px] text-[#666666] mb-2">Đã xác thực</p>
                                <h3 className="text-[28px] font-bold text-[#262662] mb-2">{statsData.verified.toLocaleString()}</h3>
                                <div className="flex items-center gap-1 text-xs text-[#10B981]">
                                    <img src={arrowUpIcon} alt="" className="w-3 h-3.5" style={{ filter: 'invert(55%) sepia(86%) saturate(434%) hue-rotate(94deg) brightness(101%) contrast(96%)' }} />
                                    <span>{statsData.verifiedPercentage}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Section */}
                <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
                    <div className="flex gap-4 items-end">
                        {/* Filter 1 */}
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-[#666666] mb-2">TRẠNG THÁI</label>
                            <select
                                value={selectedStatus}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                className="w-full h-10 px-5 bg-white border border-[#E0E0E0] rounded-[7px] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F1A027]/30 focus:border-[#F1A027] focus:shadow-lg focus:shadow-[#F1A027]/5 transition-all"
                            >
                                {statusOptions.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Filter 2 */}
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-[#666666] mb-2">NGÀNH HỌC</label>
                            <select
                                value={selectedMajor}
                                onChange={(e) => handleMajorChange(e.target.value)}
                                className="w-full h-10 px-5 bg-white border border-[#E0E0E0] rounded-[7px] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F1A027]/30 focus:border-[#F1A027] focus:shadow-lg focus:shadow-[#F1A027]/5 transition-all"
                            >
                                {majorOptions.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Filter 3 */}
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-[#666666] mb-2">TỪ NGÀY</label>
                            <DatePicker
                                value={fromDate}
                                onChange={setFromDate}
                                placeholder="dd/mm/yyyy"
                            />
                        </div>

                        {/* Filter 4 */}
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-[#666666] mb-2">ĐẾN NGÀY</label>
                            <DatePicker
                                value={toDate}
                                onChange={setToDate}
                                placeholder="dd/mm/yyyy"
                            />
                        </div>

                        {/* Export Button */}
                        <button className="h-10 px-5 bg-[#F1A027] text-white rounded font-bold text-sm flex items-center gap-2 hover:bg-[#d89123] transition-colors cursor-pointer">
                            <img src={downloadIcon} alt="" className="w-3.5 h-[18.67px]" style={{ filter: 'brightness(0) invert(1)' }} />
                            <span>Xuất Excel</span>
                        </button>
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
