import { Link } from 'react-router';

export const WelcomeMessageHome = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <div className="text-white text-[28px] md:text-[55px] lg:text-[95px] text-center mt-[15px] sm:mt-30">
        <p>We make crypto</p>
        <p>clear and simple</p>
      </div>

      <div className="mt-6">
        <Link to="/registration">
          <button
            className="
        btn-generic"
          >
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
};
