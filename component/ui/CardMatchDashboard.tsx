import { Minus } from "lucide-react";
import Image from "next/image";
import React from "react";

function CardMatchDashboard() {
  return (
    <div className="max-w-6xl w-full flex bg-white gap-5 shadow-[0_-2px_1px_rgba(0,0,0,0.05),0_4px_9px_rgba(0,0,0,0.1)] py-8 lg:py-7 px-3 sm:px-5 md:px-10 lg:px-3 hover:bg-gray-50">
      <div className="w-full flex gap-5 flex-col lg:flex-row justify-center lg:grid grid-cols-5">
        <div className="flex w-auto gap-3 sm:gap-5 lg:flex-row-reverse justify-start col-span-2 ">
          <div className="bg-logo-team w-[60px] h-[60px] min-w-[60px] min-h-[60px] sm:w-[70px] sm:h-[70px] flex items-center justify-center">
            <Image src="/logo-only.svg" alt="" height={30} width={30} className="w-auto h-auto p-2" />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-xl md:text-2xl font-extrabold lg:text-end line-clamp-1">TEAM Nee Guzz</h1>
            <p className="text-base lg:text-lg text-[#888888] text-start line-clamp-1">SMK N 7 Kota Semarang’s</p>
          </div>
        </div>
        <div className="gap-5 items-center font-fira-code hidden lg:flex col-span-1 justify-center">
          <p className="text-3xl font-bold bg-black text-white h-16 w-[70px] flex items-center justify-center">1</p>

          <Minus />

          <p className="text-3xl font-bold bg-black text-white h-16 w-[70px] flex items-center justify-center">30</p>
        </div>
        <div className="flex gap-3 sm:gap-5 justify-start col-span-2">
          <div className="bg-logo-team w-[60px] h-[60px] min-w-[60px] min-h-[60px] sm:w-[70px] sm:h-[70px] flex items-center justify-center">
            <Image src="/logo-only.svg" alt="" height={30} width={30} className="w-auto h-auto p-2" />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-xl md:text-2xl font-extrabold text-start line-clamp-1">Maulana Usus Besar</h1>
            <p className="text-base lg:text-lg text-[#888888] text-start line-clamp-1">SMK N 7 Kota Semarang’ssssssssssss</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between lg:hidden font-plus-jakarta-sans text-lg sm:text-2xl md:text-3xl">
        <p className=" font-bold bg-black text-white h-[50px] w-[50px] md:h-16 md:w-[70px] flex items-center justify-center">
          30
        </p>
        <p className=" font-bold bg-black text-white h-[50px] w-[50px] md:h-16 md:w-[70px] flex items-center justify-center">
          30
        </p>
      </div>
    </div>
  );
}

export default CardMatchDashboard;
