import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { LoginSchema } from '../../schemas/LoginSchema';
import { RootState, useAppDispatch, useAppSelector } from '../../store/store';
import { useNavigate } from 'react-router';
import { loginUser, selectUser } from '../../store/features/user/authSlice';
import { useEffect } from 'react';
import logo from '/logo.png';

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
    <form className="form-basic" noValidate onSubmit={handleSubmit(onSubmit)}>
      <div>
        <h2 className="flex gap-2 items-center justify-center">
          <img className="h-8" src={logo} alt="logo" />
          Crypto Hills
        </h2>
        <div className="h-10 flex items-center justify-center">
          {error && <span className="text-xs text-rose-500">{error}</span>}
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1 my-2">
            <label className="text-xs" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="form-input autofill:transition-colors autofill:duration-[999999999s]"
              type="email"
              autoComplete="on"
              {...register('email')}
            />
            {errors.email && (
              <span className="text-xs text-red-500">
                {errors.email.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1 my-2">
            <label className="text-xs" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="form-input"
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
          <div>
            <button
              type="submit"
              className="w-20 text-white bg-gradient-to-tr from-blue-600 via-purple-700 to-violet-900 hover:bg-gradient-to-bl focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm p-2 text-center cursor-pointer"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
