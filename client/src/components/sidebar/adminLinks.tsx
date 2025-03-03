import { MdOutlineSpaceDashboard } from 'react-icons/md';
import { ISSidebar } from '../../types/sidebar';
import {
  FaCog,
  FaMoneyBillWave,
  FaRegUser,
  FaShoppingCart,
} from 'react-icons/fa';
import { RiBankFill } from 'react-icons/ri';

export const adminLinks: ISSidebar[] = [
  { title: 'Dashboard', href: '/dashboard', icon: <MdOutlineSpaceDashboard /> },
  { title: 'WithDraw', href: '/withdraw', icon: <FaMoneyBillWave /> },
  { title: 'Deposits', href: '/deposits', icon: <RiBankFill /> },
  { title: 'Buy Miner', href: '/buy-miner', icon: <FaShoppingCart /> },
  { title: 'Settings', href: '/settings', icon: <FaCog /> },
  { title: 'Profile', href: '/profile', icon: <FaRegUser /> },
];
