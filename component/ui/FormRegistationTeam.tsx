import { FormDataTeam } from "@/lib/types";

function FormRegistationTeam({
  data,
  setData,
}: {
  data: FormDataTeam;
  setData: React.Dispatch<React.SetStateAction<FormDataTeam>>;
}) {
  return (
    <div className="z-10 w-full flex flex-col justify-center items-center gap-10 sm:gap-12 lg:mt-8">
      <h1 className="text-center font-bold text-xl sm:text-2xl font-plus-jakarta-sans">TEAM PROFILE</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-7 sm:gap-y-9 gap-x-4 sm:gap-x-6 w-full">
        <div className="flex flex-col gap-1">
          <label htmlFor="team_name" className="text-sm lg:text-base font-fira-code">
            TEAM NAME
          </label>
          <input
            value={data.team_name}
            onChange={(e) => setData({ ...data, team_name: e.target.value })}
            type="text"
            id="team_name"
            name="team_name"
            placeholder="Team name"
            className="p-3 sm:p-4 bg-white rounded-xs w-full outline-none text-sm lg:text-base font-plus-jakarta-sans shadow-md"
          />
          <p className="text-red-500 text-xs">please fill your name</p>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="team_logo" className="text-sm lg:text-base font-fira-code tracking-wide">
            TEAM LOGO (OPTIONAL)
          </label>

          <label
            htmlFor="team_logo"
            className="relative bg-white w-full h-12 sm:h-14 flex items-center px-4 cursor-pointer shadow-md"
          >
            <span
              className={`text-gray-400 font-plus-jakarta-sans text-sm lg:text-base ${data.team_logo ? "text-gray-800" : ""}`}
            >
              {data.team_logo?.name || "FILE →"}
            </span>

            <input
              type="file"
              accept=".jpg, .png, .jpeg"
              id="team_logo"
              name="team_logo"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                  setData({ ...data, team_logo: file });
                }
              }}
            />
            <p className="text-red-500 text-xs">please fill your name</p>
          </label>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="kategori" className="text-sm lg:text-base font-fira-code">
            KATEGORI LOMBA
          </label>
          <select
            id="kategori"
            name="kategori"
            onChange={(e) => {
              setData({ ...data, kategori: e.target.value });
            }}
            className={`h-12 sm:h-14 px-4 bg-white rounded-sm outline-none shadow-md font-plus-jakarta-sans text-sm lg:text-base ${
              data.kategori === "" ? "text-gray-400" : "text-black"
            }`}
          >
            <option value="">-- SELECT --</option>
            <option value="soccer bot" className="text-black">
              SOCCER BOT
            </option>
            <option value="summo bot" className="text-black">
              SUMMO BOT
            </option>
          </select>
          <p className="text-red-500 text-xs">please fill your name</p>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="asal_instansi" className="text-sm lg:text-base font-fira-code">
            ASAL INSTANSI
          </label>
          <input
            value={data.asal_instansi}
            onChange={(e) => setData({ ...data, asal_instansi: e.target.value })}
            type="text"
            id="asal_instansi"
            name="asal_instansi"
            placeholder="Asal instansi"
            className="p-3 sm:p-4 bg-white rounded-xs w-full outline-none text-sm lg:text-base font-plus-jakarta-sans shadow-md"
          />
          <p className="text-red-500 text-xs">please fill your name</p>
        </div>
      </div>

      <p className="text-center text-[#7d7d7d] text-sm sm:text-base italic font-plus-jakarta-sans">
        Dilarang menggunakan nama team yang mengandung unsur SARA*
      </p>
    </div>
  );
}

export default FormRegistationTeam;
