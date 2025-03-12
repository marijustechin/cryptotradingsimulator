import { useState } from 'react';
import HelperService from '../../services/HelperService';
import { selectUser } from '../../store/features/user/authSlice';
import { useAppSelector } from '../../store/store';
import { NavLink, useLocation } from 'react-router';
import { ISSidebar } from '../../types/sidebar';
import { FiMenu } from 'react-icons/fi';

interface SidebarProps {
  navLinks: ISSidebar[];
}

export const Sidebar = ({ navLinks }: SidebarProps) => {
  const user = useAppSelector(selectUser);
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Toggle Button (Hidden when sidebar is open) */}
      {!isOpen && (
        <button
          className="md:hidden p-3 text-white bg-black fixed top-4 left-4 z-50 rounded-lg"
          onClick={() => setIsOpen(true)}
        >
          <FiMenu size={24} />
        </button>
      )}

      {/* Overlay to close sidebar when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen bg-black text-white p-6 w-64 transform transition-transform duration-300 z-40 
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative md:flex md:flex-col`}
      >
        {/* Balance Display */}
        <div className="flex flex-col items-center justify-center mb-8">
          {user.balance && (
            <h3 className="text-center text-2xl font-bold">
              {HelperService.formatCurrency(user.balance)}
            </h3>
          )}
        </div>

        {/* Navigation Links */}
        <ul className="space-y-3">
          {navLinks.map((link, index) => (
            <li key={index}>
              <NavLink
                to={link.href}
                className={`flex items-center p-4 rounded-lg hover:bg-gray-800 transition duration-200 text-lg font-medium
                  ${location.pathname === link.href ? 'bg-gradient-to-r from-blue-500 to-purple-600' : ''}`}
                onClick={handleLinkClick}
              >
                {link.icon}
                <span className="ml-4">{link.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
