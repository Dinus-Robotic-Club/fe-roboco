"use client";
import { categories } from "@/lib";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

function Category() {
  const [active, setActive] = useState("soccerbot");
  const selected = categories.find((item) => item.id === active) || categories[0];
  return (
    <section className="relative w-full flex justify-center my-10" id="category">
      <div className="flex flex-col font-plus-jakarta-sans w-full mx-3 sm:mx-10 lg:mx-20 gap-4 max-w-7xl">
        <h1 className="font-extrabold text-4xl text-center md:text-start  lg:text-5xl 2xl:text-[53px]">Kategori Lomba</h1>
        <p className="font-semibold text-base lg:text-xl text-center md:text-start">DN ROBOCO 2026</p>

        <div className="flex w-full font-plus-jakarta-sans mt-10 flex-wrap">
          <div className="flex bg-transparent max-w-5xl w-full">
            {categories.map((cat, index) => (
              <button
                key={cat.id}
                onClick={() => setActive(cat.id)}
                className={`w-36 sm:w-46 pb-1.5 sm:pb-2.5 pt-5 sm:pt-7 text-sm sm:text-base font-semibold transition-all bg-cover
              ${active === cat.id ? "bg-category-button text-black z-20" : "bg-category-button-trans text-[#FDFF87]"} ${
                  index !== 1 ? "-mr-4" : ""
                }`}
              >
                {cat.title.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Content Card */}
          <div className="bg-white w-full max-w-7xl rounded-b-3xl rounded-tr-3xl p-6 md:p-10 flex flex-col md:flex-row justify-between items-center gap-10 border-4 border-black">
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl font-bold mb-4 flex gap-3 items-center">
                <Image src={selected.icon} alt="logo" height={35} width={35} />
                {selected.title}
              </h2>

              <div className="space-y-4 text-lg leading-relaxed">
                {selected.description.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              <div className="mt-8 text-center flex flex-col md:flex-row gap-4">
                <Link
                  href="/register"
                  className="px-10 py-3 border-3 border-black bg-black text-[#FBFF00] font-semibold rounded-md shadow-md hover:bg-[#A8A8A8] transition flex items-center justify-center"
                >
                  DAFTAR
                </Link>

                <Link
                  href={selected.guidebook}
                  className="px-10 py-3 border-3 border-black text-black rounded-lg font-semibold hover:bg-[#FAFAFA] transition flex justify-center items-center gap-4"
                >
                  <Image src={selected.icon} alt="logo" width={30} height={30} className="" /> GUIDE BOOK
                </Link>
              </div>
            </div>

            {/* Image */}
            <div className="w-full md:w-1/2 flex justify-center">
              <Image
                src={selected.image}
                alt={selected.title}
                width={450}
                height={300}
                className="w-[260px] md:w-[350px] h-auto drop-shadow-xl scale-x-[-1]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Category;
