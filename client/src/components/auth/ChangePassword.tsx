import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangePasswordSchema } from "../../schemas/ChangePassword";
import * as z from "zod";
import UserService from "../../services/UserService";
import toast from "react-hot-toast";
import { useState } from "react";
import { useNavigate } from "react-router";
import HelperService from "../../services/HelperService";
import { useAppDispatch } from "../../store/store";
import { logoutUser } from "../../store/features/user/authSlice";
import { useTranslation } from "react-i18next";

export const ChangePasswordForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { t } = useTranslation();

  const schema = ChangePasswordSchema(t);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<ReturnType<typeof ChangePasswordSchema>>>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: z.infer<ReturnType<typeof ChangePasswordSchema>>) => {
    try {
      await UserService.changePassword(
        data.currentPassword,
        data.newPassword,
        data.repeatPassword
      );

      toast.success(t("user_profile_password_changed")); // translated toast
      await dispatch(logoutUser());
      navigate("/login");
    } catch (e) {
      setError(HelperService.errorToString(e));
    }
  };

  return (
    <form
      className="bg-gray-800 text-white p-4 rounded-2xl shadow-lg max-w-xs w-full mx-auto"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <h4 className="text-center font-semibold text-white-300 mb-4">
        {t("user_profile_change_password")}
      </h4>

      <div className="text-center">
        {error && <span className="form-error-span">{error}</span>}
      </div>

      <div className="flex flex-col gap-5">
        {/* Current Password */}
        <div>
          <label className="text-sm text-violet-700" htmlFor="currentPassword">
            {t("user_profile_current_password")}
          </label>
          <input
            id="currentPassword"
            type="password"
            className="w-full p-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none"
            placeholder={t("user_profile_current_password")}
            autoComplete="off"
            {...register("currentPassword")}
          />
          {errors.currentPassword && (
            <span className="text-xs text-red-500">{errors.currentPassword.message}</span>
          )}
        </div>

        {/* New Password */}
        <div>
          <label className="text-sm text-violet-700" htmlFor="newPassword">
            {t("user_profile_new_password")}
          </label>
          <input
            id="newPassword"
            type="password"
            className="w-full p-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none"
            placeholder={t("user_profile_new_password")}
            autoComplete="off"
            {...register("newPassword")}
          />
          {errors.newPassword && (
            <span className="text-xs text-red-500">{errors.newPassword.message}</span>
          )}
        </div>

        {/* Repeat Password */}
        <div>
          <label className="text-sm text-violet-700" htmlFor="repeatPassword">
            {t("user_profile_repeat_password")}
          </label>
          <input
            id="repeatPassword"
            type="password"
            className="w-full p-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none"
            placeholder={t("user_profile_repeat_password")}
            autoComplete="off"
            {...register("repeatPassword")}
          />
          {errors.repeatPassword && (
            <span className="text-xs text-red-500">{errors.repeatPassword.message}</span>
          )}
        </div>
      </div>

      <button type="submit" className="btn-generic mt-8">
        {t("user_profile_change_password")}
      </button>
    </form>
  );
};
