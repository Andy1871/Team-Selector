"use client";
import { useEffect, useState } from "react";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import { useSquad } from "@/providers/SquadProvider";
import { useAssignments } from "@/providers/AssignmentProvider";

type Player = {
  id: number;
  name: string;
  position?: string | null;
  number?: number | null;
  age?: number | null;
  nationality?: string | null;
};

type ApiSquadResp = { response?: Array<{ players?: Player[] }> };
type Buckets = { GK: Player[]; DEF: Player[]; MID: Player[]; FWD: Player[] };


// Draggable row

function PlayerRow({ p }: { p: Player }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `player:${p.id}`,
    data: { playerId: p.id, position: p.position ?? "" },
  });
  const style: React.CSSProperties = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : {};

  return (
    <li
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="flex items-center justify-between py-1.5 px-2 -mx-2 rounded-lg cursor-grab active:cursor-grabbing hover:bg-green-50 transition-colors"
      style={style}
      data-player-id={p.id}
      data-player-pos={p.position ?? ""}
    >
      <span className="text-sm text-gray-800 truncate">{p.name}</span>
      <span className="text-xs font-mono bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded ml-2 shrink-0">{p.number ?? "—"}</span>
    </li>
  );
}

const BUCKET_BADGE: Record<string, string> = {
  GK:  "bg-yellow-100 text-yellow-800",
  DEF: "bg-blue-100  text-blue-800",
  MID: "bg-green-100 text-green-800",
  FWD: "bg-red-100   text-red-800",
};

// Droppable bucket
function BucketSection({
  title,
  code,
  children,
  count,
}: {
  title: string;
  code: "GK" | "DEF" | "MID" | "FWD";
  children: React.ReactNode;
  count: number;
}) {
  const { setNodeRef } = useDroppable({ id: `bucket:${code}` });
  return (
    <section ref={setNodeRef} className="mt-4 first:mt-0">
      <div className="flex items-center gap-2 mb-1">
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${BUCKET_BADGE[code]}`}>
          {code}
        </span>
        <h3 className="font-semibold text-sm text-gray-700">
          {title}
        </h3>
        <span className="text-xs text-muted-foreground ml-auto">({count})</span>
      </div>
      {children}
    </section>
  );
}

export default function PlayerList() {
  const { selectedTeamId, selectedTeamName, setPlayersById, getBucket } = useSquad();
  const { assignments } = useAssignments();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const { setNodeRef: setAutoRef } = useDroppable({ id: "bucket:AUTO" });

  useEffect(() => {
    if (!selectedTeamId) return;
    let cancelled = false;

    setLoading(true);
    setErr(null);

    fetch(`/api/squad/${selectedTeamId}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data: ApiSquadResp) => {
        if (cancelled) return;
        const squad = data?.response?.[0]?.players;
        const list = Array.isArray(squad) ? squad : [];
        setPlayers(list);

        // expose players map for Pitch labels
        const map = Object.fromEntries(
          list.map((p) => [p.id, { id: p.id, name: p.name, position: p.position ?? null }])
        );
        setPlayersById(map);
      })
      .catch((e) => {
        if (cancelled) return;
        console.error(e);
        setErr("Failed to load squad");
        setPlayers([]);
        setPlayersById({});
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedTeamId, setPlayersById]);

  if (!selectedTeamId) {
    return (
      <div className="border border-dashed border-gray-200 rounded-xl p-4 shadow-sm text-center">
        <p className="text-sm text-gray-400">Select a team above to load the squad</p>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="border rounded-xl p-4 shadow-sm text-center">
        <p className="text-sm text-gray-500 animate-pulse">Loading {selectedTeamName ?? "team"} squad…</p>
      </div>
    );
  }
  if (err) {
    return (
      <div className="border border-red-200 rounded-xl p-4 shadow-sm text-center">
        <p className="text-sm text-red-500">{err}</p>
      </div>
    );
  }

  //group players into their position groups using getBucket function
  const grouped = players.reduce<Buckets>(
    (acc, p) => {
      acc[getBucket(p.position)].push(p);
      return acc;
    },
    { GK: [], DEF: [], MID: [], FWD: [] }
  );

  const sortFn = (a: Player, b: Player) =>
    (a.number ?? Infinity) - (b.number ?? Infinity) || a.name.localeCompare(b.name);

  grouped.GK.sort(sortFn);
  grouped.DEF.sort(sortFn);
  grouped.MID.sort(sortFn);
  grouped.FWD.sort(sortFn);

  // Remove players already assigned to a dot
  const assignedIds = new Set(Object.values(assignments).filter(Boolean) as number[]);
  const filtered = {
    GK: grouped.GK.filter((p) => !assignedIds.has(p.id)),
    DEF: grouped.DEF.filter((p) => !assignedIds.has(p.id)),
    MID: grouped.MID.filter((p) => !assignedIds.has(p.id)),
    FWD: grouped.FWD.filter((p) => !assignedIds.has(p.id)),
  };

  return (
    <div ref={setAutoRef} className="border border-gray-100 rounded-xl p-4 shadow-sm bg-white">
      <BucketSection title="Goalkeepers" code="GK" count={filtered.GK.length}>
        {filtered.GK.length === 0 ? (
          <p className="text-sm text-muted-foreground mt-2">None</p>
        ) : (
          <ul className="space-y-1 mt-2">
            {filtered.GK.map((p) => (
              <PlayerRow key={p.id} p={p} />
            ))}
          </ul>
        )}
      </BucketSection>

      <BucketSection title="Defenders" code="DEF" count={filtered.DEF.length}>
        {filtered.DEF.length === 0 ? (
          <p className="text-sm text-muted-foreground mt-2">None</p>
        ) : (
          <ul className="space-y-1 mt-2">
            {filtered.DEF.map((p) => (
              <PlayerRow key={p.id} p={p} />
            ))}
          </ul>
        )}
      </BucketSection>

      <BucketSection title="Midfielders" code="MID" count={filtered.MID.length}>
        {filtered.MID.length === 0 ? (
          <p className="text-sm text-muted-foreground mt-2">None</p>
        ) : (
          <ul className="space-y-1 mt-2">
            {filtered.MID.map((p) => (
              <PlayerRow key={p.id} p={p} />
            ))}
          </ul>
        )}
      </BucketSection>

      <BucketSection title="Forwards" code="FWD" count={filtered.FWD.length}>
        {filtered.FWD.length === 0 ? (
          <p className="text-sm text-muted-foreground mt-2">None</p>
        ) : (
          <ul className="space-y-1 mt-2">
            {filtered.FWD.map((p) => (
              <PlayerRow key={p.id} p={p} />
            ))}
          </ul>
        )}
      </BucketSection>
    </div>
  );
}
