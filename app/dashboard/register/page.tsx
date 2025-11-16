"use client";
import Footer from "@/component/ui/Footer";
import FormRegistationTeam from "@/component/ui/FormRegistationTeam";
import FormRegistrationPlayer from "@/component/ui/FormRegistrationPlayer";
import Navbar from "@/component/ui/Navbar";
import { nav_register } from "@/lib";
import { FormDataPlayer, FormDataTeam } from "@/lib/types";
import { useMounted } from "@/lib/useMounted";
import Image from "next/image";
import { useState } from "react";

function Register() {
  const mounted = useMounted();

  const [teamData, setTeamData] = useState<FormDataTeam>({
    team_name: "",
    team_logo: null,
    kategori: "",
    asal_instansi: "",
  });

  const [playerData, setPlayerData] = useState<FormDataPlayer>({
    player1_name: "",
    player1_picture: null,
    player1_twibbon: "",
    player1_phone: "",
    player2_name: "",
    player2_picture: null,
    player2_twibbon: "",
    player2_phone: "",
  });

  const handleSubmit = () => {
    console.log("TEAM DATA:", teamData);
    console.log("PLAYER DATA:", playerData);
    setTeamData({ team_name: "", team_logo: null, kategori: "", asal_instansi: "" });
  };

  if (!mounted) return null;

  return (
    <main className="w-full relative flex flex-col items-center bg-registation-page">
      <Navbar left={nav_register.left} right={nav_register.right} />
      <div className="z-10 min-h-[700px] w-full shadow-lg absolute top-0 left-0 right-0 bg-white"></div>
      <div className="flex flex-col max-w-5xl justify-center items-center font-plus-jakarta-sans w-full px-10 gap-4 text-center mt-52 mb-32 z-20">
        <h1 className="font-extrabold text-3xl lg:text-5xl 2xl:text-[53px]">REGISTRATION FORM</h1>
        <p className="text-base lg:text-xl 2xl:text-2xl">
          tolong lengkapi form di bawah ini, silahkan download{" "}
          <a href="" className="underline cursor-pointer">
            panduan pendaftaran
          </a>{" "}
          atau hubungi{" "}
          <a href="" className="underline cursor-pointer">
            narahubung kami
          </a>
        </p>
      </div>
      <div className="min-h-[502px] w-full max-w-[1176px] relative flex justify-center items-center flex-col px-3 sm:px-6 lg:px-20 z-20 mb-28 py-10 mx-auto shadow-md lg:shadow-none bg-[#fcff00] lg:bg-transparent">
        <Image src="/bg-registration-team.svg" alt="Registration Team" fill className="rounded-md object-cover hidden lg:block" />
        <FormRegistationTeam data={teamData} setData={setTeamData} />
      </div>
      <div className="w-full flex flex-col justify-center items-center mb-28">
        <h1 className="text-center font-bold text-2xl font-plus-jakarta-sans mb-10">PLAYER PROFILE</h1>
        <FormRegistrationPlayer data={playerData} setData={setPlayerData} />
        <div className="w-full max-w-[1176px] flex justify-center mt-10 px-3 md:px-6">
          <button
            onClick={handleSubmit}
            className="bg-[#FBFF00] hover:bg-yellow-300 transition font-fira-code font-medium py-3 px-10 w-full shadow-md"
          >
            SUBMIT NOW
          </button>
        </div>
      </div>

      <div className="w-full h-auto pt-20 bg-white">
        <Footer />
      </div>
    </main>
  );
}

export default Register;
