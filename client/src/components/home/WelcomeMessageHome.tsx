import { Link } from 'react-router';
import portfolio from '/portfolio.png';

import { lazy } from 'react';
const CoinTable = lazy(() => import('../home/CoinTable'));

export const WelcomeMessageHome = () => {
  return (
    <main className='flex flex-col items-center min-h-screen max-w-4xl p-1'>
      <div className='text-white text-center md:mt-32 mt-12'>
        <h1 className='title-first'>We make crypto clear and simple</h1>
      </div>
      <CoinTable />
      <div className='grid md:grid-cols-[1fr_1fr] text-white gap-3 relative mt-20 md:mt-40'>
        <div className='text-white text-center md:text-left p-2'>
          <p className='title-first'>
            Take your first step into safe, secure crypto investing
          </p>
          <div className='mt-6'>
            <Link to='/registration' className='btn-generic'>
              Get Started
            </Link>
          </div>
        </div>
        <div className='texture-case absolute md:-top-35 lg:-top-35 lg:-right-30 md:-right-60'></div>
        <img
          className='z-10 object-cover max-w-[15rem] md:max-w-[20rem] w-full place-self-center md:place-self-end'
          src={portfolio}
          alt='portfolio'
        />
      </div>
    </main>
  );
};
