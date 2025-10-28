"use client";
import { useState } from "react";
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import Pitch from "./Pitch";
import PlayerList from "./PlayerList";
import { useSquadDnD } from "@/hooks/useSquadDnD";
import { useSquad } from "@/providers/SquadProvider";

export default function SquadBuilder() {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));
  const [activeId, setActiveId] = useState<string | null>(null);
  const { onDragEndGlobal, onDragCancelGlobal } = useSquadDnD();
  const { playersById } = useSquad();

  return (
    <DndContext
      sensors={sensors}
      onDragStart={({ active }) => setActiveId(String(active.id))}
      onDragEnd={(e) => {
        setActiveId(null);           // ensure overlay + pitch ghost clear
        onDragEndGlobal(e);          // let shared logic handle the drop
      }}
      onDragCancel={() => {
        setActiveId(null);
        onDragCancelGlobal();
      }}
    >
      <div className="grid md:grid-cols-[1fr_2fr] gap-4">
        <PlayerList />
        <Pitch activeId={activeId} />
      </div>

      <DragOverlay>
        {!activeId ? null : activeId.startsWith("player:") ? (
          // Name chip when dragging from the player list
          <div className="px-2 py-1 rounded bg-white shadow font-medium">
            {playersById[Number(activeId.split(":")[1])]?.name ?? "Player"}
          </div>
        ) : (
          // Dot overlay when dragging a dot on the pitch
          <div className="w-5 h-5 rounded-full border-2 border-green-700 bg-gray-300 shadow" />
        )}
      </DragOverlay>
    </DndContext>
  );
}
