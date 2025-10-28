"use client";
import { useFormationGeometry } from "@/providers/FormationGeometryProvider";
import type { FormationKey } from "@/lib/formations";
import { startingFormations } from "@/static-data";

export default function StartingFormations() {
  const { selectedKey, setFormation } = useFormationGeometry();

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
                  onClick={() => setFormation(f as FormationKey)}
                  className={`py-1.5 rounded-md border text-sm font-medium transition-colors
                    ${isActive
                      ? "border-green-700 bg-yellow-200"
                      : "border-gray-300 bg-gray-100 hover:bg-gray-200 hover:border-gray-400"}`}
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
