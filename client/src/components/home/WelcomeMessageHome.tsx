import { Link } from "react-router";
import portfolio from "/portfolio.png";
import { useEffect, useState } from "react";
import { CoinTable } from "../home/CoinTable";
import { Loader } from "../Loader";

export const WelcomeMessageHome = () => {
  const [isContentReady, setIsContentReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsContentReady(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!isContentReady) {
    return (
      <div className="flex items-center justify-center h-[75vh]">
        <Loader/>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen max-w-4xl p-1">
      <div className="text-white text-center md:mt-32 mt-12">
        <h1 className="title-first">We make crypto clear and simple</h1>
      </div>
      <CoinTable />
      <div className="mt-6">
        <Link to="/registration" className="btn-generic">
          Get Started
        </Link>
      </div>
      <div className="grid md:grid-cols-[0.7fr_1.3fr] text-white gap-3 relative mt-20 md:mt-40">
        <div className="text-white text-center md:text-left">
          <h1 className="title-first">
            Take your first step into safe, secure crypto investing
          </h1>
          <div className="mt-6">
            <Link to="/registration" className="btn-generic">
              Get Started
            </Link>
          </div>
        </div>
        <div className="texture-purple absolute top-60 right-10 md:-top-15 lg:-right-50 md:-right-80"></div>
        <img
          className="z-10 object-cover w-full"
          src={portfolio}
          alt="portfolio"
        />
      </div>
    </div>
  );
};