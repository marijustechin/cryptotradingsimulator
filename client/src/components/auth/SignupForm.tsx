import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { SignupSchema } from "../../schemas/SignupSchema";
import { useNavigate } from "react-router";
import { useState } from "react";
import AuthService from "../../services/AuthService";
import HelperService from "../../services/HelperService";
import toast from "react-hot-toast";
import Logo from "../../../public/logo.png";

import FormImg from "../../../public/textures/forms-background.png"

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
    
      <div className="flex relative pt-[5.62rem] pb-[10rem]">
        <div className="absolute bottom-[-16rem] left-[-6rem] sm:right-[10rem] lg:bottom-[-18.5rem] w-2xl lg:w-3xl z-0">
          <img
            src={FormImg}
            alt="signup"
            className="absolute bottom-0 left-0 "
          />
        </div>
        <div className="relative flex items-center justify-center w-full min-h-screen z-10 sm:left-32 md:left-50 lg:left-70">
          <form
            className="sm:max-w-sm mx-auto bg-[#1c1c1c] rounded-[1rem] opacity-60 backdrop-blur-[10px] p-5 "
            noValidate
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="">
              <div className="flex">
                <img
                  src={Logo}
                  alt="logo"
                  className="w-[3.375rem] h-[3.32175rem] "
                />
                <h2 className="pl-[0.5rem]">Crypto Hills</h2>
              </div>

              <div className="h-10">
                {error && (
                  <span className="text-sm text-rose-500">{error}</span>
                )}
              </div>
              <div className="flex flex-col gap-2 my-2">
                <label htmlFor="first_name">First name</label>
                <input
                  id="first_name"
                  className="w-full p-2 rounded-lg focus:outline-none autofill:transition-colors autofill:duration-[999999999s] bg-dark-gray"
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
                  className="w-full p-2 rounded-lg focus:outline-none autofill:transition-colors autofill:duration-[999999999s] bg-dark-gray"
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
                  className="w-full p-2 rounded-lg focus:outline-none autofill:transition-colors autofill:duration-[999999999s] bg-dark-gray"
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
                  className="w-full p-2 rounded-lg focus:outline-none autofill:transition-colors autofill:duration-[999999999s] bg-dark-gray"
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
                className="px-4 py-2 mt-[2rem] rounded-[10px] border border-white/47 cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    
  );
};
