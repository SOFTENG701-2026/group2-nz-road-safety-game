// Position-driven coach prompts, scoring, and objective progress.
// Each branch is independent and only fires once (guarded by g.flags).
import { SCHOOL_ZONE, PED_X, SIDE_X, FINISH_X } from './constants.js';
import { inSchoolZone, onRoadMain, onLeftSide } from './geofence.js';
import { pxToKmh } from './units.js';
import { setCoach, logEvent } from './state.js';

export function stepCoachEvents(g, dt) {
  const c = g.car;
  const level = g.level;
  const config = level?.config ?? {};
  const schoolZone = config.schoolZone;
  const pedX = config.pedX;
  const sideX = config.sideX;
  const bridgeX = config.bridgeX;
  const finishX = level?.finishX ?? FINISH_X;

  // ── School zone ──────────────────────────────────────────────
  if (schoolZone) {
    if (c.x > schoolZone.x1 - 140 && c.x < schoolZone.x1 - 60 && !g.flags.schoolWarned) {
      setCoach(g, 'schoolEnter');
      g.flags.schoolWarned = true;
    }
    if (inSchoolZone(c.x, schoolZone) && !g.flags.schoolEntered) g.flags.schoolEntered = true;
    if (inSchoolZone(c.x, schoolZone)) {
      const kmh = pxToKmh(Math.abs(c.speed));
      if (kmh > 30 && !g.flags.schoolViolated) {
        g.flags.schoolViolated = true;
        logEvent(g, 'School zone speeding', -25);
        g.demerits += 20;
        setCoach(g, 'schoolSpeeding');
        const obj = g.objectives.find(o => o.id === 'school');
        if (obj) obj.fail = true;
      }
    }
    if (c.x > schoolZone.x2 + 30 && g.flags.schoolEntered && !g.flags.schoolDone) {
      g.flags.schoolDone = true;
      if (!g.flags.schoolViolated) {
        logEvent(g, 'School zone — speed kept', +10);
        const obj = g.objectives.find(o => o.id === 'school');
        if (obj) obj.done = true;
        setCoach(g, 'schoolGood');
      }
    }
  }

  // ── Pedestrian crossing ──────────────────────────────────────
  if (pedX) {
    if (c.x > pedX - 200 && c.x < pedX - 80 && !g.flags.pedNoticed) {
      setCoach(g, 'pedAhead');
      g.flags.pedNoticed = true;
    }
    const p = g.ped;
    const pedDx = c.x - p.x;
    const pedDy = c.y - p.y;
    if (p.state === 'crossing' && Math.hypot(pedDx, pedDy) < 22
        && Math.abs(c.speed) > 20 && !g.flags.pedHit) {
      g.flags.pedHit = true;
      logEvent(g, 'Hit pedestrian', -50);
      g.demerits += 35;
      setCoach(g, 'pedHit');
      const obj = g.objectives.find(o => o.id === 'ped');
      if (obj) obj.fail = true;
    }
    if (c.x > pedX + 60 && !g.flags.pedPassed) {
      g.flags.pedPassed = true;
      const obj = g.objectives.find(o => o.id === 'ped');
      if (obj && !g.flags.pedHit && !g.flags.pedAlerted) {
        obj.done = true;
      }
    }
  }

  // ── Give-way intersection ────────────────────────────────────
  if (sideX) {
    if (c.x > sideX - 280 && c.x < sideX - 100 && !g.flags.gaveWayWarned) {
      setCoach(g, 'giveWayAhead');
      g.flags.gaveWayWarned = true;
    }
    if (c.x > sideX + 60 && !g.flags.gaveWay) {
      g.flags.gaveWay = true;
      logEvent(g, 'Held right of way', +5);
      const obj = g.objectives.find(o => o.id === 'giveway');
      if (obj) obj.done = true;
      setCoach(g, 'giveWayGood');
    }
  }

  // ── One-lane bridge (Level 2) ────────────────────────────────
  if (bridgeX) {
    if (c.x > bridgeX - 300 && c.x < bridgeX - 150 && !g.flags.bridgeWarned) {
      setCoach(g, 'giveWayAhead'); // Reuse give way message for simplicity
      g.flags.bridgeWarned = true;
    }
    if (c.x > bridgeX - 110 && c.x < bridgeX + 110) {
      const kmh = pxToKmh(Math.abs(c.speed));
      if (kmh > 40 && !g.flags.bridgeViolated) {
        g.flags.bridgeViolated = true;
        logEvent(g, 'Bridge speeding', -15);
        const obj = g.objectives.find(o => o.id === 'bridge');
        if (obj) obj.fail = true;
      }
    }
    if (c.x > bridgeX + 120 && !g.flags.bridgeDone) {
      g.flags.bridgeDone = true;
      const obj = g.objectives.find(o => o.id === 'bridge');
      if (obj && !g.flags.bridgeViolated) obj.done = true;
    }
  }

  // ── Wrong side of road ───────────────────────────────────────
  if (onRoadMain(c.x, c.y) && Math.abs(c.speed) > 12 && !onLeftSide(c)) {
    g.flags.wrongSideTimer = (g.flags.wrongSideTimer || 0) + dt;
    if (g.flags.wrongSideTimer > 0.6 && !g.flags.wrongSideWarned) {
      setCoach(g, 'wrongSide');
      logEvent(g, 'Wrong side of road', -10);
      g.demerits += 10;
      g.flags.wrongSideWarned = true;
      const obj = g.objectives.find(o => o.id === 'left');
      if (obj) obj.fail = true;
    }
  } else {
    g.flags.wrongSideTimer = 0;
  }
  if (!g.flags.wrongSideWarned && c.x > finishX - 200) {
    const obj = g.objectives.find(o => o.id === 'left');
    if (obj) obj.done = true;
  }

  // ── Speeding warning ─────────────────────────────────────────
  const currentKmh = pxToKmh(Math.abs(c.speed));
  const limit = (schoolZone && inSchoolZone(c.x, schoolZone)) ? 30 : (level?.id === 'rural' ? 100 : 50);
  if (currentKmh > limit + 5 && !g.flags.generalSpeedWarned && !inSchoolZone(c.x, schoolZone)) {
    setCoach(g, 'speeding');
    g.flags.generalSpeedWarned = true;
    const obj = g.objectives.find(o => o.id === 'speed');
    if (obj) obj.fail = true;
  }
  if (level?.id === 'rural' && c.x > finishX - 200 && !g.flags.generalSpeedWarned) {
    const obj = g.objectives.find(o => o.id === 'speed');
    if (obj) obj.done = true;
  }

  // ── Finish line ──────────────────────────────────────────────
  if (c.x >= finishX && !g.finished) {
    g.finished = true;
    const obj = g.objectives.find(o => o.id === 'finish');
    if (obj) obj.done = true;
    setCoach(g, 'finish');
  }
}
