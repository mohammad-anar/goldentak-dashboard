"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { useForgotPasswordMutation } from "@/redux/features/auth/authApi";
import { toast } from "sonner";

interface ForgotPasswordForm {
  email: string;
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      await forgotPassword({ email: data.email }).unwrap();
      toast.success("OTP sent successfully to your email");
      router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to send OTP. Please check your email.");
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-medium text-white mb-3">
          Forgot Password
        </h1>
        <p className="text-auth-text-gray text-[15px]">
          Enter the email associated with your account and we&apos;ll
          send a code to reset your password.
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
            <p className="text-red-500 text-xs mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Send Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full py-7 rounded-xl font-semibold text-white text-lg bg-auth-primary hover:bg-auth-primary/90 cursor-pointer transition-all border-none"
        >
          {isLoading ? "Sending..." : "Send"}
        </Button>
      </form>

      {/* Back to Login Link */}
      <div className="mt-8">
        <p className="text-auth-text-gray text-sm">
          Remember your password?{" "}
          <Link
            href="/login"
            className="text-blue-900 font-medium hover:text-blue-800 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
