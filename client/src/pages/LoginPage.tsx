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
    <main className="min-h-70vh relative max-w-3xl mx-auto">
      <img
        className="absolute top-80 md:-left-40 md:top-8 z-10"
        src={bg}
        alt="background"
      />
      <div className="absolute inset-0 top-60 md:-right-40 flex items-center justify-center z-20">
        <LoginForm />
      </div>
    </main>
  );
};
