// World dimensions and key positions. Tune these to change the level layout.

export const W = 1600;          // world width (px)
export const H = 1100;          // world height (px)

export const ROAD_W = 110;      // 2-lane road width
export const LANE   = ROAD_W / 2;

export const MAIN_Y = 560;      // main road centerline (horizontal road)
export const SIDE_X = 1180;     // side road centerline (vertical road joining main)

// Speed-30 school zone on the main road
export const SCHOOL_ZONE = { x1: 540, x2: 880 };

// Pedestrian crossing on main road
export const PED_X = 980;

// Start / finish gates on main road
export const START_X  = 140;
export const FINISH_X = 1480;

// Speed conversion: tuned so 50 px/s is about 30 km/h, 90 px/s is about 50 km/h.
export const KMH_PER_PXS = 50 / 90;
