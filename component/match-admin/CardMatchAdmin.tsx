import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ICardMatch } from "../ui/CardMatch";
import ValidationModal from "./validationModal";

export default function CardMatchAdmin({ data }: { data: ICardMatch }) {
  const route = useRouter();
  const [showModalStart, setShowModalStart] = useState(false);

  const goToMatch = () => {
    route.push(`/admin/match/${data.uid}`);
  };

  return (
    <>
      <div
        onClick={() => setShowModalStart(true)}
        className="w-full py-6 px-3 flex-col items-center justify-between rounded-md lg:rounded bg-white shadow-[0_-2px_1px_rgba(0,0,0,0.05),0_4px_9px_rgba(0,0,0,0.1)] max-w-6xl 2xl:max-w-7xl cursor-pointer"
      >
        <p className="mb-6 text-gray-700 font-medium tracking-wide text-center block lg:hidden">
          {data?.roundLabel} | {data?.category}
        </p>

        <div className="w-full flex lg:flex-col items-center justify-between">
          <div className="flex flex-col gap-6 lg:grid lg:grid-cols-5 items-start lg:items-center lg:w-full lg:max-w-6x md:px-3">
            <div className="flex flex-row-reverse lg:flex-row items-center gap-4 justify-end col-span-2">
              <div className="flex flex-col lg:text-right">
                <h1 className="text-xl font-bold line-clamp-1">{data?.teamA.name}</h1>
                <p className="text-sm text-gray-600 line-clamp-1">{data?.teamA.community.name}</p>
              </div>

              <div className="bg-logo-team w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] flex items-center justify-center">
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}${data?.teamA.logo}`}
                  alt={data?.teamA.name}
                  width={30}
                  height={30}
                  className="w-auto h-auto p-2"
                />
              </div>

              <p className="text-3xl font-bold bg-black text-white h-16 w-[70px] hidden lg:flex items-center justify-center">
                {data?.scoreA}
              </p>
            </div>

            <div className="hidden lg:flex justify-center col-span-1">
              <Image src="/logo-only.svg" alt="Center Logo" width={50} height={50} className="w-20" />
            </div>

            <div className="flex items-center gap-4 justify-start col-span-2 ">
              <p className="text-3xl font-bold bg-black text-white h-16 w-[70px] hidden lg:flex items-center justify-center">
                {data?.scoreB}
              </p>

              <div className="bg-logo-team w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] flex items-center justify-center">
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}${data?.teamB.logo}`}
                  alt={data?.teamB.name}
                  width={30}
                  height={30}
                  className="w-auto h-auto p-2"
                />
              </div>

              <div className="flex flex-col text-left">
                <h1 className="text-xl font-bold line-clamp-1">{data?.teamB.name}</h1>
                <p className="text-sm text-gray-600 line-clamp-1">{data?.teamB.community.name}</p>
              </div>
            </div>
          </div>

          <p className="mt-6 text-gray-700 font-medium tracking-wider hidden lg:flex">
            {data?.roundLabel} | {data?.category}
          </p>

          <div className="flex flex-col justify-between lg:hidden text-lg sm:text-2xl gap-6 md:px-3">
            <p className="font-bold bg-black text-white h-[50px] w-[50px] md:h-16 md:w-[70px] flex items-center justify-center">
              {data?.scoreA}
            </p>
            <p className="font-bold bg-black text-white h-[50px] w-[50px] md:h-16 md:w-[70px] flex items-center justify-center">
              {data?.scoreB}
            </p>
          </div>
        </div>
      </div>

      {showModalStart && (
        <ValidationModal
          setShowModalStart={setShowModalStart}
          action={goToMatch}
          title="Masuk ke Match?"
          desc="Apakah kamu ingin membuka halaman match ini?"
          confirm_text="Ya, lanjut"
        />
      )}
    </>
  );
}
