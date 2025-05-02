import { MdOutlineSpaceDashboard } from 'react-icons/md';
import { ISSidebar } from '../../types/sidebar';
import {
  FaMoneyBillWave,
  FaRegUser,
} from 'react-icons/fa';
import { RiBankFill } from 'react-icons/ri';

export const userLinks: ISSidebar[] = [
  {
    title: 'nav_dashboard',
    href: '/my-dashboard',
    icon: <MdOutlineSpaceDashboard />,
  },
  {
    title: 'nav_trading',
    href: '/my-dashboard/trading',
    icon: <RiBankFill />,
  },
  {
    title: 'nav_orders',
    href: '/my-dashboard/orders',
    icon: <FaMoneyBillWave />,
  },
  {
    title: 'nav_profile',
    href: '/my-dashboard/profile',
    icon: <FaRegUser />,
  },
];

