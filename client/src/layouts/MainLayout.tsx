import { Outlet } from 'react-router';
import { Footer } from '../components/Footer';
import { Header } from '../components/header/Header';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow">
        <Outlet />
      </div>
      <div className="w-full border-t border-[#636363]">
        <Footer />
      </div>
    </div>
  );
};
export default MainLayout;
