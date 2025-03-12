import { useEffect } from 'react';
import { SignupForm } from '../components/auth/SignupForm';
import bg from '/forms-background.png';
import { useNavigate } from 'react-router';
import { useAppSelector } from '../store/store';
import { selectUser } from '../store/features/user/authSlice';

export const RegistrationPage = () => {
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (user.role === 'USER') navigate('/my-dashboard');
  }, [navigate, user]);

  return (
    <main className="flex flex-col justify-center items-center px-4 relative pt-5 pb-5 md:pt-16 md:pb-16">
      <div className="absolute z-0 flex justify-start max-w-4xl">
        <img className="w-full object-cover" src={bg} alt="background" />
      </div>

      <div className="w-full max-w-5xl flex flex-col md:flex-row items-center md:items-start justify-center sm:justify-end gap-8 md:gap-12">
        <div className="w-full md:w-1/2 flex justify-center md:justify-end z-10">
          <SignupForm />
        </div>
      </div>
    </main>
  );
};
