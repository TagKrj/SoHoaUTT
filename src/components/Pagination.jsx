import { useState } from 'react';
import chevronLeftIcon from '../assets/icons/chevron-left-icon.svg';
import chevronRightIcon from '../assets/icons/chevron-right-icon.svg';
import chevronDoubleLeftIcon from '../assets/icons/chevron-double-left-icon.svg';

const Pagination = ({
    currentPage = 1,
    totalPages = 128,
    pageSize = 20,
    onPageChange,
    onPageSizeChange
}) => {
    const [size, setSize] = useState(pageSize);

    const handlePageSizeChange = (e) => {
        const newSize = parseInt(e.target.value);
        setSize(newSize);
        if (onPageSizeChange) {
            onPageSizeChange(newSize);
        }
    };

    const handlePageClick = (page) => {
        if (page >= 1 && page <= totalPages && onPageChange) {
            onPageChange(page);
        }
    };

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages + 2) {
            // Show all pages if total is small
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Show first page
            pages.push(1);

            // Calculate range around current page
            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);

            // Adjust if near start
            if (currentPage <= 3) {
                start = 2;
                end = maxVisiblePages;
            }
            // Adjust if near end
            else if (currentPage >= totalPages - 2) {
                start = totalPages - maxVisiblePages + 1;
                end = totalPages - 1;
            }

            // Add ellipsis if needed
            if (start > 2) {
                pages.push('...');
            }

            // Add middle pages
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            // Add ellipsis if needed
            if (end < totalPages - 1) {
                pages.push('...');
            }

            // Show last page
            pages.push(totalPages);
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="flex items-center gap-5">
            {/* Page Size Selector */}
            <div className="flex items-center gap-[7.45px]">
                <span className="text-[14px] text-[#666666] font-inter">
                    Hiển thị:
                </span>
                <select
                    value={size}
                    onChange={handlePageSizeChange}
                    className="w-[70px] h-8 px-[10px] bg-white border border-[#E0E0E0] rounded-[7px] text-[14px] text-black cursor-pointer focus:outline-none focus:border-[#262662]"
                >
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
            </div>

            {/* Page Numbers */}
            <div className="flex items-center gap-1.5">
                {/* Previous Double Button */}
                <button
                    onClick={() => handlePageClick(1)}
                    disabled={currentPage === 1}
                    className={`w-9 h-9 flex items-center justify-center bg-white border border-[#E0E0E0] rounded transition-all cursor-pointer ${currentPage === 1
                        ? 'opacity-40 cursor-not-allowed'
                        : 'hover:border-[#262662] cursor-pointer'
                        }`}
                >
                    <img
                        src={chevronDoubleLeftIcon}
                        alt="First page"
                        className="w-2.5 h-[5px]"
                    />
                </button>

                {/* Previous Button */}
                <button
                    onClick={() => handlePageClick(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`w-9 h-9 flex items-center justify-center bg-white border border-[#E0E0E0] rounded transition-all cursor-pointer${currentPage === 1
                        ? 'opacity-40 cursor-not-allowed'
                        : 'hover:border-[#262662] cursor-pointer'
                        }`}
                >
                    <img
                        src={chevronLeftIcon}
                        alt="Previous page"
                        className="w-[11.2px] h-[19.61px]"
                    />
                </button>

                {/* Page Number Buttons */}
                {pageNumbers.map((page, index) => (
                    page === '...' ? (
                        <div
                            key={`ellipsis-${index}`}
                            className="w-9 h-9 flex items-center justify-center bg-white border border-[#E0E0E0] rounded text-[14px] text-[#666666]"
                        >
                            ...
                        </div>
                    ) : (
                        <button
                            key={page}
                            onClick={() => handlePageClick(page)}
                            className={`h-9 min-w-9 px-[11px] flex items-center justify-center rounded text-[14px] transition-all cursor-pointer ${currentPage === page
                                ? 'bg-[#262662] border border-[#262662] text-white'
                                : 'bg-white border border-[#E0E0E0] text-[#666666] hover:border-[#262662]'
                                }`}
                        >
                            {page}
                        </button>
                    )
                ))}

                {/* Next Button */}
                <button
                    onClick={() => handlePageClick(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`w-9 h-9 flex items-center justify-center bg-white border border-[#E0E0E0] rounded transition-all cursor-pointer ${currentPage === totalPages
                        ? 'opacity-40 cursor-not-allowed'
                        : 'hover:border-[#262662] cursor-pointer'
                        }`}
                >
                    <img
                        src={chevronRightIcon}
                        alt="Next page"
                        className="w-[11.2px] h-[19.61px]"
                    />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
