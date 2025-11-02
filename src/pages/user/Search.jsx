import MainLayout from '../../layouts/MainLayout';

const SearchPage = () => {
    return (
        <MainLayout userRole="USER">
            <div className="p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Tra cứu văn bằng</h1>
                <p className="text-gray-600">Trang tra cứu văn bằng cho người dùng.</p>
            </div>
        </MainLayout>
    );
};

export default SearchPage;
