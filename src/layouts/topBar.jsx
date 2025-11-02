import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import homeIcon from '../assets/icons/home-icon.svg';
import searchIcon from '../assets/icons/search-topbar-icon.svg';
import bellIcon from '../assets/icons/bell-icon.svg';

const Topbar = ({ userRole = 'USER' }) => {
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');

    // Map route paths to breadcrumb names
    const routeNames = {
        '/dashboard': 'Tổng quan',
        '/certificate': 'Cấp chứng chỉ',
        '/batch': 'Cấp hàng loạt',
        '/verify': 'Xác thực',
        '/search': 'Tra cứu'
    };

    const [user] = useState({
        avatar: userRole === 'ADMIN' ? 'AD' : 'US'
    });

    const currentPageName = routeNames[location.pathname] || 'Trang chủ';

    return (
        <div className="h-[73px] bg-white border-b border-[#E0E0E0] px-8 flex items-center justify-between">
            {/* Left Section - Breadcrumb */}
            <div className="flex items-center gap-3">
                <img src={homeIcon} alt="Home" className="w-3.5 h-3" />
                <span className="text-sm text-[#666666]">/</span>
                <span className="text-sm font-bold text-[#262662]">{currentPageName}</span>
            </div>

            {/* Center Section - Search Bar */}
            <div className="flex items-center gap-2">
                <div className="relative w-[500px]">
                    <img
                        src={searchIcon}
                        alt="Search"
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
                    />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Tìm kiếm theo mã SV, tên SV, mã chứng chỉ..."
                        className="w-full h-10 pl-10 pr-4 border border-[#E0E0E0] rounded-3xl text-sm text-gray-900 placeholder:text-[#999999] focus:outline-none focus:ring-2 focus:ring-[#F1A027]/30 focus:border-[#F1A027] focus:shadow-lg focus:shadow-[#F1A027]/5 transition-all"
                    />
                </div>
            </div>

            {/* Right Section - Notification & Avatar */}
            <div className="flex items-center gap-4">
                {/* Notification Button */}
                <button className="relative w-10 h-10 bg-[#F5F5F7] rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                    <img src={bellIcon} alt="Notifications" className="w-4.5 h-5" />
                    {/* Notification Badge */}
                    <div className="absolute top-2 right-2 w-2 h-2 bg-[#EF4444] border border-white rounded-full"></div>
                </button>

                {/* User Avatar */}
                <div className="w-10 h-10 bg-[#262662] border-2 border-[#E0E0E0] rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-white">{user.avatar}</span>
                </div>
            </div>
        </div>
    );
};

export default Topbar;
