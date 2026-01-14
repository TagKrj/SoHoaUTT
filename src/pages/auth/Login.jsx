import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoIcon from '../../assets/logos/logo-icon.svg';
import uttLogo from '../../assets/logos/utt-logo.png';
import useAuth from '../../hooks/useAuth';

const Login = () => {
    const navigate = useNavigate();
    const { loading, error, handleLogin } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        remember: false
    });
    const [loginError, setLoginError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoginError(null);
        try {
            await handleLogin(formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            setLoginError(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Header */}
            <header className="border-b border-gray-200 px-12 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo Section */}
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 relative bg-[#262662] rounded-lg flex items-center justify-center">
                            <img src={uttLogo} alt="" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-base font-bold text-[#262662] leading-tight">
                                HỆ THỐNG SỐ HÓA VĂN BẰNG
                            </h1>
                            <p className="text-xs text-[#6B7280] leading-tight">
                                Trường Đại học Công nghệ GTVT
                            </p>
                        </div>
                    </div>

                    {/* Header Right */}
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-[#262662]">Hotline:</span>
                            <span className="text-sm font-bold text-[#262662]">1900 1234</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg">
                            <select name="" id="">
                                <option value="">Tiếng Việt</option>
                                <option value="">Tiếng Anh</option>
                            </select>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-4 py-16">
                <div className="w-full max-w-md">
                    {/* System Title */}
                    <div className="text-center mb-8">
                        <h2 className="text-[28px] font-bold text-[#262662] leading-tight mb-3">
                            HỆ THỐNG SỐ HÓA VĂN BẰNG
                        </h2>
                        <p className="text-[15px] text-[#6B7280] leading-tight">
                            Hệ thống quản lý và xác thực văn bằng chính thức của<br />
                            Trường Đại học Công nghệ GTVT
                        </p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Error Message */}
                        {(loginError || error) && (
                            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                                {loginError || error}
                            </div>
                        )}

                        {/* Username/Email Field */}
                        <div>
                            <label className="block text-[13px] text-[#374151] mb-2">
                                Tên đăng nhập hoặc Email
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#262662] focus:border-transparent"
                                    placeholder="Nhập tên đăng nhập hoặc email"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-[13px] text-[#374151] mb-2">
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#262662] focus:border-transparent"
                                    placeholder="Nhập mật khẩu"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#262662] font-normal cursor-pointer"
                                >
                                    {showPassword ? 'Ẩn' : 'Hiện'}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center">
                            <label htmlFor="remember" className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    checked={formData.remember}
                                    onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-4 h-4 border-2 border-gray-300 rounded flex items-center justify-center peer-checked:bg-[#262662] peer-checked:border-[#262662] transition-colors">
                                    {formData.remember && (
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                                <span className="ml-2 text-sm text-[#374151]">
                                    Duy trì đăng nhập
                                </span>
                            </label>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-[#F1A027] hover:bg-[#d89020] disabled:bg-[#d4a574] text-white font-bold text-[15px] rounded-lg transition-colors cursor-pointer"
                        >
                            {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
                        </button>

                        {/* Forgot Password */}
                        <div className="text-center">
                            <a href="#" className="text-sm text-[#262662] hover:underline">
                                Quên mật khẩu?
                            </a>
                        </div>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-8">
                        <div className="flex-1 h-px bg-[#E5E7EB]"></div>
                        <span className="text-[13px] text-[#9CA3AF]">HOẶC</span>
                        <div className="flex-1 h-px bg-[#E5E7EB]"></div>
                    </div>

                    {/* Alternative Link */}
                    <div className="text-center">
                        <a href="#" className="text-sm font-bold text-[#262662] hover:underline">
                            Hướng dẫn sử dụng hệ thống
                        </a>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-200 py-7">
                <div className="container mx-auto px-4">
                    {/* Footer Badges */}
                    <div className="flex items-center justify-center gap-12 mb-8">
                        {/* Badge 1 */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white border-2 border-[#262662] flex items-center justify-center">
                                <svg className="w-6 h-6 text-[#F1A027]" fill="currentColor" viewBox="0 0 26 23">
                                    <path d="M13 0l3 9h9l-7 5 3 9-8-6-8 6 3-9-7-5h9z" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <div className="text-[13px] text-[#374151]">Hệ thống chính thức</div>
                                <div className="text-[13px] font-bold text-[#374151]">Trường Đại học Công nghệ GTVT</div>
                            </div>
                        </div>

                        {/* Badge 2 */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white border-2 border-[#262662] flex items-center justify-center">
                                <svg className="w-5 h-5" viewBox="0 0 20 22" fill="none">
                                    <rect x="1" y="7" width="18" height="14" stroke="#262662" strokeWidth="2" rx="2" />
                                    <path d="M6 11l4 3 4-3" stroke="#F1A027" strokeWidth="2" fill="none" />
                                    <circle cx="10" cy="2" r="2" fill="#F1A027" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <div className="text-[13px] text-[#374151]">Bảo mật SSL</div>
                                <div className="text-[13px] font-bold text-[#374151]">Mã hóa 256-bit</div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Bottom */}
                    <div className="text-center">
                        <p className="text-[13px] text-[#6B7280] mb-3">
                            2025 Trường Đại học Công nghệ GTVT. Tất cả quyền được bảo lưu.
                        </p>
                        <div className="flex items-center justify-center gap-6">
                            <a href="#" className="text-[13px] font-semibold text-[#262662] hover:underline">
                                Chính sách bảo mật
                            </a>
                            <a href="#" className="text-[13px] font-semibold text-[#262662] hover:underline">
                                Điều khoản sử dụng
                            </a>
                            <a href="#" className="text-[13px] font-semibold text-[#262662] hover:underline">
                                Liên hệ hỗ trợ
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Login;
