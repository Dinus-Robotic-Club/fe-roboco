import React from "react";
import CardMatch from "../ui/CardMatch";

function OngoingMatch() {
  const loop = [1, 2, 3, 4, 5];
  return (
    <>
      {loop.map((number) => (
        <CardMatch key={number} />
      ))}
    </>
  );
}

export default OngoingMatch;
