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

export const UpdateUserForm = () => {
  const dispatch = useAppDispatch();
  const userData = useAppSelector(selectUserInfo);
  const infoStatus = useAppSelector(getUserInfoStatus);
  const infoError = useAppSelector(getUserInfoError);

  // saugom pradines reiksmes, kad veliau
  // galetume sulyginti su formos laukais
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
  } = useForm<z.infer<typeof UpdateUserSchema>>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: initialValues.current,
  });

  // When the user logs in/out, reset the form
  useEffect(() => {
    if (userData) {
      reset(userData);
      initialValues.current = userData; // Update initial values
    }
  }, [userData, reset]);

  // Load user info on mount
  useEffect(() => {
    dispatch(getInfo());
  }, [dispatch]);

  // stebim visu lauku paketimuas
  const watchedFields = watch();

  // palyginam fomos laukus su pradiniais duomenimis
  const isFormChanged =
    JSON.stringify(watchedFields) !== JSON.stringify(initialValues.current);

  // Isvalom klaidas, jei naudotojas keicia lauku reiksmes
  const handleChange = useCallback(() => {
    if (infoError) dispatch(setInfoError(''));
  }, [infoError, dispatch]);

  const onSubmit: SubmitHandler<z.infer<typeof UpdateUserSchema>> = async (
    formData
  ) => {
    await dispatch(updateUserInfo(formData));
    if (infoStatus === 'succeeded') {
      toast.success('Profile data updated successfully');
    }
  };

  return (
    <form
      className="bg-gray-900 text-white p-4 rounded-2xl shadow-lg max-w-xs w-full mx-auto"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="text-center">
        {infoStatus === 'loading' && (
          <span className="text-sm text-emerald-500">Saving data...</span>
        )}
        {infoError && <span className="form-error-span">{infoError}</span>}
      </div>
      <div className="flex flex-col gap-3">
        <div>
          <label className="text-sm text-violet-700" htmlFor="first_name">
            First name
          </label>
          <input
            id="first_name"
            className="w-full p-2 rounded-lg bg-gray-800 text-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none"
            type="text"
            autoComplete="on"
            placeholder="Your name"
            {...register('first_name', { onChange: handleChange })}
          />
          {errors.first_name && (
            <span className="form-error-span">{errors.first_name.message}</span>
          )}
        </div>
        <div>
          <label className="text-sm text-violet-700" htmlFor="last_name">
            Last name
          </label>
          <input
            id="last_name"
            className="w-full p-2 rounded-lg bg-gray-800 text-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none"
            type="text"
            autoComplete="on"
            placeholder="Last name"
            {...register('last_name', { onChange: handleChange })}
          />
          {errors.last_name && (
            <span className="form-error-span">{errors.last_name.message}</span>
          )}
        </div>
        <div>
          <label className="text-sm text-violet-700" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            className="w-full p-2 rounded-lg bg-gray-800 text-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none"
            type="text"
            autoComplete="on"
            placeholder="Your email"
            {...register('email', { onChange: handleChange })}
          />
          {errors.email && (
            <span className="form-error-span">{errors.email.message}</span>
          )}
        </div>
        <div>
          <label className="text-violet-700 text-sm" htmlFor="address">
            Address
          </label>
          <input
            id="address"
            className="w-full p-2 rounded-lg bg-gray-800 text-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none"
            type="text"
            autoComplete="on"
            placeholder="Address"
            {...register('address', { onChange: handleChange })}
          />
          {errors.address && (
            <span className="form-error-span">{errors.address.message}</span>
          )}
        </div>
        <div>
          <label className="text-sm text-violet-700" htmlFor="phone_number">
            Phone number
          </label>
          <input
            id="phone_number"
            className="w-full p-2 rounded-lg bg-gray-800 text-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none"
            type="text"
            autoComplete="on"
            placeholder="Phone number"
            {...register('phone_number', { onChange: handleChange })}
          />
          {errors.phone_number && (
            <span className="form-error-span">
              {errors.phone_number.message}
            </span>
          )}
        </div>
      </div>

      {/* Taip mes rodome mygtuka tik tada, kai kurio nors lauko duomenys keiciasi */}
      {isFormChanged && (
        <button type="submit" className="btn-generic">
          Update
        </button>
      )}
    </form>
  );
};
