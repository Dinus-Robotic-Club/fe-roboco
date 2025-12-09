import { useEffect, useState } from "react";
import CardMatch, { ICardMatch } from "../ui/CardMatch";
import EmptyState from "../ui/Global/not-found-data";
import { getSession } from "next-auth/react";
import CardMatchAdmin from "../match-admin/CardMatchAdmin";

function OngoingMatch({ data }: { data: ICardMatch[] }) {
  const [userRole, setUserRole] = useState<string | null>("");
  useEffect(() => {
    async function getRole() {
      const session = await getSession();
      if (session && session.user) {
        setUserRole(session.user.role);
      }
    }
    getRole();
  }, []);
  if (!data || data.length === 0) {
    return (
      <EmptyState
        variant="public"
        className="w-full max-w-4xl h-auto "
        title="COMING SOON"
        description="Arena Pertandingan Robot Segera Tiba... "
      />
    );
  }

  return (
    <>
      {userRole === "ADMIN"
        ? data?.map((dat) => <CardMatchAdmin key={dat?.uid} data={dat} />)
        : data?.map((dat) => <CardMatch key={dat?.uid} data={dat} />)}
    </>
  );
}

export default OngoingMatch;
