import { SCHOOL_ZONE, PED_X, SIDE_X, FINISH_X, START_X, MAIN_Y, LANE } from './constants.js';

export const LEVELS = [
  {
    id: 'urban',
    name: 'Level 1: Urban Basics',
    missionName: 'The School Run',
    description: 'Learn the fundamentals: stay left, watch for schools and pedestrians.',
    worldWidth: 1600,
    startX: START_X,
    finishX: FINISH_X,
    hazards: [
      { id: 'school',  x: (SCHOOL_ZONE.x1 + SCHOOL_ZONE.x2) / 2, label: 'School zone · 30',     icon: '🏫', color: '#f5b81d' },
      { id: 'ped',     x: PED_X,                                  label: 'Pedestrian crossing',  icon: '🚶', color: '#fff'    },
      { id: 'giveway', x: SIDE_X,                                 label: 'Give-way intersection', icon: '✋', color: '#7ec8ff' },
      { id: 'finish',  x: FINISH_X,                               label: 'Destination',           icon: '🏁', color: '#7ce69a' },
    ],
    objectives: [
      { id: 'left',    label: 'Keep to the left lane',       done: false, fail: false },
      { id: 'school',  label: 'Slow to 30 in school zone',   done: false, fail: false },
      { id: 'ped',     label: 'Stop for pedestrians',        done: false, fail: false },
      { id: 'giveway', label: 'Give way at intersection',    done: false, fail: false },
      { id: 'finish',  label: 'Reach the finish line',       done: false, fail: false },
    ],
    config: {
      schoolZone: SCHOOL_ZONE,
      pedX: PED_X,
      sideX: SIDE_X,
      hasOneLaneBridge: false,
    },
    signs: [
      { kind: 'keep-left',        x: 80,                  y: 660 },
      { kind: 'school-30-start',  x: SCHOOL_ZONE.x1 - 30, y: 490 },
      { kind: 'school-30-end',    x: SCHOOL_ZONE.x2 + 30, y: 630 },
      { kind: 'kiwi-crossing',    x: PED_X - 60,          y: 490 },
      { kind: 'give-way',         x: SIDE_X - 70,         y: 680 },
      { kind: 'speed-50',         x: 300,                 y: 490 },
      { kind: 'speed-50',         x: 1320,                y: 630 },
    ]
  },
  {
    id: 'rural',
    name: 'Level 2: Open Road',
    missionName: 'Cross Country',
    description: 'Higher speeds and priority rules at one-lane bridges.',
    worldWidth: 2400,
    startX: 140,
    finishX: 2200,
    hazards: [
      { id: 'speed',   x: 600,                                    label: 'Open Road · 100',      icon: '🛣️', color: '#7ce69a' },
      { id: 'bridge',  x: 1400,                                   label: 'One-lane bridge',      icon: '🌉', color: '#f5b81d' },
      { id: 'finish',  x: 2200,                                   label: 'Destination',           icon: '🏁', color: '#7ce69a' },
    ],
    objectives: [
      { id: 'left',    label: 'Keep to the left lane',       done: false, fail: false },
      { id: 'speed',   label: 'Observe speed limits',        done: false, fail: false },
      { id: 'bridge',  label: 'Give way at bridge',          done: false, fail: false },
      { id: 'finish',  label: 'Reach the finish line',       done: false, fail: false },
    ],
    config: {
      schoolZone: null,
      pedX: null,
      sideX: null,
      hasOneLaneBridge: true,
      bridgeX: 1400,
    },
    signs: [
      { kind: 'keep-left',        x: 80,                  y: 660 },
      { kind: 'speed-100',        x: 400,                 y: 490 },
      { kind: 'one-lane-bridge',  x: 1300,                y: 490 },
      { kind: 'give-way',         x: 1350,                y: 680 },
    ]
  },
  {
    id: 'highway',
    name: 'Level 3: Highway Hazards',
    missionName: 'Advanced Commute',
    description: 'Advanced scenarios: Roundabouts and Railway crossings.',
    worldWidth: 3200,
    startX: 140,
    finishX: 3000,
    hazards: [
      { id: 'roundabout', x: 1000,                                label: 'Roundabout',           icon: '🔄', color: '#7ec8ff' },
      { id: 'rail',       x: 2200,                                label: 'Railway crossing',      icon: '🚂', color: '#f5b81d' },
      { id: 'finish',     x: 3000,                                label: 'Destination',           icon: '🏁', color: '#7ce69a' },
    ],
    objectives: [
      { id: 'left',       label: 'Keep to the left lane',       done: false, fail: false },
      { id: 'roundabout', label: 'Give way at roundabout',    done: false, fail: false },
      { id: 'rail',       label: 'Stop for trains',             done: false, fail: false },
      { id: 'finish',     label: 'Reach the finish line',       done: false, fail: false },
    ],
    config: {
      schoolZone: null,
      pedX: null,
      sideX: null,
      hasRoundabout: true,
      roundaboutX: 1000,
      hasRail: true,
      railX: 2200,
    },
    signs: [
      { kind: 'keep-left',        x: 80,                  y: 660 },
      { kind: 'speed-100',        x: 400,                 y: 490 },
      { kind: 'railway-crossing', x: 2000,                y: 490 },
    ]
  }
];
