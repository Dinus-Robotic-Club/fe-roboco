import React from "react";
import CardMatch from "../ui/CardMatch";

function HistoryMatch() {
  const loop = [1, 2];
  return (
    <>
      {loop.map((number) => (
        <CardMatch key={number} />
      ))}
    </>
  );
}

export default HistoryMatch;
