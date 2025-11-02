import MainLayout from '../../layouts/MainLayout';

const VerifyPage = () => {
    return (
        <MainLayout userRole="USER">
            <div className="p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Xác thực</h1>
                <p className="text-gray-600">Trang xác thực văn bằng.</p>
            </div>
        </MainLayout>
    );
};

export default VerifyPage;
