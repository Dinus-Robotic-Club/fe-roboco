"use client";
import { useMemo } from "react";
import ControlSoccer from "@/component/match-admin/ControlSoccer";
import { ICardMatch } from "@/component/ui/CardMatch";
import dummyData from "@/lib/dumy.json";
import { useParams, useRouter } from "next/navigation";
import ControlSumo from "@/component/match-admin/ControlSumo";

function MatchControl() {
  const { slug } = useParams();
  const router = useRouter();

  const match = useMemo(() => {
    return (dummyData as ICardMatch[]).find((item) => item.uid === slug) || null;
  }, [slug]);

  if (!match) {
    router.replace("/not-found");
    return null;
  }

  const matchType = match?.category ?? "";

  if (matchType == "SOCCER BOT") {
    return <ControlSoccer matchId={slug as string} />;
  } else if (matchType == "SUMMO BOT") {
    return <ControlSumo matchId={slug as string} />;
  }
}

export default MatchControl;
