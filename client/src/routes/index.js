import HomePage from '~/pages/Home';
import Calender from '~/pages/Calender';
import AIP from '~/pages/AIP';
import Login from '~/pages/Login';
import Dashboard from '~/pages/Dashboard';
import DataViewCalender from '~/components/DataViewCalender';
import DataViewAIP from '~/components/DataViewAIP';
import Assign from '~/components/AssignTask';

//Đăng nhập xong mới xem được
const publicRoutes = [
    {
        path: '/',
        component: HomePage,
    },
    {
        path: '/dashboard/calender',
        component: Calender,
    },
    {
        path: '/dashboard/aip',
        component: AIP,
    },
    {
        path: '/login',
        component: Login,
    },
    {
        path: '/dashboard',
        component: Dashboard,
    },
    {
        path: '/dashboard/:category',
        component: Dashboard,
    },
];

// const bodyRoutes = [
//     {
//         path: '/dashboard/dataviewcalender',
//         component: DataViewCalender,
//     },
//     {
//         path: '/dashboard/dataviewcaip',
//         component: DataViewAIP,
//     },
// ];

export { publicRoutes };
