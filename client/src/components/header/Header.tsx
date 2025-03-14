import { Link, useLocation } from 'react-router';
import { mainNavLinks, registerLinks } from './mainNavLinks';
import logo from '/logo.png';
import { useAppSelector } from '../../store/store';
import { selectUser } from '../../store/features/user/authSlice';
import { useState } from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';
import { Logout } from '../header/Logout';

export const Header = () => {
  const user = useAppSelector(selectUser);
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuOpenOrClose = (closeMenu: boolean = false) => {
    if (closeMenu) {
      setIsOpen(false);
    } else {
      setIsOpen((prev) => !prev);
    }
  };

  const links = {
    Dashboard: '/my-dashboard',
    Stats: '/my-dashboard/stats',
    Portfolio: '/my-dashboard/portfolio',
    Profile: '/my-dashboard/profile',
  };

  const allLinks = Object.values(links);

  const isDashboard = allLinks.includes(location.pathname);

  return (
    <>
      <div
        className={`container m-2 flex z-20 md:grid md:grid-cols-3 items-center justify-between  mx-auto h-[8vh] ${
          isDashboard ? 'hidden md:flex' : ''
        }`}
      >
        {/* Logo */}
        <div className="flex shrink-0 justify-start">
          <Link to="/">
            <img
              className="h-14 md:h-18"
              src={logo}
              alt="Seven Ducks Alliance Logo"
            />
          </Link>
        </div>

        <div className="hidden md:flex text-center justify-center text-white gap-5 text-[14px] font-semibold">
          {mainNavLinks
            .filter((link) => user.id || link.title !== 'My Dashboard')
            .map((link) => (
              <div className="" key={link.title}>
                <Link
                  to={link.href}
                  className={`hover:shadow-lg hover:shadow-purple-500/90 transition-all duration-300 cursor-pointer whitespace-nowrap ${
                    location.pathname === link.href
                      ? 'border-b p-[2px] pb-2 border-violet-600'
                      : ''
                  }`}
                >
                  {link.title}
                </Link>
              </div>
            ))}
        </div>

        {/* Mobile Version Sign Buttons */}
        <div className="md:hidden flex justify-center items-center text-white gap-2 w-full p-3">
          {user.id ? (
            <Logout />
          ) : (
            registerLinks.map((link, index) => (
              <div key={link.title}>
                <Link
                  to={link.href}
                  className={`px-1 py-2 rounded-[10px] border border-white/47 hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 ${
                    index === registerLinks.length - 1
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300'
                      : ''
                  }`}
                >
                  {link.title}
                </Link>
              </div>
            ))
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="flex justify-end md:justify-between text-white gap-6 inter text-[14px] font-semibold">
          <div className="md:hidden">
            <button
              className="text-[25px] cursor-pointer shrink-0"
              onClick={() => menuOpenOrClose()}
            >
              <RxHamburgerMenu />
            </button>
          </div>

          {isOpen && (
            <div className="md:hidden bg-gray-900 absolute top-15 right-3 border-1 border-gray-600 z-30 p-4 text-center rounded-[7px]">
              {mainNavLinks
                .filter((link) => user.id || link.title !== 'My Dashboard')
                .map((link) => (
                  <div
                    className="border-b p-[2px] pb-1 border-gray-600 mb-1 cursor-pointer"
                    onClick={() => menuOpenOrClose()}
                    key={link.href}
                  >
                    <Link to={link.href}>{link.title}</Link>
                  </div>
                ))}
            </div>
          )}

          {/* Sign Buttons */}
          <div className="hidden md:flex flex-1 justify-center md:justify-end items-center gap-3">
            {user.id ? (
              <Logout />
            ) : (
              registerLinks.map((link, index) => (
                <div key={link.title}>
                  <Link
                    to={link.href}
                    className={`px-4 py-2 rounded-[10px] border border-white/47 hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 ${
                      index === registerLinks.length - 1 ? 'btn-generic' : ''
                    }`}
                  >
                    {link.title}
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {isDashboard && (
        <div className="block md:hidden p-4 text-white text-center">
          <Logout />
        </div>
      )}
    </>
  );
};
