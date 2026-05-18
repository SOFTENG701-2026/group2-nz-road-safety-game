// Position-driven coach prompts, scoring, and objective progress.
// Each branch is independent and only fires once (guarded by g.flags).
import { SCHOOL_ZONE, PED_X, SIDE_X, FINISH_X } from './constants.js';
import { inSchoolZone, onRoadMain, onLeftSide } from './geofence.js';
import { pxToKmh } from './units.js';
import { setCoach, logEvent } from './state.js';

export function stepCoachEvents(g, dt) {
  const c = g.car;

  // School zone
  if (c.x > SCHOOL_ZONE.x1 - 140 && c.x < SCHOOL_ZONE.x1 - 60 && !g.flags.schoolWarned) {
    setCoach(g, 'schoolEnter');
    g.flags.schoolWarned = true;
  }
  if (inSchoolZone(c.x) && !g.flags.schoolEntered) g.flags.schoolEntered = true;
  if (inSchoolZone(c.x)) {
    const kmh = pxToKmh(Math.abs(c.speed));
    if (kmh > 30 && !g.flags.schoolViolated) {
      g.flags.schoolViolated = true;
      logEvent(g, 'School zone speeding', -25);
      g.demerits += 20;
      setCoach(g, 'schoolSpeeding');
      g.objectives.find(o => o.id === 'school').fail = true;
    }
  }
  if (c.x > SCHOOL_ZONE.x2 + 30 && g.flags.schoolEntered && !g.flags.schoolDone) {
    g.flags.schoolDone = true;
    if (!g.flags.schoolViolated) {
      logEvent(g, 'School zone speed kept', +10);
      g.objectives.find(o => o.id === 'school').done = true;
      setCoach(g, 'schoolGood');
    }
  }

  // Pedestrian crossing
  if (c.x > PED_X - 200 && c.x < PED_X - 80 && !g.flags.pedNoticed) {
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
    g.objectives.find(o => o.id === 'ped').fail = true;
  }
  if (c.x > PED_X + 60 && !g.flags.pedPassed) {
    g.flags.pedPassed = true;
    if (!g.flags.pedHit && !g.flags.pedAlerted) {
      g.objectives.find(o => o.id === 'ped').done = true;
    }
  }

  // Give-way intersection
  if (c.x > SIDE_X - 280 && c.x < SIDE_X - 100 && !g.flags.gaveWayWarned) {
    setCoach(g, 'giveWayAhead');
    g.flags.gaveWayWarned = true;
  }
  if (c.x > SIDE_X + 60 && !g.flags.gaveWay) {
    g.flags.gaveWay = true;
    logEvent(g, 'Held right of way', +5);
    g.objectives.find(o => o.id === 'giveway').done = true;
    setCoach(g, 'giveWayGood');
  }

  // Wrong side of road
  if (onRoadMain(c.x, c.y) && Math.abs(c.speed) > 12 && !onLeftSide(c)) {
    g.flags.wrongSideTimer = (g.flags.wrongSideTimer || 0) + dt;
    if (g.flags.wrongSideTimer > 0.6 && !g.flags.wrongSideWarned) {
      setCoach(g, 'wrongSide');
      logEvent(g, 'Wrong side of road', -10);
      g.demerits += 10;
      g.flags.wrongSideWarned = true;
      g.objectives.find(o => o.id === 'left').fail = true;
    }
  } else {
    g.flags.wrongSideTimer = 0;
  }
  if (!g.flags.wrongSideWarned && c.x > FINISH_X - 200) {
    g.objectives.find(o => o.id === 'left').done = true;
  }

  // Open-road speeding warning
  if (!inSchoolZone(c.x) && pxToKmh(Math.abs(c.speed)) > 50 && !g.flags.generalSpeedWarned) {
    setCoach(g, 'speeding');
    g.flags.generalSpeedWarned = true;
  }

  // Finish line
  if (c.x >= FINISH_X && !g.finished) {
    g.finished = true;
    g.objectives.find(o => o.id === 'finish').done = true;
    setCoach(g, 'finish');
  }
}
