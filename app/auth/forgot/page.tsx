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
    <div className="min-h-screen bg-linear-to-br from-[#FFD700] to-[#FBFF00] flex items-center justify-center p-2 font-fira-code">
      <div className="bg-white rounded shadow-2xl p-10 w-full max-w-lg">
        <div className="text-center mb-8">
          <Link href="/" className="flex justify-center">
            <Image src="/logo-only.svg" alt="DN Roboco Logo" width={200} height={119} className="w-32 h-auto" />
          </Link>
        </div>

        <h1 className="mb-8 text-2xl font-bold w-full text-center">Forgot Password</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="relative flex flex-col">
            <div className="relative flex items-center">
              <span className="absolute left-0 text-gray-500 text-lg pointer-events-none">
                <FaEnvelope />
              </span>

              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: "" })); // hapus error otomatis
                }}
                className={`peer w-full pl-8 px-4 py-3 bg-transparent border-b-2 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }  outline-none text-gray-800 placeholder-transparent transition-all duration-300`}
                placeholder="Team Email"
              />

              <label
                htmlFor="email"
                className="absolute left-8 -top-3.5 text-gray-600 text-sm px-1 transition-all duration-300 
                  peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 
                  peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-700"
              >
                Team Email
              </label>
            </div>

            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#FBFF00] hover:shadow-md transition font-fira-code font-medium py-3 px-10 w-full shadow-sm hover:bg-yellow-300 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-gray-700 border-t-transparent rounded-full animate-spin"></div>
                Loading ...
              </div>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-300/40 flex flex-col items-center text-center">
          <Link
            href="login"
            className="text-black font-semibold hover:text-[#f5f700] text-sm transition-colors duration-200 block mb-3 underline w-fit"
          >
            Login Account
          </Link>

          <p className="text-gray-600 text-sm">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="text-black hover:text-[#f5f700] font-semibold transition-colors duration-200 underline"
            >
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
