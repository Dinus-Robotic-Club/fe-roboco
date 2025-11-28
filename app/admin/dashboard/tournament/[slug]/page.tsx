"use client";
import Loader from "@/component/ui/Global/loader";
import { useTournaments } from "@/hooks/queries/useTournaments";
import { useParams, useRouter } from "next/navigation";

import React from "react";

function TournamentDetail() {
  const router = useRouter();
  const { data, isLoading, isError } = useTournaments();
  const { slug } = useParams();
  const tournamentData = data?.data?.find((item) => item.uid === slug);
  if (isLoading) {
    if (isLoading) return <Loader show />;
  }

  if (!tournamentData) {
    router.push("/404");
    return null;
  }

  if (isError)
    return <div className="flex justify-center items-center min-h-screen w-full">Error fetching detail tournaments</div>;

  return (
    <main className="w-full font-plus-jakarta-sans  bg-grid">
      <header
        className={`h-[300px] md:h-[400px] bg-cover bg-center shadow-xl`}
        style={{
          backgroundImage: `url(https://i.pinimg.com/originals/c8/e4/a4/c8e4a43c650380749e13eff5d0ea6f6d.jpg)`,
        }}
      ></header>
      <section className="flex flex-col w-full lg:px-26 py-14 gap-10">
        <div className="w-full  flex flex-col gap-3">
          <h1 className="lg:text-6xl 2xl:text-7xl font-bold">{tournamentData.name}</h1>
          <p className="max-w-3xl 2xl:text-xl">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam incidunt, praesentium nobis minus, culpa omnis
            quidem consectetur nam, quis suscipit at reiciendis voluptas dolore. Enim cupiditate voluptas aliquam eos rerum.
          </p>
          <div className="flex flex-col items-start">
            <p className="max-w-3xl flex gap-x-2 2xl:text-xl items-center justify-start">
              <span className="text-xl">📍</span> Location udinus hebat jl. Maulana CS
            </p>
            <p className="max-w-3xl flex gap-2 2xl:text-xl items-center justify-start">
              <span className="text-xl">🕐</span> Dahulu hingga saat ini
            </p>
          </div>
        </div>
        <h1 className="text-4xl 2xl:text-4xl font-bold">Detail Tournament</h1>
        <div className="bg-gray-100 w-full grid md:grid-cols-2 gap-10">
          <div className="bg-gray-400">
            <h2 className="font-semibold">Total Team</h2>
            <h1 className="font-bold text-4xl">100 Team</h1>
          </div>
          <div className="bg-gray-400">
            <h2 className="font-semibold">Total Player</h2>
            <h1 className="font-bold text-4xl">200 Player</h1>
          </div>
        </div>
      </section>
    </main>
  );
}

export default TournamentDetail;
