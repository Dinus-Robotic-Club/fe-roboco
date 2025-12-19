import Footer from '@/component/ui/Footer'
import Navbar from '@/component/ui/Global/Navbar'
import { nav_dashboard_main } from '@/lib'
import { auth } from '@/lib/api/auth'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await auth()

  if (!session) {
    return redirect('/auth/login')
  }

  if (session.user.role !== 'PARTICIPANT') {
    return redirect('/admin/dashboard?error=unauthorized')
  }

  return (
    <main className="bg-grid">
      <Navbar left={nav_dashboard_main.left} right={nav_dashboard_main.right} />
      {children}
      <Footer />
    </main>
  )
}
