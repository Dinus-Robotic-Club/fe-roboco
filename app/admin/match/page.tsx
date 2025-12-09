"use client";
import HistoryMatch from "@/component/match/HistoryMatch";
import OngoingMatch from "@/component/match/OngoingMatch";
import { ICardMatch } from "@/component/ui/CardMatch";
import HeaderDashboard from "@/component/ui/HeaderDashboard";
import dummyData from "@/lib/dumy.json";
import React, { useState } from "react";

function MatchsPage() {
  const [activeNav, setActiveNav] = useState("on-going-match");

  let ComponentToRender;

  if (activeNav === "on-going-match") {
    ComponentToRender = <OngoingMatch data={dummyData as ICardMatch[]} />;
  } else if (activeNav === "finished-match") {
    ComponentToRender = <HistoryMatch data={dummyData as ICardMatch[]} />;
  } else {
    ComponentToRender = null;
  }
  return (
    <div className="w-full min-h-screen flex flex-col">
      <HeaderDashboard title="Match Lists 🎮" name="Admin" />
      <main className="w-full p-4 md:p-6 mb-20">
        <nav className="flex flex-wrap gap-6 justify-center text-sm lg:text-base">
          <p
            className={`cursor-pointer px-4 py-1 rounded-sm hover:bg-[#FBFF00] transition-all duration-400 ${
              activeNav === "on-going-match" ? "bg-[#FBFF00]" : "bg-transparent"
            }`}
            onClick={() => setActiveNav("on-going-match")}
          >
            ON-GOING MATCH
          </p>
          <p
            className={`cursor-pointer px-4 py-1 rounded-sm hover:bg-[#FBFF00] transition-all duration-400 ${
              activeNav === "finished-match" ? "bg-[#FBFF00]" : "bg-transparent"
            }`}
            onClick={() => setActiveNav("finished-match")}
          >
            FINISHED MATCH
          </p>
        </nav>
        <div className="w-full h-auto flex flex-col items-center gap-10 my-20 font-plus-jakarta-sans">{ComponentToRender}</div>
      </main>
    </div>
  );
}

export default MatchsPage;
