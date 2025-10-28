"use client";
import { useState } from "react";
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";

import { FormationGeometryProvider } from "@/providers/FormationGeometryProvider";
import { AssignmentProvider } from "@/providers/AssignmentProvider";
import { useSquadDnD } from "@/hooks/useSquadDnD";
import { SquadProvider } from "@/providers/SquadProvider";

import Pitch from "@/components/Pitch";
import PlayerList from "@/components/PlayerList";
import StartingFormations from "@/components/StartingFormations";
import SelectTeam from "@/components/SelectTeam";


function SquadCanvas() {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));
  const [activeId, setActiveId] = useState<string | null>(null);
  const { onDragEndGlobal, onDragCancelGlobal } = useSquadDnD();

  return (
    <DndContext
      sensors={sensors}
      onDragStart={({ active }) => setActiveId(String(active.id))}
      onDragEnd={(e) => {
        setActiveId(null);
        onDragEndGlobal(e);
      }}
      onDragCancel={() => {
        setActiveId(null);
        onDragCancelGlobal();
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6">
        <div className="flex flex-col items-center md:col-span-2">
          <Pitch activeId={activeId} />
          <div className="gap-4 grid grid-cols-3">
            <button className="mt-6 bg-yellow-500 px-4 py-2 rounded-md font-semibold hover:bg-yellow-600">
              Share
            </button>
            <button className="mt-6 bg-yellow-500 px-4 py-2 rounded-md font-semibold hover:bg-yellow-600">
              Save Lineup
            </button>
            <button className="mt-6 bg-yellow-500 px-4 py-2 rounded-md font-semibold hover:bg-yellow-600">
              Load Lineup
            </button>
          </div>
        </div>

        <div className="flex flex-col">
          <StartingFormations />
        </div>

        <div className="flex flex-col gap-2">
          <SelectTeam />
          <PlayerList />
        </div>
      </div>

      <DragOverlay>
        {activeId ? (
          <div className="w-5 h-5 rounded-full border-2 border-green-700 bg-gray-300 shadow" />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default function Home() {
  const [user, loading] = useAuthState(auth);

  if (loading) return <p>Loading...</p>;
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <h1 className="text-2xl font-semibold mb-4">Team Selector</h1>
        <p className="text-gray-600">
          Please <span className="font-medium">sign in</span> or{" "}
          <span className="font-medium">create an account</span> to use the team selector.
        </p>
      </div>
    );
  }

  return (
    <SquadProvider>
      <FormationGeometryProvider>
        <AssignmentProvider>
          <div className="mb-2">
            <h1 className="font-semibold text-xl mb-2">Welcome to the Squad Selector</h1>
            <p>
              Choose your team, pick a base formation and get creative. Drag positions around to
              create new formations and drag and drop players into position…
            </p>
          </div>
          <SquadCanvas />
        </AssignmentProvider>
      </FormationGeometryProvider>
    </SquadProvider>
  );
}
