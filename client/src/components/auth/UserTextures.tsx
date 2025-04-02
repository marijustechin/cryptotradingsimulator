import { Outlet } from "react-router";
import { Footer } from "../Footer";
import { Sidebar } from "../sidebar/Sidebar";
import { userLinks } from "../sidebar/userLinks";
import { AdminHeader } from "../admin/AdminHeader";

import "../../textures.css";

export const UserTextures = () => {
  return (
    <div className="sm:block relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden">
      {/* Desktop version */}
      <div
        className="absolute inset-0 z-20 hidden lg:block"
        style={{
          backgroundImage: `url('/textures/sphere.svg'),
                                      url('/textures/Monero.svg'),
                                      url('/textures/star-img.svg'),
                                      url('/textures/star-img2.svg'),
                                      url('/textures/star-img3.svg'),
                                      url('/textures/Etherium-2.svg'),
                                      url('/textures/LiteCoin-1.svg'),
                                      url('/textures/sphere-y.svg'),
                                      url('/textures/Bitcoin-1.svg'),
                                      url('/textures/star-img3.svg')`,
          backgroundSize: "7%, 10%, 3%, 2%, 2%, 8%, 7%, 5%, 7%, 2%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: `right 0px top 550px,
                                        right 130px top 220px,
                                        right 300px top 110px,
                                        right 200px top 200px,
                                        right 250px top 900px,
                                        right 430px top 650px,
                                        left 300px top 550px,
                                        left 130px top 410px,
                                        left 370px top 100px,
                                        left 350px top 290px`,
        }}
      ></div>

      {/* Mobile version */}
      <div
        className="absolute inset-0 z-10 block md:hidden"
        style={{
          backgroundImage: `url('/textures/sphere.svg'),
                                      url('/textures/Monero.svg'),
                                      url('/textures/star-img.svg'),
                                      url('/textures/star-img2.svg'),
                                      url('/textures/star-img3.svg'),
                                      url('/textures/Etherium-2.svg'),
                                      url('/textures/LiteCoin-1.svg'),
                                      url('/textures/sphere-y.svg'),
                                      url('/textures/Bitcoin-1.svg'),
                                      url('/textures/star-img3.svg')
                                      `,
          backgroundSize: "18%, 25%, 9%, 6%, 5%, 25%, 23%, 14%, 17%, 8%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: `right 0px top 450px,
                                        right 20px top 295px,
                                        right 150px top 205px,
                                        right 120px top 270px,
                                        right 80px top 850px,
                                        right 80px top 720px,
                                        left 30px top 660px,
                                        left -10px top 420px,
                                        left 120px top 200px,
                                        left 120px top 330px
                                        `,
        }}
      ></div>

      {/* Tablet version */}
      <div
        className="absolute inset-0 z-10 hidden md:block lg:hidden"
        style={{
          backgroundImage: `url('/textures/sphere.svg'),
                                      url('/textures/Monero.svg'),
                                      url('/textures/star-img.svg'),
                                      url('/textures/star-img2.svg'),
                                      url('/textures/star-img3.svg'),
                                      url('/textures/Etherium-2.svg'),
                                      url('/textures/LiteCoin-1.svg'),
                                      url('/textures/sphere-y.svg'),
                                      url('/textures/Bitcoin-1.svg'),
                                      url('/textures/star-img3.svg')
                                      `,
          backgroundSize: "14%, 18%, 6%, 5%, 5%, 18%, 20%, 12%, 15%, 6%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: `right 0px top 450px,
                                        right 20px top 295px,
                                        right 150px top 205px,
                                        right 120px top 270px,
                                        right 80px top 850px,
                                        right 80px top 720px,
                                        left 30px top 660px,
                                        left -10px top 420px,
                                        left 120px top 200px,
                                        left 120px top 330px
                                        `,
        }}
      ></div>

      <div className="texture-oval z-9"></div>
      <div className="texture-oval2 z-9"></div>
      <div className="texture-oval3 z-9"></div>
      <div className="relative z-20">
        <div className="flex flex-col min-h-screen container ">
          <AdminHeader />
          <div className="flex">
            <Sidebar navLinks={userLinks} />
            <main className="flex-1 p-4">
              <Outlet />
            </main>
          </div>
        </div>
        <div className="w-full border-t border-[#636363]">
          <Footer />
        </div>
      </div>

      <div className="texture-green"></div>
      <div className="texture-orange"></div>
      <div className="texture-purple"></div>
    </div>
  );
};
