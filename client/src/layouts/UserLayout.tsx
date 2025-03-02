import { Outlet } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Header } from '../components/header/Header';

export const UserLayout = () => {
  return (
    <div>
      <Header />
      <div className="flex">
        <Navbar />
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};
