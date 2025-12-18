"use client";
import { MatchBracket } from "@/lib/types/team";
import React, { useState } from "react";
import { MatchNode } from "./MatchNode";

interface BracketDoubleProps {
  matches: MatchBracket[];
}

interface SimplePathProps {
  from: string;
  to: string;
  exactPos: Record<string, { x: number; y: number }>;
  NODE_W: number;
  NODE_H: number;
}

const SimplePath: React.FC<SimplePathProps> = ({ from, to, exactPos, NODE_W, NODE_H }) => {
  const getCenter = (key: string, side: "left" | "right") => {
    const p = exactPos[key];
    if (!p) return { x: 0, y: 0 };
    return {
      x: side === "left" ? p.x : p.x + NODE_W,
      y: p.y + NODE_H / 2 - 12,
    };
  };

  const start = getCenter(from, "right");
  const end = getCenter(to, "left");

  if (!start.x || !end.x) return null;

  const midX = (start.x + end.x) / 2;

  return (
    <path
      d={`M ${start.x} ${start.y} L ${midX} ${start.y} L ${midX} ${end.y} L ${end.x} ${end.y}`}
      fill="none"
      className="stroke-black stroke-[1.5px]"
    />
  );
};

export const BracketDouble: React.FC<BracketDoubleProps> = ({ matches }) => {
  const [hoveredTeamId, setHoveredTeamId] = useState<string | null>(null);

  const getMatch = (id: string) => matches.find((m) => m.id === id);
  const NODE_W = 260;
  const NODE_H = 180;
  const X_GAP = 80;

  const pos: Record<string, { x: number; y: number }> = {
    "WB-R1-M1": { x: 0, y: 0 },
    "WB-R1-M2": { x: 0, y: 0 },
    "WB-R2-M1": { x: 50 + NODE_W + X_GAP, y: 50 },
    "WB-R2-M2": { x: 50 + NODE_W + X_GAP, y: 350 },
    "WB-R3-M1": { x: 50 + (NODE_W + X_GAP) * 2, y: 200 },
    FINAL: { x: 50 + (NODE_W + X_GAP) * 3, y: 200 },

    "LB-R1-M1": { x: 50 + NODE_W + X_GAP, y: 600 },
    "LB-R2-M1": { x: 50 + (NODE_W + X_GAP) * 2, y: 500 },
    "LB-R3-M1": { x: 50 + (NODE_W + X_GAP) * 3, y: 600 },
    "LB-R4-M1": { x: 50 + (NODE_W + X_GAP) * 3, y: 450 },
  };

  pos["LB-R4-M1"] = { x: 50 + (NODE_W + X_GAP) * 2.5, y: 600 };

  const COL_1 = 70;
  const COL_2 = 390;
  const COL_3 = 730;
  const COL_4 = 1070;

  const exactPos: Record<string, { x: number; y: number }> = {
    "WB-R1-M1": { x: COL_1, y: 50 },
    "WB-R1-M2": { x: COL_1, y: 320 },
    "WB-R2-M1": { x: COL_2, y: 50 },
    "WB-R2-M2": { x: COL_2, y: 320 },
    "WB-R3-M1": { x: COL_3, y: 190 },
    "LB-R2-M1": { x: COL_2, y: 520 },
    "LB-R3-M1": { x: COL_3, y: 520 },
    FINAL: { x: COL_4, y: 360 },
  };

  return (
    <div className="p-4 md:p-8 min-h-screen overflow-x-auto custom-scrollbar">
      <div className="relative min-w-[1400px] min-h-[700px]">
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <SimplePath from="WB-R1-M1" to="WB-R2-M1" exactPos={exactPos} NODE_W={NODE_W} NODE_H={NODE_H} />
          <SimplePath from="WB-R1-M2" to="WB-R2-M2" exactPos={exactPos} NODE_W={NODE_W} NODE_H={NODE_H} />
          <SimplePath from="WB-R2-M1" to="WB-R3-M1" exactPos={exactPos} NODE_W={NODE_W} NODE_H={NODE_H} />
          <SimplePath from="WB-R2-M2" to="WB-R3-M1" exactPos={exactPos} NODE_W={NODE_W} NODE_H={NODE_H} />
          <SimplePath from="WB-R3-M1" to="FINAL" exactPos={exactPos} NODE_W={NODE_W} NODE_H={NODE_H} />
          <SimplePath from="LB-R1-M1" to="LB-R2-M1" exactPos={exactPos} NODE_W={NODE_W} NODE_H={NODE_H} />
          <SimplePath from="LB-R2-M1" to="LB-R3-M1" exactPos={exactPos} NODE_W={NODE_W} NODE_H={NODE_H} />
          <SimplePath from="LB-R3-M1" to="FINAL" exactPos={exactPos} NODE_W={NODE_W} NODE_H={NODE_H} />
        </svg>

        {Object.entries(exactPos).map(([key, pos]) => {
          const m = getMatch(key);
          if (!m) return null;
          return (
            <div
              key={key}
              style={{
                position: "absolute",
                left: pos.x,
                top: pos.y,
                width: NODE_W,
              }}
            >
              <MatchNode match={m} hoveredTeamId={hoveredTeamId} setHoveredTeamId={setHoveredTeamId} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
