import { Outlet, useNavigate } from 'react-router';
import { Footer } from '../components/Footer';
import { Header } from '../components/header/Header';
import { useAppSelector } from '../store/store';
import { selectUser } from '../store/features/user/authSlice';
import { useEffect } from 'react';
import { Sidebar } from '../components/sidebar/Sidebar';
import { userLinks } from '../components/sidebar/userLinks';

export const UserLayout = () => {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);

  useEffect(() => {
    if (user.role !== 'USER') navigate('/login');
  }, [user, navigate]);

  return (
    <div>
      <Header />
      <div className="flex">
        <Sidebar navLinks={userLinks} />
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};
