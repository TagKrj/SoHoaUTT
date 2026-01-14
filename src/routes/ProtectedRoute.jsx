import { Navigate } from 'react-router-dom';

/**
 * Route bảo vệ - Kiểm tra xem user đã đăng nhập chưa
 * Nếu chưa → redirect về /login
 * Nếu rồi → cho phép vào
 */
const ProtectedRoute = ({ element }) => {
    const token = localStorage.getItem('accessToken');

    return token ? element : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
