# Squad Selector — Football Lineup Builder

An interactive **tactical lineup builder** built with Next.js 15, TypeScript, and dnd-kit. Pick any Premier League or Championship team, fetch their live squad, choose a formation, and drag-and-drop players onto the pitch. Formation dots can be freely repositioned to create custom tactical shapes on the fly.

**Live demo:** [team-selector-six.vercel.app](https://team-selector-six.vercel.app/) — no login required

![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React 19](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![dnd-kit](https://img.shields.io/badge/dnd--kit-000000?style=for-the-badge&logo=react&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

---

## What It Does

| Feature | Detail |
|---------|--------|
| **Live squad data** | Fetches real player rosters from the API Sports Football API for all 44 Premier League & Championship clubs |
| **12 tactical formations** | 3 at the back, 4 at the back, 5 at the back formations |
| **Drag-and-drop** | Players from squad list to pitch, between dots to swap, or back to list to remove |
| **Formation switching** | Intelligently remaps player assignments when switching formations, preserving continuity |
| **Free positioning** | Dots can be dragged to any grid cell to sculpt custom tactical shapes |
| **Responsive layout** | Pitch full-width on mobile, four-column grid on desktop |

---

## Architecture

The app coordinates three independent concerns — squad data, formation geometry, and player assignments — through a layered context provider system. This keeps each domain isolated and independently testable.

```
SquadProvider               → who the players are (fetched from API)
  └─ FormationGeometryProvider  → where the dots are on the pitch
       └─ AssignmentProvider        → which player is on which dot
              │
              └─ useSquadDnD (hook) → all drag-and-drop logic
```

Each provider owns a single slice of state and exposes a minimal API:

| Provider | Owns | Exposes |
|----------|------|---------|
| `SquadProvider` | Selected team, player map, position grouping | `playersById`, `getBucket()`, setters |
| `FormationGeometryProvider` | Dot positions, active formation, grid config | `positions`, `selectedKey`, `setFormation()`, `setPositions()` |
| `AssignmentProvider` | `dotId → playerId` mapping | `assignments`, `setAssignments()`, `dotForPlayer()` |

Separating geometry from assignments means dots can be dragged without invalidating player assignments, and formation changes can remap assignments without touching geometry until the remap is computed.

---

## Key Engineering Decisions

### 1. Formation Remapping Algorithm

When a user switches formations, players already on the pitch shouldn't disappear — they should follow into the new shape as closely as possible.

The `remapAssignmentsToFormation` function in [StartingFormations.tsx](src/components/StartingFormations.tsx) handles this in three passes:

```typescript
// 1. Keep assignments whose dot ID exists in the new formation unchanged
// 2. Collect "orphaned" players whose dot ID no longer exists
// 3. Place each orphan on the nearest available dot using Manhattan distance

const d = Math.abs(p.row - fromPos.row) + Math.abs(p.col - fromPos.col);
```

Manhattan distance was chosen over Euclidean because the grid is discrete — positional similarity maps more naturally to row/column offsets than straight-line distance.

### 2. Drag-and-Drop Event Routing

dnd-kit fires a single `onDragEnd` event. All six interaction types — player→pitch, player→list, dot→cell, dot→list, swap between dots, and free-mode placement — are handled in one central hook ([useSquadDnD.ts](src/hooks/useSquadDnD.ts)) using a pattern-matching dispatch on source and target IDs:

```
active.id prefix   drop target prefix   → action
──────────────────────────────────────────────────
player:            cell:                → assign player to dot
player:            bucket:              → unassign player
dot:               cell:                → move/swap dots
dot:               bucket:              → unassign player on dot
```

Encoding type information into the drag ID string (`player:42`, `dot:lcb`, `cell:3-2`, `bucket:MID`) avoids the need for complex runtime type guards and makes each branch self-documenting.

### 3. Free Mode vs Formation Mode

When no formation is selected, the pitch accepts up to 11 players on any arbitrary cell. The `isFreeMode` / `freeModeFull` flags in [Pitch.tsx](src/components/Pitch.tsx) control visibility differently:

- In **formation mode**: fixed set of dots defined by the formation geometry
- In **free mode**: dots are created on-demand as players are dropped; hidden once 11 are placed (preventing overflow without a hard error)

### 4. 4-in-a-Row Spacing

The pitch uses a 5-column CSS grid. When four dots share a row (e.g. a flat 4-4-2 midfield), two dots land in the same column — the grid cells are wide enough, but the dots would appear off-centre relative to each other. A computed `xClasses` function in [Pitch.tsx](src/components/Pitch.tsx) detects this case and nudges those dots left/right within their cell using percentage offsets, keeping spacing visually even without disrupting the underlying grid.

### 5. API with Fallback Strategy

The squad endpoint ([src/app/api/squad/[teamId]/route.ts](src/app/api/squad/%5BteamId%5D/route.ts)) tries the `/players/squads` endpoint first (paid API plan), then falls back to `/players?team=&season=2023` (free tier). It paginates up to three pages and normalises the response to a consistent shape regardless of which path succeeded. This made local development possible without a paid API key.

---

## Tech Stack

| Category | Choice | Why |
|----------|--------|-----|
| Framework | Next.js 15 (App Router) | File-based routing, API routes, and Vercel deployment in one package |
| Language | TypeScript 5 | End-to-end type safety across providers, hooks, and API response shapes |
| Drag & Drop | dnd-kit | Accessible, headless, and composable — no opinions on markup or styling |
| Styling | Tailwind CSS v4 + shadcn/ui | Utility-first with a design system for form elements |
| State | React Context + custom hooks | Avoids external state libraries for a project of this scope |
| API | API Sports Football API | Real squad data for all Premier League & Championship clubs |
| Auth | Firebase (scaffolded, WIP) | Infrastructure in place for saving/loading lineups in a future release |
| Deployment | Vercel | Zero-config CI/CD from `main` branch |

---

## Local Setup

```bash
git clone https://github.com/your-username/team-selector-app-updates
cd team-selector-app-updates
npm install
```

Create a `.env.local` file:

```env
# Option A — direct API Sports key
APIFOOTBALL_KEY=your_key_here

# Option B — via RapidAPI
RAPIDAPI_KEY=your_key_here
RAPIDAPI_HOST=api-football-v1.p.rapidapi.com
```

```bash
npm run dev
# open http://localhost:3000
```

---

## Project Structure

```
src/
├── app/
│   ├── api/squad/[teamId]/route.ts   # Squad fetch with fallback strategy
│   ├── page.tsx                       # Root page & DnD context setup
│   └── layout.tsx                     # Root layout with Navbar
├── components/
│   ├── Pitch.tsx                      # Pitch grid, draggable dots, player labels
│   ├── PlayerList.tsx                 # Squad panel with droppable position buckets
│   ├── StartingFormations.tsx         # Formation picker + remapping logic
│   └── SelectTeam.tsx                 # Team dropdown (PL + Championship)
├── providers/
│   ├── SquadProvider.tsx              # Team & player state
│   ├── FormationGeometryProvider.tsx  # Dot positions & formation geometry
│   └── AssignmentProvider.tsx         # Player-to-dot mapping
├── hooks/
│   └── useSquadDnD.ts                 # Central drag-and-drop event handler
└── lib/
    ├── formations.ts                  # Formation dot coordinates (row, col, id)
    └── teams.ts                       # Team names & API Sport IDs
```

---

## Planned Features

- **Save / load lineups** via Firebase Firestore (auth scaffolding already in place)
- **Share lineup** via URL-encoded state
- **Player stats** overlay on hover
