"use client";

import Card from "@/component/dashboard-admin/card";
import FormInputTurney from "@/component/dashboard-admin/form-input";
import Footer from "@/component/ui/Footer";
import Loader from "@/component/ui/Global/loader";
import Navbar from "@/component/ui/Global/Navbar";
import HeaderDashboard from "@/component/ui/HeaderDashboard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useCreateTournament } from "@/hooks/mutations/tournament-mutations";
import { useTournaments } from "@/hooks/queries/useTournaments";
import { nav_admin } from "@/lib";
import { ICreateTournament, StageType } from "@/lib/types/type";
import { useState } from "react";

const Page = () => {
  const { data, isLoading, isError } = useTournaments();
  const { mutate, isPending } = useCreateTournament();

  const [isStage, setIsStage] = useState<StageType | null>(null);
  const [isForm, setIsForm] = useState<ICreateTournament>({
    name: "",
    slug: "",
    stageType: null,
    startDate: "",
    description: "",
    endDate: "",
    image: null,
    location: "",
    playoffType: null,
  });

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();

    Object.entries(isForm).forEach(([key, value]) => {
      if (value === null || value === undefined) return;

      if (value instanceof File) {
        formData.append(key, value);
        return;
      }

      formData.append(key, String(value));
    });

    mutate(formData);
  };

  if (isLoading) return <Loader show />;

  if (isError) return <div className="flex justify-center items-center min-h-screen w-full">Error fetching tournaments</div>;

  return (
    <div className="w-full min-h-screen bg-grid">
      <Navbar left={nav_admin.left} right={nav_admin.right} />
      <HeaderDashboard title="DASHBOARD" name="Admin" />

      <main className=" w-full p-4 md:p-6 mb-20 ">
        <p className={`px-4 py-1 rounded-sm transition-all duration-400 text-sm lg:text-base w-full text-center`}>
          TOURNAMENT LIST
        </p>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mt-20">
          {data?.data?.map((t) => (
            <Card data={t} key={t.uid} />
          ))}
        </div>
        <div className="flex justify-center items-center mt-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Buat Turnamen</Button>
            </DialogTrigger>

            <FormInputTurney
              isForm={isForm}
              setIsForm={setIsForm}
              isStage={isStage}
              setIsStage={setIsStage}
              submitForm={submitForm}
              isPending={isPending}
            />
          </Dialog>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Page;
