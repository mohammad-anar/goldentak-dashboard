"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, KeyboardEvent, ChangeEvent } from "react";
import { useVerifyOtpMutation } from "@/redux/features/auth/authApi";
import { toast } from "sonner";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (value && !/^\d+$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").substring(0, 6);
    if (!/^\d+$/.test(pastedData)) return;
    const newOtp = [...otp];
    pastedData.split("").forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);
    const nextIndex = pastedData.length < 6 ? pastedData.length : 5;
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length < 6 || !email) return;
    
    try {
      await verifyOtp({ email, otp: otpValue }).unwrap();
      toast.success("OTP verified successfully");
      router.push(`/reset-password?email=${encodeURIComponent(email)}&otp=${otpValue}`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="w-full">
      <div className="mb-10">
        <h1 className="text-3xl font-medium text-white mb-3">OTP Verify</h1>
        <p className="text-auth-text-gray text-[15px]">
          Please check your email We sent there 6 digit code
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="flex justify-between gap-2 sm:gap-3" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              value={digit}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 sm:w-[60px] sm:h-[60px] rounded-xl border-none bg-white text-black text-center text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-auth-primary transition-all"
            />
          ))}
        </div>

        <Button
          type="submit"
          disabled={otp.some(digit => !digit) || isLoading}
          className="w-full py-7 rounded-xl font-semibold text-white text-lg bg-auth-primary hover:bg-auth-primary/90 cursor-pointer transition-all border-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Verifying..." : "Verify email"}
        </Button>
      </form>

      <div className="mt-10 text-center">
        <p className="text-auth-text-gray text-[15px]">
          Don&apos;t receive any code{" "}
          <button 
            type="button" 
            className="text-red-600 hover:text-red-500 font-medium transition-colors cursor-pointer ml-1"
          >
            Resend
          </button>
        </p>
      </div>
    </div>
  );
}
