import { Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Dashboard from '../pages/user/Dashboard';
import Certificate from '../pages/user/Certificate';
import Batch from '../pages/user/Batch';
import Verify from '../pages/user/Verify';
import Search from '../pages/user/Search';

// Auth Routes
export const authRoutes = [
    {
        path: '/login',
        element: <Login />
    }
];

// User Routes
export const userRoutes = [
    {
        path: '/dashboard',
        element: <Dashboard />
    },
    {
        path: '/certificate',
        element: <Certificate />
    },
    {
        path: '/batch',
        element: <Batch />
    },
    {
        path: '/verify',
        element: <Verify />
    },
    {
        path: '/search',
        element: <Search />
    },
    {
        path: '/',
        element: <Navigate to="/dashboard" replace />
    }
];

// All Routes
const routes = [...authRoutes, ...userRoutes];

export default routes;
