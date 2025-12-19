"use client";

import React from "react";
import { MatchBracket, TeamBracket } from "@/lib/types/team";
import { BracketDouble } from "../bracket/MainBracket";

const teams: TeamBracket[] = [
  {
    id: "1",
    name: "RRQ Hoshi",
    logoUrl: "logo-only.svg",
  },
  {
    id: "2",
    name: "ONIC Esports",
    logoUrl: "logo-only.svg",
  },
  {
    id: "3",
    name: "EVOS Legends",
    logoUrl: "logo-only.svg",
  },
  {
    id: "4",
    name: "Bigetron Alpha",
    logoUrl: "logo-only.svg",
  },
  {
    id: "5",
    name: "Alter Ego",
    logoUrl: "logo-only.svg",
    // isWinner: true,
  },
  {
    id: "6",
    name: "Aura Fire",
    logoUrl: "logo-only.svg",
  },
];

const matches: MatchBracket[] = [
  // WB Round 1
  {
    id: "WB-R1-M1",
    name: "Upper Bracket R1",
    teams: [teams[3], teams[4]],
    status: "Completed",
    score: [0, 3],
  },
  {
    id: "WB-R1-M2",
    name: "Upper Bracket R1",
    teams: [teams[2], teams[5]],
    status: "Completed",
    score: [3, 2],
  },

  // WB Round 2 (Semis)
  {
    id: "WB-R2-M1",
    name: "Upper Bracket R2",
    teams: [teams[0], teams[4]],
    status: "Completed",
    score: [0, 3],
  },
  {
    id: "WB-R2-M2",
    name: "Upper Bracket R2",
    teams: [teams[1], teams[2]],
    status: "Completed",
    score: [3, 2],
  },

  // WB Final
  {
    id: "WB-R3-M1",
    name: "Upper Final",
    teams: [teams[4], teams[1]],
    status: "Completed",
    score: [2, 3],
  },

  // LB Round 2
  {
    id: "LB-R2-M1",
    name: "Lower Bracket R1",
    teams: [teams[0], teams[2]],
    status: "Completed",
    score: [3, 1],
  },

  // LB Final
  {
    id: "LB-R3-M1",
    name: "Lower Final",
    teams: [teams[0], teams[4]],
    status: "Scheduled",
    score: [2, 4],
  },

  // Grand Final
  {
    id: "FINAL",
    name: "Grand Final",
    teams: [teams[1], teams[4]],
    status: "Live",
    score: [0, 0],
  },
];

function Playoff({ title }: { title: string }) {
  return (
    <div className="w-full max-w-full flex flex-col items-center">
      <h1 className="uppercase font-bold text-2xl md:text-4xl my-6 text-center">{title}</h1>
      <div className="w-full overflow-hidden">
        <BracketDouble matches={matches} />
      </div>
    </div>
  );
}

export default Playoff;
