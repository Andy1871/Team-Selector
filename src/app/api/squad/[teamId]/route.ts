// app/api/squad/[teamId]/route.ts
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

type SquadLike = { response: Array<{ players: any[] }> };

async function fetchJson(url: string, headers: Record<string,string>) {
  const res = await fetch(url, { headers, cache: "no-store" });
  const data = await res.json();
  return { res, data };
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ teamId: string }> }
) {
  const { teamId } = await params;

  // headers: support either APISports direct or RapidAPI
  const directKey = process.env.APIFOOTBALL_KEY;
  const rapidKey = process.env.RAPIDAPI_KEY;
  const headers =
    directKey
      ? { "x-apisports-key": directKey }
      : rapidKey
      ? { "X-RapidAPI-Key": rapidKey, "X-RapidAPI-Host": "v3.football.api-sports.io" }
      : null;

  if (!headers) {
    console.error("[squad] No API key env set (APIFOOTBALL_KEY or RAPIDAPI_KEY).");
    return NextResponse.json({ error: "Server not configured with API key" }, { status: 500 });
  }

  try {
    // 1) Try squads (no season param)
    const squadsUrl = `https://v3.football.api-sports.io/players/squads?team=${teamId}`;
    let { res, data } = await fetchJson(squadsUrl, headers);

    const planErr = data?.errors?.plan || data?.errors?.token;
    const playersLen = Array.isArray(data?.response) ? data.response?.[0]?.players?.length ?? 0 : 0;
    console.log(`[squad] squads team=${teamId} players=${playersLen}`, planErr ? `(err: ${planErr})` : "");

    // If squads worked and has players, return it
    if (res.ok && playersLen > 0) {
      return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
    }

    // 2) Fallback for free plan: use players endpoint with season=2023 (free-access window)
    const season = 2023; // choose 2021-2023 if you like — adjust to your preference
    const page1Url = `https://v3.football.api-sports.io/players?team=${teamId}&season=${season}&page=1`;
    const p1 = await fetchJson(page1Url, headers);
    const first = p1.data;

    if (!p1.res.ok) {
      console.warn("[squad] players fallback upstream error", first?.errors);
      return NextResponse.json({ error: "Upstream error", ...first }, { status: p1.res.status });
    }

    // Collect pages if any (keep it light for free plan)
    const totalPages = Number(first?.paging?.total ?? 1) || 1;
    const allPlayers: any[] = Array.isArray(first?.response) ? first.response : [];

    // pull a couple pages max to avoid rate limits
    for (let page = 2; page <= Math.min(totalPages, 3); page++) {
      const url = `https://v3.football.api-sports.io/players?team=${teamId}&season=${season}&page=${page}`;
      const { data: d } = await fetchJson(url, headers);
      if (Array.isArray(d?.response)) allPlayers.push(...d.response);
    }

    // Normalize players -> { id, name, position, number, age, nationality }
    const normalized = allPlayers.map((r: any) => ({
      id: r.player?.id,
      name: r.player?.name,
      position: r.statistics?.[0]?.games?.position ?? r.player?.position ?? null,
      number: r.statistics?.[0]?.games?.number ?? null,
    })).filter((p: any) => p.id && p.name);

    const normalizedResp: SquadLike = { response: [{ players: normalized }] };

    console.log(`[squad] fallback players team=${teamId} season=${season} players=${normalized.length}`);

    return NextResponse.json(normalizedResp, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("Squad fetch failed:", err);
    return NextResponse.json({ error: "Failed to fetch squad" }, { status: 500 });
  }
}
