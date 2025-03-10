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

export const SignupForm = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm<z.infer<typeof SignupSchema>>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      email: '',
      password: '',
      first_name: '',
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof SignupSchema>> = async (
    formData
  ) => {
    try {
      const response = await AuthService.register(
        formData.first_name,
        formData.email,
        formData.password
      );
      toast.success(response.message);
      navigate('/login');
    } catch (error) {
      setError(HelperService.errorToString(error));
    }
  };

  return (
    <form
      className="sm:max-w-sm mx-auto form-basic shadow-violet-400 shadow-md mb-5 mt-5"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="">
        <div className="flex">
          <img src={Logo} alt="logo" className="w-[3rem] h-[3rem] " />
          <h2 className="pl-[0.5rem]">Crypto Hills</h2>
        </div>

        <div className="h-10">
          {error && <span className="text-sm text-rose-500">{error}</span>}
        </div>
        <div className="flex flex-col gap-2 my-3">
          <label htmlFor="first_name">First Name</label>
          <input
            id="first_name"
            className="form-input"
            type="text"
            autoComplete="on"
            {...register('first_name')}
          />
          <div className="relative">
            {errors.first_name && (
              <span className="absolute bottom-[-0.7rem] text-xs text-red-500 whitespace-nowrap">
                {errors.first_name.message}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 my-3">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            className="form-input"
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
          <label htmlFor="password">Password</label>
          <input
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

        <div className="flex flex-col gap-2 my-3">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            className="form-input"
            type="password"
            autoComplete="off"
            {...register('confirmPassword')}
          />
          <div className="relative">
            {errors.confirmPassword && (
              <span className="absolute bottom-[-0.7rem] text-xs text-red-500">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="px-4 py-2 mt-[2rem] rounded-[10px] border border-white/47 cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
        >
          Register
        </button>
      </div>
    </form>
  );
};
