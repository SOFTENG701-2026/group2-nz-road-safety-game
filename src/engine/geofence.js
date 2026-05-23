// "Where is the car?" queries — all derived from the active level config.
import { W, ROAD_W, MAIN_Y } from './constants.js';

export function inSchoolZone(x, schoolZone) {
  if (!schoolZone) return false;
  return x >= schoolZone.x1 && x <= schoolZone.x2;
}

export function onRoadMain(x, y, worldW = W) {
  return x >= 0 && x <= worldW && Math.abs(y - MAIN_Y) <= ROAD_W / 2;
}

export function onRoadSide(x, y, sideX) {
  if (!sideX) return false;
  return Math.abs(x - sideX) <= ROAD_W / 2;
}

export function inBridgeWater(x, y, g) {
  const bridgeX = g?.level?.config?.bridgeX;
  if (!bridgeX) return false;

  const withinBridgeSpan = x >= bridgeX - 100 && x <= bridgeX + 100;
  const withinRiverSlot = Math.abs(y - MAIN_Y) <= ROAD_W / 2;
  const onBridgeDeck = Math.abs(y - MAIN_Y) <= ROAD_W / 4;

  return withinBridgeSpan && withinRiverSlot && !onBridgeDeck;
}

export function carTouchesBridgeWater(car, g) {
  const cos = Math.cos(car.angle);
  const sin = Math.sin(car.angle);
  const halfLength = 19;
  const halfWidth = 10;

  const points = [
    [0, 0],
    [ halfLength, 0],
    [-halfLength, 0],
    [ halfLength,  halfWidth],
    [ halfLength, -halfWidth],
    [-halfLength,  halfWidth],
    [-halfLength, -halfWidth],
  ];

  return points.some(([localX, localY]) => {
    const x = car.x + localX * cos - localY * sin;
    const y = car.y + localX * sin + localY * cos;
    return inBridgeWater(x, y, g);
  });
}

export function inBridgeKeepLeftExemptZone(x, y, g) {
  const bridgeX = g?.level?.config?.bridgeX;
  if (!bridgeX) return false;

  return x >= bridgeX - 200
    && x <= bridgeX + 200
    && Math.abs(y - MAIN_Y) <= ROAD_W / 2;
}

export function onRoad(x, y, g) {
  const worldW      = g?.level?.worldWidth ?? W;
  const sideX       = g?.level?.config?.sideX;
  const roundaboutX = g?.level?.config?.roundaboutX;

  if (inBridgeWater(x, y, g)) return false;

  // Treat the entire roundabout disc as road
  if (roundaboutX) {
    const dx = x - roundaboutX;
    const dy = y - MAIN_Y;
    if (dx * dx + dy * dy <= 80 * 80) return true;
  }

  return onRoadMain(x, y, worldW) || onRoadSide(x, y, sideX);
}

// In New Zealand we keep left. Heading east on the main road means the
// left lane is above the centreline (lower y).
export function onLeftSide(car, g) {
  if (inBridgeKeepLeftExemptZone(car.x, car.y, g)) return true;
  if (!onRoadMain(car.x, car.y)) return true; // don't penalise off-main
  const facingEast = Math.cos(car.angle) > 0;
  return facingEast ? car.y < MAIN_Y : car.y > MAIN_Y;
}
