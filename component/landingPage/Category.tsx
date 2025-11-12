import Image from "next/image";
import React from "react";

function Category() {
  return (
    <section className="relative h-[850px] w-full flex justify-center items-center bg-transparent">
      <Image
        src="/bg-category.svg"
        alt="Category Background"
        width={1921}
        height={950}
        className="w-full h-full absolute inset-0 -z-10 hidden xl:block"
      />
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
