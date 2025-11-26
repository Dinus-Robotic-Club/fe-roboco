"use client";

import { IParticipantsBody } from "@/lib/types/team";
import { SquareCheckBig } from "lucide-react";

type Props = {
  data: IParticipantsBody[];
  setData: (index: number, patch: Partial<IParticipantsBody>) => void;
  errors?: Record<number, Partial<Record<keyof IParticipantsBody, string>>>;
  onOpenTwibbonModal: () => void;
};

export default function FormRegistrationPlayer({ data, setData, errors = {}, onOpenTwibbonModal }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-28 w-full max-w-[1176px] px-3 md:px-6">
      {data.map((player, index) => (
        <div key={index} className="flex flex-col gap-6">
          {/* NAME */}
          <Field label={`PLAYER ${index + 1} NAME`} error={errors[index]?.participantsName}>
            <input
              value={player.participantsName}
              type="text"
              placeholder={`Player ${index + 1} name`}
              className="p-4 bg-white rounded-xs shadow-md border-2"
              onChange={(e) => setData(index, { participantsName: e.target.value })}
            />
          </Field>

          <Field label={`PLAYER ${index + 1} ROLE`} error={errors[index]?.participantsRoleInTeam}>
            <select
              id="participant-role"
              name="participant-role"
              onChange={(e) => setData(index, { participantsRoleInTeam: e.target.value })}
              className={`p-4 bg-white rounded-xs shadow-md border-2 font-plus-jakarta-sans text-sm lg:text-base ${
                player.participantsRoleInTeam === "" ? "text-gray-400" : "text-black"
              }`}
            >
              <option value="">-- SELECT --</option>
              <option value="LEADER" className="text-black">
                LEADER
              </option>
              <option value="MEMBER" className="text-black">
                MEMBER
              </option>
            </select>
          </Field>

          {/* PICTURE */}
          <Field label={`PLAYER ${index + 1} PICTURE`} error={errors[index]?.participantsImage}>
            <input
              type="file"
              accept=".jpg, .png, .jpeg"
              id="participantsImage"
              name="participantsImage"
              className="p-4 bg-white rounded-xs shadow-md border-2"
              onChange={(e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                  setData(index, { participantsImage: file });
                }
              }}
            />
          </Field>

          <Field label={`PLAYER ${index + 1} SET TWIBON`} error={errors[index]?.participantsIdentityCardImage}>
            <button
              key={index}
              onClick={onOpenTwibbonModal}
              className="p-4 bg-white rounded-xs shadow-md border-2 flex justify-between text-gray-500 cursor-pointer active:bg-gray-100"
            >
              <p>Setting Twibbon</p>
              {/* <Square className="" color="" /> */}
              <SquareCheckBig color="green" />
            </button>
          </Field>

          {/* TWIBON */}
          <Field label={`PLAYER ${index + 1} TWIBON`} error={errors[index]?.participantsTwibbon}>
            <input
              value={player.participantsTwibbon}
              type="url"
              placeholder="Link upload twibbon"
              className="p-4 bg-white rounded-xs shadow-md border-2"
              onChange={(e) => setData(index, { participantsTwibbon: e.target.value })}
            />
          </Field>

          {/* PHONE */}
          <Field label={`PLAYER ${index + 1} PHONE`} error={errors[index]?.participantsPhone}>
            <input
              value={player.participantsPhone}
              type="tel"
              placeholder="08123456789"
              className="p-4 bg-white rounded-xs shadow-md border-2"
              onChange={(e) => setData(index, { participantsPhone: e.target.value })}
            />
          </Field>
        </div>
      ))}
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm lg:text-base font-fira-code">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}
