import MainLayout from '../../layouts/MainLayout';

const CertificatePage = () => {
    return (
        <MainLayout userRole="USER">
            <div className="p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Cấp chứng chỉ</h1>
                <p className="text-gray-600">Trang cấp chứng chỉ.</p>
            </div>
        </MainLayout>
    );
};

export default CertificatePage;
