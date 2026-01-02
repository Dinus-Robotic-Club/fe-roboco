"use client";
import FormRegistrationPlayer from "@/components/pages/register/form-player";
import FormRegistationTeamPendaf from "@/components/pages/register/form-team-pendaf";
import Loader from "@/components/ui/loader";
import ImageUploadModal from "@/components/ui/modal";
import Navbar from "@/components/ui/navbar";
import { useCreateTeam } from "@/hooks/useCreateTeam";
import { useGetCommunity } from "@/hooks/useGetCommunity";
import { useGetTournaments } from "@/hooks/useGetTournaments";
import { useMounted } from "@/hooks/useMounted";
import { mapZodErrors, scrollToFirstError } from "@/lib/function";
import { nav_admin } from "@/lib/statis-data";
import { RegisterTeamSchema } from "@/lib/validator/register";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { FormEvent, Suspense, useState } from "react";
import { toast } from "sonner";

function Register() {
  const router = useRouter();
  const mounted = useMounted();
  const { data: communities } = useGetCommunity();
  const { data: tournaments } = useGetTournaments();
  const { mutate, isPending, isSuccess } = useCreateTeam();
  const [showModal, setShowModal] = useState<number | null>(null);

  const [team, setTeam] = useState<ITeamBody>({
    name: "",
    email: "",
    password: "@Coba123",
    communityName: "",
    category: "",
    logo: null,
    tournamentId: "",
    invoice: null,
    confirmPassword: "@Coba123",
  });

  const [participants, setParticipants] = useState<IParticipantsBody[]>([
    {
      participantsName: "",
      participantsPhone: "",
      participantsTwibbon: "",
      participantsRoleInTeam: "",
      participantsImage: null,
      participantsIdentityCardImage: null,
    },
    {
      participantsName: "",
      participantsPhone: "",
      participantsTwibbon: "",
      participantsRoleInTeam: "",
      participantsImage: null,
      participantsIdentityCardImage: null,
    },
  ]);

  const [error, setError] = useState<RegisterError>({
    team: {},
    participants: [],
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const payload: IBodyRegisterTeam = { team, participants };

    const parsed = RegisterTeamSchema.safeParse(payload);

    if (!parsed.success) {
      const mappedErrors = mapZodErrors(parsed.error.issues);
      setError(mappedErrors);

      toast.error("Form tidak valid, silakan perbaiki field yang merah!");

      setTimeout(() => {
        scrollToFirstError(parsed.error.issues);
      }, 500);

      return;
    }
    setError({ team: {}, participants: [] });

    const fd = new FormData();
    Object.entries(team).forEach(([k, v]) => {
      if (v) fd.append(`${k}`, v instanceof File ? v : String(v));
    });

    participants.forEach((p) => {
      Object.entries(p).forEach(([k, v]) => {
        if (v) fd.append(`${k}`, v instanceof File ? v : String(v));
      });
    });

    mutate(fd);
  };

  if (isSuccess) router.push("/admin/dashboard");

  if (!mounted) return null;

  return (
    <main className="w-full relative flex flex-col items-center bg-grid">
      <Loader show={isPending} />
      <Navbar left={nav_admin.left} right={nav_admin.right} />
      <div className="z-10 min-h-175 w-full shadow-lg absolute top-0 left-0 right-0 bg-white"></div>

      <div className="flex flex-col max-w-5xl justify-center items-center font-plus-jakarta-sans w-full px-10 gap-4 text-center mt-52 mb-32 z-20">
        <h1 className="font-extrabold text-3xl lg:text-5xl 2xl:text-[53px]">REGISTRATION FORM ADMIN</h1>
        <p className="text-base lg:text-xl 2xl:text-2xl">
          tolong lengkapi form di bawah ini, silahkan download{" "}
          <a href="" className="underline cursor-pointer">
            panduan pendaftaran
          </a>{" "}
          atau hubungi{" "}
          <a href="https://wa.me/6288226457475" className="underline cursor-pointer">
            narahubung kami
          </a>
        </p>
      </div>

      <div className="max-h-full md:max-h-127.5 w-full max-w-294 relative flex justify-center items-center flex-col px-3 sm:px-6 lg:px-20 z-20 mb-28 py-10 mx-auto shadow-md lg:shadow-none bg-[#fcff00] lg:bg-transparent">
        <Image src="/bg-registration-team.svg" alt="Registration Team" fill className="rounded-md object-cover hidden lg:block" />
        <FormRegistationTeamPendaf
          data={team}
          setData={setTeam}
          listTour={tournaments.data}
          error={error.team}
          listCommunity={communities.data}
        />
      </div>

      <div className="w-full flex flex-col justify-center items-center mb-28">
        <h1 className="text-center font-bold text-2xl font-plus-jakarta-sans mb-10">PLAYER PROFILE</h1>
        <FormRegistrationPlayer
          data={participants}
          setData={(index, data) =>
            setParticipants((prev) => {
              const copy = [...prev];
              copy[index] = { ...copy[index], ...data };
              return copy;
            })
          }
          onOpenTwibbonModal={(index) => setShowModal(index)}
          errors={error.participants}
        />

        <div className="w-full max-w-294 flex justify-center mt-8 px-3 md:px-6">
          <button
            onClick={handleSubmit}
            className="bg-[#FBFF00] hover:shadow-xl transition font-fira-code font-medium py-3 px-10 w-full shadow-md"
          >
            SUBMIT NOW
          </button>
        </div>
      </div>

      {showModal !== null && (
        <ImageUploadModal
          index={showModal}
          onClose={() => setShowModal(null)}
          data={participants}
          setData={(index, data) => {
            setParticipants((prev) => {
              const copy = [...prev];
              copy[index] = { ...copy[index], ...data };
              return copy;
            });
          }}
        />
      )}
    </main>
  );
}

const RegisterPage = () => {
  return (
    <Suspense fallback={<></>}>
      <Register />
    </Suspense>
  );
};

export default RegisterPage;
