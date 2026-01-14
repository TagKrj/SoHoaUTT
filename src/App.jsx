import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import routes from './routes';
import { useAutoRefresh } from './hooks/useAutoRefresh';

function App() {
    const { checkAndRefreshToken } = useAutoRefresh();

    // Check token khi app mount
    useEffect(() => {
        checkAndRefreshToken();
    }, [checkAndRefreshToken]);

    return (
        <BrowserRouter>
            <Routes>
                {routes.map((route, index) => (
                    <Route key={index} path={route.path} element={route.element} />
                ))}
            </Routes>
        </BrowserRouter>
    );
}

export default App;
