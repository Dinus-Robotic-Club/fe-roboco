"use client";
import { useMounted } from "@/lib/useMounted";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaEnvelope } from "react-icons/fa";

export default function ForgotPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string }>({});
  const isMounted = useMounted();

  if (!isMounted) {
    return null;
  }

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: { email?: string } = {};

    if (!email) {
      newErrors.email = "Email tidak boleh kosong!";
    } else if (!validateEmail(email)) {
      newErrors.email = "Format email tidak valid!";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    setErrors({});
    setIsLoading(true);

    setTimeout(() => {
      console.log("Forgot password request:", { email });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center px-2 py-8 font-plus-jakarta-sans">
      <div className="w-full md:max-w-lg xl:max-w-xl bg-white rounded-2xl shadow-xl px-5 py-7 md:px-10 border border-gray-100">
        {/* Logo */}
        <div className="text-center mb-5">
          <Link href="/" className="flex justify-center">
            <Image src="/logo-only.svg" alt="DN Roboco Logo" width={200} height={119} className="w-24 sm:w-28 md:w-32 h-auto" />
          </Link>
        </div>

        {/* Title */}
        <h1 className="mb-6 text-2xl sm:text-3xl font-bold text-center text-gray-900">Forgot Password</h1>

        <p className="text-center text-gray-600 text-sm sm:text-base mb-8">Enter your email to reset your password.</p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="relative flex flex-col">
            <div className="relative flex items-center">
              <span className="absolute left-3 text-gray-400 text-lg pointer-events-none">
                <FaEnvelope />
              </span>

              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: "" }));
                }}
                className={`peer w-full pl-10 pr-4 py-3 bg-gray-50 border-b-2 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } outline-none text-gray-900 placeholder-transparent transition-all duration-300 focus:bg-white`}
                placeholder="Team Email"
              />

              <label
                htmlFor="email"
                className="absolute left-10 -top-3.5 text-gray-600 text-sm px-1 transition-all duration-300
              peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500
              peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-700"
              >
                Team Email
              </label>
            </div>

            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-full shadow-md font-semibold text-gray-900 bg-[#FBFF00]
          hover:bg-[#f2f500] transition-all duration-300 focus:ring-2 focus:ring-offset-2 focus:ring-[#FBFF00]
          disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                Sending...
              </div>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-8">
          <Link href="/auth/login" className="text-gray-900 font-semibold hover:text-gray-700 underline text-sm transition">
            Back to Login
          </Link>

          <p className="text-gray-600 text-sm mt-3">
            Don’t have an account?{" "}
            <Link href="/register" className="font-semibold text-gray-900 hover:text-gray-700 underline transition">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
