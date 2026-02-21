"use client";

import { useMemo } from "react";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import { useFormationGeometry } from "@/providers/FormationGeometryProvider";
import { useAssignments } from "@/providers/AssignmentProvider";
import { useSquad } from "@/providers/SquadProvider";

type CellId = string;
const cellId = (row: number, col: number): CellId => `${row}-${col}`;

function DraggableDot({
  id,
  row,
  col,
  className,
}: {
  id: string;
  row: number;
  col: number;
  className: string;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `dot:${id}`, 
      data: { row, col },
    });

  const style: React.CSSProperties = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : {};

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={[
        "absolute top-1/2 -translate-y-1/2 text-center select-none cursor-grab active:cursor-grabbing",
        className,
      ].join(" ")}
      style={style}
    >
      <div
        className={[
          "w-7 h-7 rounded-full border-2 border-green-800 bg-white shadow-md transition-transform",
          isDragging ? "opacity-60 scale-110" : "",
        ].join(" ")}
      />
    </div>
  );
}

function DroppableCell({
  id,
  children,
}: {
  id: CellId;
  children?: React.ReactNode;
}) {
  const { setNodeRef } = useDroppable({ id: `cell:${id}` }); 
  return (
    <div ref={setNodeRef} className="relative border-white/10">
      {children}
    </div>
  );
}

export default function Pitch({ activeId }: { activeId: string | null }) {
  const { grid, positions, selectedKey } = useFormationGeometry();
  const { assignments } = useAssignments();
  const { playersById } = useSquad();

  const dragging = Boolean(activeId);

  const assignedCount = useMemo(
    () => Object.values(assignments).filter((v) => v != null).length,
    [assignments]
  );

  const isFreeMode = selectedKey == null;
  const freeModeFull = isFreeMode && assignedCount >= 11;

  // Only count/render dots that are visible
  const visiblePositions = useMemo(() => {
    if (!freeModeFull) return positions;
    // when full in free mode: only show dots that have a player
    return positions.filter((p) => assignments[p.id] != null);
  }, [positions, assignments, freeModeFull]);

  // For render only: Map cells -> dot info (use visiblePositions)
  const byCell = useMemo(() => {
    const m = new Map<CellId, { id: string; row: number; col: number }>();
    for (const p of visiblePositions)
      m.set(cellId(p.row, p.col), { id: p.id, row: p.row, col: p.col });
    return m;
  }, [visiblePositions]);

  // rowCols must also be based on visible dots, otherwise 4-in-row won't trigger correctly
  const rowCols = useMemo(() => {
    const m = new Map<number, number[]>();
    for (const p of visiblePositions) {
      const list = m.get(p.row) ?? [];
      list.push(p.col);
      m.set(p.row, list);
    }
    return m;
  }, [visiblePositions]);

  // 4-in-a-row spacing tweak
  const xClasses = (row: number, col: number) => {
    const colsInRow = rowCols.get(row) ?? [];
    const isFour = colsInRow.length === 4;
    let cls = "left-1/2 -translate-x-1/2";
    if (isFour) {
      if (col === 2) cls = "left-[60%] -translate-x-1/2"; // push right in its cell
      if (col === 4) cls = "left-[15%] -translate-x-1/2"; // push left in its cell
    }
    return cls;
  };

  return (
    <div className="relative w-full max-w-4xl aspect-2/3 rounded-2xl border-4 border-green-800 overflow-hidden bg-green-600 shadow-xl">

      {/* Pitch markings — purely decorative */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Center line */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-white/20" />
        {/* Center circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[22%] aspect-square rounded-full border border-white/20" />
        {/* Center spot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/30" />
        {/* Top penalty area */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[55%] h-[17%] border-b border-l border-r border-white/20" />
        {/* Bottom penalty area */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[55%] h-[17%] border-t border-l border-r border-white/20" />
        {/* Top 6-yard box */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[28%] h-[7%] border-b border-l border-r border-white/15" />
        {/* Bottom 6-yard box */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[28%] h-[7%] border-t border-l border-r border-white/15" />
      </div>

      <div className="absolute inset-0 grid grid-cols-5 grid-rows-6">
        {Array.from({ length: grid.rows * grid.cols }).map((_, i) => {
          const row = Math.floor(i / grid.cols) + 1;
          const col = (i % grid.cols) + 1;
          const id = cellId(row, col);
          const dot = byCell.get(id);

          return (
            <DroppableCell key={id} id={id}>
              {/* ghost dots while dragging */}
              {dragging && (
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden
                >
                  <div className="w-7 h-7 rounded-full border border-white/30 bg-white/10" />
                </div>
              )}

              {dot && (
                <>
                  <DraggableDot
                    id={dot.id}
                    row={row}
                    col={col}
                    className={xClasses(row, col)}
                  />

                  {assignments[dot.id] != null && (
                    <div
                      className={[
                        "absolute top-1/2 -translate-y-[165%] w-full text-center text-xs font-medium",
                        xClasses(row, col),
                      ].join(" ")}
                    >
                      <span className="px-1.5 py-0.5 rounded-md bg-white/90 shadow-sm text-gray-900 font-semibold whitespace-nowrap">
                        {playersById[assignments[dot.id] as number]?.name ??
                          assignments[dot.id]}
                      </span>
                    </div>
                  )}
                </>
              )}
            </DroppableCell>
          );
        })}
      </div>
    </div>
  );
}
