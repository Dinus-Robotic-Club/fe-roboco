"use client";
import { timeline } from "@/lib";
import { useMounted } from "@/lib/useMounted";
import React from "react";
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";

function Timeline() {
  const mounted = useMounted();
  if (!mounted) {
    return null;
  }
  return (
    <section className="relative w-full flex justify-center my-10 scroll-mt-24  mt-24 overflow-hidden" id="timeline">
      <div className="flex flex-col font-plus-jakarta-sans w-full mx-3 sm:mx-10 lg:mx-20 gap-4 max-w-7xl">
        <h1 className="font-bold text-4xl text-center md:text-start  lg:text-5xl 2xl:text-[53px]">Timeline Lomba</h1>
        <p className="font-semibold text-base lg:text-xl text-center md:text-start">
          Simak jadwal lengkap dari pendaftaran hingga puncak acara.
        </p>
        <div className="w-full h-auto mt-10 lg:mt-20">
          <VerticalTimeline lineColor="#000">
            {timeline.map((data, i) => (
              <VerticalTimelineElement
                key={i}
                className="vertical-timeline-element--work"
                contentStyle={{
                  background: "#ffffff",
                  color: "#000000",
                  padding: "22px 26px",
                  border: "2px solid #000",
                  borderTopRightRadius: "15px",
                  borderEndStartRadius: "15px",
                  borderEndEndRadius: "2px",
                  borderTopLeftRadius: "2px",
                }}
                contentArrowStyle={{
                  borderRight: "10px solid #000000",
                }}
                date={data.date}
                iconStyle={{
                  background: "#000",
                  boxShadow: "0 0 0 4px #000",
                  border: "2px solid #FBFF00",
                  color: "#FBFF00",
                }}
                icon={<data.icon strokeWidth={1.75} />}
              >
                <h3 className="vertical-timeline-element-title text-xl">{data.title}</h3>
                <p className="text-base">{data.description}</p>
              </VerticalTimelineElement>
            ))}
          </VerticalTimeline>
        </div>
      </div>
    </section>
  );
}

export default Timeline;
