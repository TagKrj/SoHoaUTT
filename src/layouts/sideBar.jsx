import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import sideBarAdmin from '../constants/sideBarAdmin';
import sideBarUser from '../constants/sideBarUser';
import logoutIcon from '../assets/icons/logout-icon.svg';
import uttLogo from '../assets/logos/utt-logo.png';
import useAuth from '../hooks/useAuth';

const SideBar = ({ userRole = 'USER' }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, handleLogout } = useAuth();
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Chọn menu dựa trên role
    const menuItems = userRole === 'ADMIN' ? sideBarAdmin : sideBarUser;

    // Lấy avatar từ name
    const getAvatar = (name) => {
        if (!name) return 'U';
        const words = name.split(' ');
        if (words.length >= 2) {
            return (words[0][0] + words[words.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const onLogoutClick = () => {
        setShowConfirm(true);
    };

    const onConfirmLogout = async () => {
        setIsLoggingOut(true);
        try {
            await handleLogout();
            setShowConfirm(false);
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
            setIsLoggingOut(false);
        }
    };

    const onCancelLogout = () => {
        setShowConfirm(false);
    };

    return (
        <div className="w-60 h-screen bg-[#262662] flex flex-col">
            {/* Header */}
            <div className="px-5 py-7 border-b border-white/10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12  rounded-lg flex items-center justify-center border border-[#F1A027]">
                        <img src={uttLogo} alt="" />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-sm font-bold text-white leading-tight tracking-wide">
                            HỆ THỐNG
                        </h1>
                        <h1 className="text-sm font-bold text-white leading-tight tracking-wide">
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
                                            className={`w-4 h-4 mr-4 transition-all ${isActive ? 'brightness-0 saturate-100' : 'opacity-80'}`}
                                            style={isActive ? { filter: 'invert(64%) sepia(85%) saturate(537%) hue-rotate(358deg) brightness(98%) contrast(93%)' } : {}}
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
                            {user ? getAvatar(user.name) : 'U'}
                        </span>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-bold text-white leading-tight">
                            {user?.name || 'Loading...'}
                        </h3>
                        <p className="text-xs text-white/60 leading-tight mt-1">
                            {user?.role === 'ADMIN' ? 'Quản trị viên' : 'Người dùng'}
                        </p>
                    </div>
                </div>

                {/* Logout Button */}
                <button
                    onClick={onLogoutClick}
                    disabled={isLoggingOut}
                    className="w-full flex items-center justify-center gap-2 h-[37px] bg-white/10 hover:bg-white/20 disabled:bg-white/5 border border-white/20 rounded-lg transition-colors cursor-pointer"
                >
                    <img src={logoutIcon} alt="Logout" className="w-3 h-3" />
                    <span className="text-sm font-bold text-white">
                        {isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}
                    </span>
                </button>

                {/* Logout Confirm Dialog */}
                {showConfirm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-80 shadow-xl">
                            <h2 className="text-lg font-bold text-[#262662] mb-3">
                                Xác nhận đăng xuất
                            </h2>
                            <p className="text-sm text-[#666666] mb-6">
                                Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?
                            </p>
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={onCancelLogout}
                                    disabled={isLoggingOut}
                                    className="px-4 py-2 text-[#666666] bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 rounded-lg font-medium transition-colors cursor-pointer"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={onConfirmLogout}
                                    disabled={isLoggingOut}
                                    className="px-4 py-2 text-white bg-[#F1A027] hover:bg-[#d89020] disabled:bg-[#d4a574] rounded-lg font-medium transition-colors cursor-pointer"
                                >
                                    {isLoggingOut ? 'Đang xử lý...' : 'Đăng xuất'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SideBar;
