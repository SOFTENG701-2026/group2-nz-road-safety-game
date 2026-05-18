// HUD-only data: ordered list of hazards along the route. Used by the
// progress bar, the "NEXT AHEAD" callout, and the minimap.
import { SCHOOL_ZONE, PED_X, SIDE_X, FINISH_X } from './constants.js';

export const MISSION_HAZARDS = [
  { id: 'school',  x: (SCHOOL_ZONE.x1 + SCHOOL_ZONE.x2) / 2, label: 'School zone · 30',     icon: '🏫', color: '#f5b81d' },
  { id: 'ped',     x: PED_X,                                  label: 'Pedestrian crossing',  icon: '🚶', color: '#fff'    },
  { id: 'giveway', x: SIDE_X,                                 label: 'Give-way intersection', icon: '✋', color: '#7ec8ff' },
  { id: 'finish',  x: FINISH_X,                               label: 'Destination',           icon: '🏁', color: '#7ce69a' },
];
