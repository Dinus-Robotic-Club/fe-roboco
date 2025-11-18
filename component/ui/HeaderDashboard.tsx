import React from "react";

interface HeaderProps {
  title: string;
}

function HeaderDashboard({ title }: HeaderProps) {
  return (
    <div className="h-[300px] md:h-[400px] bg-white w-full flex flex-col justify-center items-center pt-[70px] 2xl:pt-20 font-plus-jakarta-sans shadow-xl gap-3">
      <h1 className="font-extrabold text-3xl lg:text-5xl 2xl:text-[53px]">{title}</h1>
      <p className="text-base lg:text-xl 2xl:text-2xl">Selamat datang, Team Nee Guzz</p>
    </div>
  );
}

export default HeaderDashboard;
