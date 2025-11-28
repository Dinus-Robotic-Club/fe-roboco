import Footer from '@/component/ui/Footer'
import Navbar from '@/component/ui/Global/Navbar'
import { nav_dashboard_main } from '@/lib'
// import { auth } from '@/lib/api/auth'

export default async function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <main className="bg-grid">
            <Navbar left={nav_dashboard_main.left} right={nav_dashboard_main.right} />
            {children}
            <Footer />
        </main>
    )
}
