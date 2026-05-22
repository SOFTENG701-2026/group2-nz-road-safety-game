import { ROAD_W, MAIN_Y } from './constants.js';

const PLAYER_FRONT = 19;
const TRIGGER_GAP = 12;
const TRAFFIC_BLUE = '#1f74e8';

const INTERSECTION_SPEED = 68;
const INTERSECTION_START_Y = MAIN_Y - ROAD_W / 2 - 30;
const INTERSECTION_END_Y = MAIN_Y + ROAD_W / 2 + 90;

const ROUNDABOUT_OUTER_RADIUS = 80;
const ROUNDABOUT_INNER_RADIUS = 22;
const ROUNDABOUT_LANE_RADIUS = (ROUNDABOUT_OUTER_RADIUS + ROUNDABOUT_INNER_RADIUS) / 2;
const ROUNDABOUT_ENTRY_DURATION = 0.65;
const ROUNDABOUT_ARC_DURATION = 3.4;
const ROUNDABOUT_EXIT_DURATION = 1.15;
const ROUNDABOUT_ENTRY_Y_OFFSET = ROAD_W / 4;
const ROUNDABOUT_EXIT_X_OFFSET = -ROAD_W / 4;
const ROUNDABOUT_ARC_START = Math.asin(ROUNDABOUT_ENTRY_Y_OFFSET / ROUNDABOUT_LANE_RADIUS);
const ROUNDABOUT_ARC_END = Math.PI * 2 - Math.acos(ROUNDABOUT_EXIT_X_OFFSET / ROUNDABOUT_LANE_RADIUS);
const ROUNDABOUT_TURN_PORTION = 0.18;

const CAR_HALF_LENGTH = 19;
const CAR_HALF_WIDTH = 10;

export function createIntersectionTraffic(level) {
  const sideX = level?.config?.sideX;
  return sideX ? [{ x: sideX, active: false, t: 0 }] : [];
}

export function createRoundaboutTraffic(level) {
  const roundaboutX = level?.config?.roundaboutX;
  return roundaboutX ? [{ x: roundaboutX, active: false, done: false, t: 0 }] : [];
}

export function stepIntersectionTraffic(g, dt) {
  const traffic = g.intersectionTraffic ?? (g.intersectionTraffic = createIntersectionTraffic(g.level));
  const roundaboutTraffic = g.roundaboutTraffic ?? (g.roundaboutTraffic = createRoundaboutTraffic(g.level));

  for (const vehicle of traffic) {
    if (!vehicle.active && playerIsEnteringIntersection(g.car, vehicle.x)) {
      vehicle.active = true;
      vehicle.t = 0;
    }

    if (vehicle.active) vehicle.t += dt;
  }

  for (const vehicle of roundaboutTraffic) {
    if (!vehicle.active && !vehicle.done && playerIsApproachingRoundabout(g.car, vehicle.x)) {
      vehicle.active = true;
      vehicle.t = 0;
    }

    if (vehicle.active) {
      vehicle.t += dt;
      if (!getRoundaboutVehiclePose(vehicle)) {
        vehicle.active = false;
        vehicle.done = true;
      }
    }
  }
}

export function getTrafficVehiclePoses(g) {
  const poses = [];

  for (const vehicle of g.intersectionTraffic ?? []) {
    const pose = getIntersectionVehiclePose(vehicle);
    if (pose) {
      poses.push({
        ...pose,
        kind: 'intersection',
        objectiveId: 'giveway',
        flag: 'intersectionNpcCollision',
      });
    }
  }

  for (const vehicle of g.roundaboutTraffic ?? []) {
    const pose = getRoundaboutVehiclePose(vehicle);
    if (pose) {
      poses.push({
        ...pose,
        kind: 'roundabout',
        objectiveId: 'roundabout-giveway',
        flag: 'roundaboutNpcCollision',
      });
    }
  }

  return poses;
}

export function getIntersectionVehiclePose(vehicle) {
  const y = INTERSECTION_START_Y + INTERSECTION_SPEED * vehicle.t;
  if (vehicle.active && y > INTERSECTION_END_Y) return null;

  return {
    x: vehicle.x + ROAD_W / 4,
    y,
    angle: Math.PI / 2,
    color: TRAFFIC_BLUE,
  };
}

export function getRoundaboutVehiclePose(vehicle) {
  if (vehicle.done) return null;

  const cx = vehicle.x;
  const cy = MAIN_Y;
  const wait = {
    x: cx + ROUNDABOUT_OUTER_RADIUS + 42,
    y: cy + ROUNDABOUT_ENTRY_Y_OFFSET,
    angle: Math.PI,
  };

  if (!vehicle.active) return { ...wait, color: TRAFFIC_BLUE };

  const entryEnd = ROUNDABOUT_ENTRY_DURATION;
  const arcEnd = entryEnd + ROUNDABOUT_ARC_DURATION;
  const total = arcEnd + ROUNDABOUT_EXIT_DURATION;

  if (vehicle.t > total) return null;

  if (vehicle.t <= entryEnd) {
    const p = vehicle.t / ROUNDABOUT_ENTRY_DURATION;
    return {
      x: lerp(wait.x, cx + Math.cos(ROUNDABOUT_ARC_START) * ROUNDABOUT_LANE_RADIUS, p),
      y: wait.y,
      angle: Math.PI,
      color: TRAFFIC_BLUE,
    };
  }

  if (vehicle.t <= arcEnd) {
    const p = (vehicle.t - entryEnd) / ROUNDABOUT_ARC_DURATION;
    const a = lerp(ROUNDABOUT_ARC_START, ROUNDABOUT_ARC_END, p);
    const baseAngle = tangentAngle(a);
    return {
      x: cx + Math.cos(a) * ROUNDABOUT_LANE_RADIUS,
      y: cy + Math.sin(a) * ROUNDABOUT_LANE_RADIUS,
      angle: getRoundaboutArcAngle(baseAngle, p),
      color: TRAFFIC_BLUE,
    };
  }

  const a = ROUNDABOUT_ARC_END;
  const exitLaneX = cx + ROUNDABOUT_EXIT_X_OFFSET;
  const arcExitY = cy + Math.sin(a) * ROUNDABOUT_LANE_RADIUS;
  const p = (vehicle.t - arcEnd) / ROUNDABOUT_EXIT_DURATION;

  return {
    x: exitLaneX,
    y: lerp(arcExitY, cy - ROUNDABOUT_OUTER_RADIUS - 110, p),
    angle: -Math.PI / 2,
    color: TRAFFIC_BLUE,
  };
}

export function trafficCollidesWithCar(car, pose) {
  return rectanglesOverlap(
    getCarCorners(car.x, car.y, car.angle),
    getCarCorners(pose.x, pose.y, pose.angle),
  );
}

function playerIsEnteringIntersection(car, intersectionX) {
  const westEdge = intersectionX - ROAD_W / 2;
  const frontX = car.x + Math.cos(car.angle) * PLAYER_FRONT;
  const headingEast = Math.cos(car.angle) > 0.25;
  const onMainApproach = Math.abs(car.y - MAIN_Y) <= ROAD_W / 2 + 20;

  return headingEast
    && onMainApproach
    && car.x < intersectionX
    && frontX >= westEdge - TRIGGER_GAP;
}

function playerIsApproachingRoundabout(car, roundaboutX) {
  const westEntry = roundaboutX - ROUNDABOUT_OUTER_RADIUS;
  const frontX = car.x + Math.cos(car.angle) * PLAYER_FRONT;
  const headingEast = Math.cos(car.angle) > 0.25;
  const onMainApproach = Math.abs(car.y - MAIN_Y) <= ROAD_W / 2 + 20;

  return headingEast
    && onMainApproach
    && car.x < roundaboutX
    && frontX >= westEntry - 42;
}

function getCarCorners(x, y, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [
    rotatePoint(x, y, -CAR_HALF_LENGTH, -CAR_HALF_WIDTH, cos, sin),
    rotatePoint(x, y,  CAR_HALF_LENGTH, -CAR_HALF_WIDTH, cos, sin),
    rotatePoint(x, y,  CAR_HALF_LENGTH,  CAR_HALF_WIDTH, cos, sin),
    rotatePoint(x, y, -CAR_HALF_LENGTH,  CAR_HALF_WIDTH, cos, sin),
  ];
}

function rotatePoint(x, y, localX, localY, cos, sin) {
  return {
    x: x + localX * cos - localY * sin,
    y: y + localX * sin + localY * cos,
  };
}

function rectanglesOverlap(a, b) {
  const axes = [
    axisFrom(a[0], a[1]),
    axisFrom(a[1], a[2]),
    axisFrom(b[0], b[1]),
    axisFrom(b[1], b[2]),
  ];

  return axes.every((axis) => projectionsOverlap(project(a, axis), project(b, axis)));
}

function axisFrom(p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const len = Math.hypot(dx, dy) || 1;
  return { x: -dy / len, y: dx / len };
}

function project(points, axis) {
  let min = Infinity;
  let max = -Infinity;

  for (const point of points) {
    const value = point.x * axis.x + point.y * axis.y;
    min = Math.min(min, value);
    max = Math.max(max, value);
  }

  return { min, max };
}

function projectionsOverlap(a, b) {
  return a.max >= b.min && b.max >= a.min;
}

function lerp(a, b, p) {
  return a + (b - a) * p;
}

function tangentAngle(a) {
  return Math.atan2(Math.cos(a), -Math.sin(a));
}

function getRoundaboutArcAngle(baseAngle, progress) {
  if (progress < ROUNDABOUT_TURN_PORTION) {
    return lerp(Math.PI, baseAngle, progress / ROUNDABOUT_TURN_PORTION);
  }

  if (progress > 1 - ROUNDABOUT_TURN_PORTION) {
    return lerp(baseAngle, -Math.PI / 2, (progress - (1 - ROUNDABOUT_TURN_PORTION)) / ROUNDABOUT_TURN_PORTION);
  }

  return baseAngle;
}
