"use client";
import MemberList from "@/component/participants/MemberList";
import TeamList from "@/component/participants/TeamList";
import HeaderDashboard from "@/component/ui/HeaderDashboard";

import React, { useState } from "react";

function Group() {
  const [activeNav, setActiveNav] = useState("team-list");
  let ComponentToRender;

  if (activeNav === "team-list") {
    ComponentToRender = <TeamList />;
  } else if (activeNav === "member-list") {
    ComponentToRender = <MemberList />;
  } else {
    ComponentToRender = null;
  }

  const handleClickNav = (key: string) => {
    setActiveNav(key);
  };
  return (
    <>
      <HeaderDashboard title="PARTICIPANTS" />
      <div className="w-full h-auto py-12 px-3 flex flex-col items-center font-plus-jakarta-sans mb-20">
        <nav className="flex flex-wrap gap-6 justify-center text-sm lg:text-base">
          <p
            className={`cursor-pointer px-4 py-1 rounded-sm hover:bg-[#FBFF00] transition-all duration-400 ${
              activeNav === "team-list" ? "bg-[#FBFF00]" : "bg-transparent"
            }`}
            onClick={() => handleClickNav("team-list")}
          >
            TEAM LIST
          </p>
          <p
            className={`cursor-pointer px-4 py-1 rounded-sm hover:bg-[#FBFF00] transition-all duration-400 ${
              activeNav === "member-list" ? "bg-[#FBFF00]" : "bg-transparent"
            }`}
            onClick={() => handleClickNav("member-list")}
          >
            MEMBER LIST
          </p>
        </nav>
        <div className="w-full h-auto flex flex-col items-center gap-20 mt-20 ">{ComponentToRender}</div>
      </div>
    </>
  );
}

export default Group;
