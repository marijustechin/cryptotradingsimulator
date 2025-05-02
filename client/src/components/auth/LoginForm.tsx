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
import { useTranslation } from 'react-i18next';

export const LoginForm = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const { status, error } = useAppSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const schema = LoginSchema(t);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<z.infer<ReturnType<typeof LoginSchema>>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<z.infer<ReturnType<typeof LoginSchema>>> = (formData) => {
    dispatch(loginUser({ email: formData.email, password: formData.password }));
  };

  // sync redux error into form error
  useEffect(() => {
    if (error) {
      setError('root', { message: error });
    }
  }, [error, setError]);

  // redirect on success
  useEffect(() => {
    if (status === 'succeeded') {
      dispatch(getInfo());
      if (user.role === 'ADMIN') {
        navigate('/dashboard');
      } else if (user.role === 'USER') {
        navigate('/my-dashboard');
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

        {/* Email */}
        <div className="flex flex-col gap-2 my-3">
          <label className="form-label" htmlFor="email">
            {t('form_input_label_email')}
          </label>
          <input
            onKeyUp={clearError}
            id="email"
            className="form-input"
            type="email"
            autoComplete="on"
            {...register('email')}
          />
          {errors.email && (
            <span className="text-xs text-red-500">{errors.email.message}</span>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-2 my-3">
          <label className="form-label" htmlFor="password">
            {t('form_input_label_password')}
          </label>
          <input
            onKeyUp={clearError}
            id="password"
            className="form-input"
            type="password"
            autoComplete="off"
            {...register('password')}
          />
          {errors.password && (
            <span className="text-xs text-red-500">{errors.password.message}</span>
          )}
        </div>

        <p className="text-right">
          <Link className="text-sm text-violet-300" to="/restore-password-email">
            {t('form_forgot_password')}
          </Link>
        </p>

        <div>
          <button type="submit" className="btn-generic">
            {t('form_button_login')}
          </button>
        </div>
      </div>
    </form>
  );
};
