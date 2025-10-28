"use client";
import React, { createContext, useContext, useMemo, useState, Dispatch, SetStateAction } from "react";
import { FORMATIONS, GRID, FormationKey, Coord } from "@/lib/formations";

type Ctx = {
  grid: typeof GRID;
  selectedKey: FormationKey | null;
  basePositions: Coord[];
  positions: Coord[];
  setPositions: Dispatch<SetStateAction<Coord[]>>;
  setFormation: (key: FormationKey | null) => void;
  /** derived: "row-col" -> dotId for active dots only */
  dotIdByCell: Record<string, string>;
};

const FormationGeometryContext = createContext<Ctx | null>(null);

export function FormationGeometryProvider({ children }: { children: React.ReactNode }) {
  const [selectedKey, setSelectedKey] = useState<FormationKey | null>(null);

  const ALL_DOTS = useMemo<Coord[]>(() => {
    const out: Coord[] = [];
    for (let r = 1; r <= GRID.rows; r++) for (let c = 1; c <= GRID.cols; c++) out.push({ row: r, col: c, id: `${r}-${c}` });
    return out;
  }, []);

  const basePositions = useMemo(() => (selectedKey ? FORMATIONS[selectedKey] : ALL_DOTS), [selectedKey, ALL_DOTS]);
  const [positions, setPositions] = useState<Coord[]>(ALL_DOTS);

  const setFormation = (key: FormationKey | null) => {
    setSelectedKey(key);
    setPositions(key ? [...FORMATIONS[key]] : ALL_DOTS);
  };

  const dotIdByCell = useMemo(() => {
    const o: Record<string, string> = {};
    for (const p of positions) o[`${p.row}-${p.col}`] = p.id;
    return o;
  }, [positions]);

  const value: Ctx = { grid: GRID, selectedKey, basePositions, positions, setPositions, setFormation, dotIdByCell };
  return <FormationGeometryContext.Provider value={value}>{children}</FormationGeometryContext.Provider>;
}

export function useFormationGeometry() {
  const ctx = useContext(FormationGeometryContext);
  if (!ctx) throw new Error("useFormationGeometry must be used within FormationGeometryProvider");
  return ctx;
}
