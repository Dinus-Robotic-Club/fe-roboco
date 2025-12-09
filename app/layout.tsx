import type { Metadata } from 'next';
import { Fira_Code, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import QueryProvider from '@/providers/app-providers';
import { AuthProvider } from '@/context/auth-context';

const plusJakartaSans = Plus_Jakarta_Sans({
	variable: '--font-plus-jakarta-sans',
	subsets: ['latin'],
});

const firaCode = Fira_Code({
	variable: '--font-fira-code',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'DN ROBOCO | Dinus Robotic Competition',
	description:
		'DN ROBOCO adalah kompetisi robotik tahunan yang diselenggarakan oleh Dinus Robotic Club Universitas Dian Nuswantoro. Tunjukkan inovasimu dan jadi bagian dari revolusi teknologi robotik Indonesia!',
	verification: {
		google: 'xmfOs1QpvhiaYZaSbnc5YQdK0exrtJfx4Ti_DtEHyu0',
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${plusJakartaSans.variable} ${firaCode.variable} antialiased`}
			>
				<QueryProvider>
					<AuthProvider>
						<main>{children}</main>
						<Toaster expand={true} richColors position="top-right" />
					</AuthProvider>
				</QueryProvider>
			</body>
		</html>
	);
}
