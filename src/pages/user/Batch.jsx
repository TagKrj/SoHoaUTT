import SideBar from '../../layouts/sideBar';

const BatchPage = () => {
    return (
        <div className="flex h-screen bg-gray-50">
            <SideBar userRole="USER" />
            <div className="flex-1 p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Cấp hàng loạt</h1>
                <p className="text-gray-600">Trang cấp hàng loạt chứng chỉ.</p>
            </div>
        </div>
    );
};

export default BatchPage;
