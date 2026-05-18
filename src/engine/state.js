// Game-state factory + small mutators used by the tick functions.
import { START_X, MAIN_Y, LANE, SIDE_X } from './constants.js';
import { COACH_LINES } from './coach-lines.js';

export function createGame() {
  return {
    car:   { x: START_X, y: MAIN_Y - LANE / 2, angle: 0, speed: 0 },
    keys:  { up: false, down: false, left: false, right: false, brake: false },
    npc:   { x: SIDE_X, y: 980, speed: 0, state: 'waiting' },
    ped:   { x: 980,    y: MAIN_Y - 90, t: 0, state: 'waiting', dir: 1 },
    t: 0,
    started: false,
    finished: false,
    score: 100,
    demerits: 0,
    coach: { id: 'start', shown: 0, text: COACH_LINES.start.text, tone: 'info' },
    flags: {
      schoolEntered: false, schoolViolated: false,
      pedAlerted: false, gaveWay: false, pedPassed: false, finishedOnce: false,
    },
    events: [],
    objectives: [
      { id: 'left',    label: 'Keep to the left lane',       done: false, fail: false },
      { id: 'school',  label: 'Slow to 30 in school zone',   done: false, fail: false },
      { id: 'ped',     label: 'Stop for pedestrians',        done: false, fail: false },
      { id: 'giveway', label: 'Give way at intersection',    done: false, fail: false },
      { id: 'finish',  label: 'Reach the finish line',       done: false, fail: false },
    ],
  };
}

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
