import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { UpdateUserSchema } from '../../schemas/UpdateUserSchema';
import { useAppDispatch, useAppSelector } from '../../store/store';
import {
  getInfo,
  getUserInfoError,
  getUserInfoStatus,
  selectUserInfo,
  setInfoError,
  updateUserInfo,
} from '../../store/features/user/userInfoSlice';
import { useCallback, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export const UpdateUserForm = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const userData = useAppSelector(selectUserInfo);
  const infoStatus = useAppSelector(getUserInfoStatus);
  const infoError = useAppSelector(getUserInfoError);

  const initialValues = useRef({
    first_name: userData?.first_name ?? '',
    last_name: userData?.last_name ?? '',
    email: userData?.email ?? '',
    address: userData?.address ?? '',
    phone_number: userData?.phone_number ?? '',
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<z.infer<ReturnType<typeof UpdateUserSchema>>>({
    resolver: zodResolver(UpdateUserSchema(t)),
    defaultValues: initialValues.current,
  });

  useEffect(() => {
    if (userData) {
      reset(userData);
      initialValues.current = userData;
    }
  }, [userData, reset]);

  useEffect(() => {
    dispatch(getInfo());
  }, [dispatch]);

  const watchedFields = watch();
  const isFormChanged =
    JSON.stringify(watchedFields) !== JSON.stringify(initialValues.current);

  const handleChange = useCallback(() => {
    if (infoError) dispatch(setInfoError(''));
  }, [infoError, dispatch]);

  const onSubmit: SubmitHandler<z.infer<ReturnType<typeof UpdateUserSchema>>> = async (formData) => {
    await dispatch(updateUserInfo(formData));
    if (infoStatus === 'succeeded') {
      toast.success(t('user_profile_updated_success'));
    }
  };

  return (
    <form
      className='bg-gray-800 text-white p-4 rounded-2xl shadow-lg max-w-xs w-full mx-auto'
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className='text-center mb-2'>
        {infoStatus === 'loading' && (
          <span className='text-sm text-emerald-500'>{t('user_profile_saving_data')}</span>
        )}
        {infoError && <span className='form-error-span'>{infoError}</span>}
      </div>

      <h4 className='text-center font-semibold mb-4'>
        {t('user_profile_update_info')}
      </h4>

      <div className='flex flex-col gap-3'>
        <div>
          <label htmlFor='first_name' className='form-label'>
            {t('form_input_label_name')}
          </label>
          <input
            id='first_name'
            className='w-full p-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none'
            {...register('first_name', { onChange: handleChange })}
            placeholder={t('user_profile_your_name')}
            autoComplete='on'
          />
          {errors.first_name && <span className='form-error-span'>{errors.first_name.message}</span>}
        </div>

        <div>
          <label htmlFor='last_name' className='form-label'>
            {t('user_profile_last_name')}
          </label>
          <input
            id='last_name'
            className='w-full p-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none'
            {...register('last_name', { onChange: handleChange })}
            placeholder={t('user_profile_last_name')}
            autoComplete='on'
          />
          {errors.last_name && <span className='form-error-span'>{errors.last_name.message}</span>}
        </div>

        <div>
          <label htmlFor='email' className='form-label'>
            {t('form_input_label_email')}
          </label>
          <input
            id='email'
            className='w-full p-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none'
            {...register('email', { onChange: handleChange })}
            placeholder={t('user_profile_your_email')}
            autoComplete='on'
          />
          {errors.email && <span className='form-error-span'>{errors.email.message}</span>}
        </div>

        <div>
          <label htmlFor='address' className='form-label'>
            {t('user_profile_address')}
          </label>
          <input
            id='address'
            className='w-full p-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none'
            {...register('address', { onChange: handleChange })}
            placeholder={t('user_profile_address')}
            autoComplete='on'
          />
          {errors.address && <span className='form-error-span'>{errors.address.message}</span>}
        </div>

        <div>
          <label htmlFor='phone_number' className='form-label'>
            {t('user_profile_phone_number')}
          </label>
          <input
            id='phone_number'
            className='w-full p-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none'
            {...register('phone_number', { onChange: handleChange })}
            placeholder={t('user_profile_number_example')}
            autoComplete='on'
          />
          {errors.phone_number && <span className='form-error-span'>{errors.phone_number.message}</span>}
        </div>
      </div>

      {isFormChanged && (
        <button type='submit' className='btn-generic mt-6'>
          {t('user_profile_update_button')}
        </button>
      )}
    </form>
  );
};
