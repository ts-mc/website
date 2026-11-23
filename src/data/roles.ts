export type RoleEntry = {
  name: string;
  gradient: readonly [string, string];
  /** Match this public staff headline when listing the role's known members. */
  staffHeadline?: string;
  directory?: "active" | "retired";
  level?: number;
  discordId?: string;
  event?: boolean;
};

export const ROLES: RoleEntry[] = [
  { name: "TempVoice", discordId: "1342814509370310658", gradient: ["#b0b6e7", "#d7dcff"] },
  { name: "Security", discordId: "1215807322081853533", gradient: ["#b0b6e7", "#d7dcff"] },
  { name: "+", discordId: "1266167182895743028", gradient: ["#b0b6e7", "#d7dcff"] },
  { name: "DM FOR SUPPORT", discordId: "1558058901604274178", gradient: ["#b0b6e7", "#d7dcff"] },
  { name: "Bots+", discordId: "1342820691468226576", gradient: ["#b0b6e7", "#d7dcff"] },
  { name: "Access", discordId: "995801108180123668", gradient: ["#b0b6e7", "#d7dcff"] },
  { name: "Patreon", discordId: "1239998752807452705", gradient: ["#b0b6e7", "#d7dcff"] },
  { name: "TheySixSRV", discordId: "1540706262734475327", gradient: ["#b0b6e7", "#d7dcff"] },
  { name: "Dyno", discordId: "1521501505352634522", gradient: ["#b0b6e7", "#d7dcff"] },
  { name: "Ticket Tool", discordId: "1556690549388476456", gradient: ["#b0b6e7", "#d7dcff"] },
  { name: "Bots", discordId: "1546109612799959040", gradient: ["#b0b6e7", "#d7dcff"] },
  { name: "TheySix", discordId: "985228848952139866", gradient: ["#d4843d", "#fffb00"], staffHeadline: "Server Owner", directory: "active" },
  { name: "Manager", discordId: "1106015726864699492", gradient: ["#f85db5", "#ff0004"], staffHeadline: "Manager", directory: "active" },
  { name: "Admin", discordId: "985228893080387634", gradient: ["#ff0000", "#ffa3cb"], staffHeadline: "Admin", directory: "active" },
  { name: "Head Moderator", discordId: "1115246680191799296", gradient: ["#7f3aff", "#f763f8"], staffHeadline: "Head Moderator", directory: "active" },
  { name: "Moderator", discordId: "985228926332829706", gradient: ["#6186eb", "#b2f9ff"], staffHeadline: "Moderator", directory: "active" },
  { name: "Helper", discordId: "1106016520762572852", gradient: ["#4cadd0", "#b2f9ff"], staffHeadline: "Helper", directory: "active" },
  { name: "SinFul Tech", discordId: "1162915368512270346", gradient: ["#40ed11", "#40ed11"] },
  { name: "Developer", discordId: "1572263978837741668", gradient: ["#69aaff", "#69aaff"] },
  { name: "Retired", discordId: "1460406228722127077", gradient: ["#ad48ff", "#ad48ff"], directory: "retired" },
  { name: "Partner", discordId: "1380929134993211473", gradient: ["#ed80ba", "#ed80ba"] },
  { name: "HELP", discordId: "1563185329714765854", gradient: ["#ff615d", "#ff615d"] },
  { name: "Staff", discordId: "1118591747472228482", gradient: ["#d6dde9", "#d6dde9"], staffHeadline: "Staff Team", directory: "active" },
  { name: "Trial Staff", discordId: "1401993036564529183", gradient: ["#ee79d7", "#ee79d7"] },
  { name: "Designer", discordId: "1074156504820756542", gradient: ["#57d39b", "#57d39b"] },
  { name: "Farm Designer", discordId: "1145849247569281074", gradient: ["#9dc7a6", "#9dc7a6"] },
  { name: "YouTuber", discordId: "1106306224187773019", gradient: ["#ff625e", "#ff625e"] },
  { name: "Content Creator", discordId: "1128787540401475696", gradient: ["#fe5757", "#fe5757"] },
  { name: "Magma", discordId: "1106301773167218720", gradient: ["#fc895d", "#fc895d"], event: true },
  { name: "Star", discordId: "1106301750366974073", gradient: ["#eeeeee", "#eeeeee"], event: true },
  { name: "Mystic", discordId: "1106301780389793872", gradient: ["#ff6655", "#ff6655"], event: true },
  { name: "Obsidian", discordId: "1106302348487295137", gradient: ["#e457ac", "#e457ac"], event: true },
  { name: "1.22 Before GTA 6", discordId: "1447354024805269595", gradient: ["#60c6df", "#60c6df"], event: true },
  { name: "TheySixWeen", discordId: "1564703824420282448", gradient: ["#ff932a", "#ff932a"], event: true },
  { name: "Contributor", discordId: "1559948356707684362", gradient: ["#75c6c0", "#75c6c0"] },
  { name: "VIP", discordId: "1145467796088692757", gradient: ["#ed87ff", "#ed87ff"] },
  { name: "TSE Player", discordId: "1538561600682991666", gradient: ["#72cde4", "#72cde4"] },
  { name: "Friends", discordId: "1128787409136525372", gradient: ["#dbf794", "#dbf794"] },
  { name: "Infinity [125+]", discordId: "1238983932570243163", gradient: ["#ba35ff", "#b237d2"], level: 125 },
  { name: "Invasion [110+]", discordId: "1238984133695508570", gradient: ["#5bbf63", "#a9ed70"], level: 110 },
  { name: "Purpeille [95+]", discordId: "1238983787883528342", gradient: ["#f63aa5", "#e638b5"], level: 95 },
  { name: "Void Steel [80+]", discordId: "1238982607455391764", gradient: ["#883bff", "#8965f5"], level: 80 },
  { name: "Sculk [65+]", discordId: "1238982431760187403", gradient: ["#30c6de", "#58b9dc"], level: 65 },
  { name: "Echo Shard [50+]", discordId: "1238981604949626960", gradient: ["#d8dce0", "#9ca9b8"], level: 50 },
  { name: "Emerald [40+]", discordId: "1238981480718401608", gradient: ["#32d86a", "#4ab266"], level: 40 },
  { name: "Diamond [30+]", discordId: "1116392729514086482", gradient: ["#19d7f5", "#38acd7"], level: 30 },
  { name: "Gold [25+]", discordId: "1116392740863868968", gradient: ["#ffc928", "#e8b821"], level: 25 },
  { name: "Amethyst [20+]", discordId: "1116392745930604596", gradient: ["#c13be6", "#9f46d1"], level: 20 },
  { name: "Redstone [15+]", discordId: "1116392751462891570", gradient: ["#f04b44", "#d84742"], level: 15 },
  { name: "Copper [10+]", discordId: "1116392756542197790", gradient: ["#e68d48", "#c66e3f"], level: 10 },
  { name: "Quartz [5+]", discordId: "1116392759998296204", gradient: ["#e5e0d9", "#bcb9b4"], level: 5 },
  { name: "Beta Tester", discordId: "1394714699224055928", gradient: ["#d43d3d", "#ffec00"] },
  { name: "Member", discordId: "985228971849429012", gradient: ["#8799ae", "#f1f7ff"] },
  { name: "Bedrock & PE", discordId: "1235361557307723776", gradient: ["#afc8d4", "#d1dcdf"] },
  { name: "Java Edition", discordId: "1235362094518501417", gradient: ["#afc8d4", "#d1dcdf"] },
  { name: ".poll", discordId: "1559958691426471976", gradient: ["#afc8d4", "#d1dcdf"] },
  { name: ".update", discordId: "1559958769058975866", gradient: ["#afc8d4", "#d1dcdf"] },
  { name: "@everyone", gradient: ["#afc8d4", "#d1dcdf"] },
];

export const LEVEL_ROLES = ROLES.filter((role) => role.level !== undefined);
export const EVENT_ROLES = ROLES.filter((role) => role.event);
export const NON_LEVEL_ROLES = ROLES.filter((role) => role.level === undefined && !role.event);
