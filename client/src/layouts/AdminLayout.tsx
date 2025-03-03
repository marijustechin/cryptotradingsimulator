import { Outlet } from 'react-router';
import { AdminSidebar } from '../components/sidebar/AdminSidebar';

export const AdminLayout = () => {
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
};
