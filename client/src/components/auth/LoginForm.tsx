import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { LoginSchema } from '../../schemas/LoginSchema';
import { RootState, useAppDispatch, useAppSelector } from '../../store/store';
import { useNavigate } from 'react-router';
import { loginUser, selectUser } from '../../store/features/user/authSlice';
import { useEffect } from 'react';

export const LoginForm = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const { status, error } = useAppSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof LoginSchema>> = (formData) => {
    dispatch(loginUser({ email: formData.email, password: formData.password }));
  };

  // redux klaidas sinchronizuojam su formos klaidomis
  useEffect(() => {
    if (error) {
      setError('root', { message: error });
    }
  }, [error, setError]);

  // jei viskas ok, redirectinam
  useEffect(() => {
    if (status === 'succeeded') {
      // ar useris, ar adminas
      if (user.role === 'ADMIN') {
        navigate('/dashboard');
        return;
      }

      if (user.role === 'USER') {
        navigate('/my-dashboard');
        return;
      }
    }
  }, [status, user, navigate]);

  return (
    <form
      className="max-w-sm mx-auto"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <h2>🪙 Please login</h2>
        <div className="h-10">
          {error && <span className="text-sm text-rose-500">{error}</span>}
        </div>
        <div className="flex flex-col gap-2 my-2">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            className="w-full border border-violet-400 p-2 rounded-lg focus:outline-none"
            type="email"
            autoComplete="on"
            {...register('email')}
          />
          {errors.email && (
            <span className="text-xs text-red-500">{errors.email.message}</span>
          )}
        </div>
        <div className="flex flex-col gap-2 my-2">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            className="w-full border border-violet-400 p-2 rounded-lg focus:outline-none"
            type="password"
            autoComplete="off"
            {...register('password')}
          />
          {errors.password && (
            <span className="text-xs text-red-500">
              {errors.password.message}
            </span>
          )}
        </div>
        <button
          type="submit"
          className="w-full text-white bg-gradient-to-r from-blue-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
        >
          Login
        </button>
      </div>
    </form>
  );
};
