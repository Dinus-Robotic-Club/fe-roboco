import CardMatch from "@/component/ui/CardMatch";
import Footer from "@/component/ui/Footer";
import Navbar from "@/component/ui/Navbar";
import { nav_dashboard } from "@/lib";
import Image from "next/image";

function Dashboard() {
  const items = [1, 2, 3];
  return (
    <main className="bg-grid">
      <Navbar left={nav_dashboard.left} right={nav_dashboard.right} />
      <div className="h-[300px] md:h-[400px] bg-white w-full flex flex-col justify-center items-center pt-[70px] 2xl:pt-20 font-plus-jakarta-sans shadow-xl">
        <h1 className="font-extrabold text-3xl lg:text-5xl 2xl:text-[53px]">DASHBOARD TEAM</h1>
        <p className="text-base lg:text-xl 2xl:text-2xl">Selamat datang, Team Nee Guzz</p>
      </div>
      <div className="w-full h-auto py-12 px-3 flex flex-col items-center font-plus-jakarta-sans">
        <div className="flex flex-col gap-16 items-center">
          <h1 className="text-xl">TEAM PROFILE</h1>
          <div className="flex flex-col lg:flex-row gap-24">
            <div className="flex flex-col justify-between gap-16 md:gap-20 lg:gap-0 md:h-[400px]">
              <div className="flex w-full gap-2 justify-center lg:justify-start">
                <div className="bg-logo-team w-[70px] h-[70px]">
                  <Image src="/logo-only.svg" alt="" height={30} width={30} className="w-full h-full p-2 " />
                </div>
                <div className="flex flex-col justify-center">
                  <h1 className="text-3xl lg:text-4xl font-bold">TEAM Nee Guzz</h1>
                  <p className="text-base lg:text-xl">SMK N 7 Kota Semarang’s Basis</p>
                </div>
              </div>
              <div className="flex flex-col gap-10">
                <div className="w-full grid gap-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2">
                  <div className="flex flex-col items-center lg:items-start">
                    <h1 className="font-bold text-4xl">#5</h1>
                    <p className="text-base">Basis Standings</p>
                  </div>

                  <div className="flex flex-col items-center lg:items-start">
                    <h1 className="font-bold text-4xl">#4</h1>
                    <p className="text-base">Group Standings</p>
                  </div>

                  <div className="flex flex-col items-center lg:items-start">
                    <h1 className="font-bold text-4xl">15</h1>
                    <p className="text-base">Game Win</p>
                  </div>

                  <div className="flex flex-col items-center lg:items-start">
                    <h1 className="font-bold text-4xl">12</h1>
                    <p className="text-base">Game Lose</p>
                  </div>

                  <div className="flex flex-col items-center lg:items-start">
                    <h1 className="font-bold text-4xl">42</h1>
                    <p className="text-base">Goal Scored</p>
                  </div>

                  <div className="flex flex-col items-center lg:items-start">
                    <h1 className="font-bold text-4xl">25</h1>
                    <p className="text-base">Goal Conceded</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-12 items-end justify-center flex-wrap lg:flex-nowrap">
              <div className="flex flex-col items-center">
                <div className="bg-player min-h-[215px] min-w-[215px]">
                  <Image className="h-80 w-auto pb-2 pl-3" alt="member1" src="/member1.png" height={300} width={200} />
                </div>
                <h1 className="text-2xl font-bold">Player I</h1>
                <p>Team Leader</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="bg-player min-h-[215px] min-w-[215px]">
                  <Image className="h-80 w-auto pb-2 pl-3" alt="member2" src="/member1.png" height={300} width={200} />
                </div>
                <h1 className="text-2xl font-bold">Player II</h1>
                <p>Team Player</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-20 mt-30 mb-12 py-5 w-full items-center justify-center">
          <h1 className="text-xl">MATCH HISTORY</h1>
          <div className="w-full  flex flex-col items-center justify-center gap-3">
            {items.map((items) => (
              <CardMatch key={items} />
            ))}
            <a href="/dashboard/match/history" className="font-plus-jakarta-sans mt-7 text-base md:text-xl">
              WATCH FULL MATCH HISTORY →
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

export default Dashboard;
