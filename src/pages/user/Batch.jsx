import MainLayout from '../../layouts/MainLayout';

const BatchPage = () => {
    return (
        <MainLayout userRole="USER">
            <div className="p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Cấp hàng loạt</h1>
                <p className="text-gray-600">Trang cấp hàng loạt chứng chỉ.</p>
            </div>
        </MainLayout>
    );
};

export default BatchPage;
