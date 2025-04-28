import { Link } from 'react-router';
import logo from '/logo.png';
import { Logout } from '../header/Logout';
import { LanguageSelector } from '../header/LanguageSelector';

export const AdminHeader = () => {

  
  return (

      <div
        className='container flex md:grid md:grid-cols-2 items-center justify-between z-50 h-[10vh]'
      >

        <div className="flex shrink-0 justify-start">
          <Link to="/">
            <img
              className="h-14 md:h-18"
              src={logo}
              alt="Seven Ducks Alliance Logo"
            />
          </Link>
        </div>

        <div className="flex p-4 text-white text-center justify-self-end gap-4">
        <LanguageSelector/>
          <Logout />
        </div>
    </div>
  );
};