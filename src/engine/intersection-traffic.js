import { ROAD_W, MAIN_Y, H } from './constants.js';

const PLAYER_FRONT = 19;
const TRIGGER_GAP = 12;
const TRAFFIC_BLUE = '#1f74e8';

const INTERSECTION_SPEED = 68;
const MAIN_ROAD_SPEED = 85;
const LANE_OFFSET = ROAD_W / 4;

const ROUNDABOUT_OUTER_RADIUS = 80;
const ROUNDABOUT_INNER_RADIUS = 22;
const ROUNDABOUT_LANE_RADIUS = (ROUNDABOUT_OUTER_RADIUS + ROUNDABOUT_INNER_RADIUS) / 2;
const ROUNDABOUT_APPROACH_DURATION = 1.5;
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
  return [];
}

export function createRoundaboutTraffic(level) {
  const roundaboutX = level?.config?.roundaboutX;
  if (!roundaboutX) return [];
  const count = level?.config?.continuousTraffic ? 2 : 1;
  return Array.from({ length: count }, (_, i) => ({
    x: roundaboutX,
    active: false,
    done: false,
    t: 0,
    cooldown: i * 4.0,
  }));
}

export function createMainRoadTraffic(level) {
  if (!level?.config?.continuousTraffic) return [];
  const count = 3;
  return Array.from({ length: count }, (_, i) => ({
    active: false,
    t: 0,
    cooldown: i * 5.0,
    speed: MAIN_ROAD_SPEED,
  }));
}

function getStraightPath(from, sideX, mainY, worldW) {
  const L = LANE_OFFSET;
  const entryDist = 100;
  const exitDist = 100;
  const points = [];

  if (from === 'N') {
    points.push({ x: sideX + L, y: -entryDist });
    points.push({ x: sideX + L, y: H + exitDist });
  } else if (from === 'S') {
    points.push({ x: sideX - L, y: H + entryDist });
    points.push({ x: sideX - L, y: -exitDist });
  } else if (from === 'E') {
    points.push({ x: worldW + entryDist, y: mainY + L });
    points.push({ x: -exitDist, y: mainY + L });
  }
  return points;
}

export function stepIntersectionTraffic(g, dt) {
  const traffic = g.intersectionTraffic ?? (g.intersectionTraffic = []);
  const roundaboutTraffic = g.roundaboutTraffic ?? (g.roundaboutTraffic = createRoundaboutTraffic(g.level));
  const mainTraffic = g.mainRoadTraffic ?? (g.mainRoadTraffic = createMainRoadTraffic(g.level));
  const sideX = g.level?.config?.sideX;
  const worldWidth = g.level?.worldWidth ?? 1600;

  // 1. Spawn logic for intersection (Straight only)
  if (sideX && g.level?.config?.continuousTraffic && traffic.length < 4) {
    const directions = ['N', 'S', 'E']; // No 'W' to keep player lane clear
    const from = directions[Math.floor(Math.random() * directions.length)];
    const path = getStraightPath(from, sideX, MAIN_Y, worldWidth);
    const spawnPose = path[0];
    
    const allPoses = getTrafficVehiclePoses(g);
    const isClear = !allPoses.some(p => Math.hypot(p.x - spawnPose.x, p.y - spawnPose.y) < 160);

    if (isClear) {
      traffic.push({
        from,
        path,
        t: 0,
        speed: INTERSECTION_SPEED * (0.85 + Math.random() * 0.3),
        active: true,
        started: false,
      });
    }
  }

  // 2. Step intersection NPCs
  const allPoses = getTrafficVehiclePoses(g);

  for (let i = traffic.length - 1; i >= 0; i--) {
    const npc = traffic[i];
    const pose = getIntersectionVehiclePose(npc);
    if (!pose) {
      traffic.splice(i, 1);
      continue;
    }

    let currentSpeed = npc.speed;
    const distToCenter = Math.hypot(pose.x - sideX, pose.y - MAIN_Y);
    
    // Commit to crossing once near enough to the center
    if (!npc.started && distToCenter < ROAD_W * 0.5) {
      npc.started = true;
    }

    // A. Keep Distance / Collision Avoidance
    const sensorDist = 70;
    const sensorX = pose.x + Math.cos(pose.angle) * sensorDist;
    const sensorY = pose.y + Math.sin(pose.angle) * sensorDist;
    
    const someoneAhead = allPoses.some(other => {
      // Don't detect self or cars very close to center if we are already crossing
      if (Math.hypot(other.x - pose.x, other.y - pose.y) < 20) return false;
      return Math.hypot(other.x - sensorX, other.y - sensorY) < 55;
    });

    // B. Intersection Yielding (Give way to player from right)
    // Only yield if at entry and haven't started crossing yet
    const isAtEntry = !npc.started && distToCenter < ROAD_W * 1.3 && distToCenter > ROAD_W * 0.45;
    
    let shouldYield = false;
    if (isAtEntry) {
      const player = g.car;
      // N lets W (player) pass
      if (npc.from === 'N') {
        if (player.x < sideX && player.x > sideX - 280 && Math.abs(player.y - (MAIN_Y - LANE_OFFSET)) < 50) shouldYield = true;
      } 
      // E lets N pass (but player is at W, so E lets W pass if they are close)
      else if (npc.from === 'E') {
        if (player.x < sideX && player.x > sideX - 150 && Math.abs(player.y - (MAIN_Y - LANE_OFFSET)) < 50) shouldYield = true;
      }
    }

    if (someoneAhead || shouldYield) {
      currentSpeed = 0;
    }

    npc.t += currentSpeed * dt;
  }

  // 3. Roundabout stepping (original logic)
  for (const vehicle of roundaboutTraffic) {
    if (!vehicle.active && !vehicle.done) {
      if (g.level?.config?.continuousTraffic) {
        vehicle.cooldown = (vehicle.cooldown ?? 0) - dt;
        if (vehicle.cooldown <= 0) {
          vehicle.active = true;
          vehicle.t = 0;
        }
      } else if (playerIsApproachingRoundabout(g.car, vehicle.x)) {
        vehicle.active = true;
        vehicle.t = 0;
      }
    }

    if (vehicle.active) {
      vehicle.t += dt;
      if (!getRoundaboutVehiclePose(vehicle)) {
        vehicle.active = false;
        if (g.level?.config?.continuousTraffic) {
          vehicle.cooldown = 2.0 + Math.random() * 4.0;
        } else {
          vehicle.done = true;
        }
      }
    }
  }

  // 4. Main road flow (fallback for non-intersection levels)
  for (const vehicle of mainTraffic) {
    if (!vehicle.active) {
      vehicle.cooldown = (vehicle.cooldown ?? 0) - dt;
      if (vehicle.cooldown <= 0) {
        vehicle.active = true;
        vehicle.t = 0;
        vehicle.speed = MAIN_ROAD_SPEED * (0.8 + Math.random() * 0.3);
      }
    }

    if (vehicle.active) {
      vehicle.t += dt;
      const x = worldWidth + 100 - (vehicle.speed ?? MAIN_ROAD_SPEED) * vehicle.t;
      if (x < -100) {
        vehicle.active = false;
        vehicle.cooldown = 2.0 + Math.random() * 6.0;
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

  const worldWidth = g.level?.worldWidth ?? 1600;
  for (const vehicle of g.mainRoadTraffic ?? []) {
    const pose = getMainRoadVehiclePose(vehicle, worldWidth);
    if (pose) {
      poses.push({
        ...pose,
        kind: 'main',
        objectiveId: 'left',
        flag: 'mainRoadNpcCollision',
      });
    }
  }

  return poses;
}

export function getIntersectionVehiclePose(vehicle) {
  const points = vehicle.path;
  const d = vehicle.t;
  
  let totalDist = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const dist = Math.hypot(points[i+1].x - points[i].x, points[i+1].y - points[i].y);
    if (totalDist + dist > d) {
      const p = (d - totalDist) / dist;
      const x = lerp(points[i].x, points[i+1].x, p);
      const y = lerp(points[i].y, points[i+1].y, p);
      const angle = Math.atan2(points[i+1].y - points[i].y, points[i+1].x - points[i].x);
      return { x, y, angle, color: TRAFFIC_BLUE };
    }
    totalDist += dist;
  }
  return null;
}

function getManeuverPath(from, to, sideX, mainY, worldW) {
  const L = LANE_OFFSET;
  const entryDist = 100;
  const exitDist = 100;

  const points = [];
  
  // Entry Point
  if (from === 'N') points.push({ x: sideX - L, y: -entryDist });
  if (from === 'S') points.push({ x: sideX + L, y: H + entryDist });
  if (from === 'W') points.push({ x: -entryDist, y: mainY - L });
  if (from === 'E') points.push({ x: worldW + entryDist, y: mainY + L });

  // Intersection Entry Line
  if (from === 'N') points.push({ x: sideX - L, y: mainY - ROAD_W/2 });
  if (from === 'S') points.push({ x: sideX + L, y: mainY + ROAD_W/2 });
  if (from === 'W') points.push({ x: sideX - ROAD_W/2, y: mainY - L });
  if (from === 'E') points.push({ x: sideX + ROAD_W/2, y: mainY + L });

  // Intermediate Turning Points
  if (from === 'N' && to === 'E') points.push({ x: sideX - L, y: mainY - L }, { x: sideX + L, y: mainY - L });
  if (from === 'N' && to === 'W') points.push({ x: sideX - L, y: mainY + L }, { x: sideX - ROAD_W/2, y: mainY + L });
  
  if (from === 'S' && to === 'W') points.push({ x: sideX + L, y: mainY + L }, { x: sideX - L, y: mainY + L });
  if (from === 'S' && to === 'E') points.push({ x: sideX + L, y: mainY - L }, { x: sideX + ROAD_W/2, y: mainY - L });

  if (from === 'W' && to === 'N') points.push({ x: sideX + L, y: mainY - L }, { x: sideX + L, y: mainY - ROAD_W/2 });
  if (from === 'W' && to === 'S') points.push({ x: sideX - L, y: mainY - L }, { x: sideX - L, y: mainY + ROAD_W/2 });

  if (from === 'E' && to === 'S') points.push({ x: sideX - L, y: mainY + L }, { x: sideX - L, y: mainY + ROAD_W/2 });
  if (from === 'E' && to === 'N') points.push({ x: sideX + L, y: mainY + L }, { x: sideX + L, y: mainY - ROAD_W/2 });

  // Intersection Exit Line
  if (to === 'N') points.push({ x: sideX + L, y: mainY - ROAD_W/2 });
  if (to === 'S') points.push({ x: sideX - L, y: mainY + ROAD_W/2 });
  if (to === 'W') points.push({ x: sideX - ROAD_W/2, y: mainY + L });
  if (to === 'E') points.push({ x: sideX + ROAD_W/2, y: mainY - L });

  // Final Exit Point
  if (to === 'N') points.push({ x: sideX + L, y: -exitDist });
  if (to === 'S') points.push({ x: sideX - L, y: H + exitDist });
  if (to === 'W') points.push({ x: -exitDist, y: mainY + L });
  if (to === 'E') points.push({ x: worldW + exitDist, y: mainY - L });

  return points;
}


export function getRoundaboutVehiclePose(vehicle) {
  if (vehicle.done) return null;

  const cx = vehicle.x;
  const cy = MAIN_Y;
  const waitX = cx + ROUNDABOUT_OUTER_RADIUS + 42;
  const waitY = cy + ROUNDABOUT_ENTRY_Y_OFFSET;
  
  const approachStart = { x: cx + ROUNDABOUT_OUTER_RADIUS + 500, y: waitY, angle: Math.PI };
  const wait = { x: waitX, y: waitY, angle: Math.PI };

  if (!vehicle.active) return { ...approachStart, color: TRAFFIC_BLUE };

  const approachEnd = ROUNDABOUT_APPROACH_DURATION;
  const entryEnd = approachEnd + ROUNDABOUT_ENTRY_DURATION;
  const arcEnd = entryEnd + ROUNDABOUT_ARC_DURATION;
  const total = arcEnd + ROUNDABOUT_EXIT_DURATION;

  if (vehicle.t > total) return null;

  if (vehicle.t <= approachEnd) {
    const p = vehicle.t / ROUNDABOUT_APPROACH_DURATION;
    return {
      x: lerp(approachStart.x, wait.x, p),
      y: wait.y,
      angle: Math.PI,
      color: TRAFFIC_BLUE,
    };
  }

  if (vehicle.t <= entryEnd) {
    const p = (vehicle.t - approachEnd) / ROUNDABOUT_ENTRY_DURATION;
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
    y: lerp(arcExitY, -200, p),
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
