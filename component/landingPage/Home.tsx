import React from "react";
import Image from "next/image";

function Home() {
  return (
    <section className="bg-home min-h-screen relative flex justify-center items-center overflow-hidden" id="Home">
      <div className="absolute inset-0 h-full bg-linear-to-b from-white/95 from-20% to-white/60 flex justify-center items-center px-[150px] 2xl:px-[200px]">
        <Image
          src="/bg-home-white.svg"
          alt="Background Home"
          width={1626}
          height={733}
          className="w-full h-full hidden xl:block"
        />
      </div>

      <div className="z-10 w-full max-w-5xl flex flex-col items-center gap-6 sm:gap-8 lg:gap-10 px-4 sm:px-6 lg:px-10 py-8">
        <Image
          src="/logo-title.svg"
          alt="logo-title"
          width={488}
          height={234}
          className="w-full max-w-[340px] md:max-w-[400px] lg:max-w-[450px] 2xl:max-w-[550px] h-auto px-2"
        />

        <p className="text-base sm:text-lg md:text-xl 2xl:text-2xl text-center font-plus-jakarta-sans leading-relaxed max-w-2xl">
          Buktikan lah diri anda bahwa anda adalah seorang penggiat teknologi dengan mental yang kuat dalam kompetisi DN Roboco
          2026.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-5 w-full justify-center items-center max-w-md sm:max-w-none">
          <button className="border-2 border-black bg-[#FBFF00] px-4 sm:px-5 md:px-7 lg:px-12 py-3 sm:py-4 text-sm sm:text-base md:text-lg w-full sm:w-fit font-plus-jakarta-sans flex items-center justify-center gap-2 sm:gap-2.5 transition-all cursor-pointer hover:scale-105">
            <p>daftar sekarang</p>
            <Image
              src="/arrow-left.svg"
              alt="Arrow Icon"
              width={20}
              height={20}
              className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
            />
          </button>

          <button className="border-2 border-black  bg-[#FBFF00] px-4 sm:px-5 md:px-6 lg:px-12 py-3 sm:py-4 text-sm sm:text-base md:text-lg w-full sm:w-fit font-plus-jakarta-sans flex items-center justify-center gap-2 sm:gap-2.5 transition-all cursor-pointer hover:scale-105">
            <p>jurnal kompetisi</p>
            <Image
              src="/arrow-left.svg"
              alt="Arrow Icon"
              width={20}
              height={20}
              className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
            />
          </button>
        </div>
      </div>
    </section>
  );
}

export default Home;
