import Footer from '@/component/ui/Footer'
import Navbar from '@/component/ui/Global/Navbar'
import { nav_admin } from '@/lib'
import { auth } from '@/lib/api/auth'
import { redirect } from 'next/navigation'

export default async function DashboardAdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const session = await auth()

    if (!session) {
        return redirect('/auth/login')
    }

    if (session.user.role !== 'ADMIN') {
        return redirect('/dashboard?error=unauthorized')
    }

    return (
        <main className="bg-grid">
            <Navbar left={nav_admin.left} right={nav_admin.right} />
            {children}
            <Footer />
        </main>
    )
}
