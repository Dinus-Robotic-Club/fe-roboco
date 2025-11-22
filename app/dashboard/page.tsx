"use client";
import Certificate from "@/component/dashboard-user/Certificate";
import TeamDashboard from "@/component/dashboard-user/TeamDashboard";
import TeamProfile from "@/component/dashboard-user/TeamProfile";
import HeaderDashboard from "@/component/ui/HeaderDashboard";
import { nav_dashboard } from "@/lib";
import { DownloadIcon } from "lucide-react";
import { useState } from "react";

function Dashboard() {
  const [activeNav, setActiveNav] = useState("team-dashboard");
  let ComponentToRender;

  if (activeNav === "team-dashboard") {
    ComponentToRender = <TeamDashboard />;
  } else if (activeNav === "team-profile") {
    ComponentToRender = <TeamProfile />;
  } else if (activeNav === "certificate") {
    ComponentToRender = <Certificate />;
  } else {
    ComponentToRender = null;
  }

  const handleClickNav = (key: string) => {
    setActiveNav(key);
  };
  return (
    <>
      <HeaderDashboard title="DASHBOARD TEAM" />
      <div className="w-full h-auto py-12 px-3 flex flex-col items-center font-plus-jakarta-sans">
        <nav className="flex flex-wrap gap-6 justify-center text-sm lg:text-base">
          {nav_dashboard.map((data) => (
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
        <div className="w-full h-auto flex flex-col items-center gap-20 my-20">{ComponentToRender}</div>
      </div>
    </>
  );
}

export default Dashboard;
