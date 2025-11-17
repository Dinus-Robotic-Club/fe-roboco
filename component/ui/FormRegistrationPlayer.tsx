import { FormDataPlayer } from "@/lib/types";
import React from "react";

function FormRegistrationPlayer({
  data,
  setData,
}: {
  data: FormDataPlayer;
  setData: React.Dispatch<React.SetStateAction<FormDataPlayer>>;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-28 w-full max-w-[1176px] px-3 md:px-6 ">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <label htmlFor="player1_name" className="text-sm lg:text-base font-fira-code">
            PLAYER 1 NAME (TEAM LEADER)
          </label>
          <input
            value={data.player1_name}
            id="player1_name"
            type="text"
            placeholder="player 1 name"
            className="p-4 bg-white rounded-xs w-full outline-none text-sm lg:text-base font-plus-jakarta-sans shadow-md border-2"
            onChange={(e) => setData({ ...data, player1_name: e.target.value })}
          />
          <p className="text-red-500 text-xs">please fill your name</p>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="player1_picture" className="text-sm lg:text-base font-fira-code">
            PLAYER 1 PICTURE
          </label>
          <input
            id="player1_picture"
            type="file"
            accept=".jpg, .png, .jpeg"
            placeholder="player 1 picture"
            className="p-4 bg-white rounded-xs w-full outline-none text-sm lg:text-base font-plus-jakarta-sans shadow-md border-2"
            onChange={(e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (file) {
                setData({ ...data, player1_picture: file });
              }
            }}
          />
          <p className="text-red-500 text-xs">please fill your name</p>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="player1_twibon" className="text-sm lg:text-base font-fira-code">
            PLAYER 1 TWIBON
          </label>
          <input
            value={data.player1_twibbon}
            id="player1_twibon"
            type="url"
            placeholder="link"
            className="p-4 bg-white rounded-xs w-full outline-none text-sm lg:text-base font-plus-jakarta-sans shadow-md border-2"
            onChange={(e) => setData({ ...data, player1_twibbon: e.target.value })}
          />
          <p className="text-red-500 text-xs">please fill your name</p>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="player1_phone" className="text-sm lg:text-base font-fira-code">
            PLAYER 1 PHONE NUMBER
          </label>
          <input
            value={data.player1_phone}
            id="player1_phone"
            type="tel"
            placeholder="08123456789"
            className="p-4 bg-white rounded-xs w-full outline-none text-sm lg:text-base font-plus-jakarta-sans shadow-md border-2"
            onChange={(e) => setData({ ...data, player1_phone: e.target.value })}
          />
          <p className="text-red-500 text-xs">please fill your name</p>
        </div>

        <button className="bg-[#FBFF00] hover:bg-yellow-300 transition font-fira-code font-medium py-3 mt-2 shadow-md">
          DOWNLOAD TWIBON
        </button>
      </div>

      {/* PLAYER 2 */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <label htmlFor="player2_name" className="text-sm lg:text-base font-fira-code text-start md:text-right">
            PLAYER 2 NAME
          </label>
          <input
            value={data.player2_name}
            id="player2_name"
            type="text"
            placeholder="player 2 name"
            className="p-4 bg-white rounded-xs w-full outline-none text-sm lg:text-base font-plus-jakarta-sans shadow-md border-2"
            onChange={(e) => setData({ ...data, player2_name: e.target.value })}
          />
          <p className="text-red-500 text-xs text-start md:text-right">please fill your name</p>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="player2_picture" className="text-sm lg:text-base font-fira-code text-start md:text-right">
            PLAYER 2 PICTURE
          </label>
          <input
            id="player2_picture"
            type="file"
            accept=".jpg, .png, .jpeg"
            placeholder="player 1 picture"
            className="p-4 bg-white rounded-xs w-full outline-none text-sm lg:text-base font-plus-jakarta-sans shadow-md border-2"
            onChange={(e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (file) {
                setData({ ...data, player2_picture: file });
              }
            }}
          />
          <p className="text-red-500 text-xs text-start md:text-right">please fill your name</p>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="player2_twibon" className="text-sm lg:text-base font-fira-code text-start md:text-right">
            PLAYER 2 TWIBON
          </label>
          <input
            value={data.player2_twibbon}
            id="player2_twibon"
            type="url"
            placeholder="link"
            className="p-4 bg-white rounded-xs w-full outline-none text-sm lg:text-base font-plus-jakarta-sans shadow-md border-2"
            onChange={(e) => setData({ ...data, player2_twibbon: e.target.value })}
          />
          <p className="text-red-500 text-xs text-start md:text-right">please fill your name</p>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="player2_phone" className="text-sm lg:text-base font-fira-code text-start md:text-right">
            PLAYER 2 PHONE NUMBER
          </label>
          <input
            value={data.player2_phone}
            id="player2_phone"
            type="tel"
            placeholder="08123456789"
            className="p-4 bg-white rounded-xs w-full outline-none text-sm lg:text-base font-plus-jakarta-sans shadow-md border-2"
            onChange={(e) => setData({ ...data, player2_phone: e.target.value })}
          />
          <p className="text-red-500 text-xs text-start md:text-right">please fill your name</p>
        </div>

        <button className="bg-[#FBFF00] hover:bg-yellow-300 transition font-fira-code font-medium py-3 mt-2 shadow-md">
          DOWNLOAD TWIBON
        </button>
      </div>
    </div>
  );
}

export default FormRegistrationPlayer;
