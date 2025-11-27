"use client";
import HistoryMatch from "@/component/match/HistoryMatch";
import OngoingMatch from "@/component/match/OngoingMatch";
import HeaderDashboard from "@/component/ui/HeaderDashboard";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

function MatchPage() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab");

  const [activeNav, setActiveNav] = useState(() => {
    return defaultTab === "history" ? "match-history" : "live-match";
  });

  let ComponentToRender;

  if (activeNav === "live-match") {
    ComponentToRender = <OngoingMatch />;
  } else if (activeNav === "match-history") {
    ComponentToRender = <HistoryMatch />;
  } else {
    ComponentToRender = null;
  }
  return (
    <>
      <HeaderDashboard title="MATCH COLLECTION" name="maulll" />
      <div className="w-full h-auto py-12 px-3 flex flex-col items-center font-plus-jakarta-sans">
        <nav className="flex flex-wrap gap-6 justify-center text-sm lg:text-base">
          <p
            className={`cursor-pointer px-4 py-1 rounded-sm hover:bg-[#FBFF00] transition-all duration-400 ${
              activeNav === "live-match" ? "bg-[#FBFF00]" : "bg-transparent"
            }`}
            onClick={() => setActiveNav("live-match")}
          >
            LIVE MATCH
          </p>
          <p
            className={`cursor-pointer px-4 py-1 rounded-sm hover:bg-[#FBFF00] transition-all duration-400 ${
              activeNav === "match-history" ? "bg-[#FBFF00]" : "bg-transparent"
            }`}
            onClick={() => setActiveNav("match-history")}
          >
            MATCH HISTORY
          </p>
        </nav>
        <div className="w-full h-auto flex flex-col items-center gap-10 my-20">{ComponentToRender}</div>
      </div>
    </>
  );
}

export default MatchPage;
