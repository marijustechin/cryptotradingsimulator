import { Outlet } from 'react-router';
import { Sidebar } from '../components/sidebar/Sidebar';
import { adminLinks } from '../components/sidebar/adminLinks';

export const AdminLayout = () => {
  return (
    <div className="flex h-screen">
      <Sidebar navLinks={adminLinks} />
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
};
