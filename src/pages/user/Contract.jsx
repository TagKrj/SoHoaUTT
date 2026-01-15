import { useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import Pagination from '../../components/Pagination';
import ContractDetailModal from '../../components/ContractDetailModal';
import CreateContractModal from '../../components/CreateContractModal';
import useContracts from '../../hooks/useContracts';
import eyeIcon from '../../assets/icons/eye-icon.svg';
import trashIcon from '../../assets/icons/trash-icon.svg';
import searchIcon from '../../assets/icons/search-icon.svg';

const ContractPage = () => {
    const {
        contracts,
        loading,
        error,
        currentPage,
        pageSize,
        totalCount,
        totalPages,
        goToPage,
        setPageSize,
        removeContract,
        searchContracts,
        refetch,
        formatCurrency,
        formatDate
    } = useContracts();

    const [searchInput, setSearchInput] = useState('');
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedContractId, setSelectedContractId] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

    const handleSearch = () => {
        if (searchInput.trim()) {
            searchContracts(searchInput);
        }
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchInput(value);
        if (!value.trim()) {
            // Reset nếu xóa hết text
            searchContracts('');
        }
    };

    const handleSearchKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleViewDetail = (id) => {
        setSelectedContractId(id);
        setShowDetailModal(true);
    };

    const handleCloseDetailModal = () => {
        setShowDetailModal(false);
        setSelectedContractId(null);
    };

    const handleDelete = async (id) => {
        try {
            await removeContract(id);
            setShowDeleteConfirm(null);
            alert('Xóa hợp đồng thành công');
        } catch (err) {
            alert('Lỗi: ' + err.message);
        }
    };

    const handleCreateSuccess = () => {
        refetch();
    };

    // Truncate text với tooltip
    const TruncatedText = ({ text, maxLength = 40 }) => {
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
                        {text}
                    </div>
                )}
            </div>
        );
    };

    return (
        <MainLayout userRole="USER">
            <div className="p-8 bg-gray-50 min-h-screen">
                {/* Page Header */}
                <div className="mb-6">
                    <h1 className="text-[28px] font-bold text-[#262662] leading-tight">Quản Lý Hợp Đồng</h1>
                    <p className="text-sm text-[#666666] mt-3">Xem, tạo, tìm kiếm và quản lý hợp đồng trong hệ thống</p>
                </div>

                {/* Search & Filter Section */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex gap-3">
                        <div className="flex-1 relative">
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <circle cx="11" cy="11" r="8" stroke="#999999" strokeWidth="2" />
                                    <path d="M21 21L16.65 16.65" stroke="#999999" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={searchInput}
                                onChange={handleSearchChange}
                                onKeyPress={handleSearchKeyPress}
                                placeholder="Tìm kiếm mã hợp đồng (VD: 2111/HOABINH/HĐXL)"
                                className="w-full pl-10 pr-4 py-2.5 border border-[#E0E0E0] rounded-lg text-sm focus:outline-none focus:border-[#F1A027] transition-colors"
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            className="px-6 py-2.5 bg-[#F1A027] text-white rounded-lg font-bold text-sm hover:bg-[#d89123] transition-colors cursor-pointer"
                        >
                            Tìm kiếm
                        </button>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="px-6 py-2.5 bg-[#262662] text-white rounded-lg font-bold text-sm hover:bg-[#1a1a3f] transition-colors cursor-pointer flex items-center gap-2"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            Tạo Mới
                        </button>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {/* Loading State */}
                    {loading && (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[#F5F5F7]">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-[13px] font-bold text-[#666666] border-b border-[#E0E0E0]">MÃ HỢP ĐỒNG</th>
                                        <th className="px-6 py-4 text-left text-[13px] font-bold text-[#666666] border-b border-[#E0E0E0]">MÃ HASH</th>
                                        <th className="px-6 py-4 text-right text-[13px] font-bold text-[#666666] border-b border-[#E0E0E0]">GIÁ TRỊ</th>
                                        <th className="px-6 py-4 text-right text-[13px] font-bold text-[#666666] border-b border-[#E0E0E0]">ESCROW</th>
                                        <th className="px-6 py-4 text-left text-[13px] font-bold text-[#666666] border-b border-[#E0E0E0]">THAO TÁC</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[...Array(5)].map((_, index) => (
                                        <tr key={index} className="border-b border-[#F0F0F0]">
                                            <td className="px-6 py-3"><div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div></td>
                                            <td className="px-6 py-3"><div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div></td>
                                            <td className="px-6 py-3"><div className="h-4 bg-gray-200 rounded animate-pulse w-16 ml-auto"></div></td>
                                            <td className="px-6 py-3"><div className="h-4 bg-gray-200 rounded animate-pulse w-16 ml-auto"></div></td>
                                            <td className="px-6 py-3"><div className="flex gap-2">
                                                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                                                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                                            </div></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="p-4 m-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Table */}
                    {!loading && (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-[#F5F5F7]">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-[13px] font-bold text-[#666666] border-b border-[#E0E0E0]">MÃ HỢP ĐỒNG</th>
                                            <th className="px-6 py-4 text-left text-[13px] font-bold text-[#666666] border-b border-[#E0E0E0]">MÃ HASH</th>
                                            <th className="px-6 py-4 text-right text-[13px] font-bold text-[#666666] border-b border-[#E0E0E0]">GIÁ TRỊ</th>
                                            <th className="px-6 py-4 text-right text-[13px] font-bold text-[#666666] border-b border-[#E0E0E0]">ESCROW</th>
                                            <th className="px-6 py-4 text-left text-[13px] font-bold text-[#666666] border-b border-[#E0E0E0]">THAO TÁC</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {contracts.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                                    Không có hợp đồng nào
                                                </td>
                                            </tr>
                                        ) : (
                                            contracts.map((contract) => (
                                                <tr
                                                    key={contract.id}
                                                    className="border-b border-[#F0F0F0] hover:bg-gray-50 transition-colors"
                                                >
                                                    <td className="px-6 py-3 text-sm text-[#262626] font-mono">
                                                        <TruncatedText text={contract.id} maxLength={20} />
                                                    </td>
                                                    <td className="px-6 py-3 text-sm text-[#262626] font-bold">
                                                        <TruncatedText text={contract.contractHashId} maxLength={20} />
                                                    </td>
                                                    <td className="px-6 py-3 text-sm text-right text-[#F1A027] font-semibold">
                                                        {contract.totalContractValueFormatted}
                                                    </td>
                                                    <td className="px-6 py-3 text-sm text-right text-[#10B981] font-semibold">
                                                        {contract.initialEscrowPledgeFormatted}
                                                    </td>
                                                    <td className="px-6 py-3">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => handleViewDetail(contract.id)}
                                                                className="w-8 h-8 flex items-center justify-center border border-[#E0E0E0] rounded-[7px] hover:border-[#262662] transition-colors cursor-pointer"
                                                                title="Xem chi tiết"
                                                            >
                                                                <img src={eyeIcon} alt="View" className="w-3.5 h-[10.89px] icon-gray" />
                                                            </button>
                                                            <button
                                                                onClick={() => setShowDeleteConfirm(contract.id)}
                                                                className="w-8 h-8 flex items-center justify-center border border-[#E0E0E0] rounded-[7px] hover:border-red-500 transition-colors cursor-pointer"
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

                            {/* Pagination Footer */}
                            {contracts.length > 0 && (
                                <div className="px-6 py-4 border-t border-[#E0E0E0] flex items-center justify-between">
                                    <div className="text-sm text-[#666666]">
                                        Hiển thị <span className="font-bold text-[#666666]">1-{Math.min(pageSize, contracts.length)}</span> trong tổng số <span className="font-bold text-[#666666]">{totalCount.toLocaleString()}</span> hợp đồng
                                    </div>
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        pageSize={pageSize}
                                        onPageChange={goToPage}
                                        onPageSizeChange={setPageSize}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-sm shadow-xl">
                            <div className="flex items-start gap-4 mb-4">

                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-[#262662]">Xóa Hợp Đồng</h3>
                                    <p className="text-sm text-gray-600 mt-1">Bạn có chắc chắn muốn xóa hợp đồng này? Hành động này không thể hoàn tác.</p>
                                </div>
                            </div>

                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setShowDeleteConfirm(null)}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold text-sm hover:bg-gray-300 transition-colors cursor-pointer"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={() => handleDelete(showDeleteConfirm)}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg font-bold text-sm hover:bg-red-600 transition-colors cursor-pointer"
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modals */}
                <ContractDetailModal
                    contractId={selectedContractId}
                    isOpen={showDetailModal}
                    onClose={handleCloseDetailModal}
                />

                <CreateContractModal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={handleCreateSuccess}
                />
            </div>
        </MainLayout>
    );
};

export default ContractPage;
