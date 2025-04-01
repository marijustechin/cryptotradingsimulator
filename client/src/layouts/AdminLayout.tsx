import { Outlet, useNavigate } from "react-router";
import { useAppSelector } from "../store/store";
import { selectUser } from "../store/features/user/authSlice";
import { useEffect, useState } from "react";
import { Footer } from "../components/Footer";
import { AdminHeader } from "../components/admin/AdminHeader";
import { AdminTextures } from "../components/admin/AdminTextures";
import { Sidebar } from "../components/sidebar/Sidebar";
import { adminLinks } from "../components/sidebar/adminLinks";

const AdminLayout = () => {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);

  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (user.role !== "ADMIN") navigate("/login");
  }, [user, navigate]);

  // Handle window resize event to detect desktop size
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1440); // Adjust this breakpoint as needed (1280px for xl)
    };

    handleResize(); // Check initial screen size
    window.addEventListener("resize", handleResize); // Add event listener for resizing

    return () => {
      window.removeEventListener("resize", handleResize); // Cleanup on component unmount
    };
  }, []);

  return (
    <>
      {isDesktop ? (
        <AdminTextures />
      ) : (
        // Layout for mobile/tablet screens
        <>
          <div className="flex flex-col min-h-screen container">
          <AdminHeader />
          <div className="flex">
            <Sidebar navLinks={adminLinks} />
            <main className="flex-1 p-4">
              <Outlet />
            </main>
          </div>
        </div>
        <div className="w-full border-t border-[#636363]">
          <Footer />
        </div>
        </>
      )}
    </>
  );
};

export default AdminLayout;
