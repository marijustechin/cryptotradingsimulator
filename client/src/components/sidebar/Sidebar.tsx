import { ISSidebar } from './sidebarNavLinks';
import { NavLink, useLocation } from 'react-router';

interface SidebarProps {
  navLinks: ISSidebar[];
}

export const Sidebar = ({ navLinks }: SidebarProps) => {
  const location = useLocation();

  return (
    <div className="flex flex-col h-screen bg-black text-white p-4 w-60">
      <div className="flex items-center mb-6">
        {/* ******** */}
        {/* Userio info tures buti */}
        <h1 className="text-xl font-bold">Crypto Hill's</h1>
        <img src="/logo.png" alt="Seven Duck Alliance" className="w-9 h-9 rounded-full ml-2" />
        {/* ******** */}
      </div>
      <ul className="space-y-2">
        {navLinks.map((link, index) => (
          <li key={index}>
            <NavLink
              to={link.href}
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg hover:bg-gray-800 ${
                  location.pathname === link.href ? 'bg-gradient-to-r from-blue-500 to-purple-600' : ''
                }`
              }
            >
              {link.icon}
              <span className="ml-3">{link.title}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};
