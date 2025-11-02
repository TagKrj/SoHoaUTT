import SideBar from '../../layouts/sideBar';

const VerifyPage = () => {
    return (
        <div className="flex h-screen bg-gray-50">
            <SideBar userRole="USER" />
            <div className="flex-1 p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Xác thực</h1>
                <p className="text-gray-600">Trang xác thực văn bằng.</p>
            </div>
        </div>
    );
};

export default VerifyPage;
