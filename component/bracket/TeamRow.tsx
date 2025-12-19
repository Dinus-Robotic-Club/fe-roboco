import { TeamBracket } from "@/lib/types/team";
import Image from "next/image";

export const TeamRow = ({
  team,
  isTop,
  hoveredTeamId,
  setHoveredTeamId,
  score,
}: {
  team: TeamBracket;
  isTop: boolean;
  hoveredTeamId: string | null;
  setHoveredTeamId: (id: string | null) => void;
  score?: number;
}) => {
  const isHovered = hoveredTeamId && team.id === hoveredTeamId;

  return (
    <div
      className={`flex items-center justify-between px-3.5 py-2 transition-colors duration-200 cursor-default ${
        isTop ? "border-b-[1.3px] border-black " : ""
      } ${team.isWinner ? "bg-yellow-300/40" : ""} ${isHovered ? "bg-gray-300" : ""}`}
      onMouseEnter={() => {
        if (team.id) setHoveredTeamId(team.id);
      }}
      onMouseLeave={() => setHoveredTeamId(null)}
    >
      <div className="flex items-center gap-2">
        <div
          className={`w-8 h-8 flex items-center justify-center overflow-hidden shrink-0 ${team.logoUrl ? "" : "bg-[#FBFF00]"}`}
        >
          {team.logoUrl ? (
            <Image width={60} height={60} src={team.logoUrl} alt={team.name} className="w-full h-full" />
          ) : (
            <span className="text-xs font-bold text-black">{team.name.substring(0, 2)}</span>
          )}
        </div>
        <span className={`text-sm font-medium line-clamp-1 text-black`}>{team.name}</span>
      </div>
      <span className="font-plus-jakarta-sans text-md font-bold text-black">{score !== undefined ? score : "-"}</span>
    </div>
  );
};
