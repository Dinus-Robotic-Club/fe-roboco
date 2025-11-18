import type { Metadata } from 'next'
import { Fira_Code, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import QueryProvider from '@/providers/app-providers'

const plusJakartaSans = Plus_Jakarta_Sans({
    variable: '--font-plus-jakarta-sans',
    subsets: ['latin'],
})

const firaCode = Fira_Code({
    variable: '--font-fira-code',
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: 'DN ROBOCO | Dinus Robotic Competition',
    description:
        'DN ROBOCO adalah kompetisi robotik tahunan yang diselenggarakan oleh Dinus Robotic Club Universitas Dian Nuswantoro. Tunjukkan inovasimu dan jadi bagian dari revolusi teknologi robotik Indonesia!',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={`${plusJakartaSans.variable} ${firaCode.variable} antialiased`}>
                <QueryProvider>{children}</QueryProvider>
            </body>
        </html>
    )
}
