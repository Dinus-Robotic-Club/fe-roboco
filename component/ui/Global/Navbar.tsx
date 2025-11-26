"use client";
import { NavData } from "@/lib/types/type";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { FiAlignRight, FiX } from "react-icons/fi";
import { usePathname } from "next/navigation";
import NavLogo from "../NavLogo";

function Navbar({ left, right }: NavData) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav
      className={`fixed font-plus-jakarta-sans top-0 left-0 w-full h-full max-h-[78px] 2xl:max-h-25 z-50 uppercase flex items-center justify-between md:justify-center gap-7 transition-all duration-400 px-4 ${
        scrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="hidden md:flex gap-4 lg:gap-7 text-sm 2xl:text-lg w-full justify-end">
        {left.map((item) => {
          const active = pathname === item.href;

          return (
            <a key={item.title} href={item.href} className="relative font-semibold text-black transition-all duration-300 group">
              {item.title}

              <span
                className={`
                  absolute left-0 -bottom-1 h-[3px] bg-[#fcff00] rounded-full transition-all duration-300
                  ${active ? "w-full" : "w-0 group-hover:w-full"}
                `}
              ></span>
            </a>
          );
        })}
      </div>

      <div className="hidden md:flex relative min-w-[165px] items-center justify-center">
        <NavLogo />
      </div>

      <div className="hidden md:flex gap-4 lg:gap-7 text-sm 2xl:text-lg w-full justify-start">
        {right.map((item) => {
          const active = pathname === item.href;

          return (
            <a key={item.title} href={item.href} className="relative font-semibold text-black transition-all duration-300 group">
              {item.title}

              <span
                className={`
                  absolute left-0 -bottom-1 h-[3px] bg-[#fcff00] rounded-full transition-all duration-300
                  ${active ? "w-full" : "w-0 group-hover:w-full"}
                `}
              ></span>
            </a>
          );
        })}
      </div>

      <a href={pathname} className="md:hidden block">
        <Image src="/logo-only.svg" alt="logo" width={55} height={55} className="h-9 w-auto" />
      </a>

      <FiAlignRight className="w-9 h-9 md:hidden block" onClick={toggleMenu} />

      <div
        className={`fixed inset-0 h-screen bg-black/20 backdrop-blur-xs ${menuOpen ? "block" : "hidden"}`}
        onClick={() => setMenuOpen(false)}
      ></div>

      <div
        className={`fixed top-0 right-0 transition-all duration-300 w-[75%] sm:w-[60%] h-screen bg-white shadow-2xl z-50 flex flex-col p-6 gap-6 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button onClick={() => setMenuOpen(false)} className="self-end text-gray-600 hover:text-black">
          <FiX size={28} />
        </button>

        <a href={pathname} className="self-center">
          <Image src="/logo-only.svg" alt="logo" width={55} height={55} className="h-14 w-auto md:hidden block mb-4" />
        </a>

        <nav className="flex flex-col gap-4 text-base font-medium text-gray-700 uppercase">
          {[...left, ...right].map((item) => {
            const active = pathname === item.href;

            return (
              <a
                key={item.title}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="relative font-semibold text-black transition-all duration-300 group"
              >
                {item.title}

                <span
                  className={`
                    absolute left-0 -bottom-1 h-[3px] bg-[#fcff00] rounded-full transition-all duration-300
                    ${active ? "w-full" : "w-0 group-hover:w-full"}
                  `}
                ></span>
              </a>
            );
          })}
        </nav>

        <div className="mt-auto text-xs text-gray-400 text-center">© {new Date().getFullYear()} Dinus Robotic Club</div>
      </div>
    </nav>
  );
}

export default Navbar;
