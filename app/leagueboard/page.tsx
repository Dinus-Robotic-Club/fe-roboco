"use client";
import BasisRank from "@/component/leagueboard/BasisRank";
import GroupRankSoccer from "@/component/leagueboard/GroupRankSoccer";
import GroupRankSumo from "@/component/leagueboard/GroupRankSumo";
import Playoff from "@/component/leagueboard/Playoff";
import HistoryMatch from "@/component/match/HistoryMatch";
import OngoingMatch from "@/component/match/OngoingMatch";
import { ICardMatch } from "@/component/ui/CardMatch";
import Footer from "@/component/ui/Footer";
import Loader from "@/component/ui/Global/loader";
import Navbar from "@/component/ui/Global/Navbar";
import HeaderDashboard from "@/component/ui/HeaderDashboard";
import { useAllMatchPage } from "@/hooks/function/useMatch";
import { nav_home, nav_legaueboard } from "@/lib";
import { useState } from "react";

function Leagueboard() {
  const [activeNav, setActiveNav] = useState("basis-rank");
  const { history, isLoading, onGoing } = useAllMatchPage();

  // if (isLoading) return <Loader show />

  let ComponentToRender;

  if (activeNav === "basis-rank") {
    ComponentToRender = <BasisRank />;
  } else if (activeNav === "group-rank-soccer") {
    ComponentToRender = <GroupRankSoccer />;
  } else if (activeNav === "group-rank-sumo") {
    ComponentToRender = <GroupRankSumo />;
  } else if (activeNav === "on-going match") {
    ComponentToRender = <OngoingMatch data={onGoing?.data as ICardMatch[]} />;
  } else if (activeNav === "match-history") {
    ComponentToRender = <HistoryMatch data={history?.data as ICardMatch[]} />;
  } else if (activeNav === "playoff-sumo") {
    ComponentToRender = <Playoff title="Playoff SUMMO" />;
  } else if (activeNav === "playoff-soccer") {
    ComponentToRender = <Playoff title="Playoff SOCCER" />;
  } else ComponentToRender = null;

  const handleClickNav = (key: string) => {
    setActiveNav(key);
  };
  return (
    <div className="bg-grid h-full w-full">
      <Navbar left={nav_home.left} right={nav_home.right} />
      <HeaderDashboard title="LEAGUEBOARD" name=" " />
      <div className="w-full h-auto py-12 px-3 flex flex-col items-center font-plus-jakarta-sans mb-20">
        <nav className="flex flex-wrap gap-6 justify-center text-sm lg:text-base">
          {nav_legaueboard.map((data) => (
            <p
              key={data.key}
              className={`cursor-pointer px-4 py-1 rounded-sm hover:bg-[#FBFF00] transition-all duration-400 ${
                activeNav === data.key ? "bg-[#FBFF00]" : "bg-transparent"
              }`}
              onClick={() => handleClickNav(data.key)}
            >
              {data.label}
            </p>
          ))}
        </nav>
        <div className="w-full h-auto flex flex-col items-center gap-20 mt-20 lg:px-10 overflow-x-auto">{ComponentToRender}</div>
      </div>
      <Footer />
    </div>
  );
}

export default Leagueboard;
