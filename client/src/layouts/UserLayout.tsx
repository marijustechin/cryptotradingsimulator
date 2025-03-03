import { Outlet } from 'react-router';
import { UserSidebar } from '../components/sidebar/UserSidebar';
import { Footer } from '../components/Footer';
import { Header } from '../components/header/Header';

export const UserLayout = () => {
  return (
    <div>
      <Header />
      <div className="flex">
        <UserSidebar />
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};
