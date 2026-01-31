export type Role = "Tank" | "Heal" | "DPS";

export interface Player {
  name: string;
  classes: string[];
  role: Role;
  sets: string[];
  bars: {
    front: string[];
    back: string[];
  };
  championPoints: {
    warfare: string[];
    fitness: string[];
    craft: string[];
  };
}

export interface RaidTemplate {
  raidName: string;
  players: Player[];
}
