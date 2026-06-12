"use strict";

const STORAGE_KEYS = {
  partners: "roletaSensorial.partners",
  pauseWord: "roletaSensorial.pauseWord",
  session: "roletaSensorial.session",
  sessionArchive: "roletaSensorial.sessionArchive",
  overrideRank: "roletaSensorial.overrideRank",
  gameMode: "roletaSensorial.gameMode",
  musicMuted: "roletaSensorial.musicMuted",
  musicVolume: "roletaSensorial.musicVolume",
  musicRevision: "roletaSensorial.musicRevision",
  preferences: "roletaSensorial.preferences"
};

const SESSION_TTL_MS = 6 * 60 * 60 * 1000;
const MUSIC_REVISION = "4";
const BACKGROUND_TRACK_SRC = "assets/audio/background.mp3";
const BACKGROUND_TRACK_TITLE = "Smooth Dark Type Beat - Tower Beatz";
const DEFAULT_MUSIC_VOLUME = 0.42;

const PROGRESSION_PRESETS = {
  short: {
    2: { minutes: 2, spins: 2 },
    3: { minutes: 4, spins: 4 },
    4: { minutes: 7, spins: 6 },
    5: { minutes: 10, spins: 8 },
    6: { minutes: 14, spins: 10 },
    7: { minutes: 18, spins: 12 },
    8: { minutes: 23, spins: 15 },
    9: { minutes: 30, spins: 18 },
    10: { minutes: 38, spins: 22 },
    11: { minutes: 46, spins: 26 },
    12: { minutes: 55, spins: 30 },
    13: { minutes: 65, spins: 34 },
    14: { minutes: 75, spins: 38 }
  },

  standard: {
    2: { minutes: 3, spins: 4 },
    3: { minutes: 7, spins: 8 },
    4: { minutes: 11, spins: 12 },
    5: { minutes: 15, spins: 16 },
    6: { minutes: 20, spins: 20 },
    7: { minutes: 25, spins: 24 },
    8: { minutes: 31, spins: 28 },
    9: { minutes: 38, spins: 32 },
    10: { minutes: 46, spins: 36 },
    11: { minutes: 55, spins: 40 },
    12: { minutes: 65, spins: 44 },
    13: { minutes: 75, spins: 48 },
    14: { minutes: 85, spins: 52 }
  },

  slow: {
    2: { minutes: 5, spins: 6 },
    3: { minutes: 10, spins: 10 },
    4: { minutes: 16, spins: 14 },
    5: { minutes: 23, spins: 18 },
    6: { minutes: 31, spins: 23 },
    7: { minutes: 40, spins: 28 },
    8: { minutes: 50, spins: 33 },
    9: { minutes: 62, spins: 39 },
    10: { minutes: 74, spins: 45 },
    11: { minutes: 86, spins: 51 },
    12: { minutes: 98, spins: 57 },
    13: { minutes: 110, spins: 63 },
    14: { minutes: 120, spins: 70 }
  }
};

const RANKS = [
  {
    rank: 1,
    phase: "Falas, confissões, sussurros e leitura do clima.",
    short: "Conexão",
    color: "#7c3aed",
    accent: "#a78bfa",
    icon: "whisper",
    image: "assets/fundo-01.jpg",
    caption: "Falas, confissões, sussurros e leitura do clima."
  },
  {
    rank: 2,
    phase: "Mãos, dedos, pressão e descoberta do corpo.",
    short: "Toque",
    color: "#d97706",
    accent: "#f59e0b",
    icon: "massage",
    image: "assets/fundo-02.jpg",
    caption: "Mãos, dedos, pressão e descoberta do corpo."
  },
  {
    rank: 3,
    phase: "Rituais & Rotina",
    short: "Rituais",
    color: "#f59e0b",
    accent: "#fbbf24",
    icon: "ritual",
    image: "assets/fundo-03.jpg",
    caption: "Preparação, respiração e criação de clima."
  },
  {
    rank: 4,
    phase: "Beijos",
    short: "Beijos",
    color: "#f9a8d4",
    accent: "#fbcfe8",
    icon: "kiss",
    image: "assets/fundo-04.jpg",
    caption: "Boca com boca, mordidas e trilhas pelo corpo."
  },
  {
    rank: 5,
    phase: "Desafios & Brincadeiras",
    short: "Desafios",
    color: "#f97316",
    accent: "#fb923c",
    icon: "game",
    image: "assets/fundo-05.jpg",
    caption: "Jogos, imitações, áudios e competição divertida."
  },
  {
    rank: 6,
    phase: "Sensorial",
    short: "Sensorial",
    color: "#38bdf8",
    accent: "#7dd3fc",
    icon: "sensory",
    image: "assets/fundo-06.jpg",
    caption: "Temperatura, texturas, gelo e sopro."
  },
  {
    rank: 7,
    phase: "Strip & Exibição",
    short: "Strip",
    color: "#f2c36b",
    accent: "#fcd34d",
    icon: "strip",
    image: "assets/fundo-04.jpg",
    caption: "Roupa saindo, espelho e voyeurismo."
  },
  {
    rank: 8,
    phase: "Fantasia & Roleplay",
    short: "Fantasia",
    color: "#a855f7",
    accent: "#c084fc",
    icon: "fantasy",
    image: "assets/fundo-09.jpg",
    caption: "Personagens, cenários e teatro erótico."
  },
  {
    rank: 9,
    phase: "Estimulação Manual",
    short: "Manual",
    color: "#fb923c",
    accent: "#fdba74",
    icon: "hand",
    image: "assets/fundo-06.jpg",
    caption: "Masturbação, mão guiada e edging."
  },
  {
    rank: 10,
    phase: "Sexo Oral",
    short: "Oral",
    color: "#ff4778",
    accent: "#fda4af",
    icon: "mouth",
    image: "assets/fundo-09.jpg",
    caption: "Língua, sucção e técnicas detalhadas."
  },
  {
    rank: 11,
    phase: "Poder & Provocação",
    short: "Poder",
    color: "#9f1239",
    accent: "#e11d48",
    icon: "power",
    image: "assets/fundo-10.jpg",
    caption: "Tapas, restrições, ordens e controle."
  },
  {
    rank: 12,
    phase: "Penetração & Clímax",
    short: "Clímax",
    color: "#dc2626",
    accent: "#ef4444",
    icon: "climax",
    image: "assets/fundo-12.jpg",
    caption: "Posições, ritmo e desfecho."
  },
  {
    rank: 13,
    phase: "Surpresa",
    short: "Surpresa",
    color: "#8b5cf6",
    accent: "#a78bfa",
    icon: "surprise",
    image: "assets/fundo-01.jpg",
    caption: "Coringas, adoração e combos inesperados."
  },
  {
    rank: 14,
    phase: "Aftercare",
    short: "Cuidado",
    color: "#10b981",
    accent: "#34d399",
    icon: "aftercare",
    image: "assets/fundo-05.jpg",
    caption: "Pós-sexo, hidratação, carinho e acolhimento."
  }
];

const WEIGHT_MATRIX = {
  1:  [1, 0.35, 0.28, 0.12, 0.08, 0.05, 0, 0, 0, 0, 0, 0, 0.18, 0],
  2:  [0.22, 1, 0.38, 0.28, 0.12, 0.18, 0.05, 0, 0, 0, 0, 0, 0.15, 0],
  3:  [0.08, 0.28, 1, 0.45, 0.32, 0.22, 0.12, 0.08, 0, 0, 0, 0, 0.18, 0],
  4:  [0, 0.12, 0.35, 1, 0.48, 0.38, 0.28, 0.18, 0.12, 0.05, 0, 0, 0.15, 0],
  5:  [0, 0.05, 0.18, 0.35, 1, 0.45, 0.42, 0.32, 0.22, 0.12, 0.08, 0, 0.22, 0],
  6:  [0, 0, 0.08, 0.22, 0.38, 1, 0.52, 0.42, 0.28, 0.22, 0.12, 0.05, 0.18, 0],
  7:  [0, 0, 0, 0.12, 0.28, 0.45, 1, 0.55, 0.48, 0.32, 0.22, 0.08, 0.25, 0],
  8:  [0, 0, 0, 0.05, 0.18, 0.28, 0.42, 1, 0.58, 0.52, 0.38, 0.22, 0.28, 0],
  9:  [0, 0, 0, 0, 0.12, 0.18, 0.32, 0.45, 1, 0.72, 0.58, 0.42, 0.22, 0],
  10: [0, 0, 0, 0, 0, 0.12, 0.22, 0.35, 0.62, 1, 0.78, 0.68, 0.28, 0],
  11: [0, 0, 0, 0, 0, 0.05, 0.15, 0.28, 0.45, 0.68, 1, 0.88, 0.32, 0],
  12: [0, 0, 0, 0, 0, 0, 0.12, 0.25, 0.38, 0.58, 0.78, 1.25, 0.28, 0],
  13: [0.18, 0.18, 0.22, 0.22, 0.28, 0.25, 0.28, 0.28, 0.22, 0.22, 0.22, 0.18, 1, 0],
  14: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.58, 0.35, 1]
};

const AROUSAL_LEVELS = [
  { value: "cold", label: "Frio", score: 0 },
  { value: "warming", label: "Aquecendo", score: 1 },
  { value: "ready", label: "No ponto", score: 2 },
  { value: "high", label: "Muito alto", score: 3 },
  { value: "edge", label: "Quase lá", score: 4 }
];
const DEFAULT_AROUSAL_LEVEL = "warming";
const AROUSAL_LEVEL_MAP = AROUSAL_LEVELS.reduce((acc, level) => {
  acc[level.value] = level;
  return acc;
}, {});

const RANK_SIX_PHASE_VARIANTS = new Set(["sensory", "guided", "direct", "edge", "retreat", "mutual", "display"]);
const CONSENT_LIMITS = ["anal", "throat", "impact", "recording"];
const SESSION_ITEMS = ["lubricant", "massageOil", "vibrator", "analToy", "camera"];

const CLOTHING_STAGE = {
  dressed: 0,
  partial: 1,
  underwear: 2,
  naked: 3
};

const CLOTHING_RULES = {
  "r2-06": { before: { receiver: "naked" } },
  "r2-10": { before: { receiver: "naked" } },
  "r4-01": { before: { receiver: "naked" }, effects: { receiver: "partial" } },
  "r4-03": { before: { actor: "naked" }, effects: { actor: "partial" } },
  "r4-09": { before: { actor: "naked" }, effects: { actor: "partial" } },
  "r4-10": { before: { receiver: "naked" }, effects: { receiver: "partial" } },
  "r4-11": { before: { all: "naked" }, effects: { all: "partial" } },
  "r3-strip-01": { before: { actor: "naked" }, effects: { actor: "partial" } },
  "r3-strip-02": { before: { other: "naked" }, effects: { other: "partial" } },
  "r3-strip-03": { before: { receiver: "naked" }, effects: { receiver: "partial" } },
  "r3-strip-04": { before: { actor: "naked", receiver: "naked" }, effects: { actor: "partial", receiver: "partial" } },
  "r3-strip-05": { before: { receiver: "naked" }, effects: { receiver: "partial" } },
  "r3-strip-06": { before: { actor: "naked" }, effects: { actor: "naked" } },
  "r4-strip-01": { before: { receiver: "underwear" }, effects: { receiver: "underwear" } },
  "r4-strip-02": { before: { receiver: "underwear" }, effects: { receiver: "underwear" } },
  "r4-strip-03": { before: { actor: "underwear" }, effects: { actor: "underwear" } },
  "r4-strip-04": { atLeast: { all: "underwear" }, anyBefore: { all: "naked" }, effects: { all: "naked" } },
  "r4-strip-05": { atLeast: { all: "naked" } },
  "r5-01": { atLeast: { receiver: "underwear" } },
  "r5-02": { atLeast: { receiver: "underwear" } },
  "r5-03": { atLeast: { receiver: "underwear" } },
  "r5-04": { atLeast: { all: "underwear" } },
  "r5-05": { atLeast: { receiver: "underwear" } },
  "r5-06": { atLeast: { receiver: "underwear" } },
  "r5-07": { atLeast: { receiver: "underwear" } },
  "r5-08": { atLeast: { receiver: "underwear" } },
  "r6-01": { atLeast: { receiver: "naked" } },
  "r6-02": { atLeast: { receiver: "naked" } },
  "r6-03": { atLeast: { receiver: "naked" } },
  "r6-04": { atLeast: { receiver: "naked" } },
  "r6-05": { atLeast: { receiver: "naked" } },
  "r6-06": { atLeast: { all: "naked" } },
  "r6-07": { atLeast: { receiver: "naked" } },
  "r6-08": { atLeast: { receiver: "naked" } },
  "r7-01": { atLeast: { all: "naked" } },
  "r7-02": { atLeast: { all: "naked" } },
  "r7-03": { atLeast: { all: "naked" } },
  "r7-04": { atLeast: { all: "naked" } },
  "r7-05": { atLeast: { all: "naked" } },
  "r7-06": { atLeast: { all: "naked" } },
  "r7-07": { atLeast: { all: "naked" } },
  "r7-08": { atLeast: { all: "naked" } },
  "r5-surprise-01": { atLeast: { female: "partial" } },
  "r5-surprise-02": { atLeast: { female: "underwear" }, before: { female: "naked" } },
  "r5-surprise-03": { atLeast: { actor: "underwear" }, before: { actor: "naked" } },
  "r6-surprise-01": { atLeast: { other: "naked" } },
  "r6-surprise-02": { atLeast: { female: "partial" } },
  "r6-surprise-03": { atLeast: { female: "partial" } },
  "r6-surprise-04": { atLeast: { female: "partial" } },
  "r6-surprise-05": { atLeast: { receiver: "naked" } },
  "r6-surprise-06": { atLeast: { receiver: "naked" } },
  "r6-surprise-08": { atLeast: { female: "partial", other: "naked" } },
  "r6-surprise-10": { atLeast: { actor: "naked" } },
  "r6-surprise-11": { atLeast: { other: "naked" } },
  "r6-surprise-12": { atLeast: { actor: "naked" } },
  "r7-surprise-01": { atLeast: { all: "naked" } },
  "r7-surprise-02": { atLeast: { all: "naked" } },
  "r7-surprise-03": { atLeast: { all: "naked" } },
  "r7-surprise-04": { atLeast: { all: "naked" } },
  "r1-solo-01": { before: { actor: "naked" } },
  "r1-solo-03": { before: { actor: "naked" } },
  "r1-solo-04": { before: { actor: "naked" } },
  "r2-solo-03": { before: { actor: "naked" } },
  "r2-solo-06": { before: { actor: "naked" } },
  "r3-solo-01": { atLeast: { actor: "partial" } },
  "r3-solo-02": { atLeast: { actor: "naked" } },
  "r3-solo-03": { atLeast: { actor: "underwear" }, before: { actor: "naked" } },
  "r3-solo-04": { atLeast: { actor: "underwear" }, before: { actor: "naked" } },
  "r4-solo-01": { before: { actor: "naked" }, effects: { actor: "partial" } },
  "r4-solo-02": { effects: { actor: "underwear" } },
  "r4-solo-03": { atLeast: { actor: "underwear" }, before: { actor: "naked" } },
  "r4-solo-04": { atLeast: { actor: "underwear" }, before: { actor: "naked" } },
  "r4-solo-05": { before: { actor: "naked" }, effects: { actor: "partial" } },
  "r4-solo-06": { before: { actor: "naked" }, effects: { actor: "naked" } },
  "r5-solo-01": { atLeast: { actor: "underwear" } },
  "r5-solo-02": { atLeast: { actor: "underwear" } },
  "r5-solo-03": { atLeast: { actor: "underwear" } },
  "r5-solo-04": { atLeast: { actor: "underwear" } },
  "r5-solo-05": { atLeast: { actor: "underwear" } },
  "r6-solo-01": { atLeast: { actor: "underwear" } },
  "r6-solo-02": { atLeast: { actor: "underwear" } },
  "r7-solo-01": { atLeast: { actor: "underwear" } },
  "r7-solo-02": { atLeast: { actor: "underwear" } },
  "r1-solo-var-01": { before: { actor: "naked" } },
  "r1-solo-var-02": { before: { actor: "naked" } },
  "r1-solo-var-03": { before: { actor: "naked" } },
  "r2-solo-var-01": { before: { actor: "naked" } },
  "r2-solo-var-02": { before: { actor: "naked" } },
  "r2-solo-var-03": { before: { actor: "naked" } },
  "r3-solo-var-01": { before: { actor: "naked" } },
  "r3-solo-var-02": { atLeast: { actor: "underwear" }, before: { actor: "naked" } },
  "r3-solo-var-03": { before: { actor: "naked" } },
  "r4-solo-var-01": { before: { actor: "naked" }, effects: { actor: "partial" } },
  "r4-solo-var-02": { before: { actor: "naked" }, effects: { actor: "underwear" } },
  "r5-solo-var-01": { atLeast: { actor: "underwear" } },
  "r5-solo-var-02": { atLeast: { actor: "underwear" } },
  "r5-solo-var-03": { atLeast: { actor: "underwear" } },
  "r6-solo-var-01": { atLeast: { actor: "underwear" } },
  "r6-solo-var-02": { atLeast: { actor: "underwear" } },
  "r7-solo-var-01": { atLeast: { actor: "underwear" } },
  "r7-solo-var-02": { atLeast: { actor: "underwear" } },
  "r4-couple-m-01": { atLeast: { receiver: "underwear" }, before: { receiver: "naked" } },
  "r4-couple-f-01": { atLeast: { receiver: "underwear" }, before: { receiver: "naked" } },
  "r4-couple-f-02": { atLeast: { receiver: "partial" } },
  "r5-couple-01": { atLeast: { receiver: "underwear" } },
  "r5-couple-02": { atLeast: { receiver: "underwear" } },
  "r5-couple-f-01": { atLeast: { receiver: "partial" } },
  "r5-couple-f-02": { atLeast: { receiver: "naked" } },
  "r5-couple-any-01": { atLeast: { receiver: "underwear" } },
  "r5-couple-any-02": { atLeast: { actor: "naked", receiver: "partial" } },
  "r6-couple-01": { atLeast: { receiver: "naked" } },
  "r6-couple-02": { atLeast: { receiver: "naked" } },
  "r6-couple-m-01": { atLeast: { receiver: "underwear" }, before: { receiver: "naked" } },
  "r6-couple-f-01": { atLeast: { receiver: "naked" } },
  "r6-couple-m-02": { atLeast: { receiver: "naked" } },
  "r6-couple-m-03": { atLeast: { receiver: "naked" } },
  "r6-couple-f-02": { atLeast: { receiver: "naked" } },
  "r6-couple-f-03": { atLeast: { receiver: "naked" } },
  "r6-couple-f-04": { atLeast: { receiver: "naked" } },
  "r6-couple-f-05": { atLeast: { receiver: "naked" } },
  "r6-couple-f-06": { atLeast: { receiver: "naked" } },
  "r6-couple-m-04": { atLeast: { receiver: "naked" } },
  "r6-couple-m-05": { atLeast: { receiver: "naked" } },
  "r6-couple-any-01": { atLeast: { receiver: "naked" } },
  "r6-couple-any-02": { atLeast: { receiver: "naked" } },
  "r6-couple-any-03": { atLeast: { receiver: "naked" } },
  "r6-couple-any-04": { atLeast: { actor: "naked" } },
  "r6-couple-fm-01": { atLeast: { actor: "partial", receiver: "naked" } },
  "r6-couple-any-05": { atLeast: { receiver: "naked" } },
  "r6-couple-any-06": { atLeast: { all: "naked" } },
  "r6-couple-m-06": { atLeast: { receiver: "naked" } },
  "r6-new-01": { atLeast: { all: "naked" } },
  "r6-new-02": { atLeast: { receiver: "naked" } },
  "r6-new-03": { atLeast: { receiver: "naked" } },
  "r6-new-04": { atLeast: { receiver: "naked" } },
  "r6-new-05": { atLeast: { all: "naked" } },
  "r6-new-06": { atLeast: { receiver: "naked" } },
  "r7-couple-01": { atLeast: { all: "naked" } },
  "r7-couple-02": { atLeast: { all: "naked" } },
  "r7-couple-any-01": { atLeast: { all: "naked" } },
  "r7-new-01": { atLeast: { all: "naked" } },
  "r7-new-02": { atLeast: { all: "naked" } },
  "r7-new-03": { atLeast: { all: "naked" } },
  "r7-new-04": { atLeast: { all: "naked" } },
  "r7-new-05": { atLeast: { all: "naked" } },
  "r7-new-06": { atLeast: { all: "naked" } },
  "loop-couple-01": { atLeast: { all: "naked" } },
  "loop-couple-02": { atLeast: { receiver: "naked" } },
  "loop-couple-03": { atLeast: { receiver: "naked" } },
  "loop-couple-04": { atLeast: { all: "naked" } },
  "loop-couple-05": { atLeast: { receiver: "naked" } },
  "loop-couple-06": { atLeast: { all: "naked" } },
  "r6-recv-01": { atLeast: { receiver: "naked" } },
  "r6-recv-02": { atLeast: { receiver: "naked" } },
  "r7-recv-01": { atLeast: { all: "naked" } },
  "r7-recv-02": { atLeast: { all: "naked" } },
  "loop-solo-01": { atLeast: { actor: "underwear" } },
  "loop-solo-02": { atLeast: { actor: "underwear" } },
  "r6-couple-m-07": { atLeast: { receiver: "naked" } },
  "r6-couple-m-08": { atLeast: { receiver: "naked" } },
  "r6-couple-m-09": { atLeast: { receiver: "naked" } },
  "r6-couple-m-10": { atLeast: { receiver: "naked" } },
  "r6-couple-m-11": { atLeast: { receiver: "naked" } },
  "r6-couple-m-12": { atLeast: { receiver: "naked" } },
  "r6-couple-m-13": { atLeast: { receiver: "naked" } },
  "r6-couple-m-14": { atLeast: { receiver: "naked" } },
  "r6-couple-m-15": { atLeast: { receiver: "naked" } },
  "r6-couple-f-07": { atLeast: { receiver: "naked" } },
  "r6-couple-f-08": { atLeast: { receiver: "naked" } },
  "r6-couple-f-09": { atLeast: { receiver: "naked" } },
  "r6-couple-f-10": { atLeast: { receiver: "naked" } },
  "r6-couple-f-11": { atLeast: { receiver: "naked" } },
  "r4-couple-ff-02": { atLeast: { all: "partial" } },
  "r4-couple-ff-03": { atLeast: { all: "naked" } },
  "r4-couple-ff-04": { atLeast: { receiver: "underwear" }, before: { receiver: "naked" } },
  "r4-couple-mm-02": { atLeast: { all: "partial" } },
  "r4-couple-mm-03": { atLeast: { all: "naked" } },
  "r4-couple-mm-04": { atLeast: { receiver: "underwear" }, before: { receiver: "naked" } },
  "r6-couple-hm-01": { atLeast: { receiver: "naked" } },
  "r4-couple-mh-01": { atLeast: { all: "underwear" } },
  "r4-couple-any-01": { atLeast: { all: "naked" } },
  "r4-new-01": { atLeast: { receiver: "naked" } },
  "r4-new-03": {},
  "r4-new-04": { atLeast: { receiver: "underwear" } },
  "r4-new-05": { atLeast: { all: "underwear" } },
  "r4-new-06": { atLeast: { receiver: "naked" } },
  "r5-new-01": { atLeast: { receiver: "naked" } },
  "r5-new-02": { atLeast: { receiver: "naked" } },
  "r5-new-03": { atLeast: { receiver: "naked" } },
  "r5-new-04": { atLeast: { receiver: "naked" } },
  "r5-new-05": { atLeast: { receiver: "naked" } },
  "r5-new-06": { atLeast: { receiver: "naked" } },
  "r4-solo-f-new-01": { atLeast: { actor: "partial" } },
  "r5-solo-f-new-02": { atLeast: { actor: "underwear" } },
  "r6-solo-f-new-03": { atLeast: { actor: "underwear" } },
  "r7-solo-f-new-04": { atLeast: { actor: "underwear" } },
  "r4-solo-m-new-01": { atLeast: { actor: "underwear" } },
  "r5-solo-m-new-02": { atLeast: { actor: "underwear" } },
  "r6-solo-m-new-03": { atLeast: { actor: "underwear" } },
  "r7-solo-m-new-04": { atLeast: { actor: "underwear" } },
  "r5-recv-01": { atLeast: { receiver: "underwear" } },
  "r5-recv-02": { atLeast: { receiver: "underwear" } },
  "r2-desafios-01": {},
  "r2-desafios-02": {},
  "r2-desafios-03": {},
  "r2-desafios-04": {},
  "r2-desafios-05": {},
  "r2-desafios-06": {},
  "r2-desafios-07": {},
  "r2-desafios-08": {},
  "r2-desafios-09": {},
  "r3-desafios-01": {},
  "r3-desafios-02": {},
  "r3-desafios-03": {},
  "r3-desafios-04": {},
  "r3-desafios-05": {},
  "r3-desafios-06": {},
  "r3-desafios-07": {},
  "r3-desafios-08": {},
  "r4-desafios-01": { atLeast: { all: "naked" } },
  "r4-desafios-02": { atLeast: { actor: "partial" } },
  "r4-desafios-03": { atLeast: { all: "naked" } },
  "r4-desafios-04": { atLeast: { all: "naked" } },
  "r4-desafios-05": { atLeast: { all: "naked" } },
  "r4-desafios-06": {},
  "r5-desafios-01": { atLeast: { receiver: "underwear" } },
  "r5-desafios-02": { atLeast: { receiver: "underwear" } },
  "r5-desafios-03": { atLeast: { receiver: "underwear" } },
  "r5-desafios-04": { atLeast: { actor: "partial" } },
  "r6-desafios-01": { atLeast: { all: "naked" } },
  "r2-rituais-01": {},
  "r2-rituais-02": {},
  "r3-rituais-01": {},
  "r3-rituais-02": {},
  "r4-rituais-01": { atLeast: { all: "naked" } },
  "r4-rituais-02": { atLeast: { receiver: "naked" } },
  "r5-rituais-01": { atLeast: { receiver: "naked" } },
  "r5-rituais-02": { atLeast: { receiver: "naked" } },
  "r4-fantasia-01": {},
  "r4-fantasia-02": {},
  "r5-fantasia-01": { atLeast: { receiver: "underwear" } },
  "r5-fantasia-02": { atLeast: { receiver: "underwear" } },
  "r6-fantasia-01": { atLeast: { all: "naked" } },
  "r6-fantasia-02": { atLeast: { all: "naked" } },
  "r7-fantasia-01": { atLeast: { all: "naked" } },
  "r7-fantasia-02": { atLeast: { all: "naked" } },
  "r8-aftercare-01": {},
  "r8-aftercare-02": {},
  "r8-aftercare-03": {},
  "r8-aftercare-04": {},
  "r8-aftercare-05": {},
  "r8-aftercare-06": {},
  "r8-aftercare-07": {},
  "r8-aftercare-08": {}
};

const PRONOUN_PRESETS = {
  feminine: {
    article: "a",
    subject: "ela",
    possessive: "dela",
    direct: "ela",
    attentive: "atenta",
    arousal: "molhada",
    devoured: "devorada",
    dirty: "suja",
    intimacy: "bucetinha",
    intimacyWithArticle: "a bucetinha",
    intimacyLocative: "na bucetinha",
    naked: "nua",
    ownIntimacy: "sua própria bucetinha",
    touched: "tocada",
    underwearOuter: "por cima dos peitos e da calcinha",
    underwearInside: "por dentro da calcinha",
    chestUnderwear: "peitos por cima da lingerie",
    bottomUnderwear: "calcinha"
  },
  masculine: {
    article: "o",
    subject: "ele",
    possessive: "dele",
    direct: "ele",
    attentive: "atento",
    arousal: "duro",
    devoured: "devorado",
    dirty: "sujo",
    intimacy: "pau",
    intimacyWithArticle: "o pau",
    intimacyLocative: "no pau",
    naked: "nu",
    ownIntimacy: "seu próprio pau",
    touched: "tocado",
    underwearOuter: "por cima da cueca",
    underwearInside: "por dentro da cueca",
    chestUnderwear: "peito e barriga",
    bottomUnderwear: "cueca"
  }
};

const CHALLENGE_BANK = window.ROULETTE_CHALLENGE_BANK || { baseChallenges: [], adaptiveChallenges: [] };
const CHALLENGES = CHALLENGE_BANK.baseChallenges;
const ADAPTIVE_CHALLENGES = CHALLENGE_BANK.adaptiveChallenges;

const ALL_CHALLENGES = [
  ...CHALLENGES.map((challenge) => ({ ...challenge, mode: challenge.mode || "couple" })),
  ...ADAPTIVE_CHALLENGES
];

const state = {
  sessionStartTime: Date.now(),
  spinCount: 0,
  usedChallengeIds: [],
  history: [],
  archivedSessions: [],
  sessionActive: false,
  currentRank: 1,
  overrideRank: null,
  gameMode: "couple",
  heatBias: 0,
  progressionMode: "standard",
  musicMuted: true,
  musicVolume: 0.18,
  learning: {
    femaleWarmth: 0,
    tagScores: {},
    seductionFeedbackCount: 0
  },
  challengeFeedback: {
    challengeScores: {},
    tagScores: {},
    rankScores: {},
    count: 0,
    lastUpdatedAt: null
  },
  partners: [],
  arousal: {},
  preferences: {
    limits: {},
    items: {}
  },
  pauseWord: "",
  turnIndex: 0,
  spinning: false,
  rotation: 0,
  currentChallenge: null,
  lastWeights: WEIGHT_MATRIX[1],
  timerInitial: 0,
  timerRemaining: 0,
  timerRunning: false,
  timerFrameId: null,
  lastTimerTick: 0,
  lastVibrationAt: 0,
  lastCountdownBeep: null,
  devicePixelRatio: window.devicePixelRatio || 1
};

const dom = {
  ageScreen: document.getElementById("age-screen"),
  gameScreen: document.getElementById("game-screen"),
  entryForm: document.getElementById("entry-form"),
  partnerOneName: document.getElementById("partner-one-name"),
  partnerOneLabel: document.getElementById("partner-one-label"),
  partnerOnePronoun: document.getElementById("partner-one-pronoun"),
  partnerTwoName: document.getElementById("partner-two-name"),
  partnerTwoPronoun: document.getElementById("partner-two-pronoun"),
  pauseWord: document.getElementById("pause-word"),
  pauseWordLabel: document.getElementById("pause-word-label"),
  adultConsent: document.getElementById("adult-consent"),
  consentText: document.getElementById("consent-text"),
  gameModeInputs: Array.from(document.querySelectorAll('input[name="gameMode"]')),
  preferenceInputs: Array.from(document.querySelectorAll("[data-pref-scope]")),
  entryPanel: document.getElementById("entry-form"),
  stageBg: document.getElementById("stage-bg"),
  openSession: document.getElementById("open-session"),
  closeSession: document.getElementById("close-session"),
  sessionDrawer: document.getElementById("session-drawer"),
  endSession: document.getElementById("end-session"),
  resetSession: document.getElementById("reset-session"),
  openHistory: document.getElementById("open-history"),
  musicToggle: document.getElementById("music-toggle"),
  musicVolume: document.getElementById("music-volume"),
  closeHistory: document.getElementById("close-history"),
  historyModal: document.getElementById("history-modal"),
  historyList: document.getElementById("history-list"),
  canvas: document.getElementById("roulette"),
  spin: document.getElementById("spin"),
  rankPulse: document.getElementById("rank-pulse"),
  wheelRank: document.getElementById("wheel-rank"),
  wheelCaption: document.getElementById("wheel-caption"),
  turnName: document.getElementById("turn-name"),
  turnAvatar: document.getElementById("turn-avatar"),
  rankNumber: document.getElementById("rank-number"),
  rankPhase: document.getElementById("rank-phase"),
  elapsedTime: document.getElementById("elapsed-time"),
  spinCount: document.getElementById("spin-count"),
  unusedCount: document.getElementById("unused-count"),
  nextRankHint: document.getElementById("next-rank-hint"),
  arousalPanel: document.getElementById("arousal-panel"),
  rankOverride: document.getElementById("rank-override"),
  safeWordDisplay: document.getElementById("safe-word-display"),
  rankList: document.getElementById("rank-list"),
  wheelShell: document.querySelector(".wheel-shell"),
  resultModal: document.getElementById("result-modal"),
  resultCard: document.getElementById("result-card"),
  resultAvatar: document.getElementById("result-avatar"),
  resultRank: document.getElementById("result-rank"),
  resultPhase: document.getElementById("result-phase"),
  resultTurn: document.getElementById("result-turn"),
  resultTitle: document.getElementById("result-title"),
  resultText: document.getElementById("result-text"),
  insightBox: document.getElementById("insight-box"),
  insightText: document.getElementById("insight-text"),
  insightReady: document.getElementById("insight-ready"),
  insightWarmup: document.getElementById("insight-warmup"),
  timerBox: document.getElementById("timer-box"),
  timerDisplay: document.getElementById("timer-display"),
  timerStart: document.getElementById("timer-start"),
  timerPause: document.getElementById("timer-pause"),
  timerRestart: document.getElementById("timer-restart"),
  previousResult: document.getElementById("previous-result"),
  feedbackLike: document.getElementById("feedback-like"),
  feedbackDislike: document.getElementById("feedback-dislike"),
  copyResult: document.getElementById("copy-result"),
  closeResult: document.getElementById("close-result"),
  flash: document.getElementById("flash"),
  toast: document.getElementById("toast")
};

let ctx = null;
let dashboardIntervalId = null;
let toastTimeoutId = null;
let audioCtx = null;
let musicElement = null;

document.addEventListener("DOMContentLoaded", init);

function init() {
  loadStoredState();
  bindEvents();
  renderMusicControls();
  initializeCanvas();
  renderRankList();
  updateSessionRank({ silent: true });
  renderAll();
  registerServiceWorker();

  dashboardIntervalId = window.setInterval(() => {
    updateSessionRank();
    renderAll();
  }, 1000);

  window.addEventListener("resize", () => {
    initializeCanvas();
    drawWheel();
  });
}

function bindEvents() {
  dom.entryForm.addEventListener("submit", handleEntrySubmit);
  dom.gameModeInputs.forEach((input) => {
    input.addEventListener("change", () => setGameMode(input.value));
  });
  dom.spin.addEventListener("click", spinWheel);
  dom.openSession.addEventListener("click", openSessionDrawer);
  dom.closeSession.addEventListener("click", closeSessionDrawer);
  dom.sessionDrawer.addEventListener("click", (event) => {
    if (event.target === dom.sessionDrawer) closeSessionDrawer();
  });
  dom.endSession.addEventListener("click", endSession);
  dom.resetSession.addEventListener("click", resetSession);
  dom.openHistory.addEventListener("click", openHistoryModal);
  dom.musicToggle.addEventListener("click", toggleMusic);
  dom.musicVolume.addEventListener("input", handleMusicVolumeInput);
  dom.closeHistory.addEventListener("click", () => (dom.historyModal.hidden = true));
  dom.historyModal.addEventListener("click", (event) => {
    if (event.target === dom.historyModal) dom.historyModal.hidden = true;
  });
  dom.arousalPanel.addEventListener("input", handleArousalChange);
  dom.arousalPanel.addEventListener("change", handleArousalChange);
  dom.arousalPanel.addEventListener("click", handleArousalStep);
  dom.rankOverride.addEventListener("change", handleOverrideChange);
  dom.timerStart.addEventListener("click", startTimer);
  dom.timerPause.addEventListener("click", pauseTimer);
  dom.timerRestart.addEventListener("click", restartTimer);
  dom.insightReady.addEventListener("click", () => applySensoryInsight("ready"));
  dom.insightWarmup.addEventListener("click", () => applySensoryInsight("warmup"));
  dom.previousResult.addEventListener("click", showPreviousChallenge);
  dom.feedbackLike.addEventListener("click", () => applyChallengeFeedback("like"));
  dom.feedbackDislike.addEventListener("click", () => applyChallengeFeedback("dislike"));
  dom.closeResult.addEventListener("click", closeResult);
  dom.copyResult.addEventListener("click", copyCurrentChallenge);
}

function handleEntrySubmit(event) {
  event.preventDefault();
  const partners = [readProfile(1)];
  if (state.gameMode === "couple") partners.push(readProfile(2));

  const pauseRequired = state.gameMode === "couple";
  if (partners.some((profile) => !profile.name) || (pauseRequired && !dom.pauseWord.value.trim()) || !dom.adultConsent.checked) {
    showToast("Preencha os dados da sessão e confirme o consentimento.");
    return;
  }

  archiveCurrentSession("new-session");
  startFreshSession();
  state.partners = partners;
  state.arousal = createArousalState(state.partners);
  state.preferences = readSessionPreferences(state.partners);
  state.pauseWord = dom.pauseWord.value.trim() || (state.gameMode === "solo" ? "limite" : "");
  chooseInitialTurn();
  saveJson(STORAGE_KEYS.partners, state.partners);
  saveJson(STORAGE_KEYS.preferences, state.preferences);
  localStorage.setItem(STORAGE_KEYS.pauseWord, state.pauseWord);
  localStorage.setItem(STORAGE_KEYS.gameMode, state.gameMode);
  saveSession();
  enterGame();
}

function readProfile(index) {
  const nameInput = index === 1 ? dom.partnerOneName : dom.partnerTwoName;
  const pronounInput = index === 1 ? dom.partnerOnePronoun : dom.partnerTwoPronoun;
  return normalizeProfile({
    name: nameInput.value.trim() || (state.gameMode === "solo" && index === 1 ? "Você" : ""),
    preset: pronounInput.value
  });
}

function setGameMode(mode) {
  state.gameMode = mode === "solo" ? "solo" : "couple";
  dom.entryPanel.dataset.mode = state.gameMode;
  dom.gameModeInputs.forEach((input) => {
    input.checked = input.value === state.gameMode;
  });
  dom.partnerTwoName.required = state.gameMode === "couple";
  dom.partnerTwoPronoun.required = state.gameMode === "couple";
  dom.pauseWord.required = state.gameMode === "couple";
  dom.partnerOneLabel.textContent = state.gameMode === "solo" ? "Você" : "Perfil 1";
  dom.partnerOneName.placeholder = state.gameMode === "solo" ? "Você" : "Nome";
  dom.pauseWordLabel.textContent = state.gameMode === "solo" ? "Limite pessoal" : "Palavra de pausa";
  dom.pauseWord.placeholder = state.gameMode === "solo" ? "Opcional" : "Ex.: vermelho";
  dom.consentText.textContent = state.gameMode === "solo"
    ? "Você é maior de 18 anos e concorda com seus limites, pausa e consentimento contínuo."
    : "Ambos são maiores de 18 anos e concordam com limites, pausa e consentimento contínuo.";
  if (state.gameMode === "solo" && !dom.partnerOneName.value.trim()) dom.partnerOneName.value = "Você";
  localStorage.setItem(STORAGE_KEYS.gameMode, state.gameMode);
  updateSessionRank({ forcePulse: true });
  renderAll();
}

function enterGame() {
  dom.ageScreen.classList.remove("is-active");
  dom.gameScreen.classList.add("is-active");
  initializeCanvas();
  updateSessionRank({ forcePulse: true });
  renderAll();
  startWheelIntroAnimation();
  if (!state.musicMuted && state.musicVolume > 0) startMusic();
}

function loadStoredState() {
  const partners = loadJson(STORAGE_KEYS.partners, []);
  const pauseWord = localStorage.getItem(STORAGE_KEYS.pauseWord) || "";
  const session = loadJson(STORAGE_KEYS.session, null);
  const override = loadJson(STORAGE_KEYS.overrideRank, null);
  const gameMode = localStorage.getItem(STORAGE_KEYS.gameMode) || "couple";
  const storedPreferences = loadJson(STORAGE_KEYS.preferences, null);
  const storedMusicRevision = localStorage.getItem(STORAGE_KEYS.musicRevision);
  const storedMusicMuted = loadJson(STORAGE_KEYS.musicMuted, false);
  const storedMusicVolume = Number(localStorage.getItem(STORAGE_KEYS.musicVolume));
  state.archivedSessions = loadJson(STORAGE_KEYS.sessionArchive, []);

  state.gameMode = gameMode === "solo" ? "solo" : "couple";
  if (storedMusicRevision !== MUSIC_REVISION) {
    state.musicMuted = true;
    state.musicVolume = DEFAULT_MUSIC_VOLUME;
    saveMusicPreferences();
  } else {
    state.musicMuted = Boolean(storedMusicMuted);
    state.musicVolume = Number.isFinite(storedMusicVolume) ? clamp(storedMusicVolume, 0, 1) : DEFAULT_MUSIC_VOLUME;
  }
  state.partners = Array.isArray(partners) ? partners.slice(0, 2).map((profile) => normalizeProfile(profile)) : [];
  state.preferences = normalizeSessionPreferences(storedPreferences, state.partners);
  state.pauseWord = pauseWord;
  state.overrideRank = Number.isInteger(override) ? override : null;

  if (session && Date.now() - session.sessionStartTime < SESSION_TTL_MS) {
    state.sessionActive = true;
    state.sessionStartTime = session.sessionStartTime || Date.now();
    state.spinCount = session.spinCount || 0;
    state.usedChallengeIds = Array.isArray(session.usedChallengeIds) ? session.usedChallengeIds : [];
    state.history = Array.isArray(session.history) ? session.history : [];
    state.turnIndex = session.turnIndex || 0;
    state.rotation = session.rotation || 0;
    state.heatBias = Number.isFinite(session.heatBias) ? session.heatBias : 0;
    state.learning = normalizeLearning(session.learning);
    state.challengeFeedback = normalizeChallengeFeedback(session.challengeFeedback);
    state.arousal = normalizeArousalState(session.arousal);
    state.preferences = normalizeSessionPreferences(session.preferences || storedPreferences, state.partners);
    state.progressionMode = session.progressionMode || "standard";
    if (session.gameMode) state.gameMode = session.gameMode === "solo" ? "solo" : "couple";
  } else if (session) {
    state.sessionActive = false;
    archiveSessionSnapshot(session, "expired");
    localStorage.removeItem(STORAGE_KEYS.session);
  }

  setGameMode(state.gameMode);
  if (state.partners[0]) {
    dom.partnerOneName.value = state.partners[0].name;
    dom.partnerOnePronoun.value = state.partners[0].preset;
  }
  if (state.partners[1]) {
    dom.partnerTwoName.value = state.partners[1].name;
    dom.partnerTwoPronoun.value = state.partners[1].preset;
  }
  if (state.pauseWord) dom.pauseWord.value = state.pauseWord;
  if (state.overrideRank) dom.rankOverride.value = String(state.overrideRank);
  syncArousalState();

  updateProfileLabels();
}

function saveSession() {
  if (!state.sessionActive) return;

  saveJson(STORAGE_KEYS.session, {
    sessionStartTime: state.sessionStartTime,
    spinCount: state.spinCount,
    usedChallengeIds: state.usedChallengeIds,
    history: state.history,
    turnIndex: state.turnIndex,
    rotation: state.rotation,
    gameMode: state.gameMode,
    heatBias: state.heatBias,
    progressionMode: state.progressionMode,
    learning: state.learning,
    challengeFeedback: normalizeChallengeFeedback(state.challengeFeedback),
    arousal: normalizeArousalState(state.arousal),
    preferences: normalizeSessionPreferences(state.preferences)
  });
  saveJson(STORAGE_KEYS.overrideRank, state.overrideRank);
}

function startFreshSession(options = {}) {
  const { active = true } = options;
  stopTimer();
  state.sessionActive = active;
  state.sessionStartTime = Date.now();
  state.spinCount = 0;
  state.usedChallengeIds = [];
  state.history = [];
  state.currentRank = 1;
  state.overrideRank = null;
  state.heatBias = 0;
  state.progressionMode = "standard";
  state.learning = createLearningProfile();
  state.challengeFeedback = createChallengeFeedbackProfile();
  state.arousal = {};
  state.preferences = normalizeSessionPreferences(state.preferences);
  state.turnIndex = 0;
  state.rotation = 0;
  state.currentChallenge = null;
  state.lastWeights = WEIGHT_MATRIX[1];
  state.timerInitial = 0;
  state.timerRemaining = 0;
  state.timerRunning = false;
  state.lastCountdownBeep = null;
  dom.rankOverride.value = "";
  if (dom.canvas) {
    dom.canvas.style.transition = "none";
    dom.canvas.style.transform = "rotate(0deg)";
    window.setTimeout(() => {
      dom.canvas.style.transition = "";
    }, 40);
  }
}

function archiveCurrentSession(reason = "ended") {
  const snapshot = {
    sessionStartTime: state.sessionStartTime,
    spinCount: state.spinCount,
    usedChallengeIds: state.usedChallengeIds,
    history: state.history,
    turnIndex: state.turnIndex,
    rotation: state.rotation,
    gameMode: state.gameMode,
    heatBias: state.heatBias,
    learning: state.learning,
    challengeFeedback: normalizeChallengeFeedback(state.challengeFeedback),
    arousal: normalizeArousalState(state.arousal),
    partners: state.partners
  };
  return archiveSessionSnapshot(snapshot, reason);
}

function archiveSessionSnapshot(snapshot, reason = "ended") {
  const history = Array.isArray(snapshot?.history) ? snapshot.history : [];
  const spinCount = snapshot?.spinCount || 0;
  if (!spinCount && !history.length) return false;

  const startedAt = snapshot.sessionStartTime || Date.now();
  const endedAt = Date.now();
  const ranks = history.map((item) => item.rank).filter(Number.isFinite);
  const summary = {
    id: `${endedAt}-${Math.random().toString(36).slice(2, 8)}`,
    reason,
    startedAt,
    endedAt,
    durationMs: Math.max(0, endedAt - startedAt),
    spinCount,
    gameMode: snapshot.gameMode || state.gameMode,
    partners: (snapshot.partners || state.partners || []).map((profile) => normalizeProfile(profile).name).filter(Boolean),
    maxRank: ranks.length ? Math.max(...ranks) : snapshot.currentRank || state.currentRank,
    challenges: history.slice(0, 40)
  };

  state.archivedSessions = [summary, ...state.archivedSessions].slice(0, 20);
  saveJson(STORAGE_KEYS.sessionArchive, state.archivedSessions);
  return true;
}

function endSession() {
  const archived = archiveCurrentSession("ended");
  startFreshSession({ active: false });
  localStorage.removeItem(STORAGE_KEYS.session);
  saveJson(STORAGE_KEYS.overrideRank, null);
  closeSessionDrawer();
  dom.resultModal.hidden = true;
  dom.insightBox.hidden = true;
  dom.gameScreen.classList.remove("is-active");
  dom.ageScreen.classList.add("is-active");
  updateSessionRank({ silent: true });
  renderAll();
  showToast(archived ? "Noite salva no registro." : "Sessão encerrada.");
}

function updateSessionRank(options = {}) {
  const previous = state.currentRank;
  const naturalRank = calculateNaturalRank();
  const biasedRank = clamp(naturalRank + state.heatBias, 1, 14);
  const pacedRank = applyLearningPacing(biasedRank);
  const arousalPacedRank = applyArousalPacing(pacedRank);
  const continuity = getSessionContinuity();
  const continuityCeiling = getContinuityRankCeiling(continuity.clothing);
  const requestedRank = state.overrideRank || arousalPacedRank;

  const desiredRank = clamp(Math.min(requestedRank, continuityCeiling), 1, 14);

  if (state.overrideRank) {
    state.currentRank = desiredRank;
  } else if (desiredRank > previous && !canAdvanceRank()) {
    state.currentRank = previous;
  } else if (desiredRank > previous) {
    state.currentRank = Math.min(previous + 1, desiredRank);
  } else {
    state.currentRank = desiredRank;
  }

  state.lastWeights = computeRankWeights();

  if (state.currentRank !== previous || options.forcePulse) {
    applyRankTheme();
    drawWheel();
    if (!options.silent) pulseRankChange();
  }
}

function calculateNaturalRank() {
  const minutesElapsed = getMinutesElapsed();
  const preset = PROGRESSION_PRESETS[state.progressionMode] || PROGRESSION_PRESETS.standard;

  for (let rank = 14; rank >= 2; rank--) {
    const threshold = preset[rank];
    if (!threshold) continue;
    if (minutesElapsed >= threshold.minutes || state.spinCount >= threshold.spins) {
      return rank;
    }
  }

  return 1;
}

function getMaxAllowedChallengeRank() {
  return state.currentRank;
}

function applyLearningPacing(rank) {
  if (state.overrideRank || state.gameMode !== "couple" || !getFemalePartner()) return rank;

  const learning = normalizeLearning(state.learning);
  if (!learning.seductionFeedbackCount) return rank;

  if (learning.femaleWarmth <= -3) return Math.min(rank, 4);
  if (learning.femaleWarmth <= -2) return Math.min(rank, 6);
  if (learning.femaleWarmth < 0 && rank >= 9) return rank - 1;

  return rank;
}

function applyArousalPacing(rank) {
  if (state.overrideRank) return rank;

  const scores = getSessionArousalScores();
  if (!scores.length) return rank;

  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);

  if (minScore <= 0) return Math.min(rank, 5);
  if (minScore === 1 && rank >= 10) return rank - 1;
  if (minScore >= 2 && maxScore >= 4 && rank >= 8) return Math.min(rank + 1, 14);
  if (minScore >= 2 && maxScore >= 3 && rank >= 6) return Math.min(rank + 1, 14);

  return rank;
}

function computeRankWeights() {
  const base = WEIGHT_MATRIX[state.currentRank] || WEIGHT_MATRIX[1];
  const used = new Set(state.usedChallengeIds);
  const remainingByRank = countRemainingByRank(used);

  return base.map((weight, index) => {
    const rank = index + 1;
    if (!remainingByRank[rank]) return 0;
    if (rank === 14 && state.currentRank < 12) return 0;
    if (rank === 13 && state.spinCount < 3) return weight * 0.18;
    return weight;
  });
}

function countRemainingByRank(usedSet) {
  return getChallengePool().reduce((acc, challenge) => {
    if (!challenge.loop && !usedSet.has(challenge.id)) {
      acc[challenge.rank] = (acc[challenge.rank] || 0) + 1;
    }
    return acc;
  }, {});
}

function spinWheel() {
  if (state.spinning) return;

  dom.wheelShell?.classList.remove("is-intro");
  playRouletteSound();
  updateSessionRank();
  const selected = selectChallenge();

  if (!selected) {
    showToast("Todos os desafios disponíveis foram usados. Reinicie a sessão para liberar a roleta.");
    return;
  }

  const selectedRank = getRankMeta(selected.rank);
  const sliceDeg = 360 / RANKS.length;
  const sliceCenter = (selected.rank - 1) * sliceDeg + sliceDeg / 2;
  const fullSpins = 360 * (5 + Math.floor(Math.random() * 3));
  const jitter = (Math.random() - 0.5) * sliceDeg * 0.22;
  const target = 360 - sliceCenter;

  state.currentChallenge = buildChallengeResult(selected);
  state.spinning = true;
  state.spinCount += 1;
  markChallengeUsed(selected.id);
  state.rotation += fullSpins + target - modulo(state.rotation, 360) + jitter;
  state.history = [state.currentChallenge, ...state.history].slice(0, 80);
  saveSession();

  dom.spin.disabled = true;
  dom.spin.textContent = "Girando...";
  dom.canvas.style.transform = `rotate(${state.rotation}deg)`;

  let spinFallbackId = null;
  const finishSpin = () => {
    dom.canvas.removeEventListener("transitionend", finishSpin);
    if (spinFallbackId) window.clearTimeout(spinFallbackId);
    if (!state.spinning) return;

    state.spinning = false;
    dom.spin.disabled = false;
    dom.spin.textContent = "Girar roleta";
    updateSessionRank();
    playRouletteStopSound();
    showResult(state.currentChallenge, selectedRank);
    renderAll();
  };

  dom.canvas.addEventListener("transitionend", finishSpin, { once: true });
  spinFallbackId = window.setTimeout(finishSpin, 5600);

  renderAll();
}

function selectChallenge() {
  const initialTurnIndex = state.turnIndex;
  const selected = selectChallengeForCurrentTurn();
  if (selected || state.gameMode !== "couple" || state.partners.length < 2) return selected;

  for (let offset = 1; offset < state.partners.length; offset += 1) {
    state.turnIndex = modulo(initialTurnIndex + offset, state.partners.length);
    const alternate = selectChallengeForCurrentTurn();
    if (alternate) return alternate;
  }

  state.turnIndex = initialTurnIndex;
  return null;
}

function selectChallengeForCurrentTurn() {
  const used = new Set(state.usedChallengeIds);
  const pool = getChallengePool();
  const retreat = selectStrategicRetreat(pool, used);
  if (retreat) return retreat;

  const candidates = getEligibleChallengeEntries(pool, used);

  if (candidates.length) return weightedPick(candidates);

  const fallback = getNextAvailableChallengeEntries(pool, used);

  return fallback.length ? weightedPick(fallback) : null;
}

function getEligibleChallengeEntries(pool = getChallengePool(), used = new Set(state.usedChallengeIds)) {
  const maxAllowedRank = getMaxAllowedChallengeRank();

  return pool
    .filter((challenge) =>
      !challenge.loop &&
      !used.has(challenge.id) &&
      challenge.rank <= maxAllowedRank
    )
    .map((challenge) => ({
      challenge,
      weight: getChallengeWeight(challenge)
    }))
    .filter((entry) => entry.weight > 0);
}

function getChallengeWeight(challenge) {
  const base = state.lastWeights[challenge.rank - 1] || 0;
  if (!base) return 0;
  let multiplier = 1;

  if (state.gameMode === "couple" && state.currentRank === 1 && challenge.seductionFlow) {
    multiplier *= 2.8;
  }
  if (state.gameMode === "couple" && state.currentRank === 1 && !challenge.seductionFlow) {
    multiplier *= 0.55;
  }

  if (state.gameMode === "couple" && state.currentRank === 1 && challenge.seductionFlow) {
    multiplier *= getLearningMultiplier(challenge);
  }
  multiplier *= getArousalMultiplier(challenge);
  multiplier *= getRankSixPhaseMultiplier(challenge);
  multiplier *= getChallengeFeedbackMultiplier(challenge);
  multiplier *= getTagCooldownMultiplier(challenge);

  return base * multiplier;
}

function getRankSixPhaseMultiplier(challenge) {
  if (challenge.rank !== 10) return 1;

  const variant = getRankSixPhaseVariant(challenge);
  if (!variant) return 1;

  const roles = resolveChallengeRoles(challenge);
  if (!roles) return 1;

  const actorScore = getArousalScore(roles.actor);
  const receiverScore = getArousalScore(roles.receiver);
  const lowestScore = Math.min(actorScore, receiverScore);
  const highestScore = Math.max(actorScore, receiverScore);
  let multiplier = 1;

  if (lowestScore <= 1) {
    if (variant === "sensory" || variant === "guided") multiplier *= 1.25;
    if (variant === "direct") multiplier *= 0.82;
    if (variant === "edge" || variant === "mutual" || variant === "display") multiplier *= 0.55;
  }

  if (receiverScore >= 2 && (variant === "guided" || variant === "direct")) multiplier *= 1.12;
  if (receiverScore >= 3 && (variant === "direct" || variant === "mutual")) multiplier *= 1.18;
  if (highestScore >= 4 && (variant === "edge" || variant === "retreat")) multiplier *= 1.45;
  if (variant === "retreat" && highestScore < 4) multiplier *= 0.72;

  return clamp(multiplier, 0.35, 1.8);
}

function getRankSixPhaseVariant(challenge) {
  if (RANK_SIX_PHASE_VARIANTS.has(challenge.phaseVariant)) return challenge.phaseVariant;
  if (challenge.loop) return "retreat";
  if (challenge.rank !== 10) return null;

  const haystack = `${challenge.id || ""} ${challenge.title || ""}`.toLowerCase();

  if (/(recuo|sem tocar|tira a mão|respira|segura|implor)/.test(haystack)) return "retreat";
  if (/(quase|limite|orgasmo|edging|negad|comando)/.test(haystack)) return "edge";
  if (/(69|alternância|facesit|sincronia|câmera|camera|apresenta)/.test(haystack)) return "mutual";
  if (/(sopro|temperatura|beijo|água|agua|pausa|saliva|mapa)/.test(haystack)) return "sensory";
  if (/(guia|controle|comanda|ritmo|fala)/.test(haystack)) return "guided";

  return "direct";
}

function getArousalMultiplier(challenge) {
  const roles = resolveChallengeRoles(challenge);
  if (!roles) return 1;

  const actorScore = getArousalScore(roles.actor);
  const receiverScore = getArousalScore(roles.receiver);
  const lowestScore = Math.min(actorScore, receiverScore);
  const focusScore = challenge.turnMode === "mutual"
    ? lowestScore
    : receiverScore;

  let multiplier = 1;

  if (challenge.rank >= 10 && lowestScore <= 1) multiplier *= lowestScore <= 0 ? 0.18 : 0.5;
  if (challenge.rank >= 9 && focusScore <= 0) multiplier *= 0.35;
  if (challenge.rank <= 5 && lowestScore <= 1) multiplier *= 1.35;
  if (challenge.rank >= 8 && focusScore >= 3) multiplier *= 1.18;
  if (challenge.rank >= 10 && focusScore >= 4) multiplier *= 1.3;
  if (challenge.loop && Math.max(actorScore, receiverScore) >= 4) multiplier *= 1.8;

  return clamp(multiplier, 0.12, 2.4);
}

function getLearningMultiplier(challenge) {
  const learning = normalizeLearning(state.learning);
  const tags = Array.isArray(challenge.learningTags) ? challenge.learningTags : [];
  const tagBoost = tags.reduce((sum, tag) => sum + (learning.tagScores[tag] || 0), 0);
  let multiplier = 1 + clamp(tagBoost * 0.08, -0.45, 0.85);

  if (learning.femaleWarmth < -1 && tags.some((tag) => ["femaleChoice", "safePacing", "femaleLeads", "femaleWhispers"].includes(tag))) {
    multiplier += 0.35;
  }

  if (learning.femaleWarmth > 1 && tags.includes("adaptiveTone")) {
    multiplier += 0.18;
  }

  return clamp(multiplier, 0.35, 2.1);
}

function getChallengeFeedbackMultiplier(challenge) {
  const feedback = normalizeChallengeFeedback(state.challengeFeedback);
  const directScore = feedback.challengeScores[challenge.id] || 0;
  const rankScore = feedback.rankScores[challenge.rank] || 0;
  const tagScore = getChallengeFeedbackTags(challenge)
    .reduce((sum, tag) => sum + (feedback.tagScores[tag] || 0), 0);

  let multiplier = 1;

  if (directScore > 0) multiplier *= 1 + clamp(directScore * 0.32, 0, 0.95);
  if (directScore < 0) multiplier *= clamp(1 + directScore * 0.34, 0.08, 1);

  multiplier *= 1 + clamp(tagScore * 0.045, -0.52, 0.72);
  multiplier *= 1 + clamp(rankScore * 0.035, -0.18, 0.24);

  return clamp(multiplier, 0.05, 2.6);
}

function getChallengeFeedbackTags(challenge) {
  const tags = new Set([
    `rank:${challenge.rank}`,
    `mode:${challenge.mode || "couple"}`
  ]);
  const text = getChallengeSearchText(challenge);
  const variant = getRankSixPhaseVariant(challenge);

  if (challenge.turnMode) tags.add(`turn:${challenge.turnMode}`);
  if (challenge.loop) tags.add("loop");
  if (challenge.seductionFlow) tags.add("seductionFlow");
  if (variant) tags.add(`phase:${variant}`);

  (Array.isArray(challenge.learningTags) ? challenge.learningTags : [])
    .forEach((tag) => tags.add(`learn:${tag}`));
  getChallengeRequiredItems(challenge).forEach((item) => tags.add(`item:${item}`));
  getChallengeActorLimits(challenge).forEach((limit) => tags.add(`actorLimit:${limit}`));
  getChallengeReceiverLimits(challenge).forEach((limit) => tags.add(`receiverLimit:${limit}`));
  getChallengeGlobalLimits(challenge).forEach((limit) => tags.add(`globalLimit:${limit}`));

  if (/(pergunta|responda|diga|confesse|fale|sussurr)/.test(text)) tags.add("theme:talk");
  if (/(beijo|beije|boca|lábio|labio|pescoço|pescoco)/.test(text)) tags.add("theme:kiss");
  if (/(massagem|massageie|carinho|toque|mãos|maos)/.test(text)) tags.add("theme:touch");
  if (/(strip|roupa|peça|peca|nua|nu\b|desnudo)/.test(text)) tags.add("theme:strip");
  if (/(oral|chupe|língua|lingua|lamber|lambida)/.test(text)) tags.add("theme:oral");
  if (/(masturb|dedo|mão|mao|punho)/.test(text)) tags.add("theme:manual");
  if (/(penetra|posição|posicao|posição|clímax|climax|gozar)/.test(text)) tags.add("theme:climax");
  if (/(anal|cu\b|plug|bumbum)/.test(text)) tags.add("theme:anal");
  if (/(tapa|mordid|pux|belisc|dor|dolorid)/.test(text)) tags.add("theme:impact");
  if (/(vibrador|brinquedo|dildo)/.test(text)) tags.add("theme:toy");
  if (/(câmera|camera|gravar|vídeo|video)/.test(text)) tags.add("theme:recording");
  if (/(quase|limite|recuo|segura|pausa|edging)/.test(text)) tags.add("theme:edging");

  return Array.from(tags);
}

function getNextAvailableChallengeEntries(pool = getChallengePool(), used = new Set(state.usedChallengeIds), options = {}) {
  const maxRank = getMaxAllowedChallengeRank();

  const available = pool
    .filter((challenge) =>
      !challenge.loop &&
      !used.has(challenge.id) &&
      challenge.rank <= maxRank
    )
    .sort((a, b) => a.rank - b.rank);

  if (!available.length) return [];

  const sameRank = available.filter((challenge) => challenge.rank === state.currentRank);
  const lowerRank = available.filter((challenge) => challenge.rank < state.currentRank);

  const candidates = sameRank.length ? sameRank : lowerRank;

  return candidates
    .map((challenge) => ({ challenge, weight: 1 }));
}

function selectStrategicRetreat(pool, used) {
  if (state.currentRank !== 12 || Math.random() > 0.35) return null;
  if (!hasCompletedRankSevenAction()) return null;
  const retreats = pool.filter((challenge) => challenge.loop && !used.has(challenge.id));
  return retreats.length ? randomFrom(retreats) : null;
}

function hasCompletedRankSevenAction() {
  return state.history.some((entry) => entry.rank >= 12 && !entry.loop);
}

function getChallengePool() {
  const continuity = getSessionContinuity();
  return ALL_CHALLENGES.filter((challenge) =>
    (challenge.mode === state.gameMode || challenge.mode === "both") &&
    challengeMatchesProfiles(challenge) &&
    challengeMatchesPreferences(challenge) &&
    challengeMatchesSessionContinuity(challenge, continuity)
  );
}

function challengeMatchesProfiles(challenge) {
  if (challenge.requiresFemale && !getFemalePartner()) return false;
  if (challenge.requiresMale && !getMalePartner()) return false;
  if (challenge.requiresMixedPair && (!getFemalePartner() || !getMalePartner())) return false;
  const roles = resolveChallengeRoles(challenge);
  if (!roles) return false;
  const { actor, receiver } = roles;

  if (challenge.actorPreset && challenge.actorPreset !== actor.preset) return false;
  if (challenge.receiverPreset && challenge.receiverPreset !== receiver.preset) return false;
  return true;
}

function challengeMatchesPreferences(challenge) {
  const preferences = normalizeSessionPreferences(state.preferences);
  const roles = resolveChallengeRoles(challenge);
  if (!roles) return false;

  const requiredItems = getChallengeRequiredItems(challenge);
  if (!requiredItems.every((item) => preferenceItemAvailable(item, preferences))) return false;

  const actorLimits = getChallengeActorLimits(challenge);
  if (actorLimits.some((limit) => participantBlocksLimit(roles.actor, limit, preferences))) return false;

  const receiverLimits = getChallengeReceiverLimits(challenge);
  if (receiverLimits.some((limit) => participantBlocksLimit(roles.receiver, limit, preferences))) return false;

  const blockedByLimits = getChallengeGlobalLimits(challenge);
  if (blockedByLimits.some((limit) => sessionBlocksLimit(limit, preferences))) return false;

  return true;
}

function getChallengeRequiredItems(challenge) {
  const hasExplicitItems = Array.isArray(challenge.requiredItems);
  const items = new Set(hasExplicitItems ? challenge.requiredItems : []);
  if (hasExplicitItems) return Array.from(items);

  const text = getChallengeSearchText(challenge);

  if (/(óleo|oleo|vela de massagem)/.test(text)) items.add("massageOil");
  if (/lubrificante/.test(text)) items.add("lubricant");
  if (/(vibrador|dildo|brinquedo)/.test(text)) items.add("vibrator");
  if (/plug/.test(text)) {
    items.add("analToy");
    items.add("lubricant");
  }
  if (/(câmera|camera|gravando|gravar|vídeo|video)/.test(text)) items.add("camera");

  return Array.from(items);
}

function getChallengeActorLimits(challenge) {
  return normalizeLimitList(challenge.actorLimits);
}

function getChallengeReceiverLimits(challenge) {
  const limits = new Set(normalizeLimitList(challenge.receiverLimits));
  const text = getChallengeSearchText(challenge);

  if (/(anal|cu\b|bumbum|períneo|perineo|plug)/.test(text)) limits.add("anal");
  if (/(tapa|tapas|mordid|puxão de cabelo|puxar o cabelo|belisc|dolorid|dor)/.test(text)) limits.add("impact");
  if (/(garganta|deepthroat|facefuck|engolir.*fundo|forçando.*cabeça|forcando.*cabeca)/.test(text)) limits.add("throat");

  return Array.from(limits);
}

function getChallengeGlobalLimits(challenge) {
  const limits = new Set(normalizeLimitList(challenge.blockedByLimits));
  const text = getChallengeSearchText(challenge);

  if (/(câmera|camera|gravando|gravar|vídeo|video)/.test(text)) limits.add("recording");

  return Array.from(limits);
}

function getChallengeSearchText(challenge) {
  return `${challenge.title || ""} ${challenge.text || ""}`.toLowerCase();
}

function normalizeLimitList(list) {
  if (!Array.isArray(list)) return [];
  return list.filter((limit) => CONSENT_LIMITS.includes(limit));
}

function preferenceItemAvailable(item, preferences) {
  if (item === "massageOil") return Boolean(preferences.items.massageOil || preferences.items.lubricant);
  return Boolean(preferences.items[item]);
}

function participantBlocksLimit(partner, limit, preferences) {
  const key = getContinuityKey(partner?.name || "");
  return Boolean(preferences.limits[key]?.[limit]);
}

function sessionBlocksLimit(limit, preferences) {
  return Object.values(preferences.limits).some((limits) => Boolean(limits?.[limit]));
}

function challengeMatchesSessionContinuity(challenge, continuity = getSessionContinuity()) {
  if (!challenge.loop && challenge.rank < continuity.rankFloor) return false;
  if (challenge.rank > continuity.rankCeiling) return false;
  return challengeMatchesClothingContinuity(challenge, continuity.clothing);
}

function challengeMatchesClothingContinuity(challenge, clothing) {
  const rule = CLOTHING_RULES[challenge.id];
  if (!rule) return true;
  const roles = resolveChallengeRoles(challenge);
  if (!roles) return false;
  const entry = { actor: roles.actor.name, receiver: roles.receiver.name };

  if (!matchesClothingBound(rule.before, clothing, (stage, limit) => stage < limit, entry)) return false;
  if (!matchesClothingBound(rule.atLeast, clothing, (stage, limit) => stage >= limit, entry)) return false;
  if (!matchesAnyClothingBound(rule.anyBefore, clothing, (stage, limit) => stage < limit, entry)) return false;
  if (!matchesAnyClothingBound(rule.anyAtLeast, clothing, (stage, limit) => stage >= limit, entry)) return false;

  return true;
}

function matchesClothingBound(bounds, clothing, predicate, entry = null) {
  if (!bounds) return true;

  return Object.entries(bounds).every(([target, stageName]) => {
    const targetKeys = resolveContinuityTargetKeys(target, entry);
    const limit = getClothingStageValue(stageName);
    return targetKeys.length && targetKeys.every((key) => predicate(getClothingStage(clothing, key), limit));
  });
}

function matchesAnyClothingBound(bounds, clothing, predicate, entry = null) {
  if (!bounds) return true;

  return Object.entries(bounds).every(([target, stageName]) => {
    const targetKeys = resolveContinuityTargetKeys(target, entry);
    const limit = getClothingStageValue(stageName);
    return targetKeys.some((key) => predicate(getClothingStage(clothing, key), limit));
  });
}

function getSessionContinuity() {
  const clothing = inferClothingState();
  const maxRankReached = state.history.reduce((max, entry) => Math.max(max, entry.rank || 0), 1);

  return {
    clothing,
    maxRankReached,
    rankFloor: getTemporalRankFloor(maxRankReached, clothing),
    rankCeiling: getContinuityRankCeiling(clothing)
  };
}

function getContinuityRankCeiling(clothing) {
  const partnerKeys = getContinuityPartnerKeys();
  if (!partnerKeys.length) return 7;

  const stages = partnerKeys.map((key) => getClothingStage(clothing, key));
  const allNaked = stages.every((stage) => stage >= CLOTHING_STAGE.naked);
  const anyNaked = stages.some((stage) => stage >= CLOTHING_STAGE.naked);
  const anyUnderwear = stages.some((stage) => stage >= CLOTHING_STAGE.underwear);

  if (allNaked) return 14;
  if (anyNaked) return 12;
  if (anyUnderwear) return 10;
  return 7;
}

function getTemporalRankFloor(maxRankReached, clothing) {
  let floor = 1;

  if (maxRankReached >= 9) floor = 5;
  if (maxRankReached >= 10) floor = 6;
  if (maxRankReached >= 12) floor = 7;

  const partnerKeys = getContinuityPartnerKeys();
  const allNaked = partnerKeys.length && partnerKeys.every((key) => getClothingStage(clothing, key) >= CLOTHING_STAGE.naked);
  if (allNaked) floor = Math.max(floor, 6);

  return floor;
}

function inferClothingState() {
  const clothing = {};
  getContinuityPartnerKeys().forEach((key) => {
    clothing[key] = CLOTHING_STAGE.dressed;
  });

  state.history.slice().reverse().forEach((entry) => {
    const rule = CLOTHING_RULES[entry.id];
    applyClothingEffects(clothing, rule?.effects, entry);
    applyImplicitContinuityEffects(clothing, entry);
  });

  return clothing;
}

function applyClothingEffects(clothing, effects, entry) {
  if (!effects) return;

  Object.entries(effects).forEach(([target, stageName]) => {
    const stage = getClothingStageValue(stageName);
    resolveContinuityTargetKeys(target, entry).forEach((key) => {
      clothing[key] = Math.max(getClothingStage(clothing, key), stage);
    });
  });
}

function applyImplicitContinuityEffects(clothing, entry) {
  if (entry.rank >= 12) {
    applyClothingEffects(clothing, { all: "naked" }, entry);
    return;
  }

  if (entry.rank >= 10) {
    const target = entry.mode === "solo" ? "actor" : "receiver";
    applyClothingEffects(clothing, { [target]: entry.mode === "solo" ? "underwear" : "naked" }, entry);
    return;
  }

  if (entry.rank >= 9) {
    const target = entry.mode === "solo" ? "actor" : "receiver";
    applyClothingEffects(clothing, { [target]: "underwear" }, entry);
  }
}

function resolveContinuityTargetKeys(target, entry = null) {
  if (target === "all") return getContinuityPartnerKeys();
  if (target === "actor") return [getContinuityKey(entry?.actor || getCurrentPartner().name)];
  if (target === "receiver") return [getContinuityKey(entry?.receiver || getOtherPartner().name)];
  if (target === "female") {
    const femalePartner = getFemalePartner();
    return femalePartner ? [getContinuityKey(femalePartner.name)] : [];
  }
  if (target === "other") {
    const femalePartner = getFemalePartner();
    const otherPartner = getOtherThan(femalePartner);
    return otherPartner?.name ? [getContinuityKey(otherPartner.name)] : [];
  }

  return [];
}

function getContinuityPartnerKeys() {
  if (state.partners.length) return state.partners.map((partner) => getContinuityKey(partner.name));
  return [getContinuityKey(getCurrentPartner().name)];
}

function getContinuityKey(name) {
  return name || "__self";
}

function getClothingStage(clothing, key) {
  return clothing[key] ?? CLOTHING_STAGE.dressed;
}

function getClothingStageValue(stageName) {
  return CLOTHING_STAGE[stageName] ?? CLOTHING_STAGE.dressed;
}

function weightedPick(entries) {
  const total = entries.reduce((sum, entry) => sum + entry.weight, 0);
  let cursor = Math.random() * total;

  for (const entry of entries) {
    cursor -= entry.weight;
    if (cursor <= 0) return entry.challenge;
  }

  return entries[entries.length - 1].challenge;
}

function buildChallengeResult(challenge) {
  const roles = resolveChallengeRoles(challenge);
  const actor = roles?.actor || getCurrentPartner();
  const receiver = roles?.receiver || getOtherPartner();
  const rank = getRankMeta(challenge.rank);

  return {
    id: challenge.id,
    rank: challenge.rank,
    mode: challenge.mode,
    loop: Boolean(challenge.loop),
    insight: Boolean(challenge.insight),
    turnMode: challenge.turnMode || "single",
    seductionFlow: Boolean(challenge.seductionFlow),
    learningTags: Array.isArray(challenge.learningTags) ? challenge.learningTags : [],
    phase: rank.phase,
    title: challenge.title,
    text: formatChallengeText(challenge.text, actor, receiver),
    seconds: challenge.seconds,
    actor: actor.name,
    actorPreset: actor.preset,
    receiver: receiver.name,
    receiverPreset: receiver.preset,
    insightFocus: resolveChallengeInsightFocus(challenge, actor, receiver),
    feedback: null,
    skipped: false,
    at: new Date().toISOString()
  };
}

function showResult(challenge) {
  const rank = getRankMeta(challenge.rank);
  dom.resultCard.style.setProperty("--result-image", getResultImage(challenge, rank));
  dom.resultRank.textContent = rank.short;
  dom.resultPhase.textContent = rank.phase;
  dom.resultTurn.textContent = challenge.turnMode === "mutual" ? "Troca do casal" : `Vez de ${challenge.actor}`;
  if (dom.resultAvatar) {
    dom.resultAvatar.textContent = getProfileInitial({ name: challenge.turnMode === "mutual" ? "Casal" : challenge.actor });
    dom.resultAvatar.classList.toggle("is-alt", challenge.actorPreset === "feminine");
  }
  dom.resultTitle.textContent = challenge.title;
  dom.resultText.textContent = challenge.text;
  dom.resultModal.hidden = false;
  setupInsight(challenge);
  setupTimer(challenge.seconds);
  updateFeedbackButtons(challenge);
  updatePreviousResultButton(challenge);
  signalMoment(challenge.rank);
}

function getResultImage(challenge, rank) {
  return composeImageLayers(getCoupleSceneImage(challenge.rank), getLegacyResultImage(challenge, rank));
}

function getLegacyResultImage(challenge, rank) {
  if (challenge.rank === 10 && challenge.receiverPreset === "masculine") return "assets/fundo-10.jpg";
  return rank.image;
}

function getRankSceneImage(rank) {
  return composeImageLayers(getCoupleSceneImage(rank.rank), rank.image);
}

function getCoupleSceneImage(rankNumber) {
  const context = getCoupleImageContext();
  return context ? `assets/couples/${context}/r${rankNumber}.jpg` : "";
}

function getCoupleImageContext(partners = state.partners) {
  if (state.gameMode !== "couple" || !Array.isArray(partners) || partners.length < 2) return "";

  const presets = partners.slice(0, 2).map((partner) => partner.preset);
  const maleCount = presets.filter((preset) => preset === "masculine").length;
  const femaleCount = presets.filter((preset) => preset === "feminine").length;

  if (maleCount === 2) return "hh";
  if (femaleCount === 2) return "mm";
  if (maleCount === 1 && femaleCount === 1) return "hm";
  return "";
}

function composeImageLayers(primaryImage, fallbackImage) {
  const fallback = `url("${fallbackImage}")`;
  if (!primaryImage || primaryImage === fallbackImage) return fallback;
  return `url("${primaryImage}"), ${fallback}`;
}

function setupInsight(challenge) {
  dom.insightBox.hidden = !challenge.insight;
  if (!challenge.insight) return;

  const seductionFocus = getSeductionFocusLabel(challenge);
  dom.insightReady.textContent = challenge.seductionFlow ? `${seductionFocus} entrou` : "Está no ponto";
  dom.insightWarmup.textContent = challenge.seductionFlow ? "Mais leve" : "Voltar estímulos";
  dom.insightText.textContent = challenge.seductionFlow
    ? `${seductionFocus} entrou no clima e interagiu com vontade, ou precisa de mais tempo/leveza para se soltar?`
    : state.gameMode === "solo"
    ? "O corpo já está no ponto ou precisa de mais provocação?"
    : "Leiam o corpo: está molhada/duro e pedindo mais, ou precisa voltar para estímulos?";
}

function resolveChallengeInsightFocus(challenge, actor, receiver) {
  if (!challenge.seductionFlow) return null;

  const requested = challenge.insightTarget;
  if (requested === "actor") return toInsightProfile(actor);
  if (requested === "receiver") return toInsightProfile(receiver);
  if (requested === "couple") return { name: "O casal", preset: null };
  if (requested === "female") {
    const femalePartner = getFemalePartner();
    return femalePartner ? toInsightProfile(femalePartner) : toInsightProfile(receiver);
  }

  const tags = Array.isArray(challenge.learningTags) ? challenge.learningTags : [];
  const femaleFocused = tags.some((tag) =>
    ["femaleChoice", "femaleLeads", "femaleWhispers", "languagePreference", "confidenceBuild", "desireSignal", "safePacing"].includes(tag)
  );

  if (femaleFocused) {
    const femalePartner = getFemalePartner();
    if (femalePartner) return toInsightProfile(femalePartner);
  }

  if (tags.includes("femaleResponds") || tags.includes("question") || tags.includes("bodySignal")) {
    return toInsightProfile(receiver);
  }

  if (challenge.turnMode === "mutual") return { name: "O casal", preset: null };
  return toInsightProfile(receiver);
}

function toInsightProfile(profile) {
  return {
    name: profile?.name || "O casal",
    preset: profile?.preset || null
  };
}

function getSeductionFocus(challenge = state.currentChallenge) {
  if (challenge?.insightFocus?.name) return challenge.insightFocus;
  const femalePartner = getFemalePartner();
  return femalePartner ? toInsightProfile(femalePartner) : { name: "O casal", preset: null };
}

function getSeductionFocusLabel(challenge = state.currentChallenge) {
  return getSeductionFocus(challenge).name || "O casal";
}

function setupTimer(seconds) {
  stopTimer();
  state.timerInitial = seconds || 0;
  state.timerRemaining = seconds || 0;
  state.lastVibrationAt = 0;
  state.lastCountdownBeep = null;

  if (seconds > 0) {
    dom.timerBox.hidden = false;
    dom.timerStart.textContent = "Iniciar";
    dom.timerStart.disabled = false;
    dom.timerPause.disabled = true;
    dom.timerRestart.disabled = false;
    updateTimerDisplay();
  } else {
    dom.timerBox.hidden = true;
  }
}

function startTimer() {
  if (!state.timerInitial) return;
  unlockAudio();

  if (state.timerRemaining <= 0) {
    state.timerRemaining = state.timerInitial;
    state.lastCountdownBeep = null;
    updateTimerDisplay();
  }

  state.timerRunning = true;
  state.lastTimerTick = performance.now();
  state.timerFrameId = requestAnimationFrame(tickTimer);

  dom.timerStart.textContent = "Retomar";
  dom.timerStart.disabled = true;
  dom.timerPause.disabled = false;
  dom.timerRestart.disabled = false;
}

function pauseTimer() {
  if (!state.timerRunning) return;
  stopTimer();
  dom.timerStart.textContent = "Retomar";
  dom.timerStart.disabled = false;
  dom.timerPause.disabled = true;
}

function restartTimer() {
  stopTimer();
  state.timerRemaining = state.timerInitial;
  state.lastCountdownBeep = null;
  updateTimerDisplay();
  dom.timerStart.textContent = "Iniciar";
  dom.timerStart.disabled = false;
  dom.timerPause.disabled = true;
  dom.timerRestart.disabled = false;
}

function stopTimer() {
  if (state.timerFrameId) {
    cancelAnimationFrame(state.timerFrameId);
    state.timerFrameId = null;
  }
  state.timerRunning = false;
}

function tickTimer(timestamp) {
  if (!state.timerRunning) return;

  const elapsed = (timestamp - state.lastTimerTick) / 1000;
  state.lastTimerTick = timestamp;
  state.timerRemaining = Math.max(0, state.timerRemaining - elapsed);
  updateTimerDisplay();
  playFinalCountdownBeep();
  pulseTimerVibration(timestamp);

  if (state.timerRemaining <= 0) {
    stopTimer();
    signalTimerEnd();
    dom.timerStart.textContent = "Iniciar";
    dom.timerStart.disabled = false;
    dom.timerPause.disabled = true;
    dom.timerRestart.disabled = false;
    return;
  }

  state.timerFrameId = requestAnimationFrame(tickTimer);
}

function pulseTimerVibration(timestamp) {
  const rank = state.currentChallenge?.rank || 0;
  if (rank < 8 || !navigator.vibrate) return;

  const tension = state.timerInitial
    ? clamp(1 - state.timerRemaining / state.timerInitial, 0, 1)
    : 0;
  const intervalRanges = {
    8: [13000, 5000],
    9: [11000, 4200],
    10: [7600, 2600],
    11: [5200, 1500],
    12: [3800, 1000]
  };
  const [slow, fast] = intervalRanges[rank] || intervalRanges[8];
  const interval = slow - (slow - fast) * tension;
  const pulse = Math.round(70 + tension * 110 + (rank - 8) * 24);
  const gap = Math.round(95 - tension * 54);
  const patterns = {
    8: [pulse, gap, pulse + 30],
    9: [pulse, gap, pulse + 45, gap, pulse + 70],
    10: [pulse, gap, pulse + 55, gap, pulse + 90, gap, pulse + 125],
    11: [pulse, gap, pulse + 60, gap, pulse + 100, gap, pulse + 150],
    12: [pulse, gap, pulse + 70, gap, pulse + 120, gap, pulse + 180]
  };

  if (!state.lastVibrationAt || timestamp - state.lastVibrationAt >= interval) {
    navigator.vibrate(patterns[rank]);
    state.lastVibrationAt = timestamp;
  }
}

function updateTimerDisplay() {
  const safe = Math.max(0, Math.ceil(state.timerRemaining));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  dom.timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function signalTimerEnd() {
  if (navigator.vibrate) navigator.vibrate([180, 70, 220, 70, 300]);
  playTimerEndSound();
  flash();
}

function signalMoment(rank) {
  if (!navigator.vibrate) return;
  if (rank >= 12) navigator.vibrate([120, 50, 160, 60, 220]);
  else if (rank >= 9) navigator.vibrate([90, 50, 120]);
}

function closeResult() {
  stopTimer();
  dom.resultModal.hidden = true;
  dom.insightBox.hidden = true;
  advanceTurn();
  saveSession();
  renderAll();
}

async function copyCurrentChallenge() {
  const text = dom.resultText.textContent.trim();
  if (!text) return;

  try {
    await navigator.clipboard.writeText(text);
    temporarilyLabel(dom.copyResult, "Copiado");
  } catch {
    temporarilyLabel(dom.copyResult, "Falhou");
  }
}

function showPreviousChallenge() {
  const previous = getPreviousChallengeInHistory();
  if (!previous) {
    showToast("Ainda não há pergunta anterior nesta sessão.");
    updatePreviousResultButton();
    return;
  }

  stopTimer();
  state.currentChallenge = previous;
  showResult(previous);
  saveSession();
  renderAll();
  showToast("Pergunta anterior na tela.");
}

function getPreviousChallengeInHistory(challenge = state.currentChallenge) {
  if (!challenge || !Array.isArray(state.history) || state.history.length < 2) return null;
  const index = getHistoryIndexForChallenge(challenge);
  const previousIndex = index >= 0 ? index + 1 : 1;
  return state.history[previousIndex] || null;
}

function getHistoryIndexForChallenge(challenge) {
  if (!challenge) return -1;
  return state.history.findIndex((entry) =>
    (challenge.at && entry.at === challenge.at) ||
    (entry.id === challenge.id && entry.text === challenge.text)
  );
}

function applyChallengeFeedback(value) {
  if (!state.currentChallenge || !["like", "dislike"].includes(value)) return;

  const challenge = state.currentChallenge;
  const previous = challenge.feedback || null;
  if (previous === value) {
    showToast(value === "like" ? "Esse curti já estava salvo." : "Essa pergunta já perdeu peso.");
    return;
  }

  const delta = getFeedbackValue(value) - getFeedbackValue(previous);
  updateChallengeFeedbackProfile(challenge, delta);
  updateCurrentChallengeFeedback(challenge.id, value, { skipped: value === "dislike" });
  updatePacingFromChallengeFeedback(delta, challenge);
  updateFeedbackButtons(challenge);
  saveSession();

  if (value === "dislike") {
    const replaced = replaceCurrentChallenge(challenge);
    showToast(replaced
      ? "Aprendido: troquei por outra pergunta e reduzi temas parecidos."
      : "Aprendido: essa pergunta perde peso nos próximos giros.");
    return;
  }

  showToast("Aprendido: perguntas parecidas ganham mais chance.");
  updateSessionRank({ forcePulse: true });
  saveSession();
  renderAll();
}

function getFeedbackValue(value) {
  if (value === "like") return 1;
  if (value === "dislike") return -1;
  return 0;
}

function updateChallengeFeedbackProfile(challenge, delta) {
  if (!delta) return;

  const feedback = normalizeChallengeFeedback(state.challengeFeedback);
  feedback.challengeScores[challenge.id] = clamp((feedback.challengeScores[challenge.id] || 0) + delta, -4, 5);
  feedback.rankScores[challenge.rank] = clamp((feedback.rankScores[challenge.rank] || 0) + delta * 0.35, -3, 4);

  getChallengeFeedbackTags(challenge).forEach((tag) => {
    feedback.tagScores[tag] = clamp((feedback.tagScores[tag] || 0) + delta, -5, 6);
  });

  feedback.count += 1;
  feedback.lastUpdatedAt = new Date().toISOString();
  state.challengeFeedback = feedback;
}

function updateCurrentChallengeFeedback(challengeId, value, options = {}) {
  const skipped = Boolean(options.skipped);

  if (state.currentChallenge?.id === challengeId) {
    state.currentChallenge.feedback = value;
    state.currentChallenge.skipped = skipped;
  }

  const entry = state.history.find((item) => item.id === challengeId);
  if (!entry) return;

  entry.feedback = value;
  entry.skipped = skipped;
}

function updatePacingFromChallengeFeedback(delta, challenge) {
  if (delta < 0) {
    state.heatBias = clamp(state.heatBias - 1, -2, 2);
    return;
  }

  if (delta > 0 && challenge.rank >= 6) {
    state.heatBias = clamp(state.heatBias + 1, -2, 2);
  }
}

function replaceCurrentChallenge(previousChallenge) {
  const entries = getReplacementChallengeEntries(previousChallenge);
  if (!entries.length) {
    updateSessionRank({ forcePulse: true });
    saveSession();
    renderAll();
    return false;
  }

  stopTimer();
  const selected = weightedPick(entries);
  const replacement = buildChallengeResult(selected);
  replacement.replacesId = previousChallenge.id;
  state.currentChallenge = replacement;
  markChallengeUsed(selected.id);
  state.history = [replacement, ...state.history].slice(0, 80);
  updateSessionRank({ forcePulse: true });
  showResult(replacement);
  saveSession();
  renderAll();
  return true;
}

function getReplacementChallengeEntries(previousChallenge) {
  const used = new Set(state.usedChallengeIds);
  const pool = getChallengePool().filter((challenge) =>
    !challenge.loop &&
    !used.has(challenge.id)
  );
  const sameRank = pool.filter((challenge) => challenge.rank === previousChallenge.rank);
  const nearby = pool.filter((challenge) =>
    challenge.rank !== previousChallenge.rank &&
    Math.abs(challenge.rank - previousChallenge.rank) <= 1
  );
  const candidates = sameRank.length ? sameRank : nearby;

  return candidates
    .map((challenge) => ({
      challenge,
      weight: getReplacementChallengeWeight(challenge, previousChallenge)
    }))
    .filter((entry) => entry.weight > 0);
}

function getReplacementChallengeWeight(challenge, previousChallenge) {
  const distance = Math.abs(challenge.rank - previousChallenge.rank);
  const base = Math.max(getChallengeWeight(challenge), 0.2);
  return base * (distance ? 0.45 : 1);
}

function markChallengeUsed(challengeId) {
  if (!state.usedChallengeIds.includes(challengeId)) {
    state.usedChallengeIds.push(challengeId);
  }
}

function updateFeedbackButtons(challenge = state.currentChallenge) {
  const feedback = challenge?.feedback || "";
  dom.feedbackLike.classList.toggle("is-selected", feedback === "like");
  dom.feedbackDislike.classList.toggle("is-selected", feedback === "dislike");
  dom.feedbackLike.setAttribute("aria-pressed", String(feedback === "like"));
  dom.feedbackDislike.setAttribute("aria-pressed", String(feedback === "dislike"));
}

function updatePreviousResultButton(challenge = state.currentChallenge) {
  const hasPrevious = Boolean(getPreviousChallengeInHistory(challenge));
  dom.previousResult.disabled = !hasPrevious;
  dom.previousResult.setAttribute("aria-disabled", String(!hasPrevious));
}

function applySensoryInsight(answer) {
  if (!state.currentChallenge?.insight) return;

  updateLearningFromInsight(answer, state.currentChallenge);
  updateArousalFromInsight(answer, state.currentChallenge);
  const focus = getSeductionFocus(state.currentChallenge);
  const seductionFocus = focus.name || "O casal";
  const possessive = focus.preset ? getPreset(focus.preset).possessive : "do casal";
  const warmupMessage = `Aprendido: ${seductionFocus} precisa de mais tempo. O motor vai favorecer o ritmo ${possessive}.`;

  if (answer === "ready") {
    state.heatBias = clamp(state.heatBias + 1, -2, 2);
    showToast(state.currentChallenge.seductionFlow
      ? `Aprendido: ${seductionFocus} respondeu bem. O motor pode subir o tom.`
      : "Insight salvo: o motor vai sustentar mais intensidade.");
  } else {
    state.heatBias = clamp(state.heatBias - 1, -2, 2);
    showToast(state.currentChallenge.seductionFlow
      ? warmupMessage
      : "Insight salvo: a roleta vai voltar para estímulos antes de subir.");
  }

  dom.insightBox.hidden = true;
  updateSessionRank({ forcePulse: true });
  saveSession();
  renderAll();
}

function updateLearningFromInsight(answer, challenge) {
  if (state.gameMode !== "couple" || !challenge.seductionFlow || !getFemalePartner()) return;

  const learning = normalizeLearning(state.learning);
  const positive = answer === "ready";
  const tags = Array.isArray(challenge.learningTags) ? challenge.learningTags : [];
  const focus = getSeductionFocus(challenge);
  const tracksFemaleWarmth = focus.preset === "feminine";
  const effectiveTags = tracksFemaleWarmth ? tags : tags.filter((tag) => !tag.startsWith("female"));

  if (tracksFemaleWarmth) {
    learning.femaleWarmth = clamp(learning.femaleWarmth + (positive ? 1 : -1), -4, 4);
  }
  learning.seductionFeedbackCount += challenge.seductionFlow ? 1 : 0;

  effectiveTags.forEach((tag) => {
    const delta = positive ? 1 : -0.7;
    learning.tagScores[tag] = clamp((learning.tagScores[tag] || 0) + delta, -4, 5);
  });

  if (!positive && challenge.seductionFlow && tracksFemaleWarmth) {
    ["femaleChoice", "femaleLeads", "femaleWhispers", "safePacing"].forEach((tag) => {
      learning.tagScores[tag] = clamp((learning.tagScores[tag] || 0) + 1.1, -4, 5);
    });
    ["maleStarts"].forEach((tag) => {
      learning.tagScores[tag] = clamp((learning.tagScores[tag] || 0) - 0.6, -4, 5);
    });
  }

  state.learning = learning;
}

function updateArousalFromInsight(answer, challenge) {
  const focus = getSeductionFocus(challenge);
  if (!focus?.name || focus.name === "O casal") {
    adjustAllArousal(answer === "ready" ? 1 : -1);
    return;
  }

  adjustPartnerArousal(focus.name, answer === "ready" ? 1 : -1);
}

function handleOverrideChange() {
  const value = Number(dom.rankOverride.value);
  state.overrideRank = value ? clamp(value, 1, 14) : null;
  saveSession();
  updateSessionRank({ forcePulse: true });
  renderAll();
}

function handleArousalChange(event) {
  const control = event.target.closest("[data-arousal-key]");
  if (!control) return;

  const key = control.dataset.arousalKey;
  const numericValue = Number(control.value);
  const value = Number.isInteger(numericValue)
    ? AROUSAL_LEVELS[clamp(numericValue, 0, AROUSAL_LEVELS.length - 1)]?.value
    : control.value;

  setArousalLevel(key, value);
}

function handleArousalStep(event) {
  const button = event.target.closest("[data-arousal-step]");
  if (!button) return;

  const key = button.dataset.arousalKey;
  const delta = Number(button.dataset.arousalStep);
  const current = getArousalLevelIndexByKey(key);
  const next = clamp(current + delta, 0, AROUSAL_LEVELS.length - 1);
  setArousalLevel(key, AROUSAL_LEVELS[next].value);
}

function setArousalLevel(key, value) {
  state.arousal = normalizeArousalState(state.arousal);
  state.arousal[key] = AROUSAL_LEVEL_MAP[value] ? value : DEFAULT_AROUSAL_LEVEL;
  saveSession();
  updateSessionRank({ forcePulse: true });
  renderAll();
}

function renderArousalPanel() {
  if (!dom.arousalPanel) return;

  const participants = getArousalParticipants();
  if (!participants.length) {
    dom.arousalPanel.hidden = true;
    dom.arousalPanel.replaceChildren();
    return;
  }

  dom.arousalPanel.hidden = false;
  const header = document.createElement("div");
  header.className = "arousal-panel-head";

  const title = document.createElement("span");
  title.className = "arousal-title";
  title.textContent = "Perfis em cena";

  const caption = document.createElement("span");
  caption.className = "arousal-caption";
  caption.textContent = "Intensidade";
  header.append(title, caption);

  const list = document.createElement("div");
  list.className = "arousal-list";

  participants.forEach((partner, index) => {
    const key = getArousalKey(partner);
    const levelIndex = getArousalLevelIndex(partner);
    const level = AROUSAL_LEVELS[levelIndex];
    const fill = 14 + (levelIndex / Math.max(1, AROUSAL_LEVELS.length - 1)) * 86;
    const flameCount = clamp(Math.ceil((levelIndex + 1) / 2), 1, 3);
    const row = document.createElement("div");
    row.className = "arousal-profile";
    row.classList.toggle("is-alt", index % 2 === 1);
    row.style.setProperty("--arousal-level", String(levelIndex));
    row.style.setProperty("--arousal-fill", `${fill}%`);

    const avatar = document.createElement("span");
    avatar.className = "profile-avatar arousal-avatar";
    avatar.textContent = getProfileInitial(partner);
    avatar.setAttribute("aria-hidden", "true");

    const profile = document.createElement("div");
    profile.className = "arousal-profile-copy";

    const name = document.createElement("strong");
    name.className = "arousal-name";
    name.textContent = partner.name || "Você";

    const valueText = document.createElement("strong");
    valueText.className = "arousal-level";
    valueText.textContent = level.label;
    profile.append(name, valueText);

    const controls = document.createElement("div");
    controls.className = "arousal-profile-control";

    const decrease = document.createElement("button");
    decrease.type = "button";
    decrease.className = "arousal-step";
    decrease.dataset.arousalKey = key;
    decrease.dataset.arousalStep = "-1";
    decrease.setAttribute("aria-label", `Diminuir excitação de ${partner.name || "voce"}`);
    decrease.textContent = "−";

    const track = document.createElement("label");
    track.className = "arousal-profile-track";

    const range = document.createElement("input");
    range.type = "range";
    range.className = "arousal-range";
    range.min = "0";
    range.max = String(AROUSAL_LEVELS.length - 1);
    range.step = "1";
    range.value = String(levelIndex);
    range.dataset.arousalKey = key;
    range.setAttribute("aria-label", `Excitação de ${partner.name || "voce"}`);

    const fillBar = document.createElement("span");
    fillBar.className = "arousal-profile-fill";
    track.append(range, fillBar);

    const increase = document.createElement("button");
    increase.type = "button";
    increase.className = "arousal-step";
    increase.dataset.arousalKey = key;
    increase.dataset.arousalStep = "1";
    increase.setAttribute("aria-label", `Aumentar excitação de ${partner.name || "voce"}`);
    increase.textContent = "+";

    const flames = document.createElement("span");
    flames.className = "arousal-flames";
    flames.setAttribute("aria-label", `${flameCount} chama(s)`);
    for (let i = 0; i < flameCount; i += 1) {
      const flame = document.createElement("span");
      flame.className = "arousal-flame";
      flames.appendChild(flame);
    }

    controls.append(decrease, track, increase);
    row.append(avatar, profile, controls, flames);
    list.appendChild(row);
  });

  dom.arousalPanel.replaceChildren(header, list);
}

function resetSession() {
  const confirmed = window.confirm("Criar uma nova sessão salva a noite atual no registro, libera todos os desafios e zera a curva de intensidade.");
  if (!confirmed) return;

  const archived = archiveCurrentSession("reset");
  startFreshSession();
  state.arousal = createArousalState(state.partners);
  chooseInitialTurn();
  saveSession();
  updateSessionRank({ forcePulse: true });
  renderAll();
  showToast(archived ? "Noite salva no registro. Nova sessão pronta." : "Nova sessão pronta.");
}

function renderAll() {
  syncArousalState();
  applyRankTheme();
  renderDashboard();
  renderTurn();
  renderArousalPanel();
  drawWheel();
}

function renderDashboard() {
  const rank = getRankMeta(state.currentRank);
  const pool = getChallengePool();
  const used = new Set(state.usedChallengeIds);
  const eligible = getEligibleChallengeEntries(pool, used).length;
  const nextAvailable = getNextAvailableChallengeEntries(pool, used, { promote: false }).length;
  const remaining = eligible || nextAvailable;

  dom.wheelRank.textContent = String(rank.rank);
  dom.rankNumber.textContent = String(rank.rank);
  dom.rankPhase.textContent = rank.phase;
  dom.elapsedTime.textContent = formatElapsed(Date.now() - state.sessionStartTime);
  dom.spinCount.textContent = String(state.spinCount);
  dom.unusedCount.textContent = String(Math.max(0, remaining));
  dom.wheelCaption.textContent = rank.caption;
  dom.nextRankHint.textContent = getNextRankHint();
  dom.safeWordDisplay.textContent = state.pauseWord || "-";
  renderRankList();
}

function renderTurn() {
  const current = getCurrentPartner();
  dom.turnName.textContent = current.name;
  if (dom.turnAvatar) {
    dom.turnAvatar.textContent = getProfileInitial(current);
    dom.turnAvatar.classList.toggle("is-alt", modulo(state.turnIndex, 2) === 1);
    dom.turnAvatar.classList.remove("is-pulsing");
    void dom.turnAvatar.offsetWidth;
    dom.turnAvatar.classList.add("is-pulsing");
  }
}

function renderRankList() {
  dom.rankList.replaceChildren();

  RANKS.forEach((rank) => {
    const row = document.createElement("div");
    row.className = "rank-row";
    row.classList.toggle("is-current", rank.rank === state.currentRank);
    row.style.setProperty("--row-color", rank.color);

    const dot = document.createElement("span");
    dot.className = "rank-dot";
    dot.textContent = `C${rank.rank}`;

    const text = document.createElement("span");
    const strong = document.createElement("strong");
    const small = document.createElement("small");
    strong.textContent = rank.short;
    small.textContent = rank.caption;
    text.append(strong, small);

    const weight = document.createElement("em");
    const weightValue = state.lastWeights[rank.rank - 1] || 0;
    weight.textContent = weightValue > 0 ? `${Math.round(weightValue * 100)}%` : "fechado";

    row.append(dot, text, weight);
    dom.rankList.appendChild(row);
  });
}

function openHistoryModal() {
  renderHistory();
  dom.historyModal.hidden = false;
}

function renderHistory() {
  dom.historyList.replaceChildren();
  const archives = loadJson(STORAGE_KEYS.sessionArchive, state.archivedSessions);
  state.archivedSessions = Array.isArray(archives) ? archives : [];

  if (!state.history.length && !state.archivedSessions.length) {
    const item = document.createElement("li");
    item.className = "history-empty";
    item.textContent = "Nenhuma cena registrada ainda.";
    dom.historyList.appendChild(item);
    return;
  }

  if (state.history.length) {
    const currentHeader = document.createElement("li");
    currentHeader.className = "history-section";
    currentHeader.textContent = "Sessão atual";
    dom.historyList.appendChild(currentHeader);
  }

  state.history.forEach((entry) => {
    const rank = getRankMeta(entry.rank);
    const item = document.createElement("li");
    item.className = "history-card";
    item.style.setProperty("--history-color", rank.color);

    const avatar = document.createElement("span");
    avatar.className = "profile-avatar history-avatar";
    avatar.textContent = getProfileInitial({ name: entry.actor });
    avatar.setAttribute("aria-hidden", "true");

    const content = document.createElement("div");
    content.className = "history-card-content";

    const metaRow = document.createElement("div");
    metaRow.className = "history-card-meta";

    const rankTag = document.createElement("span");
    rankTag.textContent = rank.short;

    const timeTag = document.createElement("span");
    timeTag.textContent = formatHistoryTime(entry.at);

    const feedback = getHistoryFeedbackLabel(entry);
    metaRow.append(rankTag, timeTag);
    if (feedback) {
      const feedbackTag = document.createElement("span");
      feedbackTag.className = "history-feedback";
      feedbackTag.textContent = feedback;
      metaRow.appendChild(feedbackTag);
    }

    const title = document.createElement("strong");
    title.textContent = entry.title;

    const actor = document.createElement("em");
    actor.textContent = entry.turnMode === "mutual" ? "Troca do casal" : `Perfil: ${entry.actor}`;

    const text = document.createElement("p");
    text.textContent = entry.text;

    content.append(metaRow, title, actor, text);
    item.append(avatar, content);
    dom.historyList.appendChild(item);
  });

  if (state.archivedSessions.length) {
    const archiveHeader = document.createElement("li");
    archiveHeader.className = "history-section";
    archiveHeader.textContent = "Noites salvas";
    dom.historyList.appendChild(archiveHeader);
  }

  state.archivedSessions.forEach((session) => {
    const item = document.createElement("li");
    item.className = "history-card history-archive";
    item.style.setProperty("--history-color", getRankMeta(session.maxRank || 1).color);

    const avatar = document.createElement("span");
    avatar.className = "profile-avatar history-avatar";
    avatar.textContent = getProfileInitial({ name: session.partners?.[0] || "Noite" });
    avatar.setAttribute("aria-hidden", "true");

    const content = document.createElement("div");
    content.className = "history-card-content";

    const metaRow = document.createElement("div");
    metaRow.className = "history-card-meta";

    const category = document.createElement("span");
    category.textContent = `C${session.maxRank || 1}`;

    const mode = document.createElement("span");
    mode.textContent = session.gameMode === "solo" ? "Solo" : "Casal";

    const scenes = document.createElement("span");
    scenes.textContent = `${session.spinCount || 0} cena(s)`;

    metaRow.append(category, mode, scenes);

    const title = document.createElement("strong");
    const meta = document.createElement("em");
    const partners = session.partners?.length ? session.partners.join(" + ") : "Sessão privada";
    title.textContent = partners;
    meta.textContent = `${formatHistoryTime(session.endedAt)} · ${formatDuration(session.durationMs)}`;

    content.append(metaRow, title, meta);
    item.append(avatar, content);
    dom.historyList.appendChild(item);
  });
}

function getHistoryFeedbackLabel(entry) {
  if (entry.skipped) return "Trocada";
  if (entry.feedback === "like") return "Curti";
  if (entry.feedback === "dislike") return "Não curti";
  return "";
}

function drawWheel() {
  if (!ctx) return;

  const size = dom.canvas.width / state.devicePixelRatio;
  const center = size / 2;
  const radius = center - 18;
  const slice = (Math.PI * 2) / RANKS.length;
  const weights = state.lastWeights || WEIGHT_MATRIX[state.currentRank];
  const maxWeight = Math.max(...weights, 1);
  const pulse = dom.rankPulse.classList.contains("is-active") ? 1 : 0;

  ctx.clearRect(0, 0, size, size);
  ctx.save();
  ctx.translate(center, center);

  RANKS.forEach((rank, index) => {
    const start = index * slice - Math.PI / 2;
    const end = start + slice;
    const weight = weights[index] || 0;
    const heat = weight / maxWeight;
    const active = weight > 0;
    const current = rank.rank === state.currentRank;
    const gradient = ctx.createRadialGradient(0, 0, radius * 0.08, 0, 0, radius);

    gradient.addColorStop(0, active ? rank.accent : "#3a3033");
    gradient.addColorStop(0.62, active ? rank.color : "#21191c");
    gradient.addColorStop(1, current ? "#1b070d" : "#090507");

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, start, end);
    ctx.closePath();
    ctx.globalAlpha = active ? 0.42 + heat * 0.58 : 0.26;
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = current ? rank.color : "rgba(255,255,255,0.16)";
    ctx.lineWidth = current ? 3 + pulse * 2 : 1.2;
    ctx.stroke();

    drawWheelLabel(rank, active, current, start + slice / 2, radius, pulse);
  });

  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.36, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(7, 4, 6, 0.72)";
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.strokeStyle = getRankMeta(state.currentRank).color;
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.restore();
}

function drawWheelLabel(rank, active, current, angle, radius, pulse) {
  const canvasWidth = dom.canvas.width / state.devicePixelRatio;
  const isMobile = canvasWidth <= 360;
  const isTablet = canvasWidth > 360 && canvasWidth < 450;
  const isDesktop = canvasWidth >= 450;

  let fontSize, chipWidth, chipHeight, iconRadius, labelRadius, yOffset;

  if (isMobile) {
    fontSize = 7;
    chipWidth = 44;
    chipHeight = 18;
    iconRadius = 9;
    labelRadius = radius * 0.72;
    yOffset = 8;
  } else if (isTablet) {
    fontSize = 8;
    chipWidth = 50;
    chipHeight = 20;
    iconRadius = 10;
    labelRadius = radius * 0.74;
    yOffset = 10;
  } else {
    fontSize = 10;
    chipWidth = 58;
    chipHeight = 22;
    iconRadius = 12;
    labelRadius = radius * 0.76;
    yOffset = 12;
  }

  const x = Math.cos(angle) * labelRadius;
  const y = Math.sin(angle) * labelRadius;
  const counterRotation = -(modulo(state.rotation, 360) * Math.PI) / 180;

  const hotPink = "#e0457b";
  const textColor = current ? "#ff9bc0" : active ? "#e8dcc8" : "rgba(232, 220, 200, 0.52)";
  const iconColor = current ? hotPink : active ? "#c9a24b" : "rgba(232, 220, 200, 0.44)";

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(counterRotation);

  ctx.shadowColor = current ? "rgba(224, 69, 123, 0.64)" : "rgba(0, 0, 0, 0.38)";
  ctx.shadowBlur = current ? 10 + pulse * 6 : 5;

  drawRankIconResponsive(rank.icon, 0, -yOffset - 4, iconColor, iconRadius, active, current);

  ctx.font = `700 ${fontSize}px Inter, system-ui, sans-serif`;
  
  const shortLabels = {
    "Conexão": "Conex",
    "Toque": "Toque",
    "Rituais": "Ritual",
    "Beijos": "Beijos",
    "Desafios": "Desaf",
    "Sensorial": "Senso",
    "Strip": "Strip",
    "Fantasia": "Fanta",
    "Manual": "Manual",
    "Oral": "Oral",
    "Poder": "Poder",
    "Clímax": "Clímax",
    "Surpresa": "Surpr",
    "Cuidado": "Cuid"
  };
  
  let displayText = shortLabels[rank.short] || rank.short;
  
  const textMetrics = ctx.measureText(displayText);
  if (textMetrics.width > chipWidth - 10) {
    displayText = displayText.substring(0, 4) + ".";
  }
  
  const actualTextWidth = ctx.measureText(displayText).width;
  const finalChipWidth = Math.max(chipWidth, Math.ceil(actualTextWidth) + 12);

  const chipLeft = -finalChipWidth / 2;
  const chipTop = yOffset;

  ctx.shadowBlur = current ? 8 + pulse * 4 : 4;
  ctx.fillStyle = current ? "rgba(224, 69, 123, 0.18)" : active ? "rgba(15, 11, 13, 0.72)" : "rgba(15, 11, 13, 0.36)";
  drawRoundRect(chipLeft, chipTop, finalChipWidth, chipHeight, 6);
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.lineWidth = current ? 1.5 : 0.8;
  ctx.strokeStyle = current ? hotPink : active ? "rgba(201, 162, 75, 0.26)" : "rgba(232, 220, 200, 0.1)";
  drawRoundRect(chipLeft, chipTop, finalChipWidth, chipHeight, 6);
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = textColor;
  ctx.font = `800 ${fontSize}px Inter, system-ui, sans-serif`;
  ctx.fillText(displayText, 0, chipTop + chipHeight / 2 + 0.5);

  ctx.restore();
}

function drawRankIconResponsive(icon, x, y, color, radius, active, current) {
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = active ? 1 : 0.62;
  ctx.fillStyle = current ? hexToRgba(color, 0.24) : "rgba(255, 247, 239, 0.08)";
  ctx.strokeStyle = color;
  ctx.lineWidth = current ? 2.2 : 1.8;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();

  switch (icon) {
    case "massage": drawMassageIcon(); break;
    case "touch": drawTouchIcon(); break;
    case "kiss": drawKissIcon(); break;
    case "strip": drawStripIcon(); break;
    case "hand": drawHandIcon(); break;
    case "mouth": drawMouthIcon(); break;
    case "climax": drawFlameIcon(); break;
    case "game": drawGameIcon(); break;
    case "ritual": drawRitualIcon(); break;
    case "sensory": drawSensoryIcon(); break;
    case "fantasy": drawFantasyIcon(); break;
    case "power": drawPowerIcon(); break;
    case "surprise": drawSurpriseIcon(); break;
    case "aftercare": drawAftercareIcon(); break;
    default: drawWhisperIcon(); break;
  }

  ctx.restore();
}

function drawRankIcon(icon, x, y, color, active, current) {
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = active ? 1 : 0.62;
  ctx.fillStyle = current ? hexToRgba(color, 0.24) : "rgba(255, 247, 239, 0.08)";
  ctx.strokeStyle = color;
  ctx.lineWidth = current ? 2.2 : 1.8;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.beginPath();
  ctx.arc(0, 0, 15, 0, Math.PI * 2);
  ctx.fill();

  switch (icon) {
    case "massage": drawMassageIcon(); break;
    case "touch": drawTouchIcon(); break;
    case "kiss": drawKissIcon(); break;
    case "strip": drawStripIcon(); break;
    case "hand": drawHandIcon(); break;
    case "mouth": drawMouthIcon(); break;
    case "climax": drawFlameIcon(); break;
    case "game": drawGameIcon(); break;
    case "ritual": drawRitualIcon(); break;
    case "sensory": drawSensoryIcon(); break;
    case "fantasy": drawFantasyIcon(); break;
    case "power": drawPowerIcon(); break;
    case "surprise": drawSurpriseIcon(); break;
    case "aftercare": drawAftercareIcon(); break;
    default: drawWhisperIcon(); break;
  }

  ctx.restore();
}

function drawMassageIcon() {
  ctx.beginPath();
  ctx.moveTo(-10, -5);
  ctx.quadraticCurveTo(-5, -10, 0, -5);
  ctx.quadraticCurveTo(5, 0, 10, -5);
  ctx.moveTo(-11, 1);
  ctx.quadraticCurveTo(-5, -3, 0, 1);
  ctx.quadraticCurveTo(5, 5, 11, 1);
  ctx.moveTo(-9, 7);
  ctx.quadraticCurveTo(-3, 3, 3, 7);
  ctx.stroke();
}

function drawWhisperIcon() {
  drawRoundRect(-8, -7, 16, 11, 5);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-2, 4);
  ctx.lineTo(-6, 9);
  ctx.lineTo(2, 5);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-4, -2);
  ctx.lineTo(4, -2);
  ctx.moveTo(-3, 2);
  ctx.lineTo(3, 2);
  ctx.stroke();
}

function drawTouchIcon() {
  ctx.beginPath();
  ctx.moveTo(-7, 6);
  ctx.quadraticCurveTo(-2, 10, 4, 6);
  ctx.quadraticCurveTo(10, 2, 6, -3);
  ctx.moveTo(-4, 5);
  ctx.lineTo(-4, -8);
  ctx.moveTo(0, 5);
  ctx.lineTo(0, -10);
  ctx.moveTo(4, 4);
  ctx.lineTo(4, -7);
  ctx.moveTo(8, 1);
  ctx.lineTo(8, -4);
  ctx.stroke();
}

function drawKissIcon() {
  ctx.beginPath();
  ctx.moveTo(-10, 0);
  ctx.bezierCurveTo(-6, -7, -2, -6, 0, -2);
  ctx.bezierCurveTo(3, -7, 8, -6, 10, 0);
  ctx.bezierCurveTo(5, 5, -5, 5, -10, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-8, 0);
  ctx.quadraticCurveTo(0, 3, 8, 0);
  ctx.stroke();
}

function drawEyeIcon() {
  ctx.beginPath();
  ctx.moveTo(-11, 0);
  ctx.quadraticCurveTo(0, -8, 11, 0);
  ctx.quadraticCurveTo(0, 8, -11, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, 3.2, 0, Math.PI * 2);
  ctx.fillStyle = ctx.strokeStyle;
  ctx.fill();
}

function drawStripIcon() {
  ctx.beginPath();
  ctx.moveTo(0, -11);
  ctx.quadraticCurveTo(7, -8, 2, -3);
  ctx.lineTo(2, -1);
  ctx.moveTo(0, -1);
  ctx.lineTo(-10, 8);
  ctx.lineTo(10, 8);
  ctx.closePath();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-5, 8);
  ctx.lineTo(-2, 1);
  ctx.moveTo(5, 8);
  ctx.lineTo(2, 1);
  ctx.stroke();
}

function drawHandIcon() {
  ctx.beginPath();
  ctx.moveTo(-7, 7);
  ctx.lineTo(-7, -1);
  ctx.moveTo(-3, 5);
  ctx.lineTo(-3, -8);
  ctx.moveTo(1, 5);
  ctx.lineTo(1, -10);
  ctx.moveTo(5, 5);
  ctx.lineTo(5, -7);
  ctx.moveTo(9, 2);
  ctx.quadraticCurveTo(8, 10, 0, 10);
  ctx.quadraticCurveTo(-6, 10, -7, 7);
  ctx.stroke();
}

function drawMouthIcon() {
  ctx.beginPath();
  ctx.moveTo(-10, -1);
  ctx.quadraticCurveTo(-4, -6, 0, -3);
  ctx.quadraticCurveTo(4, -6, 10, -1);
  ctx.quadraticCurveTo(5, 7, -5, 7);
  ctx.quadraticCurveTo(-8, 5, -10, -1);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-5, 3);
  ctx.quadraticCurveTo(0, 6, 5, 3);
  ctx.stroke();
}

function drawFlameIcon() {
  ctx.beginPath();
  ctx.moveTo(0, 10);
  ctx.bezierCurveTo(-9, 5, -7, -4, -1, -11);
  ctx.bezierCurveTo(0, -5, 8, -4, 7, 3);
  ctx.bezierCurveTo(7, 8, 3, 10, 0, 10);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, 7);
  ctx.bezierCurveTo(-3, 4, -2, 0, 1, -4);
  ctx.bezierCurveTo(4, 1, 4, 5, 0, 7);
  ctx.stroke();
}

function drawGameIcon() {
  ctx.beginPath();
  drawRoundRect(-10, -10, 20, 20, 4);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(-4, -2, 2, 0, Math.PI * 2);
  ctx.arc(4, -2, 2, 0, Math.PI * 2);
  ctx.arc(-4, 5, 2, 0, Math.PI * 2);
  ctx.arc(4, 5, 2, 0, Math.PI * 2);
  ctx.fill();
}

function drawRitualIcon() {
  ctx.beginPath();
  ctx.moveTo(0, -10);
  ctx.lineTo(0, 10);
  ctx.moveTo(-8, 4);
  ctx.quadraticCurveTo(0, 10, 8, 4);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, -4, 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawSensoryIcon() {
  ctx.beginPath();
  ctx.moveTo(-4, 8);
  ctx.quadraticCurveTo(-10, 0, -4, -8);
  ctx.moveTo(0, 8);
  ctx.quadraticCurveTo(-6, 0, 0, -8);
  ctx.moveTo(4, 8);
  ctx.quadraticCurveTo(-2, 0, 4, -8);
  ctx.stroke();
}

function drawFantasyIcon() {
  ctx.beginPath();
  ctx.moveTo(0, -10);
  ctx.lineTo(7, -4);
  ctx.lineTo(4, 3);
  ctx.lineTo(-4, 3);
  ctx.lineTo(-7, -4);
  ctx.closePath();
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, -4, 2.5, 0, Math.PI * 2);
  ctx.fill();
}

function drawPowerIcon() {
  ctx.beginPath();
  ctx.moveTo(0, -10);
  ctx.lineTo(-7, 4);
  ctx.lineTo(-2, 4);
  ctx.lineTo(0, 10);
  ctx.lineTo(7, -4);
  ctx.lineTo(2, -4);
  ctx.closePath();
  ctx.stroke();
}

function drawSurpriseIcon() {
  ctx.beginPath();
  ctx.arc(0, 0, 9, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-5, -3);
  ctx.lineTo(-5, -5);
  ctx.moveTo(5, -3);
  ctx.lineTo(5, -5);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-3, 4);
  ctx.quadraticCurveTo(0, 7, 3, 4);
  ctx.stroke();
}

function drawAftercareIcon() {
  ctx.beginPath();
  ctx.moveTo(0, 3);
  ctx.bezierCurveTo(-9, -2, -9, -9, -3, -8);
  ctx.bezierCurveTo(0, -7, 0, -3, 0, -3);
  ctx.bezierCurveTo(0, -3, 0, -7, 3, -8);
  ctx.bezierCurveTo(9, -9, 9, -2, 0, 3);
  ctx.stroke();
}

function drawRoundRect(x, y, width, height, radius) {
  if (typeof ctx.roundRect === "function") {
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    return;
  }

  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function initializeCanvas() {
  if (!dom.canvas) return;
  const shell = dom.canvas.parentElement;
  const rect = shell ? shell.getBoundingClientRect() : dom.canvas.getBoundingClientRect();
  const cssSize = Math.max(280, Math.round(rect.width || 520));

  dom.canvas.width = cssSize * state.devicePixelRatio;
  dom.canvas.height = cssSize * state.devicePixelRatio;
  dom.canvas.style.width = "100%";
  dom.canvas.style.height = "100%";

  ctx = dom.canvas.getContext("2d", { alpha: true });
  ctx.setTransform(state.devicePixelRatio, 0, 0, state.devicePixelRatio, 0, 0);
}

function startWheelIntroAnimation() {
  if (!dom.wheelShell || state.spinCount > 0) return;

  dom.wheelShell.classList.remove("is-intro");
  void dom.wheelShell.offsetWidth;
  dom.wheelShell.classList.add("is-intro");
  window.setTimeout(() => {
    dom.wheelShell?.classList.remove("is-intro");
  }, 2600);
}

function applyRankTheme() {
  const rank = getRankMeta(state.currentRank);
  const heat = (rank.rank - 1) / 13;
  document.body.dataset.rank = String(rank.rank);
  document.documentElement.style.setProperty("--heat", String(heat));
  document.documentElement.style.setProperty("--rank-color", rank.color);
  document.documentElement.style.setProperty("--rank-accent", rank.accent);
  document.documentElement.style.setProperty("--rank-shadow", hexToRgba(rank.color, 0.42 + heat * 0.22));
  document.documentElement.style.setProperty("--primary-start", rank.color);
  document.documentElement.style.setProperty("--primary-end", rank.rank <= 4 ? rank.accent : "#e0457b");
  document.documentElement.style.setProperty("--primary-ink", rank.rank <= 4 ? "#140d10" : "#fff7ef");
  dom.stageBg.style.backgroundImage = getRankSceneImage(rank);
}

function pulseRankChange() {
  dom.rankPulse.classList.remove("is-active");
  void dom.rankPulse.offsetWidth;
  dom.rankPulse.classList.add("is-active");
  flash();
}

function flash() {
  dom.flash.classList.remove("is-active");
  void dom.flash.offsetWidth;
  dom.flash.classList.add("is-active");
}

function openSessionDrawer() {
  dom.sessionDrawer.classList.add("is-open");
  dom.sessionDrawer.setAttribute("aria-hidden", "false");
}

function closeSessionDrawer() {
  dom.sessionDrawer.classList.remove("is-open");
  dom.sessionDrawer.setAttribute("aria-hidden", "true");
}

function getNextRankHint() {
  if (state.overrideRank) return `Curva manual: categoria ${state.overrideRank} em cena.`;

  if (shouldEnterClosingMode()) {
    return getClosingModeHint();
  }

  if (!canAdvanceRank()) {
    const requiredTurns = getRequiredTurnsForCurrentRank();
    const turns = getTurnsByPartnerInCurrentRank();

    const pending = state.partners
      .filter((p) => (turns[p.name] || 0) < requiredTurns)
      .map((p) => p.name)
      .join(" e ");

    if (pending) {
      return `Aguardando mais desafio(s) para ${pending} antes de subir.`;
    }
  }

  const arousalHint = getArousalPacingHint();
  if (arousalHint) return arousalHint;

  const learningHint = getLearningPacingHint();
  if (learningHint) return learningHint;

  if (state.currentRank >= 14) {
    return "Categoria final: sessão encerrando, foco no cuidado.";
  }

  const next = state.currentRank + 1;
  const preset = PROGRESSION_PRESETS[state.progressionMode] || PROGRESSION_PRESETS.standard;
  const target = preset[next];

  if (!target) {
    return "Explore as categorias livremente.";
  }

  const remainingMinutes = Math.max(
    0,
    Math.ceil(target.minutes - getMinutesElapsed())
  );

  const remainingSpins = Math.max(
    0,
    target.spins - state.spinCount
  );

  if (remainingMinutes <= 0 || remainingSpins <= 0) {
    return "Próxima categoria liberada no próximo giro.";
  }

  return `Próxima categoria em ${remainingMinutes} min ou ${remainingSpins} cena(s).`;
}

function getRequiredTurnsForCurrentRank() {
  if (state.gameMode !== "couple" || state.partners.length < 2) return 0;

  if (state.progressionMode === "short") return 1;

  if (state.currentRank <= 4) return 2;

  return 1;
}

function getLearningPacingHint() {
  const femalePartner = getFemalePartner();
  if (state.gameMode !== "couple" || !femalePartner) return "";

  const learning = normalizeLearning(state.learning);
  if (!learning.seductionFeedbackCount || learning.femaleWarmth >= 0) return "";
  const focus = femalePartner.name || "ela";

  if (learning.femaleWarmth <= -2) {
    return `Leitura de ${focus}: segurar o avanço e favorecer condução, escolha e sussurros.`;
  }

  return `Leitura de ${focus}: subir mais devagar e deixar ela responder antes de aumentar o tom.`;
}

function getArousalPacingHint() {
  const participants = getArousalParticipants();
  if (!participants.length) return "";

  const cold = participants.find((partner) => getArousalScore(partner) <= 0);
  if (cold) return `${cold.name || "Participante"} marcou frio: a roleta segura a intensidade e favorece aquecimento.`;

  const warming = participants.find((partner) => getArousalScore(partner) === 1);
  if (warming && state.currentRank >= 8) {
    return `${warming.name || "Participante"} ainda esta aquecendo: estimulos diretos perdem peso.`;
  }

  const edge = participants.find((partner) => getArousalScore(partner) >= 4);
  if (edge) return `${edge.name || "Participante"} esta quase la: recuos e desfechos ganham prioridade.`;

  return "";
}

function getCurrentPartner() {
  if (!state.partners.length) return normalizeProfile({ name: state.gameMode === "solo" ? "Você" : "Casal" });
  return state.partners[modulo(state.turnIndex, state.partners.length)];
}

function getProfileInitial(partner) {
  const name = String(partner?.name || "C").trim();
  return (Array.from(name)[0] || "C").toLocaleUpperCase("pt-BR");
}

function getOtherPartner() {
  if (state.gameMode === "solo" || state.partners.length < 2) {
    return {
      ...getCurrentPartner(),
      name: "seu próprio corpo",
      isSelf: true
    };
  }
  return state.partners[modulo(state.turnIndex + 1, state.partners.length)];
}

function getFemalePartner() {
  return state.partners.find((partner) => partner.preset === "feminine") || null;
}

function getMalePartner() {
  return state.partners.find((partner) => partner.preset === "masculine") || null;
}

function getOtherThan(profile) {
  if (!profile) return getCurrentPartner();
  return state.partners.find((partner) => partner.name !== profile.name) || getOtherPartner();
}

function resolveChallengeRoles(challenge = {}) {
  const actor = resolveRoleTarget(challenge.actorTarget || "current");
  if (!actor) return null;

  const receiver = resolveRoleTarget(challenge.receiverTarget || "other", actor);
  if (!receiver) return null;

  return { actor, receiver };
}

function resolveRoleTarget(target, relativeTo = null) {
  if (target === "current") return getCurrentPartner();
  if (target === "other") return relativeTo ? getOtherThan(relativeTo) : getOtherPartner();
  if (target === "female") return getFemalePartner();
  if (target === "male") return getMalePartner();
  return null;
}

function advanceTurn() {
  if (state.gameMode !== "couple" || state.partners.length < 2) return;
  state.turnIndex = modulo(state.turnIndex + 1, state.partners.length);
}

function chooseInitialTurn() {
  if (state.gameMode !== "couple" || state.partners.length < 2) return;
  state.turnIndex = Math.floor(Math.random() * state.partners.length);
}

function formatChallengeText(text, actor, receiver) {
  const actorPreset = getPreset(actor.preset);
  const receiverPreset = getPreset(receiver.preset);
  const femalePartner = getFemalePartner() || receiver;
  const otherPartner = getOtherThan(femalePartner);
  const femalePreset = getPreset(femalePartner.preset);
  const otherPreset = getPreset(otherPartner.preset);

  return text
    .replaceAll("{actor}", actor.name)
    .replaceAll("{receiver}", receiver.name)
    .replaceAll("{partner_one}", state.partners[0]?.name || actor.name)
    .replaceAll("{partner_two}", state.partners[1]?.name || receiver.name)
    .replaceAll("{female_partner}", femalePartner.name)
    .replaceAll("{other_partner}", otherPartner.name)
    .replaceAll("{art_actor}", actorPreset.article)
    .replaceAll("{subj_actor}", actorPreset.subject)
    .replaceAll("{pron_actor}", actorPreset.possessive)
    .replaceAll("{dir_actor}", actorPreset.direct)
    .replaceAll("{art_rec}", receiverPreset.article)
    .replaceAll("{subj_rec}", receiverPreset.subject)
    .replaceAll("{pron_rec}", receiverPreset.possessive)
    .replaceAll("{dir_rec}", receiverPreset.direct)
    .replaceAll("{subj_female}", femalePreset.subject)
    .replaceAll("{pron_female}", femalePreset.possessive)
    .replaceAll("{dir_female}", femalePreset.direct)
    .replaceAll("{subj_other}", otherPreset.subject)
    .replaceAll("{pron_other}", otherPreset.possessive)
    .replaceAll("{dir_other}", otherPreset.direct)
    .replaceAll("{arousal_rec}", receiverPreset.arousal)
    .replaceAll("{arousal_actor}", actorPreset.arousal)
    .replaceAll("{actor_attentive}", actorPreset.attentive)
    .replaceAll("{receiver_attentive}", receiverPreset.attentive)
    .replaceAll("{actor_devoured}", actorPreset.devoured)
    .replaceAll("{receiver_devoured}", receiverPreset.devoured)
    .replaceAll("{actor_dirty}", actorPreset.dirty)
    .replaceAll("{receiver_dirty}", receiverPreset.dirty)
    .replaceAll("{actor_naked}", actorPreset.naked)
    .replaceAll("{receiver_naked}", receiverPreset.naked)
    .replaceAll("{actor_touched}", actorPreset.touched)
    .replaceAll("{receiver_touched}", receiverPreset.touched)
    .replaceAll("{rec_intimacy}", receiverPreset.intimacy)
    .replaceAll("{rec_intimacy_article}", receiverPreset.intimacyWithArticle)
    .replaceAll("{rec_intimacy_locative}", receiverPreset.intimacyLocative)
    .replaceAll("{own_intimacy}", actorPreset.ownIntimacy)
    .replaceAll("{actor_intimacy}", actorPreset.intimacy)
    .replaceAll("{underwear_outer}", actorPreset.underwearOuter)
    .replaceAll("{underwear_inside}", actorPreset.underwearInside)
    .replaceAll("{chest_underwear}", actorPreset.chestUnderwear)
    .replaceAll("{bottom_underwear}", actorPreset.bottomUnderwear);
}

function normalizeProfile(profile) {
  if (typeof profile === "string") {
    return { name: profile, preset: "feminine" };
  }

  const preset = PRONOUN_PRESETS[profile?.preset] ? profile.preset : "feminine";
  return {
    name: profile?.name || "",
    preset
  };
}

function readSessionPreferences(participants = state.partners) {
  const preferences = createDefaultSessionPreferences(participants);

  dom.preferenceInputs.forEach((input) => {
    const key = input.dataset.prefKey;
    if (input.dataset.prefScope === "item") {
      if (SESSION_ITEMS.includes(key)) preferences.items[key] = input.checked;
      return;
    }

    if (input.dataset.prefScope !== "partner" || !CONSENT_LIMITS.includes(key)) return;
    const partner = participants[Number(input.dataset.partnerIndex)];
    if (!partner) return;
    const partnerKey = getContinuityKey(partner.name);
    preferences.limits[partnerKey][key] = input.checked;
  });

  return preferences;
}

function createDefaultSessionPreferences(participants = state.partners) {
  const preferences = {
    limits: {},
    items: {}
  };

  SESSION_ITEMS.forEach((item) => {
    preferences.items[item] = false;
  });

  participants.forEach((partner) => {
    const key = getContinuityKey(partner.name);
    preferences.limits[key] = {};
    CONSENT_LIMITS.forEach((limit) => {
      preferences.limits[key][limit] = false;
    });
  });

  return preferences;
}

function normalizeSessionPreferences(preferences = state.preferences, participants = state.partners) {
  const normalized = createDefaultSessionPreferences(participants);
  const source = preferences && typeof preferences === "object" ? preferences : {};
  const sourceItems = source.items && typeof source.items === "object" ? source.items : {};
  const sourceLimits = source.limits && typeof source.limits === "object" ? source.limits : {};

  SESSION_ITEMS.forEach((item) => {
    normalized.items[item] = Boolean(sourceItems[item]);
  });

  Object.keys(normalized.limits).forEach((partnerKey) => {
    const limits = sourceLimits[partnerKey] && typeof sourceLimits[partnerKey] === "object"
      ? sourceLimits[partnerKey]
      : {};
    CONSENT_LIMITS.forEach((limit) => {
      normalized.limits[partnerKey][limit] = Boolean(limits[limit]);
    });
  });

  return normalized;
}

function getArousalParticipants() {
  if (state.partners.length) return state.partners;
  return state.sessionActive ? [getCurrentPartner()] : [];
}

function createArousalState(participants = getArousalParticipants()) {
  return participants.reduce((acc, partner) => {
    acc[getArousalKey(partner)] = DEFAULT_AROUSAL_LEVEL;
    return acc;
  }, {});
}

function normalizeArousalState(arousal = state.arousal, participants = getArousalParticipants()) {
  const source = arousal && typeof arousal === "object" ? arousal : {};

  return participants.reduce((acc, partner) => {
    const key = getArousalKey(partner);
    acc[key] = AROUSAL_LEVEL_MAP[source[key]] ? source[key] : DEFAULT_AROUSAL_LEVEL;
    return acc;
  }, {});
}

function syncArousalState() {
  state.arousal = normalizeArousalState(state.arousal);
}

function getArousalKey(partner) {
  const profile = partner?.isSelf ? getCurrentPartner() : partner;
  return getContinuityKey(profile?.name || "__self");
}

function getArousalLevel(partner) {
  const key = getArousalKey(partner);
  const value = normalizeArousalState(state.arousal)[key] || DEFAULT_AROUSAL_LEVEL;
  return AROUSAL_LEVEL_MAP[value] || AROUSAL_LEVEL_MAP[DEFAULT_AROUSAL_LEVEL];
}

function getArousalLevelIndex(partner) {
  return AROUSAL_LEVELS.findIndex((level) => level.value === getArousalLevel(partner).value);
}

function getArousalLevelIndexByKey(key) {
  const value = normalizeArousalState(state.arousal)[key] || DEFAULT_AROUSAL_LEVEL;
  const index = AROUSAL_LEVELS.findIndex((level) => level.value === value);
  return index >= 0 ? index : AROUSAL_LEVELS.findIndex((level) => level.value === DEFAULT_AROUSAL_LEVEL);
}

function getArousalScore(partner) {
  return getArousalLevel(partner).score;
}

function getSessionArousalScores() {
  return getArousalParticipants().map((partner) => getArousalScore(partner));
}

function adjustPartnerArousal(name, delta) {
  const partner = state.partners.find((profile) => profile.name === name)
    || (getCurrentPartner().name === name ? getCurrentPartner() : null);
  if (!partner) return;

  const key = getArousalKey(partner);
  state.arousal = normalizeArousalState(state.arousal);
  const current = AROUSAL_LEVELS.findIndex((level) => level.value === state.arousal[key]);
  const nextIndex = clamp(current + delta, 0, AROUSAL_LEVELS.length - 1);
  state.arousal[key] = AROUSAL_LEVELS[nextIndex].value;
}

function adjustAllArousal(delta) {
  getArousalParticipants().forEach((partner) => adjustPartnerArousal(partner.name, delta));
}

function createLearningProfile() {
  return {
    femaleWarmth: 0,
    tagScores: {},
    seductionFeedbackCount: 0
  };
}

function normalizeLearning(learning) {
  const profile = createLearningProfile();
  if (!learning || typeof learning !== "object") return profile;

  profile.femaleWarmth = Number.isFinite(learning.femaleWarmth)
    ? clamp(learning.femaleWarmth, -4, 4)
    : 0;
  profile.seductionFeedbackCount = Number.isFinite(learning.seductionFeedbackCount)
    ? Math.max(0, learning.seductionFeedbackCount)
    : 0;
  profile.tagScores = Object.entries(learning.tagScores || {}).reduce((acc, [tag, score]) => {
    if (Number.isFinite(score)) acc[tag] = clamp(score, -4, 5);
    return acc;
  }, {});

  return profile;
}

function createChallengeFeedbackProfile() {
  return {
    challengeScores: {},
    tagScores: {},
    rankScores: {},
    count: 0,
    lastUpdatedAt: null
  };
}

function normalizeChallengeFeedback(feedback) {
  const profile = createChallengeFeedbackProfile();
  if (!feedback || typeof feedback !== "object") return profile;

  profile.challengeScores = normalizeScoreMap(feedback.challengeScores, -4, 5);
  profile.tagScores = normalizeScoreMap(feedback.tagScores, -5, 6);
  profile.rankScores = normalizeScoreMap(feedback.rankScores, -3, 4);
  profile.count = Number.isFinite(feedback.count) ? Math.max(0, feedback.count) : 0;
  profile.lastUpdatedAt = typeof feedback.lastUpdatedAt === "string" ? feedback.lastUpdatedAt : null;

  return profile;
}

function normalizeScoreMap(source, min, max) {
  return Object.entries(source || {}).reduce((acc, [key, score]) => {
    if (Number.isFinite(score)) acc[key] = clamp(score, min, max);
    return acc;
  }, {});
}

function getPreset(preset) {
  return PRONOUN_PRESETS[preset] || PRONOUN_PRESETS.feminine;
}

function formatElapsed(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function formatHistoryTime(value) {
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(value));
  } catch {
    return "";
  }
}

function formatDuration(ms) {
  const totalSeconds = Math.max(0, Math.floor((ms || 0) / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    return `${hours}h ${rest}min`;
  }
  return `${minutes}min ${seconds}s`;
}

function getMinutesElapsed() {
  return (Date.now() - state.sessionStartTime) / 60000;
}

function getRankMeta(rank) {
  return RANKS.find((entry) => entry.rank === rank) || RANKS[0];
}

function loadJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function temporarilyLabel(button, label) {
  const original = button.textContent;
  button.textContent = label;
  window.setTimeout(() => {
    button.textContent = original;
  }, 1200);
}

function showToast(message) {
  if (toastTimeoutId) window.clearTimeout(toastTimeoutId);
  dom.toast.textContent = message;
  dom.toast.classList.add("is-visible");
  toastTimeoutId = window.setTimeout(() => {
    dom.toast.classList.remove("is-visible");
  }, 2400);
}

function renderMusicControls() {
  dom.musicToggle.classList.toggle("is-muted", state.musicMuted);
  dom.musicToggle.textContent = state.musicMuted ? "Off" : "Som";
  dom.musicToggle.setAttribute("aria-pressed", String(!state.musicMuted));
  dom.musicToggle.setAttribute("title", state.musicMuted ? `Ativar trilha: ${BACKGROUND_TRACK_TITLE}` : `Silenciar trilha: ${BACKGROUND_TRACK_TITLE}`);
  dom.musicVolume.setAttribute("title", `Volume da trilha: ${BACKGROUND_TRACK_TITLE}`);
  dom.musicVolume.value = String(Math.round(state.musicVolume * 100));
}

function toggleMusic() {
  state.musicMuted = !state.musicMuted;
  saveMusicPreferences();
  renderMusicControls();

  if (state.musicMuted) {
    stopMusic();
  } else {
    startMusic();
  }
}

function handleMusicVolumeInput() {
  state.musicVolume = clamp(Number(dom.musicVolume.value) / 100, 0, 1);
  saveMusicPreferences();
  updateMusicGain();
  if (!state.musicMuted && state.musicVolume > 0) startMusic();
  renderMusicControls();
}

function saveMusicPreferences() {
  saveJson(STORAGE_KEYS.musicMuted, state.musicMuted);
  localStorage.setItem(STORAGE_KEYS.musicVolume, String(state.musicVolume));
  localStorage.setItem(STORAGE_KEYS.musicRevision, MUSIC_REVISION);
}

function startMusic() {
  if (state.musicMuted || state.musicVolume <= 0) return;

  try {
    const track = getMusicElement();
    track.muted = false;
    track.volume = clamp(state.musicVolume, 0, 1);
    track.play().catch(() => {
      state.musicMuted = true;
      saveMusicPreferences();
      renderMusicControls();
      showToast("Toque em Som novamente para liberar a trilha.");
    });
  } catch {
    stopMusic();
  }
}

function stopMusic() {
  if (!musicElement) return;
  musicElement.pause();
}

function updateMusicGain() {
  if (!musicElement) return;
  musicElement.muted = state.musicMuted;
  musicElement.volume = state.musicMuted ? 0 : clamp(state.musicVolume, 0, 1);
}

function getMusicElement() {
  if (!musicElement) {
    musicElement = new Audio(BACKGROUND_TRACK_SRC);
    musicElement.loop = true;
    musicElement.preload = "auto";
    musicElement.volume = clamp(state.musicVolume, 0, 1);
    musicElement.addEventListener("error", () => {
      state.musicMuted = true;
      saveMusicPreferences();
      renderMusicControls();
      showToast("Não foi possível carregar a trilha de fundo.");
    });
  }
  return musicElement;
}

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    audioCtx = new AudioContextClass();
  }
  return audioCtx;
}

function unlockAudio() {
  try {
    const ctx = getAudioContext();
    if (ctx?.state === "suspended") ctx.resume();
  } catch {
    audioCtx = null;
  }
}

function playTone({ frequency = 640, duration = 0.08, gain = 0.035, type = "sine", delay = 0 }) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume();

    const start = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const amp = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, start);
    amp.gain.setValueAtTime(0.0001, start);
    amp.gain.exponentialRampToValueAtTime(gain, start + 0.012);
    amp.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(amp);
    amp.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + duration + 0.03);
  } catch {
    audioCtx = null;
  }
}

function playRouletteSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume();

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const amp = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(190, now);
    osc.frequency.exponentialRampToValueAtTime(82, now + 0.75);
    amp.gain.setValueAtTime(0.0001, now);
    amp.gain.exponentialRampToValueAtTime(0.03, now + 0.04);
    amp.gain.exponentialRampToValueAtTime(0.0001, now + 0.82);
    osc.connect(amp);
    amp.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.86);
    playTone({ frequency: 420, duration: 0.035, gain: 0.018, type: "square", delay: 0.12 });
    playTone({ frequency: 360, duration: 0.035, gain: 0.014, type: "square", delay: 0.34 });
  } catch {
    audioCtx = null;
  }
}

function playRouletteStopSound() {
  playTone({ frequency: 520, duration: 0.055, gain: 0.028, type: "triangle" });
  playTone({ frequency: 720, duration: 0.07, gain: 0.022, type: "sine", delay: 0.08 });
}

function playFinalCountdownBeep() {
  const seconds = Math.ceil(state.timerRemaining);
  if (seconds > 10 || seconds <= 0 || seconds === state.lastCountdownBeep) return;

  state.lastCountdownBeep = seconds;
  const urgent = seconds <= 3;
  playTone({
    frequency: urgent ? 980 : 680,
    duration: urgent ? 0.095 : 0.065,
    gain: urgent ? 0.055 : 0.038,
    type: urgent ? "triangle" : "sine"
  });
}

function playTimerEndSound() {
  playTone({ frequency: 880, duration: 0.08, gain: 0.05, type: "sine" });
  playTone({ frequency: 1180, duration: 0.14, gain: 0.045, type: "triangle", delay: 0.1 });
}

function hexToRgba(hex, alpha) {
  const normalized = hex.replace("#", "");
  const value = parseInt(normalized, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function modulo(value, divisor) {
  return ((value % divisor) + divisor) % divisor;
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {
      showToast("Service worker indisponível neste contexto.");
    });
  });
}

window.addEventListener("beforeunload", () => {
  if (dashboardIntervalId) window.clearInterval(dashboardIntervalId);
  stopMusic();
  saveSession();
});

function updateProfileLabels() {
  const nameInput1 = document.getElementById('partner-one-name');
  const nameInput2 = document.getElementById('partner-two-name');
  const label1 = document.getElementById('profile1-limits-label');
  const label2 = document.getElementById('profile2-limits-label');

  const name1 = nameInput1?.value.trim() || 'Perfil 1';
  const name2 = nameInput2?.value.trim() || 'Perfil 2';
  if (label1) label1.textContent = `${name1} · limites`;
  if (label2) label2.textContent = `${name2} · limites`;
}

document.addEventListener('input', (e) => {
  if (e.target.id === 'partner-one-name' || e.target.id === 'partner-two-name') {
    updateProfileLabels();
  }
});

/* NOVAS FUNÇÕES DE PROGRESSÃO E DIAGNÓSTICO */

function setProgressionMode(mode) {
  if (["short", "standard", "slow"].includes(mode)) {
    state.progressionMode = mode;
    saveSession();
    updateSessionRank({ forcePulse: true });
    renderAll();
    showToast(`Ritmo ${mode === "short" ? "rápido" : mode === "slow" ? "lento" : "padrão"} ativado.`);
  }
}

window.setProgressionMode = setProgressionMode;

function getCurrentRankHistory() {
  return state.history.filter((item) => item.rank === state.currentRank);
}

function getTurnsByPartnerInCurrentRank() {
  return getCurrentRankHistory().reduce((acc, item) => {
    const name = item.actor || "unknown";
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});
}

function getRequiredTurnsForCurrentRank() {
  if (state.gameMode !== "couple" || state.partners.length < 2) return 0;
  if (state.progressionMode === "short") return 1;
  if (state.currentRank <= 4) return 2;
  return 1;
}

function everyonePlayedAtLeastInCurrentRank(minTurns = 2) {
  if (state.gameMode !== "couple" || state.partners.length < 2) return true;
  const turns = getTurnsByPartnerInCurrentRank();
  return state.partners.every((partner) => {
    const total = turns[partner.name] || 0;
    return total >= minTurns;
  });
}

function canAdvanceRank() {
  const requiredTurns = getRequiredTurnsForCurrentRank();
  if (!requiredTurns) return true;
  return everyonePlayedAtLeastInCurrentRank(requiredTurns);
}

function recentlyUsedThemeTag(tag, depth = 3) {
  return state.history
    .slice(0, depth)
    .some((item) => {
      const itemTags = getChallengeThemeTagsFromHistory(item);
      return itemTags.includes(tag);
    });
}

function getChallengeThemeTagsFromHistory(historyItem) {
  const text = `${historyItem.title || ""} ${historyItem.text || ""}`.toLowerCase();
  const tags = [];
  if (/(pergunta|responda|diga|confesse|fale|sussurr)/.test(text)) tags.push("talk");
  if (/(beijo|beije|boca|lábio|pescoço|mordida)/.test(text)) tags.push("kiss");
  if (/(massagem|massageie|carinho|toque|mãos|dedos)/.test(text)) tags.push("touch");
  if (/(strip|roupa|peça|nua|nu\b|desnudo)/.test(text)) tags.push("strip");
  if (/(oral|chupe|língua|lamber|lambida)/.test(text)) tags.push("oral");
  if (/(masturb|dedo|mão|punho|manual)/.test(text)) tags.push("manual");
  if (/(penetra|posição|clímax|gozar)/.test(text)) tags.push("climax");
  if (/(tapa|mordid|pux|belisc|restrição|ordem)/.test(text)) tags.push("power");
  if (/(gelo|água|sopro|temperatura|textura|vela)/.test(text)) tags.push("sensory");
  if (/(jogo|desafio|imita|competi|brinca)/.test(text)) tags.push("game");
  if (/(rotina|ritual|prepara|respira|banho)/.test(text)) tags.push("ritual");
  if (/(fantasia|personagem| fingir |teatro|encena)/.test(text)) tags.push("fantasy");
  return tags;
}

function getTagCooldownMultiplier(challenge) {
  const tags = getChallengeThemeTagsFromHistory(challenge);
  if (tags.length === 0) return 1;
  if (tags.some((tag) => recentlyUsedThemeTag(tag, 3))) {
    return 0.35;
  }
  return 1;
}

function getClosingThresholdMinutes() {
  const preset = PROGRESSION_PRESETS[state.progressionMode] || PROGRESSION_PRESETS.standard;
  return preset[14]?.minutes || 80;
}

function shouldEnterClosingMode() {
  return state.currentRank >= 14 || getMinutesElapsed() >= getClosingThresholdMinutes();
}

function getClosingModeHint() {
  if (shouldEnterClosingMode()) {
    return "Sessão em modo encerramento: cuidado, conversa e desaceleração.";
  }
  return null;
}

function debugRoulette() {
  const pool = getChallengePool();
  const used = new Set(state.usedChallengeIds);

  const byRank = pool.reduce((acc, challenge) => {
    const rank = challenge.rank || "sem rank";
    if (!acc[rank]) {
      acc[rank] = { total: 0, used: 0, remaining: 0 };
    }
    acc[rank].total += 1;
    if (used.has(challenge.id)) {
      acc[rank].used += 1;
    } else {
      acc[rank].remaining += 1;
    }
    return acc;
  }, {});

  console.group("🔍 Diagnóstico da Roleta");
  console.table(byRank);
  console.log({
    currentRank: state.currentRank,
    spinCount: state.spinCount,
    elapsedMinutes: Math.round(getMinutesElapsed()),
    progressionMode: state.progressionMode,
    turnIndex: state.turnIndex,
    currentTurn: state.partners[state.turnIndex]?.name,
    overrideRank: state.overrideRank,
    canAdvance: canAdvanceRank(),
    closingMode: shouldEnterClosingMode(),
    turnsInCurrentRank: getTurnsByPartnerInCurrentRank()
  });
  console.groupEnd();
}

window.debugRoulette = debugRoulette;
