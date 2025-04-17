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
import logo from '/logo.png';
import { Link } from "react-router";

export const ChangePasswordLoginForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema),
  });

  const onSubmit = async (data: z.infer<typeof ChangePasswordSchema>) => {
    try {
      const response = await UserService.changePassword(
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
      className="form-basic"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex gap-2 items-center justify-center">
        <img src={logo} alt="logo" className="w-[2rem] h-[2rem]" />
        <h2>Crypto Hills</h2>
      </div>

      <div className="h-10 flex items-center justify-center">
        {error && <span className="text-xs text-rose-500">{error}</span>}
      </div>

      <div className="flex flex-col gap-2 my-3">
        <label className="form-label" htmlFor="newPassword">
          New Password
        </label>
        <input
          onKeyUp={() => clearErrors("newPassword")}
          id="newPassword"
          className="form-input"
          type="password"
          autoComplete="off"
          placeholder="New password"
          {...register("newPassword")}
        />
        <div className="relative">
          {errors.newPassword && (
            <span className="absolute bottom-[-0.7rem] text-xs text-red-500">
              {errors.newPassword.message}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 my-3">
        <label className="form-label" htmlFor="repeatPassword">
          Repeat New Password
        </label>
        <input
          onKeyUp={() => clearErrors("repeatPassword")}
          id="repeatPassword"
          className="form-input"
          type="password"
          autoComplete="off"
          placeholder="Repeat new password"
          {...register("repeatPassword")}
        />
        <div className="relative">
          {errors.repeatPassword && (
            <span className="absolute bottom-[-0.7rem] text-xs text-red-500">
              {errors.repeatPassword.message}
            </span>
          )}
        </div>
      </div>

      <button type="submit" className="btn-generic mt-8">
        Change Password
      </button>

      <p className="text-center text-sm mt-4">
        <Link className="text-violet-300 hover:underline" to="/login">
          ← Back to Login
        </Link>
      </p>
    </form>
  );
};
