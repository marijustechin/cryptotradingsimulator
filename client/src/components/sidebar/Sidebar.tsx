import { useState } from 'react';
import HelperService from '../../services/HelperService';
import { selectUser } from '../../store/features/user/authSlice';
import { useAppSelector } from '../../store/store';
import { NavLink, useLocation } from 'react-router';
import { ISSidebar } from '../../types/sidebar';
import { FiMenu } from 'react-icons/fi';
import { mainNavLinks } from '../header/mainNavLinks';

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
        aria-label='Toggle sidebar'
          className='md:hidden p-3 text-white bg-black fixed top-[9vh] left-4 z-50 rounded-lg'
          onClick={() => setIsOpen(true)}
        >
          <FiMenu size={24} />
        </button>
      )}

      {/* Overlay to close sidebar when clicking outside */}
      {isOpen && (
        <button
          className='fixed inset-0 bg-opacity-50 z-30 md:hidden'
          onClick={() => setIsOpen(false)}
        ></button>
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 min-h-[85vh] rounded-xl text-white bg-gray-900 p-6 w-64 transform transition-transform duration-300 z-40 
    ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
    md:translate-x-0 md:relative md:flex md:flex-col
   top-[9vh] md:top-0 border-r border-t border-violet-900 shadow-[2px_-2px_8px_rgba(138,43,226,0.6)]`}
      >
        {/* Balance Display */}
        <div className='flex flex-col items-center justify-center mb-8'>
          {user.balance && user.role === 'USER' && (
            <>
            <h4 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent text-center">
            Stellar greetings, {user.first_name}
            </h4>
            <h3>
              {HelperService.formatCurrency(user.balance)}
            </h3></>
          )}
        </div>

        {/* Navigation Links */}
        <ul className='space-y-3'>
          {/* Mobile-only mainNavLinks */}
          <div>
            {mainNavLinks
              .filter((link) => link.title !== 'My Dashboard')
              .map((link) => (
                <li key={link.title}>
                  <NavLink
                    to={link.href}
                    className={`flex items-center p-4 rounded-lg hover:bg-gray-800 transition duration-200 text-lg font-medium
                ${
                  location.pathname === link.href
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                    : ''
                }`}
                    onClick={handleLinkClick}
                  >
                    {link.title}
                  </NavLink>
                </li>
              ))}
          </div>

          {/* Other navLinks (for larger screens, still on mobile but should appear) */}
          {navLinks.map((link) => (
            <li key={link.title}>
              <NavLink
                to={link.href}
                className={`flex items-center p-4 rounded-lg hover:bg-gray-800 transition duration-200 text-lg font-medium
            ${
              location.pathname === link.href
                ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                : ''
            }`}
                onClick={handleLinkClick}
              >
                {link.icon}
                <span className='ml-4'>{link.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
