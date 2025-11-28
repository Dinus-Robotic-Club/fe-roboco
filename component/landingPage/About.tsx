import Image from 'next/image'
import React from 'react'

function About() {
    return (
        <section className="flex flex-col h-auto bg-transparent w-full " id="about">
            <Image src="/line-dnroboco.svg" alt="line-dn-roboco" width={1920} height={112} className="w-full h-auto" />
            <div className="min-h-[400px] lg:min-h-[450px] w-full flex flex-col justify-center items-center py-5 px-4 sm:px-6 lg:px-8 ">
                <div className="flex flex-col 2xl:flex-row gap-6 2xl:gap-8  justify-center items-center max-w-[1500px] w-full">
                    <div className="flex flex-col sm:flex-row items-center gap-4 lg:gap-6">
                        <Image
                            src="/text-dn-roboco.svg"
                            alt="text-dnroboco"
                            width={700}
                            height={85}
                            className="w-full max-w-[500px] sm:max-w-[400px] lg:max-w-[500px] xl:max-w-[600px] h-auto"
                        />

                        <Image src="/rectangle.svg" alt="separator" width={10} height={90} className="hidden 2xl:block w-1 h-16 lg:h-20 rotate-90 sm:rotate-0" />
                    </div>

                    <div className="flex-1 max-w-2xl">
                        <p className="text-lg sm:text-xl lg:text-2xl font-plus-jakarta-sans text-center 2xl:text-left leading-relaxed">
                            dalam DN Roboco 2026, kami memberikan ruang untuk peserta beradu teknologi dalam 2 kategori perlombaan kami, yaitu robot soccer dan robot summo
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default About
