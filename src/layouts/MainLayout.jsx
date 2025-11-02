import SideBar from './sideBar';
import Topbar from './topbar';

const MainLayout = ({ children, userRole = 'USER' }) => {
    return (
        <div className="flex h-screen bg-gray-50">
            <SideBar userRole={userRole} />
            <div className="flex-1 flex flex-col">
                <Topbar userRole={userRole} />
                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
