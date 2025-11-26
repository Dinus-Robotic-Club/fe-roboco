import { z } from 'zod'

// --- SIGN IN ---
export const signInSchema = z.object({
    email: z.string().email({ message: 'Mohon masukkan email yang valid' }),
    password: z.string().min(8, { message: 'Password minimal 8 karakter' }),
})

// --- SIGN UP ---
export const signUpSchema = z
    .object({
        email: z.string().email({ message: 'Masukkan email yang aktif' }),
        password: z
            .string()
            .min(8, { message: 'Password minimal 8 karakter' })
            .regex(/[A-Z]/, {
                message: 'Password harus memiliki minimal 1 huruf kapital',
            })
            .regex(/[0-9]/, { message: 'Password harus memiliki minimal 1 angka' })
            .regex(/[^A-Za-z0-9]/, {
                message: 'Password harus memiliki minimal 1 karakter spesial',
            }),
        confirmPassword: z.string().min(8, { message: 'Konfirmasi kata sandi minimal 8 karakter' }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Konfirmasi kata sandi harus sama dengan kata sandi',
        path: ['confirmPassword'],
    })

// --- REQUEST RESET PASSWORD ---
export const requestResetPasswordSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
})

// --- RESET PASSWORD ---
export const resetPasswordSchema = z
    .object({
        password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match.',
        path: ['confirmPassword'],
    })

export type SignInFormValues = z.infer<typeof signInSchema>
export type SignUpFormValues = z.infer<typeof signUpSchema>
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>
