// Position-driven coach prompts, scoring, and objective progress.
// Each branch is independent and only fires once (guarded by g.flags).
import { FINISH_X } from './constants.js';
import { inSchoolZone, onRoadMain, onLeftSide } from './geofence.js';
import { pxToKmh } from './units.js';
import { setCoach, logEvent } from './state.js';

export function stepCoachEvents(g, dt) {
  const c      = g.car;
  const level  = g.level;
  const config = level?.config ?? {};
  const { schoolZone, pedX, sideX, bridgeX, railX, roundaboutX, gravelZone } = config;
  const finishX = level?.finishX ?? FINISH_X;
  const isMountain = level?.id === 'mountain';

  // ── School zone / icy road (same mechanic, different coaching) ───────────
  if (schoolZone) {
    if (c.x > schoolZone.x1 - 140 && c.x < schoolZone.x1 - 60 && !g.flags.schoolWarned) {
      setCoach(g, isMountain ? 'iceEnter' : 'schoolEnter');
      g.flags.schoolWarned = true;
    }
    if (inSchoolZone(c.x, schoolZone) && !g.flags.schoolEntered) g.flags.schoolEntered = true;
    if (inSchoolZone(c.x, schoolZone)) {
      if (pxToKmh(Math.abs(c.speed)) > 30 && !g.flags.schoolViolated) {
        g.flags.schoolViolated = true;
        logEvent(g, isMountain ? 'Icy road speeding' : 'School zone speeding', -25);
        g.demerits += 20;
        setCoach(g, isMountain ? 'iceViolated' : 'schoolSpeeding');
        const obj = g.objectives.find(o => o.id === 'school');
        if (obj) obj.fail = true;
      }
    }
    if (c.x > schoolZone.x2 + 30 && g.flags.schoolEntered && !g.flags.schoolDone) {
      g.flags.schoolDone = true;
      if (!g.flags.schoolViolated) {
        logEvent(g, isMountain ? 'Icy road — safe speed' : 'School zone — speed kept', +10);
        const obj = g.objectives.find(o => o.id === 'school');
        if (obj) obj.done = true;
        setCoach(g, isMountain ? 'iceGood' : 'schoolGood');
      }
    }
  }

  // ── Pedestrian crossing ──────────────────────────────────────────────────
  if (pedX) {
    if (c.x > pedX - 200 && c.x < pedX - 80 && !g.flags.pedNoticed) {
      setCoach(g, 'pedAhead');
      g.flags.pedNoticed = true;
    }
    const p = g.ped;
    if (p.state === 'crossing' && Math.hypot(c.x - p.x, c.y - p.y) < 22
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
      if (obj && !g.flags.pedHit) {
        if (!g.flags.pedAlerted) {
          // Drove past without stopping before the crossing
          obj.fail = true;
          logEvent(g, 'Did not stop before crossing', -20);
          g.demerits += 15;
          setCoach(g, 'pedMissed');
        }
      }
    }
  }

  // ── Give-way intersection ────────────────────────────────────────────────
  if (sideX) {
    if (c.x > sideX - 280 && c.x < sideX - 100 && !g.flags.gaveWayWarned) {
      setCoach(g, 'giveWayAhead');
      g.flags.gaveWayWarned = true;
    }
    // Approach zone: player must slow to ≤25 km/h BEFORE entering intersection
    if (c.x > sideX - 150 && c.x < sideX - 65) {
      if (pxToKmh(Math.abs(c.speed)) <= 25) g.flags.giveWayStopped = true;
    }
    // Evaluate at the intersection boundary — too late to slow down after this
    if (c.x >= sideX - 65 && !g.flags.giveWayChecked) {
      g.flags.giveWayChecked = true;
      const obj = g.objectives.find(o => o.id === 'giveway');
      if (g.flags.giveWayStopped) {
        logEvent(g, 'Gave way correctly', +10);
        if (obj) obj.done = true;
        setCoach(g, 'giveWayGood');
      } else {
        logEvent(g, 'Failed to give way', -20);
        g.demerits += 15;
        if (obj) obj.fail = true;
        setCoach(g, 'giveWayFail');
      }
    }
  }

  // ── Roundabout ───────────────────────────────────────────────────────────
  if (roundaboutX) {
    if (c.x > roundaboutX - 260 && c.x < roundaboutX - 110 && !g.flags.roundaboutWarned) {
      setCoach(g, 'roundaboutAhead');
      g.flags.roundaboutWarned = true;
    }
    if (Math.abs(c.x - roundaboutX) < 90) {
      if (pxToKmh(Math.abs(c.speed)) > 40 && !g.flags.roundaboutFast) {
        g.flags.roundaboutFast = true;
        logEvent(g, 'Too fast at roundabout', -15);
        g.demerits += 10;
        setCoach(g, 'roundaboutFast');
        const obj = g.objectives.find(o => o.id === 'roundabout');
        if (obj) obj.fail = true;
      }
    }
    if (c.x > roundaboutX + 100 && !g.flags.roundaboutDone) {
      g.flags.roundaboutDone = true;
      if (!g.flags.roundaboutFast) {
        logEvent(g, 'Roundabout navigated', +10);
        const obj = g.objectives.find(o => o.id === 'roundabout');
        if (obj) obj.done = true;
        setCoach(g, 'roundaboutGood');
      }
    }
  }

  // ── Gravel / unsealed road ────────────────────────────────────────────────
  if (gravelZone) {
    if (c.x > gravelZone.x1 - 160 && c.x < gravelZone.x1 - 50 && !g.flags.gravelWarned) {
      setCoach(g, 'gravelAhead');
      g.flags.gravelWarned = true;
    }
    if (c.x >= gravelZone.x1 && c.x <= gravelZone.x2 && !g.flags.gravelEntered)
      g.flags.gravelEntered = true;
    if (c.x >= gravelZone.x1 && c.x <= gravelZone.x2) {
      if (pxToKmh(Math.abs(c.speed)) > 60 && !g.flags.gravelViolated) {
        g.flags.gravelViolated = true;
        logEvent(g, 'Gravel road speeding', -15);
        g.demerits += 10;
        setCoach(g, 'gravelFast');
        const obj = g.objectives.find(o => o.id === 'gravel');
        if (obj) obj.fail = true;
      }
    }
    if (c.x > gravelZone.x2 + 30 && g.flags.gravelEntered && !g.flags.gravelDone) {
      g.flags.gravelDone = true;
      if (!g.flags.gravelViolated) {
        logEvent(g, 'Gravel road — safe speed', +10);
        const obj = g.objectives.find(o => o.id === 'gravel');
        if (obj) obj.done = true;
        setCoach(g, 'gravelGood');
      }
    }
  }

  // ── Railway crossing ─────────────────────────────────────────────────────
  if (railX) {
    if (c.x > railX - 280 && c.x < railX - 120 && !g.flags.railWarned) {
      setCoach(g, 'railAhead');
      g.flags.railWarned = true;
    }
    // Player must slow to near-stop before the crossing line
    if (c.x > railX - 130 && c.x < railX && !g.flags.railChecked) {
      if (Math.abs(c.speed) < 12) g.flags.railStopped = true;
    }
    if (c.x >= railX && c.x < railX + 80 && !g.flags.railChecked) {
      g.flags.railChecked = true;
      if (!g.flags.railStopped) {
        g.flags.railViolated = true;
        logEvent(g, 'Ran railway crossing', -25);
        g.demerits += 20;
        setCoach(g, 'railViolation');
        const obj = g.objectives.find(o => o.id === 'rail');
        if (obj) obj.fail = true;
      }
    }
    if (c.x > railX + 80 && g.flags.railChecked && !g.flags.railDone) {
      g.flags.railDone = true;
      if (!g.flags.railViolated) {
        logEvent(g, 'Railway crossing — stopped safely', +10);
        const obj = g.objectives.find(o => o.id === 'rail');
        if (obj) obj.done = true;
        setCoach(g, 'railStop');
      }
    }
  }

  // ── One-lane bridge ──────────────────────────────────────────────────────
  if (bridgeX) {
    if (c.x > bridgeX - 300 && c.x < bridgeX - 150 && !g.flags.bridgeWarned) {
      setCoach(g, 'bridgeAhead');
      g.flags.bridgeWarned = true;
    }
    if (c.x > bridgeX - 110 && c.x < bridgeX + 110) {
      if (pxToKmh(Math.abs(c.speed)) > 40 && !g.flags.bridgeViolated) {
        g.flags.bridgeViolated = true;
        logEvent(g, 'Bridge — too fast', -15);
        g.demerits += 10;
        setCoach(g, 'bridgeFast');
        const obj = g.objectives.find(o => o.id === 'bridge');
        if (obj) obj.fail = true;
      }
    }
    if (c.x > bridgeX + 120 && !g.flags.bridgeDone) {
      g.flags.bridgeDone = true;
      if (!g.flags.bridgeViolated) {
        logEvent(g, 'Bridge crossed safely', +10);
        const obj = g.objectives.find(o => o.id === 'bridge');
        if (obj) obj.done = true;
        setCoach(g, 'bridgeGood');
      }
    }
  }

  // ── Wrong side of road ───────────────────────────────────────────────────
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
    if (obj && !obj.done) obj.done = true;
  }

  // ── General speeding warning (outside school/gravel zones) ───────────────
  const inSlow  = (schoolZone && inSchoolZone(c.x, schoolZone))
               || (gravelZone && c.x >= gravelZone.x1 && c.x <= gravelZone.x2);
  const roadLimit = level?.speedLimit ?? 50;
  if (!inSlow && pxToKmh(Math.abs(c.speed)) > roadLimit + 5 && !g.flags.generalSpeedWarned) {
    setCoach(g, 'speeding');
    g.flags.generalSpeedWarned = true;
  }

  // ── Finish line ──────────────────────────────────────────────────────────
  if (c.x >= finishX && !g.finished) {
    g.finished = true;
    const obj = g.objectives.find(o => o.id === 'finish');
    if (obj) obj.done = true;
    setCoach(g, 'finish');
  }
}
