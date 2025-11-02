import MainLayout from '../../layouts/MainLayout';

const DashboardPage = () => {
    return (
        <MainLayout userRole="USER">
            <div className="p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Tổng quan</h1>
                <p className="text-gray-600">Chào mừng đến với hệ thống số hóa văn bằng!</p>
            </div>
        </MainLayout>
    );
};

export default DashboardPage;
