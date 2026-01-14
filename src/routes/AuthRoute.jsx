import { Navigate } from 'react-router-dom';

/**
 * Route cho trang Auth (Login)
 * Nếu đã đăng nhập → redirect về /dashboard
 * Nếu chưa → cho phép vào trang login
 */
const AuthRoute = ({ element }) => {
    const token = localStorage.getItem('accessToken');

    return token ? <Navigate to="/dashboard" replace /> : element;
};

export default AuthRoute;
