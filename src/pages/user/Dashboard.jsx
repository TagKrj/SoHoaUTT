import SideBar from '../../layouts/sideBar';

const DashboardPage = () => {
    return (
        <div className="flex h-screen bg-gray-50">
            <SideBar userRole="USER" />
            <div className="flex-1 p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Tổng quan</h1>
                <p className="text-gray-600">Chào mừng đến với hệ thống số hóa văn bằng!</p>
            </div>
        </div>
    );
};

export default DashboardPage;
