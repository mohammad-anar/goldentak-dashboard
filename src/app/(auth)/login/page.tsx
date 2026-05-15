"use client";

import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import logo from "@/assets/logo.png";

import { useLoginMutation } from "@/redux/features/auth/authApi";
import { toast } from "sonner";

interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await login({ email: data.email, password: data.password }).unwrap();
      
      if (response.success) {
        localStorage.setItem("token", response.data.accessToken);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        toast.success("Logged in successfully");
        router.push("/dashboard");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-medium text-white mb-3">Admin Login</h1>
        <p className="text-auth-text-gray text-[15px]">
          Enter your Credentials to access your dashboard
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
        {/* Email Field */}
        <div className="space-y-2.5">
          <label className="block text-[15px] font-normal text-white">
            Email address
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            className="w-full px-4 py-3.5 rounded-xl border border-gray-800 bg-auth-input-bg text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-auth-primary transition-all"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2.5">
          <label className="block text-[15px] font-normal text-white">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
              })}
              className="w-full px-4 py-3.5 rounded-xl border border-gray-800 bg-auth-input-bg text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-auth-primary transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Options */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                {...register("rememberMe")}
                className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-800 bg-auth-input-bg checked:bg-auth-primary checked:border-auth-primary focus:outline-none transition-all"
              />
              <svg
                className="absolute h-4 w-4 pointer-events-none hidden peer-checked:block text-white p-0.5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <label htmlFor="rememberMe" className="text-[13px] text-auth-text-gray cursor-pointer">
              Remember for 30 days
            </label>
          </div>
          <Link
            href="/forgot-password"
            className="text-[13px] text-blue-900 hover:text-blue-800 transition-colors"
          >
            forgot password
          </Link>
        </div>

        {/* Login Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full py-7 rounded-xl font-semibold text-white text-lg bg-auth-primary hover:bg-auth-primary/90 cursor-pointer transition-all border-none"
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
}
