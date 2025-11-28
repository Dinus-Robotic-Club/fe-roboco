import Image from "next/image";
import React from "react";

function Category() {
  return (
    <section className="relative h-[800px] w-full flex justify-center items-center bg-transparent mb-10" id="category">
      <svg
        className="w-full h-auto filter drop-shadow-[0_-10px_5px_rgba(0,0,0,0.07)] absolute top-0 left-0 right-0 -z-10 hidden lg:block"
        width="2115"
        height="227"
        viewBox="0 0 2115 227"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2115 227H0V48.6768L28.6182 23.3652H415.516L472.752 73.9883H1167.29L1208.02 34.0732H1550.89L1589.96 0H2115V227Z"
          fill="white"
        />
      </svg>
      <svg
        className="w-full h-auto filter drop-shadow-[0_12px_4px_rgba(0,0,0,0.1)] absolute bottom-0 left-0 right-0 -z-10 hidden lg:block"
        width="2115"
        height="211"
        viewBox="0 0 2115 211"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2086.38 186.175L2115 159.281V0H0V211L525.035 211L564.11 174.797H906.979L947.705 132.388H1642.25L1699.48 186.175H2086.38Z"
          fill="white"
        />
      </svg>
      <div className="flex flex-col justify-center items-center font-plus-jakarta-sans w-full px-10 gap-4">
        <h1 className="font-extrabold text-3xl lg:text-5xl 2xl:text-[53px]">KATEGORI LOMBA</h1>
        <p className="text-base lg:text-xl 2xl:text-2xl">kategori lomba DN Roboco 2026</p>
        <div className="flex gap-10 w-full font-plus-jakarta-sans justify-evenly mt-16 flex-wrap">
          <div className="flex flex-col  items-center justify-center gap-10">
            <Image src="/logo-only.svg" alt="Category Image" width={300} height={300} className="w-[250px] 2xl:w-[300px]" />
            <div className="text-center flex flex-col">
              <h1 className="font-extrabold text-4xl 2x:text-[60px]">SOCCER BOT</h1>
              <p className="text-xl 2xl:text-2xl">Kompetisi Robot Soccer 1kg</p>
            </div>
          </div>
          <div className="flex flex-col  items-center justify-center gap-10 mt-20 sm:mt-0">
            <Image src="/logo-only.svg" alt="Category Image" width={300} height={300} className="w-[250px] 2xl:w-[300px]" />
            <div className="text-center flex flex-col">
              <h1 className="font-extrabold text-4xl 2x:text-[60px]">SOCCER BOT</h1>
              <p className="text-xl 2xl:text-2xl">Kompetisi Robot Soccer 1kg</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Category;
