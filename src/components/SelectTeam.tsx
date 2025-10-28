// components/SelectTeam.tsx
"use client";
import { useSquad } from "@/providers/SquadProvider";
import { PL_TEAMS, CH_TEAMS, TEAM_NAME_BY_ID } from "@/lib/teams";
import {
  Select, SelectContent, SelectGroup, SelectItem,
  SelectLabel, SelectSeparator, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export default function SelectTeam() {
  const { selectedTeamId, setSelectedTeamId, setSelectedTeamName } = useSquad();

  return (
    <Select
      value={selectedTeamId?.toString() ?? undefined}
      onValueChange={(v) => {
        const id = Number(v);
        setSelectedTeamId(id);
        setSelectedTeamName(TEAM_NAME_BY_ID.get(id) ?? null);
      }}
    >
      <SelectTrigger className="w-full font-semibold">
        <SelectValue placeholder="Select a Team" />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          <SelectLabel className="text-green-700 font-semibold">
            Premier League ({PL_TEAMS.length})
          </SelectLabel>
          {PL_TEAMS.map((t) => (
            <SelectItem key={t.id} value={t.id.toString()}>
              {t.name}
            </SelectItem>
          ))}
        </SelectGroup>

        <SelectSeparator />

        <SelectGroup>
          <SelectLabel className="text-green-700 font-semibold">
            Championship ({CH_TEAMS.length})
          </SelectLabel>
          {CH_TEAMS.map((t) => (
            <SelectItem key={t.id} value={t.id.toString()}>
              {t.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
