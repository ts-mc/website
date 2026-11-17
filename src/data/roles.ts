export type RoleEntry = {
  name: string;
  gradient: readonly [string, string];
  /** Match this public staff headline when listing the role's known members. */
  staffHeadline?: string;
  directory?: "active" | "retired";
  level?: number;
};

export const ROLES: RoleEntry[] = [
  { name: "TheySix", gradient: ["#d4843d", "#fffb00"], staffHeadline: "Server Owner", directory: "active" },
  { name: "Manager", gradient: ["#f85db5", "#ff0004"], staffHeadline: "Manager", directory: "active" },
  { name: "Admin", gradient: ["#ff0000", "#ffa3cb"], staffHeadline: "Admin", directory: "active" },
  { name: "Head Moderator", gradient: ["#7f3aff", "#f763f8"], staffHeadline: "Head Moderator", directory: "active" },
  { name: "Moderator", gradient: ["#6186eb", "#b2f9ff"], staffHeadline: "Moderator", directory: "active" },
  { name: "Helper", gradient: ["#4cadd0", "#b2f9ff"], staffHeadline: "Helper", directory: "active" },
  { name: "Staff Team", gradient: ["#8799ae", "#f1f7ff"], staffHeadline: "Staff Team", directory: "active" },
  { name: "Dev Team", gradient: ["#347fd5", "#aacfff"] },
  { name: "YouTube Team", gradient: ["#dd3b3b", "#ff4a4d"] },
  { name: "Designing Team", gradient: ["#369876", "#71ff9e"] },
  { name: "Retired", gradient: ["#b700ff", "#0073ff"], directory: "retired" },
  { name: "1.22 before GTA 6", gradient: ["#4cadd0", "#b2f9ff"] },
  { name: "TheySixWeen", gradient: ["#ff5a00", "#ffb72f"] },
  { name: "Contributor", gradient: ["#c8ccce", "#00a19b"] },
  { name: "VIP (Boosters)", gradient: ["#f47fff", "#b44cff"] },
  { name: "Infinity [125+]", gradient: ["#ba35ff", "#b237d2"], level: 125 },
  { name: "Invasion [110+]", gradient: ["#5bbf63", "#a9ed70"], level: 110 },
  { name: "Purpeille [95+]", gradient: ["#f63aa5", "#e638b5"], level: 95 },
  { name: "Void Steel [80+]", gradient: ["#883bff", "#8965f5"], level: 80 },
  { name: "Sculk [65+]", gradient: ["#30c6de", "#58b9dc"], level: 65 },
  { name: "Echo Shard [50+]", gradient: ["#d8dce0", "#9ca9b8"], level: 50 },
  { name: "Emerald [40+]", gradient: ["#32d86a", "#4ab266"], level: 40 },
  { name: "Diamond [30+]", gradient: ["#19d7f5", "#38acd7"], level: 30 },
  { name: "Gold [25+]", gradient: ["#ffc928", "#e8b821"], level: 25 },
  { name: "Amethyst [20+]", gradient: ["#c13be6", "#9f46d1"], level: 20 },
  { name: "Redstone [15+]", gradient: ["#f04b44", "#d84742"], level: 15 },
  { name: "Copper [10+]", gradient: ["#e68d48", "#c66e3f"], level: 10 },
  { name: "Quartz [5+]", gradient: ["#e5e0d9", "#bcb9b4"], level: 5 },
  { name: "Beta Tester", gradient: ["#d43d3d", "#ffec00"] },
  { name: "Member", gradient: ["#8799ae", "#f1f7ff"] },
];

export const LEVEL_ROLES = ROLES.filter((role) => role.level !== undefined);
export const NON_LEVEL_ROLES = ROLES.filter((role) => role.level === undefined);
