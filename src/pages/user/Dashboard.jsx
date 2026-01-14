import { useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import Pagination from '../../components/Pagination';
import DatePicker from '../../components/DatePicker';
import {
    certificatesData,
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
import sun from '../../assets/icons/sun.svg';

const DashboardPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedMajor, setSelectedMajor] = useState('all');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    const getStatusBadge = (status) => {
        const config = statusConfig[status];
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
                                onChange={(e) => setSelectedStatus(e.target.value)}
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
                                onChange={(e) => setSelectedMajor(e.target.value)}
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

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#F5F5F7]">
                                <tr>
                                    <th className="px-6 py-4 text-left text-[13px] font-bold text-[#666666] border-b border-[#E0E0E0]">MÃ CHỨNG CHỈ</th>
                                    <th className="px-6 py-4 text-left text-[13px] font-bold text-[#666666] border-b border-[#E0E0E0]">MÃ SINH VIÊN</th>
                                    <th className="px-6 py-4 text-left text-[13px] font-bold text-[#666666] border-b border-[#E0E0E0]">TÊN SINH VIÊN</th>
                                    <th className="px-6 py-4 text-left text-[13px] font-bold text-[#666666] border-b border-[#E0E0E0]">NGÀNH HỌC</th>
                                    <th className="px-6 py-4 text-left text-[13px] font-bold text-[#666666] border-b border-[#E0E0E0]">NGÀY CẤP</th>
                                    <th className="px-6 py-4 text-left text-[13px] font-bold text-[#666666] border-b border-[#E0E0E0]">TRẠNG THÁI</th>
                                    <th className="px-6 py-4 text-left text-[13px] font-bold text-[#666666] border-b border-[#E0E0E0]">THAO TÁC</th>
                                </tr>
                            </thead>
                            <tbody>
                                {certificatesData.map((cert) => (
                                    <tr key={cert.id} className="border-b border-[#F0F0F0] hover:bg-gray-50">
                                        <td className="px-6 py-3">
                                            <span className="text-sm font-bold text-[#262626]">{cert.id}</span>
                                        </td>
                                        <td className="px-6 py-3 text-sm text-[#262626]">{cert.studentId}</td>
                                        <td className="px-6 py-3 text-sm text-[#262626]">{cert.name}</td>
                                        <td className="px-6 py-3 text-sm text-[#262626]">{cert.major}</td>
                                        <td className="px-6 py-3 text-sm text-[#262626]">{cert.date}</td>
                                        <td className="px-6 py-3">{getStatusBadge(cert.status)}</td>
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-2">
                                                <button className="action-btn-view w-8 h-8 flex items-center justify-center border border-[#E0E0E0] rounded-[7px] hover:border-[#262662] transition-colors group cursor-pointer">
                                                    <img src={eyeIcon} alt="View" className="w-3.5 h-[10.89px] icon-gray" />
                                                </button>
                                                <button className="action-btn-download w-8 h-8 flex items-center justify-center border border-[#E0E0E0] rounded-[7px] hover:border-[#262662] transition-colors group cursor-pointer">
                                                    <img src={downloadIcon} alt="Download" className="w-3.5 h-3.5 icon-gray" />
                                                </button>
                                                <button className="action-btn-delete w-8 h-8 flex items-center justify-center border border-[#E0E0E0] rounded-[7px] hover:border-red-500 transition-colors group cursor-pointer">
                                                    <img src={trashIcon} alt="Delete" className="w-3.5 h-4 icon-gray" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    <div className="px-6 py-4 border-t border-[#E0E0E0] flex items-center justify-between">
                        <div className="text-sm text-[#666666]">
                            Hiển thị <span className="font-bold text-[#666666]">1-8</span> trong tổng số <span className="font-bold text-[#666666]">{statsData.total.toLocaleString()}</span> chứng chỉ
                        </div>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={128}
                            pageSize={pageSize}
                            onPageChange={setCurrentPage}
                            onPageSizeChange={setPageSize}
                        />
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default DashboardPage;
