import dashboardIcon from '../assets/icons/dashboard-icon.svg';
import certificateIcon from '../assets/icons/certificate-icon.svg';
import batchIcon from '../assets/icons/batch-icon.svg';
import searchIcon from '../assets/icons/search-icon.svg';

const sideBarUser = [
    {
        id: 1,
        name: 'Tổng quan',
        path: '/dashboard',
        icon: dashboardIcon,
        active: true
    },
    {
        id: 2,
        name: 'Cấp chứng chỉ',
        path: '/certificate',
        icon: certificateIcon,
        active: false
    },
    {
        id: 3,
        name: 'Cấp hàng loạt',
        path: '/batch',
        icon: batchIcon,
        active: false
    },
    {
        id: 4,
        name: 'Xác thực',
        path: '/verify',
        icon: null,
        active: false
    },
    {
        id: 5,
        name: 'Tra cứu',
        path: '/search',
        icon: searchIcon,
        active: false
    }
];

export default sideBarUser;
