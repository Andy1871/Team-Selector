# Football Lineup Creator

An interactive **Next.js lineup builder** that lets users pick an English football team, view their squad, and build tactical formations using **drag-and-drop**. Players can be dragged from a squad list onto formation dots on the pitch, swapped around, or removed back to the list.

Real squad data is fetched dynamically via the **API Sports Football API**, and advanced UI behaviour is powered by React state management using custom **context providers**.

**Live demo:** [https://<your-vercel-url>.vercel.app
](https://team-selector-six.vercel.app/)
---

## Features

### Drag-and-Drop Lineup Builder
- Move players directly onto the pitch using **dnd-kit**.
- Drag players between pitch positions or remove them back to their positional buckets in the list.
- Swap or reposition formation dots to modify tactics.

### Formation Control
- Choose from a small number of predefined formations.
- Formation geometry stored in provider state.
- Dots can be freely dragged to create custom shape variations.

### Real Team & Squad Data
- Select any team in the **Premier League** & **Championship**.
- Team selection triggers live squad fetch via API.
- Players grouped by role: GK / DEF / MID / FWD.

### Firebase Authentication (WIP)
- Built-in auth system ready for future features:
  - Save favourite tactical shapes
  - Load previous lineups
- Temporarily disabled for simplified demo - code commented out throught the apps files.

---

## Architecture Overview

This app uses **React Context Providers** to coordinate shared state:

| Provider | Responsibility |
|----------|---------------|
| `SquadProvider` | Stores selected team, squad data, and helpers for grouping players |
| `FormationGeometryProvider` | Manages formation layouts, dot positions, and cell-to-dot mapping |
| `AssignmentProvider` | Tracks which player is assigned to which dot |
| Custom Hook: `useSquadDnD` | Central logic for drag-and-drop assignment & swapping |


## Tech Stack

| Category | Technology |
|-----------|-------------|
| Framework | Next.js |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Drag & Drop | dnd-kit |
| Auth | Firebase (WIP) |
| API | API Sports |
| State | React Context Providers |
| Deployment | Vercel |

---




