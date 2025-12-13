import { TimelineAction } from "@/lib/types/type";
import { GiGoalKeeper } from "react-icons/gi";
import { IoIosFootball } from "react-icons/io";
import { TbCardsFilled } from "react-icons/tb";

const scoreActions = [
  { name: "Point", type: "point", icon: <IoIosFootball className="w-8 h-8" /> },
  { name: "Penalty", type: "penalty", icon: <GiGoalKeeper className="w-8 h-8" /> },
  { name: "Yellow Card", type: "yellow", icon: <TbCardsFilled fill="yellow" className="w-8 h-8" /> },
  { name: "Red Card", type: "red", icon: <TbCardsFilled fill="red" className="w-8 h-8" /> },
];

interface MatchActionProps {
  startMatch: boolean;
  handleScoreAction: (actionName: string, actionType: string, team: "home" | "away") => void;
  timeline: TimelineAction[];
}

function MatchAction({ startMatch, handleScoreAction, timeline }: MatchActionProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center pb-6 pt-10 lg:pt-0">
      <h2 className="font-fira-code xl:text-lg">TIMELINE</h2>

      <div className="flex w-full lg:max-w-6xl mt-2 gap-4">
        <div className="flex-1/4 md:flex-2/5 flex sm:items-center md:items-end flex-col gap-2 font-plus-jakarta-sans">
          {scoreActions.map((action) => (
            <button
              disabled={!startMatch}
              key={action.name}
              className="group flex flex-row-reverse justify-end items-center gap-4 transition-all active:scale-95 cursor-pointer disabled:cursor-not-allowed disabled:active:scale-100"
              onClick={() => handleScoreAction(action.name, action.type, "home")}
            >
              <div className="bg-black text-white font-medium py-2 px-2 rounded hover:opacity-90 transition-all group-disabled:bg-gray-600 group-disabled:opacity-75 group-disabled:hover:opacity-75">
                {action.icon}
              </div>

              <p className="hidden md:block group-disabled:text-gray-500">{action.name}</p>
            </button>
          ))}
        </div>

        <div className="flex-3/4 md:flex-3/5 flex justify-center font-fira-code">
          <div className="w-full  overflow-y-auto">
            {timeline.length === 0 ? (
              <div className="text-center text-gray-500">Belum ada aksi dalam pertandingan</div>
            ) : (
              <div className="space-y-3">
                {timeline.map((item, i) => (
                  <div key={i} className="grid grid-cols-3 gap-3">
                    <div className="col-span-1 text-right">{item.team === "home" ? item.name : null}</div>
                    <div className="col-span-1 text-center">{item.time}</div>
                    <div className="col-span-1 text-left">{item.team === "away" ? item.name : null}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1/4 md:flex-2/5 flex items-end sm:items-center md:items-start flex-col gap-2 font-plus-jakarta-sans">
          {scoreActions.map((action) => (
            <button
              disabled={!startMatch}
              key={action.name}
              className="group flex justify-start items-center gap-4 transition-all active:scale-95 cursor-pointer disabled:cursor-not-allowed disabled:active:scale-100"
              onClick={() => handleScoreAction(action.name, action.type, "away")}
            >
              <div className="bg-black text-white font-medium py-2 px-2 rounded hover:opacity-90 transition-all group-disabled:bg-gray-600 group-disabled:opacity-75 group-disabled:hover:opacity-75">
                {action.icon}
              </div>
              <p className="hidden md:block group-disabled:text-gray-500">{action.name}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MatchAction;
