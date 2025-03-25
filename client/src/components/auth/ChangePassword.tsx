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

export const ChangePasswordForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema),
  });

  const onSubmit = async (data: z.infer<typeof ChangePasswordSchema>) => {
    try {
      const response = await UserService.changePassword(
        data.currentPassword,
        data.newPassword,
        data.repeatPassword
      );
      toast.success(response.message);

      await dispatch(logoutUser());
      navigate("/login");
    } catch (e) {
      setError(HelperService.errorToString(e));
    }
  };

  return (
    <form
      className="bg-gray-900 text-white p-4 rounded-2xl shadow-lg max-w-xs w-full mx-auto"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <h3 className="text-center font-semibold text-purple-300 mb-4">
        Change Password
      </h3>

      <div className="text-center">
        {error && <span className="form-error-span">{error}</span>}
      </div>

      <div className="flex flex-col gap-3">
        <div>
          <label className="text-sm text-violet-700" htmlFor="currentPassword">
            Current Password
          </label>
          <input
            id="currentPassword"
            type="password"
            className="w-full p-2 rounded-lg bg-gray-800 text-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none autofill:transition-colors autofill:duration-[999999999s]"
            placeholder="Current password"
            autoComplete="off"
            {...register("currentPassword")}
          />
          {errors.currentPassword && (
            <span className="form-error-span">
              {errors.currentPassword.message}
            </span>
          )}
        </div>

        <div>
          <label className="text-sm text-violet-700" htmlFor="newPassword">
            New Password
          </label>
          <input
            id="newPassword"
            type="password"
            className="w-full p-2 rounded-lg bg-gray-800 text-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none autofill:transition-colors autofill:duration-[999999999s]"
            placeholder="New password"
            autoComplete="off"
            {...register("newPassword")}
          />
          {errors.newPassword && (
            <span className="form-error-span">
              {errors.newPassword.message}
            </span>
          )}
        </div>

        <div>
          <label className="text-sm text-violet-700" htmlFor="repeatPassword">
            Repeat New Password
          </label>
          <input
            id="repeatPassword"
            type="password"
            className="w-full p-2 rounded-lg bg-gray-800 text-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none autofill:transition-colors autofill:duration-[999999999s]"
            placeholder="Repeat password"
            autoComplete="off"
            {...register("repeatPassword")}
          />
          {errors.repeatPassword && (
            <span className="form-error-span">
              {errors.repeatPassword.message}
            </span>
          )}
        </div>
      </div>

      <button type="submit" className="btn-generic mt-6">
        Change Password
      </button>
    </form>
  );
};
