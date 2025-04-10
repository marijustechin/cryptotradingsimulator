import { MdOutlineSpaceDashboard } from 'react-icons/md';
import { ISSidebar } from '../../types/sidebar';
import { FaCog, FaRegUser, FaMoneyBillWave } from 'react-icons/fa';

export const adminLinks: ISSidebar[] = [
  { title: 'Dashboard', href: '/dashboard', icon: <MdOutlineSpaceDashboard /> },
  { title: 'Settings', href: '/dashboard/settings', icon: <FaCog /> },
  { title: 'Users', href: '/dashboard/users', icon: <FaRegUser /> },
  { title: 'Orders', href: '/dashboard/orders', icon: <FaMoneyBillWave /> }, 
];
