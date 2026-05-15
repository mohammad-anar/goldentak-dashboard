import { ReactNode } from "react";
import Image from "next/image";
import authImage from "@/assets/auth_page_image.png";
import logo from "@/assets/logo.png";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-auth-bg text-white overflow-hidden">
      {/* Left Side: Form Content */}
      <div className="flex flex-col items-center justify-center p-8 sm:p-12 lg:p-16 xl:p-24 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-10">
            <Image 
              src={logo} 
              alt="Which Win Logo" 
              width={200} 
              height={120} 
              className="object-contain"
              priority
            />
          </div>
          {children}
        </div>
      </div>

      {/* Right Side: Visual Image */}
      <div className="hidden lg:block relative w-full h-full">
        <Image
          src={authImage}
          alt="GoldenTak Horse Close-up"
          fill
          className="object-cover"
          priority
          sizes="50vw"
        />
        <div className="absolute inset-0 bg-black/5" />
      </div>
    </div>
  );
};

export default AuthLayout;
