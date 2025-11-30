"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({ password: "", confirmPassword: "" });
  const [isLoading, setIsLoading] = useState(false);
  const param = useParams();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(param.slug);

    const formErrors = { password: "", confirmPassword: "" };
    let isValid = true;

    if (!password) {
      formErrors.password = "Password is required.";
      isValid = false;
    } else if (password.length < 6) {
      formErrors.password = "Password must be at least 6 characters.";
      isValid = false;
    }

    if (!confirmPassword) {
      formErrors.confirmPassword = "Please confirm your password.";
      isValid = false;
    } else if (confirmPassword !== password) {
      formErrors.confirmPassword = "Passwords do not match.";
      isValid = false;
    }

    setErrors(formErrors);

    if (!isValid) return;

    setIsLoading(true);

    console.log({
      password,
      confirmPassword,
    });

    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center px-2 py-8 md:py-1 md:px-6 font-plus-jakarta-sans">
      <div className="w-full md:max-w-lg xl:max-w-xl bg-white rounded-2xl shadow-xl px-5 py-7 md:px-10 border border-gray-100">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image src="/logo-only.svg" alt="logo" width={110} height={110} className="w-32 lg:w-36 mt-2 md:pt-0" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Reset Password</h1>
          <p className="text-gray-600 text-sm sm:text-base">Create a new password for your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          {/* Password */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              New Password
            </label>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400 w-4 sm:w-6" />
              </div>

              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, password: "" }));
                }}
                className={`w-full pl-10 pr-10 py-3 bg-gray-50 border ${
                  errors.password ? "border-red-500" : "border-gray-400"
                } rounded-lg outline-none text-gray-900 placeholder-gray-400 focus:bg-white`}
                placeholder="Enter new password"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FaEye className="w-5 h-5" /> : <FaEyeSlash className="w-5 h-5" />}
              </button>
            </div>

            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400 w-4 sm:w-6" />
              </div>

              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                }}
                className={`w-full pl-10 pr-10 py-3 bg-gray-50 border ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-400"
                } rounded-lg outline-none text-gray-900 placeholder-gray-400 focus:bg-white`}
                placeholder="Confirm your password"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <FaEye className="w-5 h-5" /> : <FaEyeSlash className="w-5 h-5" />}
              </button>
            </div>

            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3.5 px-4 rounded-full shadow-md text-base font-semibold text-gray-900 bg-[#FBFF00] hover:bg-[#f2f500] disabled:opacity-70"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </div>
            ) : (
              "Update Password"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            Back to{" "}
            <Link href="/auth/login" className="font-semibold text-gray-900 hover:text-gray-700 underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
