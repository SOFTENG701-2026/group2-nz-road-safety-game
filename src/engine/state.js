// Game-state factory + small mutators used by the tick functions.
import { START_X, MAIN_Y, LANE, SIDE_X } from './constants.js';
import { COACH_LINES } from './coach-lines.js';

// ─── Ambient NPC configuration per level ────────────────────────────────────
// Westbound cars (facing west = Math.PI) drive in the lower lane (y = MAIN_Y + LANE/2).
const AMBIENT_CFG = {
  suburban: { count: 2, speedRange: [60, 75]  },
  city:     { count: 3, speedRange: [60, 78]  },
  rural:    { count: 2, speedRange: [115, 135] },
  mountain: { count: 2, speedRange: [88, 108]  },
};
const AMBIENT_COLORS = ['#2a6496', '#3a7e4e', '#8c6d2a', '#6e3a8c', '#7a3030'];

function createAmbientNpcs(level) {
  const worldW = level?.worldWidth ?? 1600;
  const cfg    = AMBIENT_CFG[level?.id] ?? { count: 1, speedRange: [68, 80] };
  const [sMin, sMax] = cfg.speedRange;
  return Array.from({ length: cfg.count }, (_, i) => ({
    id:    `${level?.id ?? 'lvl'}-${i}`,   // stable key for React lists
    x:     worldW * 0.1 + (i / cfg.count) * worldW * 0.9,
    y:     MAIN_Y + LANE / 2,
    speed: sMin + Math.random() * (sMax - sMin),
    color: AMBIENT_COLORS[i % AMBIENT_COLORS.length],
  }));
}

// ─── Factory ─────────────────────────────────────────────────────────────────

export function createGame(level) {
  const startX = level?.startX ?? START_X;
  return {
    level:       level || null,
    car:         { x: startX, y: MAIN_Y - LANE / 2, angle: 0, speed: 0 },
    keys:        { up: false, down: false, left: false, right: false, brake: false },
    npc:         {
      x:     level?.config?.sideX ?? SIDE_X,
      y:     MAIN_Y - 200,
      speed: 0,
      state: level?.config?.sideX ? 'waiting' : 'done',
    },
    ped: {
      x:     level?.config?.pedX ?? 980,
      y:     MAIN_Y - 90,
      t:     0,
      state: level?.config?.pedX ? 'waiting' : 'done',
      dir:   1,
    },
    ambientNpcs: createAmbientNpcs(level),
    t:           0,      // total game time (seconds) — used for coach debounce
    elapsed:     0,      // level timer — stops at finish
    started:     false,
    finished:    false,
    score:       100,
    demerits:    0,
    coach:       { id: 'start', shown: 0, text: COACH_LINES.start.text, tone: 'info' },
    flags:       {},
    events:      [],
    objectives:  (level?.objectives ?? []).map(o => ({ ...o, done: false, fail: false })),
  };
}

// ─── Mutators ────────────────────────────────────────────────────────────────

// Update coach.* in place. Debounce if the same line was just shown.
export function setCoach(g, id) {
  if (g.coach.id === id && g.t - g.coach.shown < 4) return;
  const line = COACH_LINES[id];
  if (!line) return;
  g.coach = { id, shown: g.t, text: line.text, tone: line.tone };
}

// Push a labelled +/- event onto the score breakdown ring buffer.
export function logEvent(g, label, delta) {
  g.events.unshift({ label, delta, t: g.t });
  if (g.events.length > 8) g.events.pop();
  g.score = Math.max(0, Math.min(100, g.score + delta));
}
