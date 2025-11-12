import Image from "next/image";
import React from "react";

function Footer() {
  return (
    <section className="relative h-[150px] lg:h-[200px] w-full flex justify-center items-end py-10">
      <svg
        className="w-full h-auto filter drop-shadow-[0_-10px_5px_rgba(0,0,0,0.07)] absolute top-0 left-0 right-0 -z-10 "
        width="2115"
        height="140"
        viewBox="0 0 2115 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M383.5 33H0V140H2115V33H1731.5L1700.5 2H1619L1588 33H1198L1165.5 0H938.5L906.5 33H527L496 2H414.5L383.5 33Z"
          fill="white"
        />
      </svg>

      <Image src="/logo-title.svg" alt="Footer Image" width={340} height={163} className="w-[150px] lg:w-[250px] h-auto" />
    </section>
  );
}

export default Footer;
