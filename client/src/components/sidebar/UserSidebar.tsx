import { MdOutlineSpaceDashboard } from 'react-icons/md';
import { FaRegUser } from 'react-icons/fa';
import { FaMoneyBillWave, FaCog, FaShoppingCart } from 'react-icons/fa';
import { RiBankFill } from 'react-icons/ri';

import { Sidebar } from './Sidebar';
import { ISSidebar } from './sidebarNavLinks';

const sidebarNavLinks: ISSidebar[] = [
  {
    title: 'Dashboard',
    href: '/my-dashboard',
    icon: <MdOutlineSpaceDashboard />,
  },
  { title: 'Stats', href: '/my-dashboard/stats', icon: <FaMoneyBillWave /> },
  { title: 'Portfolio', href: '/my-dashboard/portfolio', icon: <RiBankFill /> },
  { title: 'Kol kas neaisku', href: '/my-dashboard', icon: <FaShoppingCart /> },
  { title: 'Sugalvosim', href: '/my-dashboard', icon: <FaCog /> },
  { title: 'Profile', href: '/my-dashboard/profile', icon: <FaRegUser /> },
];

export const UserSidebar = () => {
  return <Sidebar navLinks={sidebarNavLinks} />;
};
