"use client";
import { DragEndEvent } from "@dnd-kit/core";
import { useAssignments } from "@/providers/AssignmentProvider";
import { useFormationGeometry } from "@/providers/FormationGeometryProvider";

const CELL_RE = /^cell:(\d+)-(\d+)$/;
const BUCKET_RE = /^bucket:(GK|DEF|MID|FWD)$/;

export function useSquadDnD() {
  const { dotIdByCell, setPositions } = useFormationGeometry();
  const { setAssignments } = useAssignments();

  const onDragCancelGlobal = () => {};

  const onDragEndGlobal = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const isPlayerDrag = activeId.startsWith("player:");
    const isDotDrag = activeId.startsWith("dot:");
    const isBucket = BUCKET_RE.test(overId);
    const isAutoBucket = overId === "bucket:AUTO";

    // -------------------------
    // PLAYER DRAGGED
    // -------------------------
    if (isPlayerDrag) {
      const playerId = Number(activeId.split(":")[1]);

      // Drop onto a pitch cell
      const cellMatch = overId.match(CELL_RE);
      if (cellMatch) {
        const cellKey = `${cellMatch[1]}-${cellMatch[2]}`; // "row-col"
        const dotId = dotIdByCell[cellKey]; // e.g. "lb"
        if (!dotId) return;

        setAssignments((prev) => {
          const next = { ...prev };

          // remove player from any other dot they occupy
          for (const [d, pid] of Object.entries(prev)) {
            if (pid === playerId) next[d] = null;
          }

          // assign to the target dot
          next[dotId] = playerId;
          return next;
        });
        return;
      }

      // Drop anywhere on the list (AUTO) or a bucket => unassign
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

      return;
    }

    // -------------------------
    // DOT DRAGGED
    // -------------------------
    if (!isDotDrag) return;

    const draggedDotId = activeId.split(":")[1]; // ✅ "lb" etc.

    // Dropped over list/bucket → unassign player on that dot
    if (isAutoBucket || isBucket) {
      setAssignments((prev) => {
        if (prev[draggedDotId] == null) return prev;
        return { ...prev, [draggedDotId]: null };
      });
      return;
    }

    // Dropped on a pitch cell → move/swap dots (row/col only, NEVER id)
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
        next[fromIdx] = { ...next[fromIdx], row: destRow, col: destCol };
      } else {
        const fromPos = next[fromIdx];
        const destPos = next[destIdx];
        next[fromIdx] = { ...fromPos, row: destPos.row, col: destPos.col };
        next[destIdx] = { ...destPos, row: fromRow, col: fromCol };
      }

      return next;
    });
  };

  return { onDragEndGlobal, onDragCancelGlobal };
}
