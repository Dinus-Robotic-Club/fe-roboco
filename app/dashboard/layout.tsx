import Footer from '@/component/ui/Footer'
import Navbar from '@/component/ui/Global/Navbar'
import { nav_dashboard } from '@/lib'

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <main className="bg-grid">
            <Navbar left={nav_dashboard.left} right={nav_dashboard.right} />
            {children}
            <Footer />
        </main>
    )
}
