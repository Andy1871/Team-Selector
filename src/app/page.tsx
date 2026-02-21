"use client";
import { useState } from "react";
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { auth } from "./firebase";

import { FormationGeometryProvider } from "@/providers/FormationGeometryProvider";
import { useFormationGeometry } from "@/providers/FormationGeometryProvider";
import { AssignmentProvider } from "@/providers/AssignmentProvider";
import { useAssignments } from "@/providers/AssignmentProvider";
import { useSquadDnD } from "@/hooks/useSquadDnD";
import { SquadProvider } from "@/providers/SquadProvider";

import Pitch from "@/components/Pitch";
import PlayerList from "@/components/PlayerList";
import StartingFormations from "@/components/StartingFormations";
import SelectTeam from "@/components/SelectTeam";

function ClearLineupButton() {
  const { setAssignments } = useAssignments();
  const { setFormation } = useFormationGeometry();

  const handleClear = () => {
    setAssignments({});
    setFormation(null);
  };

  return (
    <button
      onClick={handleClear}
      className="mt-3 w-full py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-500 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all shadow-sm"
    >
      Clear Lineup
    </button>
  );
}

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
      {/*
        Layout:
        - Mobile:  1 col → pitch full width, then [formations | squad] side-by-side below
        - Tablet (md): 2 cols → pitch left, [formations | squad] right (50/50)
        - Desktop (lg): 4 cols → pitch spans 2, formations col 3, squad col 4
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">

        {/* Pitch column */}
        <div className="flex flex-col md:col-span-1 lg:col-span-2">
          <Pitch activeId={activeId} />
          <ClearLineupButton />
        </div>

        {/* Controls: formations + squad — side-by-side at all breakpoints */}
        <div className="grid grid-cols-2 gap-3 md:col-span-1 lg:col-span-2 lg:grid-cols-2">
          <div className="flex flex-col">
            <StartingFormations />
          </div>

          <div className="flex flex-col gap-2">
            <SelectTeam />
            <PlayerList />
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeId ? (
          <div className="w-7 h-7 rounded-full border-2 border-green-800 bg-white shadow-lg ring-2 ring-green-300/40" />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default function Home() {
  // const [user, loading] = useAuthState(auth);

  // if (loading) return <p>Loading...</p>;
  // if (!user) {
  //   return (
  //     <div className="flex flex-col items-center justify-center h-[70vh] text-center">
  //       <h1 className="text-2xl font-semibold mb-4">Team Selector</h1>
  //       <p className="text-gray-600">
  //         Please <span className="font-medium">sign in</span> or{" "}
  //         <span className="font-medium">create an account</span> to use the team selector.
  //       </p>
  //     </div>
  //   );
  // }

  return (
    <SquadProvider>
      <FormationGeometryProvider>
        <AssignmentProvider>
          <div className="mb-4 pt-2">
            <h1 className="font-bold text-2xl tracking-tight text-gray-900 mb-1.5">
              Build Your Lineup
            </h1>
            <p className="text-sm text-gray-500 max-w-2xl leading-relaxed">
              Pick a Premier League or Championship team, choose a formation, then drag players onto the pitch.
              Reposition formation dots freely to create custom shapes.{" "}
              <span className="text-gray-400">Drag a player back to the squad panel to remove them.</span>
            </p>
          </div>
          <SquadCanvas />
        </AssignmentProvider>
      </FormationGeometryProvider>
    </SquadProvider>
  );
}
