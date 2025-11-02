// Mock data cho danh sách chứng chỉ
export const certificatesData = [
    {
        id: 'CC2024001',
        studentId: 'SV2021001',
        name: 'Nguyễn Văn An',
        major: 'Công nghệ thông tin',
        date: '15/01/2024',
        status: 'verified'
    },
    {
        id: 'CC2024002',
        studentId: 'SV2021045',
        name: 'Trần Thị Bình',
        major: 'Kế toán',
        date: '14/01/2024',
        status: 'verified'
    },
    {
        id: 'CC2024003',
        studentId: 'SV2021089',
        name: 'Lê Minh Châu',
        major: 'Quản trị kinh doanh',
        date: '14/01/2024',
        status: 'pending'
    },
    {
        id: 'CC2024004',
        studentId: 'SV2021112',
        name: 'Phạm Quốc Duy',
        major: 'Điện - Điện tử',
        date: '13/01/2024',
        status: 'verified'
    },
    {
        id: 'CC2024005',
        studentId: 'SV2021156',
        name: 'Hoàng Thị Nga',
        major: 'Ngoại ngữ',
        date: '13/01/2024',
        status: 'verified'
    },
    {
        id: 'CC2024006',
        studentId: 'SV2021203',
        name: 'Đặng Văn Phong',
        major: 'Công nghệ thông tin',
        date: '12/01/2024',
        status: 'issued'
    },
    {
        id: 'CC2024007',
        studentId: 'SV2021234',
        name: 'Vũ Thị Thu',
        major: 'Kế toán',
        date: '12/01/2024',
        status: 'verified'
    },
    {
        id: 'CC2024008',
        studentId: 'SV2021267',
        name: 'Ngô Minh Tuấn',
        major: 'Quản trị kinh doanh',
        date: '11/01/2024',
        status: 'pending'
    },
];

// Stats data
export const statsData = {
    total: 2547,
    totalTrend: '+12.5% so với tháng trước',
    monthlyIssued: 143,
    monthlyTrend: '+8.2% so với tháng trước',
    pending: 12,
    pendingTrend: 'Không thay đổi',
    verified: 2392,
    verifiedPercentage: '93.9% tổng số'
};

// Status configuration
export const statusConfig = {
    verified: {
        bg: 'rgba(16, 185, 129, 0.1)',
        text: '#059669',
        label: 'Đã xác thực',
        iconFilter: 'invert(46%) sepia(84%) saturate(695%) hue-rotate(115deg) brightness(95%) contrast(101%)'
    },
    pending: {
        bg: 'rgba(245, 158, 11, 0.1)',
        text: '#D97706',
        label: 'Chờ xác thực',
        iconFilter: 'invert(60%) sepia(85%) saturate(536%) hue-rotate(358deg) brightness(94%) contrast(92%)'
    },
    issued: {
        bg: 'rgba(59, 130, 246, 0.1)',
        text: '#2563EB',
        label: 'Đã cấp',
        iconFilter: 'invert(44%) sepia(96%) saturate(1691%) hue-rotate(201deg) brightness(100%) contrast(92%)'
    }
};

// Filter options
export const statusOptions = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'verified', label: 'Đã xác thực' },
    { value: 'pending', label: 'Chờ xác thực' },
    { value: 'issued', label: 'Đã cấp' }
];

export const majorOptions = [
    { value: 'all', label: 'Tất cả ngành' },
    { value: 'cntt', label: 'Công nghệ thông tin' },
    { value: 'ketoan', label: 'Kế toán' },
    { value: 'qtkd', label: 'Quản trị kinh doanh' },
    { value: 'dien', label: 'Điện - Điện tử' },
    { value: 'ngoaingu', label: 'Ngoại ngữ' }
];
