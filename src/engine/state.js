// Game-state factory + small mutators used by the tick functions.
import { START_X, MAIN_Y, LANE } from './constants.js';
import { COACH_LINES } from './coach-lines.js';

export function createGame(level) {
  const startX = level?.startX ?? START_X;
  return {
    level:      level || null,
    car:        { x: startX, y: MAIN_Y - LANE / 2, angle: 0, speed: 0 },
    keys:       { up: false, down: false, left: false, right: false, brake: false },
    ped: {
      x:     level?.config?.pedX ?? 980,
      y:     MAIN_Y - 90,
      t:     0,
      state: level?.config?.pedX ? 'waiting' : 'done',
      dir:   1,
    },
    t:          0,
    elapsed:    0,
    started:    false,
    finished:   false,
    score:      100,
    demerits:   0,
    coach:      { id: 'start', shown: 0, text: COACH_LINES.start.text, tone: 'info' },
    flags:      {},
    events:     [],
    objectives: (level?.objectives ?? []).map(o => ({ ...o, done: false, fail: false })),
  };
}

export function setCoach(g, id) {
  if (g.coach.id === id && g.t - g.coach.shown < 4) return;
  const line = COACH_LINES[id];
  if (!line) return;
  g.coach = { id, shown: g.t, text: line.text, tone: line.tone };
}

export function logEvent(g, label, delta) {
  g.events.unshift({ label, delta, t: g.t });
  if (g.events.length > 8) g.events.pop();
  g.score = Math.max(0, Math.min(100, g.score + delta));
}
