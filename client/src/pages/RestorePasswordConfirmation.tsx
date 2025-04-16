import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Link } from 'react-router';
import $api from '../api/axios';
import logo from '/logo.png';

const RestorePasswordSchema = z.object({
  email: z.string().email('Please enter a valid email'),
});

type FormData = z.infer<typeof RestorePasswordSchema>;

const RestorePasswordConfirmation = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<FormData>({
    resolver: zodResolver(RestorePasswordSchema),
  });

  const [apiError, setApiError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const clearError = () => setApiError('');

  const onSubmit = async (data: FormData) => {
    try {
      await $api.post('/users/send-reset-link', { email: data.email });
      setEmailSent(true);
      setApiError('');
    } catch (error: any) {
      setApiError(error?.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0d0c1d] to-[#15132b] text-white px-4">
      <form className="form-basic" noValidate onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-2 items-center justify-center">
          <img src={logo} alt="logo" className="w-[2rem] h-[2rem]" />
          <h2>Crypto Hills</h2>
        </div>

        <div className="h-10 flex items-center justify-center">
          {emailSent ? (
            <span className="text-green-400 text-sm">✅ Reset link sent! Check your inbox.</span>
          ) : (
            apiError && <span className="text-xs text-rose-500">{apiError}</span>
          )}
        </div>

        {!emailSent && (
          <>
            <div className="flex flex-col gap-2 my-3">
              <label className="form-label" htmlFor="email">
                Email
              </label>
              <input
                onKeyUp={() => {
                  clearError();
                  clearErrors('email');
                }}
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

            <div>
              <button type="submit" className="btn-generic">
                Send Reset Link
              </button>
            </div>
          </>
        )}

        <p className="text-center text-sm mt-4">
          <Link className="text-violet-300 hover:underline" to="/login">
            ← Back to Login
          </Link>
        </p>
      </form>
    </main>
  );
};

export default RestorePasswordConfirmation;
