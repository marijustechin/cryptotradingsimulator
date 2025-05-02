import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Link } from 'react-router';
import $api from '../../api/axios';
import logo from '/logo.png';
import { useTranslation } from 'react-i18next';

const schema = z.object({
  email: z.string().email('form_validation_invalid_email'),
});

type FormData = z.infer<typeof schema>;

export const RestorePasswordConfirmation = () => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
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
      setApiError(
        error?.response?.data?.message || t('form_generic_error')
      );
    }
  };

  return (
    <form className="form-basic" noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className="flex gap-2 items-center justify-center">
        <img src={logo} alt="logo" className="w-[2rem] h-[2rem]" />
        <h2>Crypto Hills</h2>
      </div>

      <div className="h-10 flex items-center justify-center">
        {emailSent ? (
          <span className="text-green-400 text-sm">
            ✅ {t('restore_password_confirmation_success')}
          </span>
        ) : (
          apiError && <span className="text-xs text-rose-500">{apiError}</span>
        )}
      </div>

      {!emailSent && (
        <>
          <div className="flex flex-col gap-2 my-3">
            <label className="form-label" htmlFor="email">
              {t('form_input_label_email')}
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
              placeholder={t('restore_password_email_placeholder')}
              {...register('email')}
            />
            <div className="relative">
              {errors.email && (
                <span className="absolute bottom-[-0.7rem] text-xs text-red-500">
                  {t(errors.email.message || '')}
                </span>
              )}
            </div>
          </div>

          <div>
            <button type="submit" className="btn-generic">
              {t('restore_password_send_link')}
            </button>
          </div>
        </>
      )}

      <p className="text-center text-sm mt-4">
        <Link className="text-violet-300 hover:underline" to="/login">
          ← {t('form_back_to_login')}
        </Link>
      </p>
    </form>
  );
};

export default RestorePasswordConfirmation;
