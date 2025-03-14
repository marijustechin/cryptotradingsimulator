import { Outlet, useNavigate } from "react-router";
import { Footer } from "../components/Footer";
import { Header } from "../components/header/Header";
import { useAppSelector } from "../store/store";
import { selectUser } from "../store/features/user/authSlice";
import { useEffect } from "react";
import { Sidebar } from "../components/sidebar/Sidebar";
import { userLinks } from "../components/sidebar/userLinks";

export const UserLayout = () => {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);

  useEffect(() => {
    if (user.role !== "USER") navigate("/login");
  }, [user, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex">
        <Sidebar navLinks={userLinks} />
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
      <div className="pt-8">
        <div className="w-full border-t border-[#636363]">
          <Footer />
        </div>
      </div>
    </div>
  );
};
