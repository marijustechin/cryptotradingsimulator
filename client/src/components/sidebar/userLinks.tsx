import { MdOutlineSpaceDashboard } from 'react-icons/md';
import { ISSidebar } from '../../types/sidebar';
import {
  FaCog,
  FaMoneyBillWave,
  FaRegUser,
  FaShoppingCart,
} from 'react-icons/fa';
import { RiBankFill } from 'react-icons/ri';

export const userLinks: ISSidebar[] = [
  {
    title: 'Dashboard',
    href: '/my-dashboard',
    icon: <MdOutlineSpaceDashboard />,
  },
  { title: 'Stats', href: '/my-dashboard/stats', icon: <FaMoneyBillWave /> },
  { title: 'Portfolio', href: '/my-dashboard/portfolio', icon: <RiBankFill /> },
  // { title: 'Kol kas neaisku', href: '/my-dashboard', icon: <FaShoppingCart /> },
  // { title: 'Sugalvosim', href: '/my-dashboard', icon: <FaCog /> },
  { title: 'Profile', href: '/my-dashboard/profile', icon: <FaRegUser /> },
];
