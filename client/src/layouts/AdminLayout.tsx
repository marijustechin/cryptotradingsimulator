import { Outlet, useNavigate } from 'react-router';
import { Sidebar } from '../components/sidebar/Sidebar';
import { adminLinks } from '../components/sidebar/adminLinks';
import { useAppSelector } from '../store/store';
import { selectUser } from '../store/features/user/authSlice';
import { useEffect } from 'react';
import { AdminHeader } from '../components/admin/AdminHeader';

export const AdminLayout = () => {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);

  useEffect(() => {
    if (user.role !== 'ADMIN') navigate('/login');
  }, [user, navigate]);

  return (
    <div className="flex h-screen container">
      <Sidebar navLinks={adminLinks} />
      <main className="flex-1 p-4">
        <AdminHeader />
        <Outlet />
      </main>
    </div>
  );
};
