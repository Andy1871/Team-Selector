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
  setAssignments: Dispatch<SetStateAction<Assignments>>; // allows assignments to update via func or new value of type Assignments
  dotForPlayer: (pid: number | null) => string | null;
};

const AssignmentContext = createContext<Ctx | null>(null);

export function AssignmentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [assignments, setAssignments] = useState<Assignments>({});

  // finding the dotId a certain playerId is assigned to by scanning all assignments
  function dotForPlayer(pid: number | null) {
    if (pid === null) return null;
    const entry = Object.entries(assignments).find(([, playerId]) => playerId === pid);
    return entry ? entry[0] : null;
  }

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
