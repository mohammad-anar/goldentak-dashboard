"use client";

import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useChangePasswordMutation } from "@/redux/features/auth/authApi";
import { toast } from "sonner";

interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ChangePasswordPage() {
  const router = useRouter();
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ChangePasswordForm>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");

  const onSubmit = async (data: ChangePasswordForm) => {
    try {
      await changePassword({ 
        oldPassword: data.currentPassword, 
        newPassword: data.newPassword 
      }).unwrap();
      toast.success("Password updated successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update password");
    }
  };

  return (
    <div className="w-full">
      <div className="mb-10">
        <h1 className="text-3xl font-medium text-white mb-3">
          Change Password
        </h1>
        <p className="text-auth-text-gray text-[15px]">
          Update your password to keep your account secure.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
        <div className="space-y-2.5">
          <label className="block text-[15px] font-normal text-white">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              placeholder="Enter your current password"
              {...register("currentPassword", {
                required: "Current password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              className="w-full px-4 py-3.5 rounded-xl border border-gray-800 bg-auth-input-bg text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-auth-primary transition-all"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            >
              {showCurrentPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        <div className="space-y-2.5">
          <label className="block text-[15px] font-normal text-white">
            New Password
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="Enter your new password"
              {...register("newPassword", {
                required: "New password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              className="w-full px-4 py-3.5 rounded-xl border border-gray-800 bg-auth-input-bg text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-auth-primary transition-all"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            >
              {showNewPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <div className="space-y-2.5">
          <label className="block text-[15px] font-normal text-white">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your new password"
              {...register("confirmPassword", {
                required: "Confirm password is required",
                validate: (value) =>
                  value === newPassword || "Passwords do not match",
              })}
              className="w-full px-4 py-3.5 rounded-xl border border-gray-800 bg-auth-input-bg text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-auth-primary transition-all"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            >
              {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full py-7 rounded-xl font-semibold text-white text-lg bg-auth-primary hover:bg-auth-primary/90 cursor-pointer transition-all border-none"
        >
          {isLoading ? "Updating..." : "Update Password"}
        </Button>
      </form>

      <div className="mt-8">
        <Link
          href="/login"
          className="text-blue-900 text-sm font-medium hover:text-blue-800 transition-colors"
        >
          Back to login
        </Link>
      </div>
    </div>
  );
}
