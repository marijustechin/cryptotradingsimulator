import { MdOutlineSpaceDashboard } from 'react-icons/md';
import { FaRegUser } from 'react-icons/fa';
import { FaMoneyBillWave, FaCog, FaShoppingCart } from 'react-icons/fa';
import { RiBankFill } from 'react-icons/ri';

import { Sidebar } from './Sidebar';
import { ISSidebar } from './sidebarNavLinks';

const sidebarNavLinks: ISSidebar[] = [
  { title: 'Dashboard', href: '/dashboard', icon: <MdOutlineSpaceDashboard /> },
  { title: 'WithDraw', href: '/withdraw', icon: <FaMoneyBillWave /> },
  { title: 'Deposits', href: '/deposits', icon: <RiBankFill /> },
  { title: 'Buy Miner', href: '/buy-miner', icon: <FaShoppingCart /> },
  { title: 'Settings', href: '/settings', icon: <FaCog /> },
  { title: 'Profile', href: '/profile', icon: <FaRegUser /> },
];

export const UserSidebar = () => {
  return <Sidebar navLinks={sidebarNavLinks} />;
};