"use client";
import React, {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

type Assignments = Record<string /*dotId*/, number /*playerId*/ | null>;
type Ctx = {
  assignments: Assignments;
  setAssignments: Dispatch<SetStateAction<Assignments>>;
  dotForPlayer: (pid: number | null) => string | null;
};

const AssignmentContext = createContext<Ctx | null>(null);

export function AssignmentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [assignments, setAssignments] = useState<Assignments>({});

  const dotForPlayer = (pid: number | null) =>
    pid == null
      ? null
      : Object.entries(assignments).find(([, v]) => v === pid)?.[0] ?? null;

  return (
    <AssignmentContext.Provider
      value={{ assignments, setAssignments, dotForPlayer }}
    >
      {children}
    </AssignmentContext.Provider>
  );
}

export function useAssignments() {
  const ctx = useContext(AssignmentContext);
  if (!ctx)
    throw new Error("useAssignments must be used within AssignmentProvider");
  return ctx;
}
