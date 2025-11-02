import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import sideBarAdmin from '../constants/sideBarAdmin';
import sideBarUser from '../constants/sideBarUser';
import logoutIcon from '../assets/icons/logout-icon.svg';
import uttLogo from '../assets/logos/utt-logo.png';

const SideBar = ({ userRole = 'USER' }) => {
    const location = useLocation();

    // Chọn menu dựa trên role
    const menuItems = userRole === 'ADMIN' ? sideBarAdmin : sideBarUser;

    // Mock user data
    const [user] = useState({
        name: userRole === 'ADMIN' ? 'Admin System' : 'User Name',
        role: userRole === 'ADMIN' ? 'Quản trị viên' : 'Người dùng',
        avatar: userRole === 'ADMIN' ? 'AD' : 'US'
    });

    const handleLogout = () => {
        console.log('Logging out...');
        // Add logout logic here
    };

    return (
        <div className="w-60 h-screen bg-[#262662] flex flex-col">
            {/* Header */}
            <div className="px-5 py-7 border-b border-white/10">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#262662] rounded-lg flex items-center justify-center border border-[#F1A027]">
                        <img src={uttLogo} alt="" />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-sm font-bold text-white leading-tight">
                            HỆ THỐNG
                        </h1>
                        <h1 className="text-sm font-bold text-white leading-tight">
                            VĂN BẰNG
                        </h1>
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 overflow-y-auto py-5">
                <ul className="space-y-0">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <li key={item.id}>
                                <Link
                                    to={item.path}
                                    className={`
                                        relative flex items-center h-[46px] px-5
                                        transition-all duration-200
                                        ${isActive
                                            ? 'bg-[#F1A027]/15'
                                            : 'hover:bg-white/5'
                                        }
                                    `}
                                >
                                    {/* Active indicator */}
                                    {isActive && (
                                        <div className="absolute left-0 top-0 w-[3px] h-full bg-[#F1A027]"></div>
                                    )}

                                    {/* Icon */}
                                    {item.icon && (
                                        <img
                                            src={item.icon}
                                            alt={item.name}
                                            className={`w-4 h-4 mr-4 ${isActive ? 'opacity-100' : 'opacity-80'}`}
                                        />
                                    )}

                                    {/* Text */}
                                    <span className={`
                                        text-sm
                                        ${isActive
                                            ? 'text-[#F1A027] font-medium'
                                            : 'text-white/80 font-normal'
                                        }
                                    `}>
                                        {item.name}
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* User Section */}
            <div className="border-t border-white/10 p-5">
                {/* User Profile */}
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-full bg-[#F1A027] flex items-center justify-center">
                        <span className="text-white text-base font-bold">
                            {user.avatar}
                        </span>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-bold text-white leading-tight">
                            {user.name}
                        </h3>
                        <p className="text-xs text-white/60 leading-tight mt-1">
                            {user.role}
                        </p>
                    </div>
                </div>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 h-[37px] bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors"
                >
                    <img src={logoutIcon} alt="Logout" className="w-3 h-3" />
                    <span className="text-sm font-bold text-white">
                        Đăng xuất
                    </span>
                </button>
            </div>
        </div>
    );
};

export default SideBar;
