import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FaInstagram, FaWhatsapp } from 'react-icons/fa'

const FooterLandingPage = () => {
  return (
    <section className="relative w-full bg-white pt-14 md:pt-16 pb-8 md:pb-10 px-5 lg:px-16">
      <svg className="w-full absolute top-0 left-0 right-0 z-10 drop-shadow-[0_-10px_5px_rgba(0,0,0,0.07)]" viewBox="0 0 2115 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M383.5 33H0V140H2115V33H1731.5L1700.5 2H1619L1588 33H1198L1165.5 0H938.5L906.5 33H527L496 2H414.5L383.5 33Z" fill="white" />
      </svg>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 lg:gap-10 font-plus-jakarta-sans relative z-20">
        <div className="order-1 lg:order-2 flex justify-center items-start lg:items-center">
          <Image src="/logo-title.svg" alt="Footer Title" width={340} height={163} className="w-50 md:w-60 lg:w-[320px] h-auto" />
        </div>

        <div className="order-2 lg:order-1 flex flex-col gap-4 items-center lg:items-start">
          <div className="flex gap-4 items-center">
            <Image src="/logo-udinus.svg" alt="logo udinus" width={45} height={45} />
            <Image src="/badge-udinus.svg" alt="badge" width={35} height={35} />
            <Image src="/logo-drc.svg" alt="logo drc" width={55} height={55} />
          </div>

          <div className="text-gray-700 text-sm 2xl:text-base leading-relaxed text-center lg:text-start">
            <p>
              Gedung I Universitas Dian Nuswantoro. Jl. Nakula I no 5-11 <br />
              Bengkel Robot – Gedung I Lt. 4
            </p>
            <p>dinusrobotic@gmail.com</p>
          </div>

          <div className="flex items-center gap-4">
            <Link href="https://www.instagram.com/dinus_robotic_club">
              <FaInstagram className="w-7 h-7 hover:text-yellow-400 transition" />
            </Link>
            <Link href="https://wa.me/+6288226457475">
              <FaWhatsapp className="w-7 h-7 hover:text-yellow-400 transition" />
            </Link>
          </div>
        </div>

        <div className="order-3 md:order-3 flex justify-center lg:justify-end">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d990.059329042267!2d110.40877426952467!3d-6.981298668401674!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e708b4ea9efeffd%3A0x4b9fea91170c31f1!2sFakultas%20Teknik%20Udinus!5e0!3m2!1sid!2sid!4v1764351753628!5m2!1sid!2sid"
            loading="lazy"
            style={{ border: 0 }}
            allowFullScreen={true}
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full max-w-87.5 h-37.5 lg:h-50 rounded-xl shadow"></iframe>
        </div>
      </div>
    </section>
  )
}

const Footer = () => {
  return (
    <section className="relative h-[150px] lg:h-[200px] w-full flex justify-center items-end py-10 z-20 bg-white">
      <svg
        className="w-full h-auto filter drop-shadow-[0_-10px_5px_rgba(0,0,0,0.07)] absolute top-0 left-0 right-0 -z-10 "
        width="2115"
        height="140"
        viewBox="0 0 2115 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path d="M383.5 33H0V140H2115V33H1731.5L1700.5 2H1619L1588 33H1198L1165.5 0H938.5L906.5 33H527L496 2H414.5L383.5 33Z" fill="white" />
      </svg>

      <Image src="/logo-title.svg" alt="Footer Image" width={340} height={163} className="w-[150px] lg:w-[250px] h-auto" />
    </section>
  )
}

export { Footer, FooterLandingPage }
