'use client'
import { useMounted } from '@/lib/useMounted'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { FaEye, FaEyeSlash, FaLock } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { ILoginError } from '@/lib/types/team'
import { AtSign } from 'lucide-react'

export default function LoginPage() {
    const router = useRouter()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState<ILoginError>({})
    const isMounted = useMounted()

    if (!isMounted) return null

    const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const newErrors: ILoginError = {}

        if (!email) newErrors.email = 'Email tidak boleh kosong!'
        else if (!validateEmail(email)) newErrors.email = 'Format email tidak valid!'

        if (!password) newErrors.password = 'Password tidak boleh kosong!'

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        setErrors({})
        setIsLoading(true)

        try {
            const res = await signIn('credentials', {
                email,
                password,
                redirect: false,
            })

            if (res?.error) {
                try {
                    const errorObj = JSON.parse(res.error)
                    setErrors(errorObj)
                } catch {
                    setErrors({ general: res.error })
                }
                return
            }

            const sessionRes = await fetch('/api/auth/session')
            const sessionData = await sessionRes.json()

            // Handle role-based redirect
            if (sessionData?.user?.role === 'ADMIN') {
                router.push('/admin/dashboard')
            } else {
                router.push('/dashboard')
            }
        } catch (err) {
            console.error('Login error:', err)

            if (err instanceof Error) {
                setErrors({ general: err.message })
            } else if (typeof err === 'string') {
                setErrors({ general: err })
            } else if (err && typeof err === 'object' && 'message' in err) {
                setErrors({ general: String(err.message) })
            } else {
                setErrors({ general: 'Terjadi kesalahan pada server.' })
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center px-2 py-8 md:py-1 md:px-6 font-plus-jakarta-sans">
            <div className="w-full md:max-w-lg xl:max-w-xl bg-white rounded-2xl shadow-xl px-5 py-7 md:px-10 border border-gray-100">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <Image src="/logo-only.svg" alt="logo" width={110} height={110} className="w-32 lg:w-36 mt-2 md:pt-0" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Welcome Back</h1>
                    <p className="text-gray-600 text-sm sm:text-base">Sign in to continue to your dashboard</p>
                </div>

                {/* Error Message */}

                <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                    {/* Email */}
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                        </label>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <AtSign className="text-gray-400 w-4 sm:w-5" />
                            </div>
                            <input
                                type="text"
                                id="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                    setErrors((prev) => ({ ...prev, email: '' }))
                                }}
                                className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${
                                    errors.email ? 'border-red-500' : 'border-gray-400'
                                } rounded-lg outline-none text-gray-900 placeholder-gray-400 transition-all duration-300 focus:bg-white`}
                                placeholder="Enter your email"
                            />
                        </div>

                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaLock className="text-gray-400 w-4 sm:w-6" />
                            </div>

                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                    setErrors((prev) => ({ ...prev, password: '' }))
                                }}
                                className={`w-full pl-10 pr-10 py-3 bg-gray-50 border ${
                                    errors.password ? 'border-red-500' : 'border-gray-400'
                                } rounded-lg outline-none text-gray-900 placeholder-gray-400 transition-all duration-300 focus:bg-white`}
                                placeholder="Enter your password"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition"
                            >
                                {showPassword ? <FaEye className="w-5 h-5" /> : <FaEyeSlash className="w-5 h-5" />}
                            </button>
                        </div>

                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>

                    <div className="flex items-center justify-end">
                        <Link href="forgot" className="font-medium hover:text-gray-700 underline text-sm">
                            Forgot password?
                        </Link>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-3.5 px-4 rounded-full shadow-md text-base font-semibold text-gray-900 bg-[#FBFF00] hover:bg-[#f2f500] focus:ring-2 focus:ring-offset-2 focus:ring-[#FBFF00] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                                Signing in...
                            </div>
                        ) : (
                            'Sign in now'
                        )}
                    </button>
                </form>

                {errors.general && <div className="mt-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">{errors.general}</div>}

                {/* Footer */}
                <div className="text-center mt-6">
                    <p className="text-gray-600 text-sm">
                        Don&#39;t have an account?{' '}
                        <Link href="/register" className="font-semibold text-gray-900 hover:text-gray-700 underline">
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
