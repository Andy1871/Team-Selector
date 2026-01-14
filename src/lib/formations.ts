export type Coord = { row: number; col: number; role?: string; id: string };
export type FormationKey =
  | "3-4-3"
  | "3-5-2"
  | "3-4-1-2"
  | "4-3-3"
  | "4-2-3-1"
  | "4-4-2"
  | "4-1-4-1"
  | "4-3-1-2"
  | "4-2-2-2"
  | "5-3-2"
  | "5-2-3"
  | "5-4-1"; // all current supported formations



const GK: Coord = { row: 6, col: 3, role: "GK", id: "gk" };

export const FORMATIONS: Record<FormationKey, Coord[]> = {

  /* ======================
     3 AT THE BACK (3)
     ====================== */

  "3-4-3": [
    GK,
    { row: 5, col: 2, id: "lcb" },
    { row: 5, col: 3, id: "cb" },
    { row: 5, col: 4, id: "rcb" },
    { row: 3, col: 1, id: "lm" },
    { row: 3, col: 2, id: "lcm" },
    { row: 3, col: 4, id: "rcm" },
    { row: 3, col: 5, id: "rm" },
    { row: 1, col: 1, id: "lw" },
    { row: 1, col: 3, id: "st" },
    { row: 1, col: 5, id: "rw" },
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

  "3-4-1-2": [
    GK,
    { row: 5, col: 2, id: "lcb" },
    { row: 5, col: 3, id: "cb" },
    { row: 5, col: 4, id: "rcb" },
    { row: 3, col: 1, id: "lm" },
    { row: 3, col: 2, id: "lcm" },
    { row: 3, col: 4, id: "rcm" },
    { row: 3, col: 5, id: "rm" },
    { row: 2, col: 3, id: "cam" },
    { row: 1, col: 2, id: "ls" },
    { row: 1, col: 4, id: "rs" },
  ],

  /* ======================
     4 AT THE BACK (6)
     ====================== */

  "4-3-3": [
    GK,
    { row: 5, col: 1, id: "lb" },
    { row: 5, col: 2, id: "lcb" },
    { row: 5, col: 4, id: "rcb" },
    { row: 5, col: 5, id: "rb" },
    { row: 3, col: 2, id: "lcm" },
    { row: 4, col: 3, id: "cm" },
    { row: 3, col: 4, id: "rcm" },
    { row: 2, col: 1, id: "lw" },
    { row: 1, col: 3, id: "st" },
    { row: 2, col: 5, id: "rw" },
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

  "4-1-4-1": [
    GK,
    { row: 5, col: 1, id: "lb" },
    { row: 5, col: 2, id: "lcb" },
    { row: 5, col: 4, id: "rcb" },
    { row: 5, col: 5, id: "rb" },
    { row: 4, col: 3, id: "dm" },
    { row: 3, col: 1, id: "lm" },
    { row: 3, col: 2, id: "lcm" },
    { row: 3, col: 4, id: "rcm" },
    { row: 3, col: 5, id: "rm" },
    { row: 1, col: 3, id: "st" },
  ],

  "4-3-1-2": [
    GK,
    { row: 5, col: 1, id: "lb" },
    { row: 5, col: 2, id: "lcb" },
    { row: 5, col: 4, id: "rcb" },
    { row: 5, col: 5, id: "rb" },
    { row: 3, col: 2, id: "lcm" },
    { row: 4, col: 3, id: "cm" },
    { row: 3, col: 4, id: "rcm" },
    { row: 2, col: 3, id: "cam" },
    { row: 1, col: 2, id: "ls" },
    { row: 1, col: 4, id: "rs" },
  ],

  "4-2-2-2": [
    GK,
    { row: 5, col: 1, id: "lb" },
    { row: 5, col: 2, id: "lcb" },
    { row: 5, col: 4, id: "rcb" },
    { row: 5, col: 5, id: "rb" },
    { row: 4, col: 2, id: "ldm" },
    { row: 4, col: 4, id: "rdm" },
    { row: 2, col: 2, id: "lam" },
    { row: 2, col: 4, id: "ram" },
    { row: 1, col: 2, id: "ls" },
    { row: 1, col: 4, id: "rs" },
  ],

  /* ======================
     5 AT THE BACK (3)
     ====================== */

  "5-3-2": [
    GK,
    { row: 5, col: 1, id: "lwb" },
    { row: 5, col: 2, id: "lcb" },
    { row: 5, col: 3, id: "cb" },
    { row: 5, col: 4, id: "rcb" },
    { row: 5, col: 5, id: "rwb" },
    { row: 3, col: 2, id: "lcm" },
    { row: 4, col: 3, id: "cm" },
    { row: 3, col: 4, id: "rcm" },
    { row: 1, col: 2, id: "ls" },
    { row: 1, col: 4, id: "rs" },
  ],

  "5-2-3": [
    GK,
    { row: 5, col: 1, id: "lwb" },
    { row: 5, col: 2, id: "lcb" },
    { row: 5, col: 3, id: "cb" },
    { row: 5, col: 4, id: "rcb" },
    { row: 5, col: 5, id: "rwb" },
    { row: 3, col: 2, id: "lcm" },
    { row: 3, col: 4, id: "rcm" },
    { row: 1, col: 1, id: "lw" },
    { row: 1, col: 3, id: "st" },
    { row: 1, col: 5, id: "rw" },
  ],

  "5-4-1": [
    GK,
    { row: 5, col: 1, id: "lwb" },
    { row: 5, col: 2, id: "lcb" },
    { row: 5, col: 3, id: "cb" },
    { row: 5, col: 4, id: "rcb" },
    { row: 5, col: 5, id: "rwb" },
    { row: 3, col: 1, id: "lm" },
    { row: 3, col: 2, id: "lcm" },
    { row: 3, col: 4, id: "rcm" },
    { row: 3, col: 5, id: "rm" },
    { row: 1, col: 3, id: "st" },
  ],
};


export const GRID = { cols: 5, rows: 6 }; 

// provides each array index with its own row, col position and id
export const ALL_DOTS: Coord[] = Array.from(
    { length: GRID.rows * GRID.cols },
    (_, i) => {
      const row = Math.floor(i / GRID.cols) + 1;
      const col = (i % GRID.cols) + 1;
      return { row, col, id: `${row}-${col}` };
    }
  );