import Image from "next/image";
import React from "react";

function CardMatch() {
  return (
    <div className="max-w-6xl w-full flex bg-white gap-5 shadow-[0_-2px_1px_rgba(0,0,0,0.05),0_4px_9px_rgba(0,0,0,0.1)] py-8 px-3 sm:px-5 md:px-10 lg:px-3 hover:bg-gray-50">
      <div className="w-full flex gap-5 flex-col lg:flex-row">
        <div className="flex w-full gap-3 sm:gap-5 lg:flex-row-reverse justify-start">
          <div className="bg-logo-team w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] flex items-center justify-center">
            <Image src="/logo-only.svg" alt="" height={30} width={30} className="w-auto h-auto p-2" />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-xl md:text-2xl font-extrabold text-start">TEAM Nee Guzz</h1>
            <p className="text-base lg:text-lg text-[#888888] text-start">SMK N 7 Kota Semarang’s Basis</p>
          </div>
        </div>
        <div className="gap-5 items-center font-fira-code hidden lg:flex">
          <p className="text-3xl font-bold">1</p>
          <p className="text-xl">GROUP</p>
          <p className="text-3xl font-bold">2</p>
        </div>
        <div className="flex w-full gap-3 sm:gap-5 justify-start ">
          <div className="bg-logo-team w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] flex items-center justify-center">
            <Image src="/logo-only.svg" alt="" height={30} width={30} className="w-auto h-auto p-2" />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-xl md:text-2xl font-extrabold text-start">TEAM Nee Guzz</h1>
            <p className="text-base lg:text-lg text-[#888888] text-start">SMK N 7 Kota Semarang’s Basis</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between lg:hidden font-plus-jakarta-sans text-2xl md:text-3xl">
        <p className="font-bold">1</p>
        <p className="font-bold">2</p>
      </div>
    </div>
  );
}

export default CardMatch;
