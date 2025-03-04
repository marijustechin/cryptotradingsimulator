import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { SignupSchema } from "../../schemas/SignupSchema";
import { useNavigate } from "react-router";
import { useState } from "react";
import AuthService from "../../services/AuthService";
import HelperService from "../../services/HelperService";
import toast from "react-hot-toast";

export const SignupForm = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm<z.infer<typeof SignupSchema>>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      email: "",
      password: "",
      first_name: "",
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
      navigate("/login");
    } catch (error) {
      setError(HelperService.errorToString(error));
    }
  };

  return (
    <>
      <form
        className="max-w-sm mx-auto"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <h2>🪙 Please signup</h2>
          <div className="h-10">
            {error && <span className="text-sm text-rose-500">{error}</span>}
          </div>
          <div className="flex flex-col gap-2 my-2">
            <label htmlFor="first_name">First name</label>
            <input
              id="first_name"
              className="w-full border border-violet-400 p-2 rounded-lg focus:outline-none autofill:transition-colors autofill:duration-[999999999s]"
              type="text"
              autoComplete="on"
              {...register("first_name")}
            />
            {errors.first_name && (
              <span className="text-xs text-red-500">
                {errors.first_name.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2 my-2">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              className="w-full border border-violet-400 p-2 rounded-lg focus:outline-none autofill:transition-colors autofill:duration-[999999999s]"
              type="email"
              autoComplete="on"
              {...register("email")}
            />
            {errors.email && (
              <span className="text-xs text-red-500">
                {errors.email.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2 my-2">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              className="w-full border border-violet-400 p-2 rounded-lg focus:outline-none autofill:transition-colors autofill:duration-[999999999s]"
              type="password"
              autoComplete="off"
              {...register("password")}
            />
            {errors.password && (
              <span className="text-xs text-red-500">
                {errors.password.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2 my-2">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              className="w-full border border-violet-400 p-2 rounded-lg focus:outline-none autofill:transition-colors autofill:duration-[999999999s]"
              type="password"
              autoComplete="off"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <span className="text-xs text-red-500">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="w-full text-white bg-gradient-to-r from-blue-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
          >
            Register
          </button>
        </div>
      </form>
    </>
  );
};
