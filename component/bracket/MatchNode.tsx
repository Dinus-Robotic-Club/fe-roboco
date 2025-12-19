import { MatchBracket } from "@/lib/types/team";
import { TeamRow } from "./TeamRow";

export const MatchNode = ({
  match,
  className,
  hoveredTeamId,
  setHoveredTeamId,
}: {
  match: MatchBracket;
  className?: string;
  hoveredTeamId: string | null;
  setHoveredTeamId: (id: string | null) => void;
}) => {
  return (
    <div className={`relative w-64 overflow-hidden flex flex-col ${className}`}>
      {/* Header / Status */}
      <div className="bg-transparent py-1 px-3 flex justify-between items-center text-sm">
        <span className="text-black">{match.name}</span>
        {match.status === "Live" && (
          <span className="flex items-center gap-1 text-red-500 font-bold animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-500" /> LIVE
          </span>
        )}
      </div>

      {/* Teams */}
      <div className="flex flex-col border-[1.5px] border-black  bg-white">
        <TeamRow
          team={match.teams[0]}
          isTop={true}
          hoveredTeamId={hoveredTeamId}
          setHoveredTeamId={setHoveredTeamId}
          score={match.score?.[0]}
        />
        <TeamRow
          team={match.teams[1]}
          isTop={false}
          hoveredTeamId={hoveredTeamId}
          setHoveredTeamId={setHoveredTeamId}
          score={match.score?.[1]}
        />
      </div>
    </div>
  );
};
