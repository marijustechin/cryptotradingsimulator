import { useEffect } from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import { selectUser } from '../store/features/user/authSlice';
import { useAppSelector } from '../store/store';
import { useNavigate } from 'react-router';
import bg from '/forms-background.png';

export const LoginPage = () => {
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (user.role === 'USER') navigate('/my-dashboard');
  }, [navigate, user]);

  return (
    <main className="relative max-w-3xl mx-auto">
      <img
        className="absolute -left-60 md:top-30 z-10"
        src={bg}
        alt="background"
      />
      <div className="absolute sm:top-10 md:top-20 lg:top-32 md:right-10 z-20">
        <LoginForm />
      </div>
    </main>
  );
};
