"use client";

import { useFormationGeometry } from "@/providers/FormationGeometryProvider";
import { useAssignments } from "@/providers/AssignmentProvider";
import type { FormationKey } from "@/lib/formations";
import { FORMATIONS } from "@/lib/formations";
import { startingFormations } from "@/static-data";

function remapAssignmentsToFormation(
  prevAssignments: Record<string, number | null>,
  prevPositions: { id: string; row: number; col: number }[],
  nextPositions: { id: string; row: number; col: number }[]
) {
  const nextIds = new Set(nextPositions.map((p) => p.id));
  const prevPosById = new Map(prevPositions.map((p) => [p.id, p]));

  // 1) keep assignments where dot id exists in next formation
  const nextAssignments: Record<string, number | null> = {};
  for (const [dotId, pid] of Object.entries(prevAssignments)) {
    if (pid == null) continue;
    if (nextIds.has(dotId)) nextAssignments[dotId] = pid;
  }

  const taken = new Set(Object.keys(nextAssignments));

  // 2) collect orphaned players (their dot id doesn't exist in the new formation)
  const orphaned: { pid: number; fromDotId: string }[] = [];
  for (const [dotId, pid] of Object.entries(prevAssignments)) {
    if (pid == null) continue;
    if (!nextIds.has(dotId)) orphaned.push({ pid, fromDotId: dotId });
  }

  // 3) place orphans onto nearest free dot in the new formation
  for (const { pid, fromDotId } of orphaned) {
    const fromPos = prevPosById.get(fromDotId);
    if (!fromPos) continue;

    let bestId: string | null = null;
    let bestDist = Infinity;

    for (const p of nextPositions) {
      if (taken.has(p.id)) continue;
      const d = Math.abs(p.row - fromPos.row) + Math.abs(p.col - fromPos.col);
      if (d < bestDist) {
        bestDist = d;
        bestId = p.id;
      }
    }

    if (bestId) {
      nextAssignments[bestId] = pid;
      taken.add(bestId);
    }
  }

  return nextAssignments;
}

export default function StartingFormations() {
  const { selectedKey, setFormation, positions } = useFormationGeometry();
  const { setAssignments } = useAssignments();

  const pickFormation = (key: FormationKey) => {
    const nextPositions = [...FORMATIONS[key]];

    // Remap assignments so players "follow" into the new formation
    setAssignments((prev) => remapAssignmentsToFormation(prev, positions, nextPositions));

    // Then apply formation geometry
    setFormation(key);
  };

  return (
    <div className="border rounded-xl p-5 flex-1 shadow-sm">
      <h3 className="font-semibold mb-1">Starting Formations</h3>
      <p className="text-sm text-gray-500 mb-4">
        These can be manually changed using drag and drop.
      </p>

      {startingFormations.map((group, i) => (
        <div key={i} className="mb-6">
          <h4 className="font-bold text-green-700 mb-2">{group.title}</h4>
          <div className="flex flex-col gap-2">
            {group.formations.map((f: string, j: number) => {
              const isActive = f === selectedKey;
              return (
                <button
                  key={j}
                  onClick={() => pickFormation(f as FormationKey)}
                  className={`py-1.5 rounded-md border text-sm font-medium transition-colors
                    ${
                      isActive
                        ? "border-green-700 bg-yellow-200"
                        : "border-gray-300 bg-gray-100 hover:bg-gray-200 hover:border-gray-400"
                    }`}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
