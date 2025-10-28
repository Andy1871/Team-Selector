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
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id, // dotId
    data: { row, col },
  });

  const style: React.CSSProperties = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

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
          "w-5 h-5 rounded-full border-2 border-green-700 bg-gray-300 shadow",
          isDragging ? "opacity-70 scale-105" : "",
        ].join(" ")}
      />
    </div>
  );
}

// created here, as no smaller components
function DroppableCell({
  id,
  children,
}: {
  id: CellId;
  children?: React.ReactNode;
}) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className="relative border-white/10">
      {children}
    </div>
  );
}

export default function Pitch({ activeId }: { activeId: string | null }) {
  const { grid, positions } = useFormationGeometry();
  const { assignments } = useAssignments();
  const { playersById } = useSquad();

  const dragging = Boolean(activeId);

  // For render only
  const byCell = useMemo(() => {
    const m = new Map<CellId, { id: string; row: number; col: number }>();
    for (const p of positions) m.set(cellId(p.row, p.col), { id: p.id, row: p.row, col: p.col });
    return m;
  }, [positions]);

  // group columns by row to offset when 4 on a row
  const rowCols = useMemo(() => {
    const m = new Map<number, number[]>();
    for (const p of positions) {
      const list = m.get(p.row) ?? [];
      list.push(p.col);
      m.set(p.row, list);
    }
    return m;
  }, [positions]);

  const xClasses = (row: number, col: number) => {
    const colsInRow = rowCols.get(row) ?? [];
    const isFour = colsInRow.length === 4;
    let cls = "left-1/2 -translate-x-1/2";
    if (isFour) {
      if (col === 2) cls = "left-[60%]"; // push right in its cell
      if (col === 4) cls = "left-[15%]"; // push left in its cell
    }
    return cls;
  };

  return (
    <div className="relative w-full max-w-4xl aspect-2/3 rounded-2xl border-4 border-green-700 overflow-hidden bg-green-600">
      <div className="absolute inset-0 grid grid-cols-5 grid-rows-6">
        {/*Array created using grid - mapped grid used to create DoppableCell & DraggableDot defined above*/}
        {Array.from({ length: grid.rows * grid.cols }).map((_, i) => {
          const row = Math.floor(i / grid.cols) + 1;
          const col = (i % grid.cols) + 1;
          const id = cellId(row, col);
          const dot = byCell.get(id);

          {
            /* Renders a droppable cell either empty or with a draggable dot inside of it */
          }
          return (
            <DroppableCell key={id} id={id}>
              {/* ghost dots while dragging */}
              {dragging && (
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden
                >
                  <div className="w-5 h-5 rounded-full border-2 border-green-700/40 bg-gray-300/30" />
                </div>
              )}

              {/* real dots stay above the ghost dots*/}
              {dot && (
                <>
                  <DraggableDot id={dot.id} row={row} col={col} className={xClasses(row, col)} />

                  {/* player label (if assigned) */}
                  {assignments[dot.id] != null && (
                    <div
                      className={[
                        "absolute top-1/2 -translate-y-[150%] w-full text-center text-xs font-medium",
                        xClasses(row, col),
                      ].join(" ")}
                    >
                      <span className="px-1.5 py-0.5 rounded bg-white/80">
                        {playersById[assignments[dot.id] as number]?.name ?? assignments[dot.id]}
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
