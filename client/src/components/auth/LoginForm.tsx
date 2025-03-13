import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { LoginSchema } from '../../schemas/LoginSchema';
import { RootState, useAppDispatch, useAppSelector } from '../../store/store';
import { Link, useNavigate } from 'react-router';
import {
  loginUser,
  selectUser,
  setStatusError,
} from '../../store/features/user/authSlice';
import { useEffect } from 'react';
import logo from '/logo.png';
import { getInfo } from '../../store/features/user/userInfoSlice';

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
      dispatch(getInfo());
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
  }, [status, user, navigate, dispatch]);

  const clearError = () => {
    if (errors.root) {
      dispatch(setStatusError(''));
    }
  };

  return (
    <form className="form-basic" noValidate onSubmit={handleSubmit(onSubmit)}>
      <div>
        <div className="flex gap-2 items-center justify-center">
          <img src={logo} alt="logo" className="w-[2rem] h-[2rem]" />
          <h2>Crypto Hills</h2>
        </div>
        <div className="h-10 flex items-center justify-center">
          {error && <span className="text-xs text-rose-500">{error}</span>}
        </div>

        <div className="flex flex-col gap-2 my-3">
          <label className="form-label" htmlFor="email">
            Email
          </label>
          <input
            onKeyUp={() => clearError()}
            id="email"
            className="form-input autofill:transition-colors autofill:duration-[999999999s]"
            type="email"
            autoComplete="on"
            {...register('email')}
          />
          <div className="relative">
            {errors.email && (
              <span className="absolute bottom-[-0.7rem] text-xs text-red-500">
                {errors.email.message}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 my-3">
          <label className="form-label" htmlFor="password">
            Password
          </label>
          <input
            onKeyUp={() => clearError()}
            id="password"
            className="form-input"
            type="password"
            autoComplete="off"
            {...register('password')}
          />
          <div className="relative">
            {errors.password && (
              <span className="absolute bottom-[-0.7rem] text-xs text-red-500">
                {errors.password.message}
              </span>
            )}
          </div>
        </div>
        <p className="text-right">
          <Link className="text-sm text-violet-300" to={'/restore-password'}>
            Forgot password?
          </Link>
        </p>
        <div>
          <button type="submit" className="btn-generic">
            Login
          </button>
        </div>
      </div>
    </form>
  );
};
