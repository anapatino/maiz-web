"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import bg_login from "../../../public/svg/login/bg_login.svg";
import "../globals.css";
import { AuthService } from "@/data/controllers/auth";
import { useRouter } from "next/navigation";
import Alert from "@/components/card/alert";

interface FomrInput {
  email: string;
  password: string;
}

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FomrInput>({ mode: "onChange" });
  const [isVisible, setIsVisible] = useState(false);
  const [messageError, setMessageError] = useState("");
  const authService = new AuthService();
  const router = useRouter();

  const onSubmit: SubmitHandler<FomrInput> = async (data) => {
    try {
      const user = await authService.login(data.email, data.password);
      if (user != null) {
        localStorage.setItem("user_email", data.email);
        router.push("/dashboard/category");
      }
    } catch (error: any) {
      setIsVisible(true);
      setMessageError(error.message);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-black relative text-white">
      <div className="absolute inset-0 z-0">
        <Image
          src={bg_login}
          alt="Background login"
          layout="fill"
          objectFit="cover"
          className="w-full h-full"
        />
      </div>
      <div className="relative z-10 p-8 bg-[#1E1E1E] flex flex-col items-center justify-center rounded-2xl max-w-sm w-full md:max-w-md lg:max-w-lg">
        <h3 className="text-3xl font-bold mb-8">LOGIN</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full p-4">
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-bold mb-2 tracking-wide"
            >
              Mail
            </label>
            <input
              type="email"
              id="email"
              placeholder="example@gmail.com"
              className="w-full p-2 border border-gray-300 rounded-md text-white bg-[#1E1E1E]"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                  message: "Enter a valid email",
                },
              })}
            />
            {errors.email && (
              <p className="text-white text-sm mt-1 tracking-wide">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-bold mb-2 tracking-wide"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-2 border border-gray-300 rounded-md text-white bg-[#1E1E1E]"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.password && (
              <p className="text-white text-sm mt-1 tracking-wide">
                {errors.password.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={!isValid}
            className={`w-full p-2 rounded-full text-base font-bold ${
              isValid
                ? "bg-[#DEA001] text-white"
                : "bg-gray-500 text-gray-300 cursor-not-allowed"
            }`}
          >
            Confirm
          </button>
        </form>
      </div>
      {isVisible && (
        <Alert
          title="Error al ingresar"
          message={messageError}
          type="error"
          onClose={() => setIsVisible(false)}
        />
      )}
    </main>
  );
}
