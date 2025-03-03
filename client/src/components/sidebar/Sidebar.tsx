import HelperService from '../../services/HelperService';
import { selectUser } from '../../store/features/user/authSlice';
import { useAppSelector } from '../../store/store';
import { NavLink, useLocation } from 'react-router';
import { ISSidebar } from '../../types/sidebar';

interface SidebarProps {
  navLinks: ISSidebar[];
}

export const Sidebar = ({ navLinks }: SidebarProps) => {
  const user = useAppSelector(selectUser);
  const location = useLocation();

  return (
    <div className="flex flex-col h-screen bg-black text-white p-4 w-60">
      <div className="flex items-center mb-6">
        {/* ******** */}
        {/* Šiek tiek pataisiau pačią mintį, bet tu dėliokis kaip čia 
            tau patogiau. Gal reikėtų kur nors darašyti "Your wallet" ???
        */}
        {user.balance && (
          <h3 className="text-center">
            {HelperService.formatCurrency(user.balance)}
          </h3>
        )}

        {/* ******** */}
      </div>
      <ul className="space-y-2">
        {navLinks.map((link, index) => (
          <li key={index}>
            <NavLink
              to={link.href}
              className={`flex items-center p-3 rounded-lg hover:bg-gray-800 ${
                location.pathname === link.href
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                  : ''
              }`}
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
