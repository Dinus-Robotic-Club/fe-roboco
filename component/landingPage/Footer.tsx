import Image from "next/image";
import React from "react";

function Footer() {
  return (
    <section className="relative h-[250px] w-full flex justify-center items-end py-10">
      <Image
        src="/bg-footer.svg"
        alt="Footer Background"
        width={1080}
        height={250}
        className="w-full h-full absolute inset-0 -z-10 "
      />
      <Image src="/logo-title.svg" alt="Footer Image" width={340} height={163} className="w-[150px] lg:w-[250px] h-auto" />
    </section>
  );
}

export default Footer;
