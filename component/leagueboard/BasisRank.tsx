import { leaderboard_dumy } from "@/lib";
import Image from "next/image";
import React from "react";

function BasisRank() {
  return (
    <>
      <div className="">
        <h1 className="text-2xl lg:text-3xl font-bold">BASIS RANK</h1>
      </div>
      <div className="w-full max-w-6xl 2xl:max-w-7xl">
        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            <div className="grid grid-cols-12 px-4 py-4 font-semibold text-sm bg-[#FBFF00]">
              <div className="col-span-7">TEAM</div>
              <div className="col-span-1 text-center">MP</div>
              <div className="col-span-1 text-center">W</div>
              <div className="col-span-1 text-center">D</div>
              <div className="col-span-1 text-center">L</div>
              <div className="col-span-1 text-center">P</div>
            </div>

            {leaderboard_dumy.map((item, i) => (
              <div key={i} className="grid grid-cols-12 px-4 py-4 items-center hover:bg-gray-50 transition">
                <div className="col-span-7 flex items-center gap-4">
                  <span className="text-lg font-semibold w-6">{item.rank}.</span>
                  <div className="flex bg-logo-team w-12 h-12 items-center justify-center">
                    <Image src={item.logo} alt="logo" width={32} height={32} className="w-full h-full p-2" />
                  </div>

                  <div>
                    <p className="font-semibold">{item.team}</p>
                    <p className="text-xs text-gray-500">{item.school}</p>
                  </div>
                </div>

                <div className="col-span-1 text-center">{item.stats.MP}</div>
                <div className="col-span-1 text-center">{item.stats.W}</div>
                <div className="col-span-1 text-center">{item.stats.D}</div>
                <div className="col-span-1 text-center">{item.stats.L}</div>
                <div className="col-span-1 text-center font-bold">{item.stats.P}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default BasisRank;
