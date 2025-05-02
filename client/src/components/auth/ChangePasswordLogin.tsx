import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useSearchParams, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import UserService from '../../services/UserService';
import { isAxiosError } from 'axios';
import HelperService from '../../services/HelperService';
import { useTranslation } from 'react-i18next';

export const ChangePasswordLoginForm = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  // 🧩 Inline schema with i18n
  const schema = z.object({
    newPassword: z
      .string()
      .min(6, { message: t('form_validation_minimum_characters', { count: 6 }) }),
  });

  useEffect(() => {
    if (!token) {
      toast.error(t('restore_password_token_missing'));
      navigate('/login');
    }
  }, [token, navigate, t]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async ({ newPassword }: { newPassword: string }) => {
    if (!token) {
      toast.error(t('restore_password_token_missing'));
      return;
    }

    try {
      setLoading(true);
      const response = await UserService.restorePassword(token!, newPassword);
      toast.success(t('restore_password_success'));
      navigate('/login');
    } catch (err) {
      setLoading(false);
      toast.error(
        isAxiosError(err)
          ? HelperService.errorToString(err)
          : t('restore_password_failed')
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-basic">
      <h2>{t('restore_password_title')}</h2>

      <label className="form-label" htmlFor="newPassword">
        {t('form_input_label_password')}
      </label>
      <input
        className="form-input"
        type="password"
        {...register('newPassword')}
        placeholder={t('restore_password_placeholder')}
      />
      {errors.newPassword && (
        <span className="text-red-500 text-sm">
          {errors.newPassword.message}
        </span>
      )}

      <button
        type="submit"
        className="btn-generic mt-4"
        disabled={loading}
      >
        {loading ? t('restore_password_resetting') : t('restore_password_submit')}
      </button>
    </form>
  );
};

export default ChangePasswordLoginForm;
