export type Coord = { row: number; col: number; role?: string; id: string };
export type FormationKey = "4-3-3" | "4-2-3-1" | "3-5-2" | "4-4-2"; // all current supported formations



const GK: Coord = { row: 6, col: 3, role: "GK", id: "gk" }; //reusable position - create all reusable positions when creating more formations.

export const FORMATIONS: Record<FormationKey, Coord[]> = {
  "4-3-3": [
    GK,
    { row: 5, col: 1, role: "LB", id: "lb" },
    { row: 5, col: 2, role: "LCB", id: "lcb" },
    { row: 5, col: 4, role: "RCB", id: "rcb" },
    { row: 5, col: 5, role: "RB", id: "rb" },
    { row: 3, col: 2, role: "LCM", id: "lcm" },
    { row: 4, col: 3, role: "CM", id: "cm" },
    { row: 3, col: 4, role: "RCM", id: "rcm" },
    { row: 2, col: 1, role: "LW", id: "lw" },
    { row: 1, col: 3, role: "ST", id: "st" },
    { row: 2, col: 5, role: "RW", id: "rw" },
  ],
  "4-2-3-1": [
    GK,
    { row: 5, col: 1, id: "lb" },
    { row: 5, col: 2, id: "lcb" },
    { row: 5, col: 4, id: "rcb" },
    { row: 5, col: 5, id: "rb" },
    { row: 4, col: 2, id: "ldm" },
    { row: 4, col: 4, id: "rdm" },
    { row: 2, col: 1, id: "lam" },
    { row: 2, col: 3, id: "cam" },
    { row: 2, col: 5, id: "ram" },
    { row: 1, col: 3, id: "st" },
  ],
  "3-5-2": [
    GK,
    { row: 5, col: 2, id: "lcb" },
    { row: 5, col: 3, id: "cb" },
    { row: 5, col: 4, id: "rcb" },
    { row: 4, col: 1, id: "lwb" },
    { row: 3, col: 2, id: "lcm" },
    { row: 4, col: 3, id: "dm" },
    { row: 3, col: 4, id: "rcm" },
    { row: 4, col: 5, id: "rwb" },
    { row: 1, col: 2, id: "ls" },
    { row: 1, col: 4, id: "rs" },
  ],
  "4-4-2": [
    GK,
    { row: 5, col: 1, id: "lb" },
    { row: 5, col: 2, id: "lcb" },
    { row: 5, col: 4, id: "rcb" },
    { row: 5, col: 5, id: "rb" },
    { row: 3, col: 1, id: "lm" },
    { row: 3, col: 2, id: "lcm" },
    { row: 3, col: 4, id: "rcm" },
    { row: 3, col: 5, id: "rm" },
    { row: 1, col: 2, id: "ls" },
    { row: 1, col: 4, id: "rs" },
  ],
};

export const GRID = { cols: 5, rows: 6 }; 

export const ALL_DOTS: Coord[] = Array.from(
    { length: GRID.rows * GRID.cols },
    (_, i) => {
      const row = Math.floor(i / GRID.cols) + 1;
      const col = (i % GRID.cols) + 1;
      return { row, col, id: `${row}-${col}` };
    }
  );