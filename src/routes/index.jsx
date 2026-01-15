import { Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Dashboard from '../pages/user/Dashboard';
import Certificate from '../pages/user/Certificate';
import Batch from '../pages/user/Batch';
import Verify from '../pages/user/Verify';
import Contracts from '../pages/user/Contract';
import ProtectedRoute from './ProtectedRoute';
import AuthRoute from './AuthRoute';

// Auth Routes
export const authRoutes = [
    {
        path: '/login',
        element: <AuthRoute element={<Login />} />
    }
];

// User Routes
export const userRoutes = [
    {
        path: '/dashboard',
        element: <ProtectedRoute element={<Dashboard />} />
    },
    {
        path: '/certificate',
        element: <ProtectedRoute element={<Certificate />} />
    },
    {
        path: '/batch',
        element: <ProtectedRoute element={<Batch />} />
    },
    {
        path: '/verify',
        element: <ProtectedRoute element={<Verify />} />
    },
    {
        path: '/contracts',
        element: <ProtectedRoute element={<Contracts />} />
    },
    {
        path: '/',
        element: <Navigate to="/dashboard" replace />
    }
];

// All Routes
const routes = [...authRoutes, ...userRoutes];

export default routes;
