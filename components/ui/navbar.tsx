'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { FiAlignRight, FiX } from 'react-icons/fi'
import { useAuth } from '@/context/auth-context'
import NavLogo from './nav-logo'
import { INavItemProps, NavData, NavItemType } from '@/lib/types/index'
import { CTA_BUTTONS } from '@/lib/statis-data'
import { isRegistrationOpen } from '@/lib/utils/registration-deadline'

const NavItem: React.FC<INavItemProps> = ({ item, isActive, onClick, className = '' }) => {
  const isCta = CTA_BUTTONS.includes(item.title as 'Masuk' | 'Keluar' | 'Dashboard')

  const baseStyles = 'relative font-semibold text-black transition-all duration-300 scroll-smooth'
  const ctaStyles = 'bg-[#fcff00] border-[1.5px] border-black px-8 py-2 rounded-full shadow hover:bg-[#FDFF9F]'
  const linkStyles = 'group'

  return (
    <a href={item.href} onClick={(e) => onClick(e, item.href, item.title)} className={`${baseStyles} ${isCta ? ctaStyles : linkStyles} ${className}`}>
      {item.title}
      {!isCta && <span className={`absolute left-0 -bottom-1 h-[3px] bg-[#fcff00] rounded-full transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />}
    </a>
  )
}

const Navbar: React.FC<NavData> = ({ left, right }) => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  // Tambahkan state mounted untuk mencegah hydration mismatch
  const [isMounted, setIsMounted] = useState(false)

  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  useEffect(() => {
    // Set mounted true setelah render pertama di client
    setIsMounted(true)

    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (e: React.MouseEvent, href: string, title: string) => {
    if (title === 'Keluar') {
      e.preventDefault()
      logout()
      return
    }

    if (pathname === '/' && href.startsWith('#')) {
      e.preventDefault()
      const el = document.querySelector(href)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        setMenuOpen(false)
      }
      return
    }

    if (menuOpen) setMenuOpen(false)
    router.push(href)
  }

  // Filter out "Daftar" link when registration is closed
  const registrationAwareRightMenu = useMemo(() => {
    if (!isMounted) return right

    return right.filter((item) => {
      // Hide "Daftar" link when registration is closed
      if (item.title === 'Daftar' && !isRegistrationOpen()) {
        return false
      }
      return true
    })
  }, [right, isMounted])

  const authAwareRightMenu = useMemo(() => {
    // PENTING: Jika belum mounted (SSR), jangan gunakan logika user.
    // Kembalikan menu default (misal: tombol 'Masuk') agar HTML server & client sama.
    if (!isMounted) return registrationAwareRightMenu

    return registrationAwareRightMenu
      .map((item) => {
        if (item.title === 'Masuk' && user) {
          let dashboardHref = '/dashboard'

          if (user.role === 'ADMIN') {
            dashboardHref = '/admin/dashboard'
          } else if (user.role === 'REFREE' || user.role === 'REFEREE') {
            dashboardHref = '/admin/refree/match'
          } else if (user.role === 'PENDAF') {
            dashboardHref = '/admin/pendaf/list-participant'
          }

          return { ...item, title: 'Dashboard', href: dashboardHref }
        }
        if (item.title === 'Keluar' && !user) {
          return null
        }
        return item
      })
      .filter((item): item is NavItemType => Boolean(item))
  }, [registrationAwareRightMenu, user, isMounted]) // Tambahkan isMounted ke dependency

  const mobileMenu = useMemo(() => [...left, ...authAwareRightMenu], [left, authAwareRightMenu])

  // Jangan render apapun sampai client siap jika props sangat dinamis,
  // TAPI untuk Navbar sebaiknya tetap render struktur dasar agar tidak layout shift.
  // Dengan fix 'isMounted' di atas, struktur di bawah aman.

  return (
    <nav
      className={`fixed font-plus-jakarta-sans top-0 left-0 w-full h-full max-h-25 2xl:max-h-25 z-50 uppercase flex items-center justify-between md:justify-center gap-7 transition-all duration-400 px-4 ${
        scrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}>
      {/* Desktop Left Menu */}
      <div className="hidden md:flex gap-4 lg:gap-7 text-sm 2xl:text-lg w-full justify-end items-center">
        {left.map((item) => (
          <NavItem key={item.title} item={item} isActive={pathname === item.href} onClick={handleNavClick} />
        ))}
      </div>

      {/* Logo Center */}
      <div className="hidden md:flex relative min-w-[165px] items-center justify-center">
        <NavLogo />
      </div>

      {/* Desktop Right Menu */}
      <div className="hidden md:flex gap-4 lg:gap-7 text-sm 2xl:text-lg w-full justify-start items-center">
        {authAwareRightMenu.map((item) => (
          <NavItem key={item.title} item={item} isActive={pathname === item.href} onClick={handleNavClick} />
        ))}
      </div>

      <a href={pathname} className="md:hidden block">
        <Image src="/logo-only.svg" alt="logo" width={55} height={55} className="h-9 w-auto" />
      </a>
      <FiAlignRight className="w-9 h-9 md:hidden block cursor-pointer" onClick={() => setMenuOpen(!menuOpen)} />

      {menuOpen && <div className="fixed inset-0 h-screen bg-black/20 backdrop-blur-xs z-40" onClick={() => setMenuOpen(false)} />}

      <div
        className={`fixed top-0 right-0 transition-transform duration-300 w-[75%] sm:w-[60%] h-screen bg-white shadow-2xl z-50 flex flex-col p-6 gap-6 ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
        <button onClick={() => setMenuOpen(false)} className="self-end text-gray-600 hover:text-black">
          <FiX size={28} />
        </button>

        <a href={pathname} className="self-center mb-4 md:hidden block">
          <Image src="/logo-only.svg" alt="logo" width={55} height={55} className="h-14 w-auto" />
        </a>

        <div className="flex flex-col gap-4 text-base font-medium text-gray-700 uppercase">
          {mobileMenu.map((item) => (
            <NavItem
              key={item.title}
              item={item}
              isActive={pathname === item.href}
              onClick={handleNavClick}
              className={CTA_BUTTONS.includes(item.title as 'Masuk' | 'Keluar' | 'Dashboard') ? 'text-center' : ''}
            />
          ))}
        </div>

        <div className="mt-auto text-xs text-gray-400 text-center">© {new Date().getFullYear()} Dinus Robotic Club</div>
      </div>
    </nav>
  )
}

export default Navbar
