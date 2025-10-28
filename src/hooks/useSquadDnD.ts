// hooks/useSquadDnD.ts
"use client";
import { DragEndEvent } from "@dnd-kit/core";
import { useAssignments } from "@/providers/AssignmentProvider";
import { useFormationGeometry } from "@/providers/FormationGeometryProvider";
import { useSquad } from "@/providers/SquadProvider";

const CELL_RE = /^(\d+)-(\d+)$/;
const BUCKET_RE = /^bucket:(GK|DEF|MID|FWD)$/;

export function useSquadDnD() {
  const { dotIdByCell, setPositions } = useFormationGeometry();
  const { assignments, setAssignments } = useAssignments();
  const { /* getBucket, playersById */ } = useSquad(); // available if you want later

  const onDragCancelGlobal = () => {};

  const onDragEndGlobal = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const isPlayerDrag = activeId.startsWith("player:");
    const isBucket = BUCKET_RE.test(overId);
    const isAutoBucket = overId === "bucket:AUTO";

 // Player dragged
    if (isPlayerDrag) {
      const playerId = Number(activeId.split(":")[1]);

      // Drop onto a pitch cell ("row-col")
      const cellMatch = overId.match(CELL_RE);
      if (cellMatch) {
        const dotId = dotIdByCell[overId];
        if (!dotId) return; // not an active dot in that cell

        setAssignments((prev) => {
          const next = { ...prev };

          // remove player from any other dot they occupy
          for (const [d, pid] of Object.entries(prev)) {
            if (pid === playerId) next[d] = null;
          }

          // assign to the target dot (replaces any occupant)
          next[dotId] = playerId;
          return next;
        });
        return;
      }

      // Drop anywhere on the list (AUTO) or an explicit bucket → unassign
      if (isAutoBucket || isBucket) {
        setAssignments((prev) => {
          const next = { ...prev };
          for (const d of Object.keys(prev)) {
            if (prev[d] === playerId) next[d] = null;
          }
          return next;
        });
        return;
      }

      // Unknown target: ignore
      return;
    }


    // DOT DRAGGED ON THE PITCH
    const draggedDotId = activeId;

    // Dropped over list/bucket → unassign the player on that dot (dot stays put)
    if (isAutoBucket || isBucket) {
      setAssignments((prev) => {
        if (prev[draggedDotId] == null) return prev;
        return { ...prev, [draggedDotId]: null };
      });
      return;
    }

    // Dropped on a pitch cell → move/swap dots
    const cellMatch = overId.match(CELL_RE);
    if (!cellMatch) return;

    const destRow = parseInt(cellMatch[1], 10);
    const destCol = parseInt(cellMatch[2], 10);

    setPositions((prev) => {
      const fromIdx = prev.findIndex((p) => p.id === draggedDotId);
      if (fromIdx === -1) return prev;

      const { row: fromRow, col: fromCol } = prev[fromIdx];
      if (fromRow === destRow && fromCol === destCol) return prev;

      const next = [...prev];
      const destIdx = next.findIndex((p) => p.row === destRow && p.col === destCol);

      if (destIdx === -1) {
        // move into empty cell
        next[fromIdx] = { ...next[fromIdx], row: destRow, col: destCol };
      } else {
        // swap with the dot currently in the destination cell
        const fromPos = next[fromIdx];
        const destPos = next[destIdx];
        next[fromIdx] = { ...fromPos, row: destPos.row, col: destPos.col };
        next[destIdx] = { ...destPos, row: fromRow, col: fromCol };
      }

      return next;
    });
  };

  return { onDragEndGlobal, onDragCancelGlobal, assignments };
}
