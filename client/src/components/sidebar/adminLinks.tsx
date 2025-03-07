import { MdOutlineSpaceDashboard } from 'react-icons/md';
import { ISSidebar } from '../../types/sidebar';
import { FaCog, FaRegUser } from 'react-icons/fa';
import { LuLogs } from 'react-icons/lu';

export const adminLinks: ISSidebar[] = [
  { title: 'Dashboard', href: '/dashboard', icon: <MdOutlineSpaceDashboard /> },
  { title: 'Users', href: '/dashboard/users', icon: <FaRegUser /> },
  { title: 'Settings', href: '/dashboard/settings', icon: <FaCog /> },
  { title: 'System logs', href: '/dashboard/system-logs', icon: <LuLogs /> },
];
