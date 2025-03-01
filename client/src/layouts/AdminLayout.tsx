import { Outlet } from 'react-router';
import { Navbar } from '../components/Navbar';

export const AdminLayout = () => {
  return (
    <div className="flex h-screen">
      <Navbar />
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
};
