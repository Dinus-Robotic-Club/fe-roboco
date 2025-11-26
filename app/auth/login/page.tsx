'use client'
import { useMounted } from '@/lib/useMounted'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { FaEnvelope, FaEye, FaEyeSlash, FaLock } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { ILoginError } from '@/lib/types/team'

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

            router.push('/dashboard')
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
        <div className="min-h-screen bg-linear-to-br from-[#FFD700] to-[#FBFF00] flex items-center justify-center p-2 font-fira-code">
            <div className="bg-white rounded shadow-2xl p-10 w-full max-w-lg">
                <div className="text-center mb-8">
                    <Link href="/" className="flex justify-center">
                        <Image src="/logo-only.svg" alt="DN Roboco Logo" width={200} height={119} className="w-32 h-auto" />
                    </Link>
                </div>

                <h1 className="mb-8 text-2xl font-bold w-full text-center">Login Here</h1>

                {errors.general && <p className="text-center text-red-500 text-sm mb-4">{errors.general}</p>}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* email */}
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
                                    setEmail(e.target.value)
                                    setErrors((prev) => ({ ...prev, email: '' }))
                                }}
                                className={`peer w-full pl-8 px-4 py-3 bg-transparent border-b-2 ${
                                    errors.email ? 'border-red-500' : 'border-gray-300'
                                } outline-none text-gray-800 placeholder-transparent transition-all duration-300`}
                                placeholder="Email"
                            />

                            {/* floating label */}
                            <label
                                htmlFor="email"
                                className="absolute left-8 -top-3.5 text-gray-600 text-sm px-1 transition-all duration-300 
                peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 
                peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-700"
                            >
                                Email
                            </label>
                        </div>

                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    {/* password */}
                    <div className="relative flex flex-col">
                        <div className="relative flex items-center">
                            <span className="absolute left-0 text-gray-500 text-lg pointer-events-none">
                                <FaLock />
                            </span>

                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                    setErrors((prev) => ({ ...prev, password: '' }))
                                }}
                                className={`peer w-full pl-8 pr-10 px-4 py-3 bg-transparent border-b-2 ${
                                    errors.password ? 'border-red-500' : 'border-gray-300'
                                } outline-none text-gray-800 placeholder-transparent transition-all duration-300`}
                                placeholder="Password"
                            />

                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 text-gray-500 hover:text-gray-700 transition text-lg">
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>

                            <label
                                htmlFor="password"
                                className="absolute left-8 -top-3.5 text-gray-600 text-sm px-1 transition-all duration-300 
                peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 
                peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-700"
                            >
                                Password
                            </label>
                        </div>

                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>

                    {/* button */}
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
                            'Login'
                        )}
                    </button>
                </form>

                <div className="mt-6 pt-6 border-t border-gray-300/40 flex flex-col items-center text-center">
                    <Link href="forgot" className="text-black font-semibold hover:text-[#f5f700] text-sm transition underline mb-3">
                        Lupa password?
                    </Link>
                    <p className="text-gray-600 text-sm">
                        Belum punya akun?{' '}
                        <Link href="/register" className="text-black hover:text-[#f5f700] font-semibold underline">
                            Daftar di sini
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
