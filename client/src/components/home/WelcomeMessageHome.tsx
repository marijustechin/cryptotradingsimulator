import { Link } from "react-router";

export const WelcomeMessageHome = () => {
  return (
    <>
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="text-white text-[28px] md:text-[55px] lg:text-[95px] text-center mt-[15px] sm:mt-30">
          We make crypto <br /> clear and simple
        </div>

        <div className="mt-6">
          <Link to="/registration">
          <button className="
        px-4 py-2 rounded-[10px] border border-white/47 cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300">
            Get Started
          </button>
          </Link>
        </div>
      </div>
    </>
  );
};
