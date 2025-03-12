import { useState } from 'react';
import HelperService from '../../services/HelperService';
import { selectUser } from '../../store/features/user/authSlice';
import { useAppSelector } from '../../store/store';
import { NavLink, useLocation } from 'react-router';
import { ISSidebar } from '../../types/sidebar';
import { FiMenu, FiX } from 'react-icons/fi';

interface SidebarProps {
  navLinks: ISSidebar[];
}

export const Sidebar = ({ navLinks }: SidebarProps) => {
  const user = useAppSelector(selectUser);
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
      setIsNavOpen(false);
    }
  };

  const handleCloseNav = (event: any) => {
    if (!event.target.closest(".nav-menu")) {
      setIsNavOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden p-3 text-white bg-black fixed top-4 left-4 z-50 rounded-lg"
        onClick={() => setIsOpen(true)}
      >
        <FiMenu size={24} />
      </button>

      {/* Overlay for closing sidebar */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 bot-0 left-0 h-screen bg-black text-white p-6 w-64 transform transition-transform duration-300 z-50
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative md:flex md:flex-col`}
      >
        {/* Close Button for Mobile */}
        <button
          className="md:hidden absolute top-4 right-4 text-white"
          onClick={() => setIsOpen(false)}
        >
          <FiX size={24} />
        </button>

        {/* Balance Display */}
        <div className="flex flex-col items-center justify-center mb-8 mt-6">
          {user.balance && (
            <h3 className="text-center text-2xl font-bold">
              {HelperService.formatCurrency(user.balance)}
            </h3>
          )}
        </div>

        {/* Sidebar Navigation Links */}
        <ul className="space-y-3">
          {navLinks.map((link, index) => (
            <li key={index}>
              <NavLink
                to={link.href}
                className={`flex items-center p-4 rounded-lg hover:bg-gray-800 transition duration-200 text-lg font-medium
                  ${location.pathname === link.href ? 'bg-gradient-to-r from-blue-500 to-purple-600' : ''}`}
                onClick={handleLinkClick}
              >
                <span className="ml-4">{link.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Top-right Navbar Menu */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button
          className="p-3 text-white bg-black rounded-lg"
          onClick={() => setIsNavOpen(!isNavOpen)}
        >
          <FiMenu size={24} />
        </button>

        {isNavOpen && (
          <div
            className="absolute right-0 mt-2 w-48 bg-black border border-gray-700 text-white rounded-lg shadow-lg p-3 nav-menu"
            onClick={(e) => e.stopPropagation()}
          >
            {[ 
              { title: 'Home', href: '/' },
              { title: 'How To Trade', href: '/how-to-trade' },
              { title: 'My Dashboard', href: '/my-dashboard' },
              { title: 'Credits', href: '/credits' }
            ].map((link, index) => (
              <NavLink
                key={index}
                to={link.href}
                className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition duration-200"
                onClick={handleLinkClick}
              >
                {link.title}
              </NavLink>
            ))}
          </div>
        )}
      </div>
      {isNavOpen && <div className="fixed inset-0 z-40" onClick={handleCloseNav}></div>}
    </>
  );
};
