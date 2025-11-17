"use client";
import { NavData } from "@/lib/types";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { FiAlignRight, FiX } from "react-icons/fi";
import { usePathname } from "next/navigation";

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
      className={`fixed font-plus-jakarta-sans top-0 left-0 w-full h-full max-h-[70px] 2xl:max-h-20 z-50 uppercase flex  items-center justify-between md:justify-center gap-7 transition-all duration-400 px-4 ${
        scrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="hidden md:flex gap-4 lg:gap-7 text-sm 2xl:text-base w-full justify-end">
        {left.map((item) => (
          <a
            key={item.title}
            href={item.href}
            className={`font-semibold hover:text-[#fcff00] transition-all duration-300${
              pathname === item.href ? "font-bold text-[#fcff00] underline decoration-2 underline-offset-4" : ""
            }`}
          >
            {item.title}
          </a>
        ))}
      </div>
      <div className="hidden md:flex relative min-w-[210px] items-center justify-center">
        <Image
          src="/bg-navbar.svg"
          alt="Background"
          width={210}
          height={80}
          className="w-full h-20 2xl:h-24 object-contain absolute"
        />
        <Image src="/logo-only.svg" alt="Logo Only" width={40} height={40} className="absolute h-16 w-16" />
      </div>
      <div className="hidden md:flex gap-4 lg:gap-7 text-sm 2xl:text-base w-full justify-start">
        {right.map((item) => (
          <a
            key={item.title}
            href={item.href}
            className={`font-semibold hover:text-[#fcff00] transition-all duration-300${
              pathname === item.href ? "font-bold text-[#fcff00] underline decoration-2 underline-offset-4" : ""
            }`}
          >
            {item.title}
          </a>
        ))}
      </div>
      <a href={pathname} className="md:hidden block">
        <Image src="/logo-only.svg" alt="logo" width={55} height={55} className="h-9 w-auto " />
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
          {[...left, ...right].map((item) => (
            <a
              key={item.title}
              href={item.href}
              className={`font-semibold hover:text-[#fcff00] transition-all duration-300${
                pathname === item.href ? "font-bold text-[#fcff00] underline decoration-2 underline-offset-4" : ""
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {item.title}
            </a>
          ))}
        </nav>
        <div className="mt-auto text-xs text-gray-400 text-center">© {new Date().getFullYear()} Dinus Robotic Club</div>
      </div>
    </nav>
  );
}

export default Navbar;
