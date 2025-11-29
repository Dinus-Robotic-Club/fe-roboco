import Image from "next/image";
import React from "react";
import Marquee from "react-fast-marquee";

const logos = [
  "./media-partner/hmte_udinus.svg",
  "./media-partner/ichibot.svg",
  "./media-partner/doscom.svg",
  "./media-partner/kakarobot.svg",
  "./media-partner/LR.svg",
  "./media-partner/pusat_info_lomba.svg",
  "./media-partner/rocket.svg",
  "./media-partner/tvku.svg",
  "./media-partner/dncc.svg",
];

function Sponsorship() {
  return (
    <section
      className="flex flex-col h-auto w-full items-center justify-center font-plus-jakarta-sans gap-16 mt-24 scroll-mt-24"
      id="sponsor"
    >
      <div className="flex flex-col items-center justify-center w-full h-auto gap-7">
        <h1 className="text-2xl font-bold">Thanks for the Sponsorship</h1>
        <div className="bg-sponsorship min-h-32 sm:min-h-60 w-full max-w-[1300px] flex items-center justify-center bg-cover sm:bg-contain uppercase font-bold italic text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center px-3">
          SPONSORSHIPS CALLING
        </div>
      </div>
      <div className="flex flex-col items-center justify-center w-full h-auto gap-10">
        <h1 className="text-2xl font-bold">Media Partner</h1>
        <div className="relative w-full overflow-hidden">
          <Marquee className="min-w-full" gradient>
            {logos.map((logo, i) => (
              <Image
                key={i}
                src={logo}
                width={120}
                height={120}
                alt="media partner"
                className={` ${logo === "./media-partner/dncc.svg" ? "w-20 md:w-28" : "w-16 md:w-20"}  shrink-0 mx-5 md:mx-10`}
              />
            ))}
            {logos.map((logo, i) => (
              <Image
                key={i}
                src={logo}
                width={120}
                height={120}
                alt="media partner"
                className={` ${logo === "./media-partner/dncc.svg" ? "w-20 md:w-28" : "w-16 md:w-20"}  shrink-0 mx-5 md:mx-10`}
              />
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}

export default Sponsorship;
