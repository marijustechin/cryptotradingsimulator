import { useEffect } from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import { selectUser } from '../store/features/user/authSlice';
import { useAppSelector } from '../store/store';
import { useNavigate } from 'react-router';

export const LoginPage = () => {
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (user.role === 'USER') navigate('/my-dashboard');
  }, [navigate, user]);

  return (
    <main>
      <div className="w-3xl mx-auto mt-10">
        <LoginForm />
      </div>
    </main>
  );
};
