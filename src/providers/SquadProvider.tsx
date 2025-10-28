"use client";
import React, { createContext, useContext, useState } from "react";

export type PlayersById = Record<number, { id: number; name: string; position?: string | null }>;

type Ctx = {
  playersById: PlayersById;
  setPlayersById: (m: PlayersById) => void;
  getBucket: (pos?: string | null) => "GK" | "DEF" | "MID" | "FWD";
  selectedTeamId: number | null;
  selectedTeamName: string | null;
  setSelectedTeamId: React.Dispatch<React.SetStateAction<number | null>>;
  setSelectedTeamName: React.Dispatch<React.SetStateAction<string | null>>;
};

const SquadContext = createContext<Ctx | null>(null);

const getBucket = (pos?: string | null) => {
  const p = (pos ?? "").toLowerCase();
  if (p.includes("keeper") || p === "gk" || p === "goalkeeper") return "GK";
  if (p.includes("def") || p === "df" || p === "defender") return "DEF";
  if (p.includes("mid") || p === "mf" || p === "midfielder") return "MID";
  return "FWD";
};

export function SquadProvider({ children }: { children: React.ReactNode }) {
  const [playersById, setPlayersByIdState] = useState<PlayersById>({});
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [selectedTeamName, setSelectedTeamName] = useState<string | null>(null);

  return (
    <SquadContext.Provider
      value={{
        playersById,
        setPlayersById: setPlayersByIdState,
        getBucket,
        selectedTeamId,
        selectedTeamName,
        setSelectedTeamId,
        setSelectedTeamName,
      }}
    >
      {children}
    </SquadContext.Provider>
  );
}

export function useSquad() {
  const ctx = useContext(SquadContext);
  if (!ctx) throw new Error("useSquad must be used within SquadProvider");
  return ctx;
}
