import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { SignupSchema } from '../../schemas/SignupSchema';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import AuthService from '../../services/AuthService';
import HelperService from '../../services/HelperService';
import toast from 'react-hot-toast';
import Logo from '/logo.png';
import { useTranslation } from 'react-i18next';

export const SignupForm = () => {
  const { t } = useTranslation();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const schema = SignupSchema(t);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      first_name: '',
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof schema>> = async (formData) => {
    try {
      await AuthService.register(
        formData.first_name,
        formData.email,
        formData.password
      );
      toast.success(t('form_toast_account_created'));
      navigate('/login');
    } catch (error) {
      setError(HelperService.errorToString(error));
    }
  };

  return (
    <form className="form-basic" noValidate onSubmit={handleSubmit(onSubmit)}>
      <div>
        <div className="flex gap-2 items-center justify-center">
          <img src={Logo} alt="logo" className="w-[2rem] h-[2rem]" />
          <h2>Crypto Hills</h2>
        </div>

        <div className="h-10">
          {error && <span className="text-sm text-rose-500">{error}</span>}
        </div>

        {/* First Name */}
        <div className="flex flex-col gap-2 my-3">
          <label className="form-label" htmlFor="first_name">
            {t('form_input_label_name')}
          </label>
          <input
            id="first_name"
            className="form-input"
            type="text"
            autoComplete="on"
            {...register('first_name')}
          />
          {errors.first_name && (
            <span className="text-xs text-red-500">
              {errors.first_name.message}
            </span>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2 my-3">
          <label className="form-label" htmlFor="email">
            {t('form_input_label_email')}
          </label>
          <input
            id="email"
            className="form-input"
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

        {/* Password */}
        <div className="flex flex-col gap-2 my-3">
          <label className="form-label" htmlFor="password">
            {t('form_input_label_password')}
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

        {/* Confirm Password */}
        <div className="flex flex-col gap-2 my-3">
          <label className="form-label" htmlFor="confirmPassword">
            {t('form_input_label_confirm_password')}
          </label>
          <input
            id="confirmPassword"
            className="form-input"
            type="password"
            autoComplete="off"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <span className="text-xs text-red-500">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        <button type="submit" className="btn-generic mt-6">
          {t('form_button_register')}
        </button>
      </div>
    </form>
  );
};
