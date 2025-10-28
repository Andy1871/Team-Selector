// lib/teams.ts
export type Team = { id: number; name: string; logo?: string };

export const PL_TEAMS: Team[] = [
  { id: 42, name: "Arsenal" },
  { id: 66, name: "Aston Villa" },
  { id: 55, name: "Brentford" },
  { id: 35, name: "Bournemouth" },
  { id: 51, name: "Brighton" },
  { id: 49, name: "Chelsea" },
  { id: 52, name: "Crystal Palace" },
  { id: 45, name: "Everton" },
  { id: 36, name: "Fulham" },
  { id: 63, name: "Leeds United" },
  { id: 40, name: "Liverpool" },
  { id: 50, name: "Manchester City" },
  { id: 33, name: "Manchester United" },
  { id: 34, name: "Newcastle United" },
  { id: 65, name: "Nottingham Forest" },
  { id: 746, name: "Sunderland" },
  { id: 47, name: "Tottenham Hotspur" },
  { id: 48, name: "West Ham United" },
  { id: 39, name: "Wolves" },
];

export const CH_TEAMS: Team[] = [
  { id: 54, name: "Birmingham City" },
  { id: 67, name: "Blackburn Rovers" },
  { id: 56, name: "Bristol City" },
  { id: 1335, name: "Charlton Athletic" },
  { id: 1346, name: "Coventry City" },
  { id: 69, name: "Derby County" },
  { id: 64, name: "Hull City" },
  { id: 57, name: "Ipswich Town" },
  { id: 46, name: "Leicester City" },
  { id: 70, name: "Middlesbrough" },
  { id: 58, name: "Millwall" },
  { id: 71, name: "Norwich Ciy" },
  { id: 1338, name: "Oxford United" },
  { id: 1355, name: "Portsmouth" },
  { id: 59, name: "Preston North End" },
  { id: 72, name: "QPR" },
  { id: 62, name: "Sheffield United" },
  { id: 74, name: "Sheffield Wednesday" },
  { id: 41, name: "Southampton" },
  { id: 75, name: "Stoke City" },
  { id: 76, name: "Swansea" },
  { id: 38, name: "Watford" },
  { id: 60, name: "West Brom" },
  { id: 1837, name: "Wrexham" },
];

// handy lookup
export const TEAM_NAME_BY_ID = new Map<number, string>([
  ...PL_TEAMS.map((t) => [t.id, t.name] as const),
  ...CH_TEAMS.map((t) => [t.id, t.name] as const),
]);
