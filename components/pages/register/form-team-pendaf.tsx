"use-client";
import CommunityInput from "./community-input";

function FormRegistationTeamPendaf({
  data,
  setData,
  error,
  listTour,
  listCommunity,
}: {
  data: ITeamBody;
  setData: React.Dispatch<React.SetStateAction<ITeamBody>>;
  error?: TeamError;
  listTour?: IGetAllTournaments[];
  listCommunity?: IGetAllCommunity[];
}) {
  return (
    <div className=" z-10  w-full">
      <div className=" flex flex-col justify-center  items-center gap-10 sm:gap-10 lg:mt-4">
        <h1 className="text-center font-bold text-xl sm:text-2xl font-plus-jakarta-sans">PROFIL TIM</h1>
        <div className="flex flex-col gap-y-7 sm:gap-y-7 gap-x-4 sm:gap-x-6 w-full h-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-7 sm:gap-y-7 gap-x-4 sm:gap-x-6 w-full h-full">
            <div className="flex flex-col gap-1">
              <label htmlFor="team_name" className="text-sm lg:text-base font-fira-code">
                NAMA TIM
              </label>
              <input
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                type="text"
                id="team_name"
                name="team_name"
                placeholder="Masukkan nama tim"
                className="p-3 sm:p-4 bg-white rounded-xs w-full outline-none text-sm lg:text-base font-plus-jakarta-sans shadow-md"
              />
              {error?.name && <p className="text-red-500 text-xs">{error.name}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="team_email" className="text-sm lg:text-base font-fira-code">
                EMAIL TIM
              </label>
              <input
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                type="text"
                id="team_email"
                name="team_email"
                placeholder="Contoh: tim.robot@email.com"
                className="p-3 sm:p-4 bg-white rounded-xs w-full outline-none text-sm lg:text-base font-plus-jakarta-sans shadow-md"
              />
              {error?.email && <p className="text-red-500 text-xs">{error.email}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="team_logo" className="text-sm lg:text-base font-fira-code tracking-wide">
                LOGO TIM (OPSIONAL)
              </label>

              <label
                htmlFor="team_logo"
                className="relative bg-white w-full h-12 sm:h-14 flex items-center px-4 cursor-pointer shadow-md"
              >
                <span className={`text-gray-400 font-plus-jakarta-sans text-sm lg:text-base ${data.logo ? "text-gray-800" : ""}`}>
                  {data.logo?.name || "PILIH FILE →"}
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
                      setData({ ...data, logo: file });
                    }
                  }}
                />
              </label>
              {error?.logo && <p className="text-red-500 text-xs">{error.logo}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="invoice" className="text-sm lg:text-base font-fira-code tracking-wide">
                BUKTI PEMBAYARAN
              </label>

              <label
                htmlFor="invoice"
                className="relative bg-white w-full h-12 sm:h-14 flex items-center px-4 cursor-pointer shadow-md"
              >
                <span
                  className={`text-gray-400 font-plus-jakarta-sans text-sm lg:text-base ${data.invoice ? "text-gray-800" : ""}`}
                >
                  {data.invoice?.name || "PILIH FILE →"}
                </span>

                <input
                  type="file"
                  accept=".jpg, .png, .jpeg"
                  id="invoice"
                  name="invoice"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                      setData({ ...data, invoice: file });
                    }
                  }}
                />
              </label>
              {error?.invoice && <p className="text-red-500 text-xs">{error.invoice}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="kategori" className="text-sm lg:text-base font-fira-code">
                KATEGORI LOMBA
              </label>
              <select
                id="kategori"
                name="kategori"
                onChange={(e) => {
                  setData({ ...data, category: e.target.value });
                }}
                className={`h-12 sm:h-14 px-4 bg-white rounded-sm outline-none shadow-md font-plus-jakarta-sans text-sm lg:text-base ${
                  data.category === "" ? "text-gray-400" : "text-black"
                }`}
              >
                <option value="">-- PILIH KATEGORI --</option>
                <option value="SOCCER" className="text-black">
                  SOCCER
                </option>
                <option value="SUMO" className="text-black">
                  SUMO
                </option>
              </select>
              {error?.category && <p className="text-red-500 text-xs">{error.category}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="turnamen" className="text-sm lg:text-base font-fira-code">
                TURNAMEN
              </label>
              <select
                id="turnamen"
                name="turnamen"
                onChange={(e) => {
                  setData({ ...data, tournamentId: e.target.value });
                }}
                className={`h-12 sm:h-14 px-4 bg-white rounded-sm outline-none shadow-md font-plus-jakarta-sans text-sm lg:text-base ${
                  data.tournamentId === "" ? "text-gray-400" : "text-black"
                }`}
              >
                <option value="">-- PILIH TURNAMEN --</option>
                {listTour &&
                  listTour.map((tour) => (
                    <option value={tour.uid} key={tour.uid} className="text-black">
                      {tour.name}
                    </option>
                  ))}
              </select>
              {error?.category && <p className="text-red-500 text-xs">{error.category}</p>}
            </div>
          </div>
          <CommunityInput
            communities={listCommunity as IGetAllCommunity[]}
            value={data.communityName}
            onChange={(val) => setData({ ...data, communityName: val })}
          />
        </div>
        <p className="text-center text-[#7d7d7d] text-sm sm:text-base italic font-plus-jakarta-sans ">
          *Dilarang menggunakan nama tim yang mengandung unsur SARA
        </p>
      </div>
    </div>
  );
}

export default FormRegistationTeamPendaf;
