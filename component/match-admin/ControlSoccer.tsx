import HeaderDashboard from "@/component/ui/HeaderDashboard";
import { Play, FlagTriangleRightIcon, Pause } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { IoIosFootball } from "react-icons/io";
import { GiGoalKeeper } from "react-icons/gi";
import { TbCardsFilled } from "react-icons/tb";
import ValidationModal from "@/component/match-admin/validationModal";
import { TimelineAction } from "@/lib/types/type";

function ControlSoccer({ matchId }: { matchId: string }) {
  const [startMatch, setStartMatch] = useState(false);
  const [showModalFinish, setShowModalFinish] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [timeline, setTimeline] = useState<TimelineAction[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [secondsLeft, setSecondsLeft] = useState(180);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const confirmPlay = () => {
    setStartMatch(true);
    setSecondsLeft(180);

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setStartMatch(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const scoreActions = [
    { name: "Point", type: "point", icon: <IoIosFootball className="w-8 h-8" /> },
    { name: "Penalty", type: "penalty", icon: <GiGoalKeeper className="w-8 h-8" /> },
    { name: "Yellow Card", type: "yellow", icon: <TbCardsFilled fill="yellow" className="w-8 h-8" /> },
    { name: "Red Card", type: "red", icon: <TbCardsFilled fill="red" className="w-8 h-8" /> },
  ];

  const handleScoreAction = (actionName: string, actionType: string, team: "home" | "away") => {
    const actionTime = formatTime(secondsLeft);
    const newAction: TimelineAction = {
      name: actionName,
      team: team,
      time: actionTime,
      type: actionType as TimelineAction["type"],
    };

    setTimeline((prev) => [...prev, newAction]);

    if (actionType === "point") {
      if (team === "home") {
        setHomeScore((prev) => prev + 1);
      } else {
        setAwayScore((prev) => prev + 1);
      }
    }
  };

  const handleFinish = () => {
    setShowModalFinish(true);
  };

  const confirmFinish = () => {
    setShowModalFinish(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setStartMatch(false);
    setSecondsLeft(180);
    console.log(timeline);
    setHomeScore(0);
    setAwayScore(0);
    setTimeline([]);
  };

  const handlePause = () => {
    if (!startMatch) return;

    if (!isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsPaused(true);
    } else {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setStartMatch(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      setIsPaused(false);
    }
  };

  return (
    <>
      <HeaderDashboard title="Match Control" name="Admin" />
      <main className="w-full p-4 md:p-6 mb-20">
        <div className="w-full py-6 px-3 flex-col items-center justify-between rounded-md bg-white shadow-[0_-2px_1px_rgba(0,0,0,0.05),0_4px_9px_rgba(0,0,0,0.1)] lg:bg-transparent lg:shadow-none font-plus-jakarta-sans">
          <p className="mb-6 text-gray-700 font-medium tracking-wide text-center block">GROUP B - MATCH 2 - SOCCER BOT</p>

          <div className="w-full flex lg:flex-col items-center justify-between">
            <div className="flex flex-col gap-6 lg:gap-0 lg:flex-row items-start justify-center w-full lg:max-w-6x md:px-3">
              {/* Home Team */}
              <div className="w-full lg:w-auto flex items-center justify-between">
                <div className="flex flex-col items-start lg:items-end">
                  <div className="flex flex-row-reverse lg:flex-row items-center gap-4 justify-end col-span-2">
                    <div className="flex flex-col lg:text-right">
                      <h1 className="text-xl font-bold line-clamp-1">Nee GUZZ</h1>
                      <p className="text-sm text-gray-600 line-clamp-1">Universitas Digidaw</p>
                    </div>
                    <div className="bg-logo-team w-[60px] h-[60px] min-w-[60px] min-h-[60px] sm:w-[70px] sm:h-[70px] flex items-center justify-center">
                      <Image src="/logo-only.svg" alt="logo" height={30} width={30} className="w-auto h-auto p-2" />
                    </div>
                    <p className="text-3xl font-bold bg-black text-white h-16 w-[70px] hidden lg:flex items-center justify-center">
                      {homeScore}
                    </p>
                  </div>

                  <div className="mt-2 flex gap-2 sm:gap-3 lg:flex-row-reverse">
                    <span className="w-7 h-2 bg-[#f9fd0b]"></span>
                    <span className="w-7 h-2 bg-gray-300"></span>
                  </div>
                </div>
                <div className="font-plus-jakarta-sans text-2xl sm:text-3xl block lg:hidden">
                  <p className=" font-bold bg-black text-white w-16 h-16 sm:w-[70px] flex items-center justify-center">
                    {homeScore}
                  </p>
                </div>
              </div>
              <div className="hidden lg:flex flex-col items-center col-span-1 gap-2 mx-3">
                <Image src="/logo-only.svg" alt="Center Logo" width={50} height={50} className="w-28" />
                <div className="h-22 bg-time bg-contain w-[310px] flex items-center justify-center font-bold pb-2 font-fira-code text-4xl">
                  {formatTime(secondsLeft)}
                </div>
              </div>
              <div className="w-full lg:w-auto flex items-center justify-between">
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-4 justify-start col-span-2 ">
                    <p className="text-3xl font-bold bg-black text-white h-16 w-[70px] hidden lg:flex items-center justify-center">
                      {awayScore}
                    </p>

                    <div className="bg-logo-team w-[60px] h-[60px] min-w-[60px] min-h-[60px] sm:w-[70px] sm:h-[70px]  flex items-center justify-center">
                      <Image src="/logo-only.svg" alt="logo" height={30} width={30} className="w-auto h-auto p-2" />
                    </div>

                    <div className="flex flex-col text-left">
                      <h1 className="text-xl font-bold line-clamp-1">Mahasigma</h1>
                      <p className="text-sm text-gray-600 line-clamp-1">Universitas Digidaw</p>
                    </div>
                  </div>
                  <div className="mt-2 flex gap-2 sm:gap-3 items-start">
                    <span className="w-7 h-2 bg-[#f9fd0b]"></span>
                    <span className="w-7 h-2 bg-[#f9fd0b]"></span>
                  </div>
                </div>
                <div className="font-plus-jakarta-sans text-2xl sm:text-3xl block lg:hidden">
                  <p className=" font-bold bg-black text-white w-16 h-16 sm:w-[70px] flex items-center justify-center">
                    {awayScore}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center w-full lg:hidden">
          <div className="h-22 bg-time bg-contain w-[320px] flex items-center justify-center font-bold pb-2.5 font-fira-code text-4xl">
            {formatTime(secondsLeft)}
          </div>
        </div>
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
        <div className="w-full flex justify-center mt-8 lg:justify-end gap-4">
          <button
            onClick={confirmPlay}
            disabled={startMatch}
            className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 shadow-md active:scale-95 bg-green-500 hover:bg-green-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100`}
          >
            <Play size={18} />
            Start
          </button>

          <button
            disabled={!startMatch}
            onClick={handlePause}
            className="px-4 py-2 rounded-lg font-semibold flex items-center gap-2 shadow-md active:scale-95 bg-yellow-500 hover:bg-yellow-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100"
          >
            <Pause size={18} />
            {isPaused ? "Continue" : "Pause"}
          </button>

          <button
            onClick={handleFinish}
            disabled={!startMatch}
            className="px-4 py-2 rounded-lg font-semibold flex items-center gap-2 border shadow-md active:scale-95 bg-red-500 hover:bg-red-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100"
          >
            <FlagTriangleRightIcon size={18} />
            Finish
          </button>
        </div>
        {showModalFinish ? (
          <ValidationModal
            setShowModalStart={setShowModalFinish}
            action={confirmFinish}
            title="Akhiri Pertandingan?"
            desc="Pertandingan akan selesai jika anda memilih Finish"
            confirm_text="Finish"
          />
        ) : null}
      </main>
    </>
  );
}

export default ControlSoccer;
