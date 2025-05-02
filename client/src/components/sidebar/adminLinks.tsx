import { MdOutlineSpaceDashboard } from 'react-icons/md';
import { ISSidebar } from '../../types/sidebar';
import { FaCog, FaRegUser, FaMoneyBillWave } from 'react-icons/fa';

export const adminLinks: ISSidebar[] = [
  { title: 'nav_dashboard', href: '/dashboard', icon: <MdOutlineSpaceDashboard /> },
  { title: 'nav_settings', href: '/dashboard/settings', icon: <FaCog /> },
  { title: 'nav_users', href: '/dashboard/users', icon: <FaRegUser /> },
  { title: 'nav_orders', href: '/dashboard/orders', icon: <FaMoneyBillWave /> },
];

