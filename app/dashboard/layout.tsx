'use client'

import { Footer } from '@/components/ui/footer'
import Navbar from '@/components/ui/navbar'
import { useAuth } from '@/context/auth-context'
import { nav_dashboard_main } from '@/lib/statis-data'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Loader from '@/components/ui/loader'

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Wait for auth to finish loading
    if (isLoading) return

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }

    // Redirect non-participants to admin dashboard
    if (user?.role && user.role !== 'PARTICIPANT') {
      router.push('/admin/dashboard?error=unauthorized')
    }
  }, [isLoading, isAuthenticated, user, router])

  // Show loader while checking auth
  if (isLoading) {
    return <Loader show />
  }

  // Don't render content until auth check is complete
  if (!isAuthenticated) {
    return <Loader show />
  }

  return (
    <main className="bg-grid">
      <Navbar left={nav_dashboard_main.left} right={nav_dashboard_main.right} />
      {children}
      <Footer />
    </main>
  )
}
