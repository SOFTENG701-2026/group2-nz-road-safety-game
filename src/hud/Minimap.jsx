// Tactical overhead minimap — top-right, 180×96 px.
// Shows roads, hazard zones, trail, ambient NPCs, and player ping.
import { useTrail } from './useTrail.js';
import { W, H, MAIN_Y, START_X, FINISH_X } from '../engine/constants.js';

const MM_W = 240;
const MM_H = 130;

export default function Minimap({ game }) {
  const level      = game.level;
  const worldW     = level?.worldWidth ?? W;
  const trail      = useTrail(game);
  const sx         = MM_W / worldW;
  const sy         = MM_H / H;
  const headingDeg = (game.car.angle * 180) / Math.PI;

  const cfg         = level?.config ?? {};
  const schoolZone  = cfg.schoolZone;
  const gravelZone  = cfg.gravelZone;
  const pedX        = cfg.pedX;
  const sideX       = cfg.sideX;
  const bridgeX     = cfg.bridgeX;
  const roundaboutX = cfg.roundaboutX;
  const railX       = cfg.railX;
  const startX      = level?.startX  ?? START_X;
  const finishX     = level?.finishX ?? FINISH_X;

  return (
    <div style={{
      position: 'absolute', top: 84, right: 16, width: MM_W,
      background: 'rgba(14,18,26,0.55)',
      border: '1px solid rgba(126,200,255,0.18)',
      borderRadius: 6,
      boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
      backdropFilter: 'blur(8px)',
      overflow: 'hidden',
    }}>
      <Header />
      <div style={{ position: 'relative', width: MM_W, height: MM_H }}>
        <svg width={MM_W} height={MM_H} viewBox={`0 0 ${MM_W} ${MM_H}`} style={{ display: 'block' }}>
          <Defs />
          <rect width={MM_W} height={MM_H} fill="#0f1520" />
          <rect width={MM_W} height={MM_H} fill="url(#mmGrid)" />

          {/* Roads */}
          <rect x="0" y={MAIN_Y * sy - 5} width={MM_W} height="10" fill="#2a3548" />
          {sideX && (
            <rect x={sideX * sx - 4} y="0" width="8" height={MM_H} fill="#2a3548" />
          )}
          <line x1="0" y1={MAIN_Y * sy} x2={MM_W} y2={MAIN_Y * sy}
                stroke="#f6c945" strokeWidth="0.6" strokeDasharray="3 3" opacity="0.6" />

          {/* School / icy zone */}
          {schoolZone && (
            <rect
              x={schoolZone.x1 * sx} y={MAIN_Y * sy - 5}
              width={(schoolZone.x2 - schoolZone.x1) * sx} height="10"
              fill={level?.id === 'mountain' ? 'rgba(160,220,255,0.4)' : 'rgba(245,184,29,0.35)'}
            />
          )}

          {/* Gravel zone */}
          {gravelZone && (
            <rect
              x={gravelZone.x1 * sx} y={MAIN_Y * sy - 5}
              width={(gravelZone.x2 - gravelZone.x1) * sx} height="10"
              fill="rgba(196,163,90,0.45)"
            />
          )}

          {/* Pedestrian crossing */}
          {pedX && (
            <rect x={pedX * sx - 1.5} y={MAIN_Y * sy - 5} width="3" height="10" fill="#fff" />
          )}

          {/* Roundabout */}
          {roundaboutX && (
            <circle cx={roundaboutX * sx} cy={MAIN_Y * sy} r="7"
                    fill="none" stroke="#a78bfa" strokeWidth="1.5" opacity="0.8" />
          )}

          {/* Railway crossing */}
          {railX && (
            <line x1={railX * sx} y1={MAIN_Y * sy - 8}
                  x2={railX * sx} y2={MAIN_Y * sy + 8}
                  stroke="#ff6b6b" strokeWidth="2" />
          )}

          {/* Bridge */}
          {bridgeX && (
            <rect x={bridgeX * sx - 8} y={MAIN_Y * sy - 5} width="16" height="10"
                  fill="#4e8ab5" stroke="#7ec8ff" strokeWidth="0.7" />
          )}

          {/* Give-way diamond at intersection */}
          {sideX && (
            <polygon
              points={`${sideX*sx},${MAIN_Y*sy+10} ${sideX*sx+4},${MAIN_Y*sy+14} ${sideX*sx},${MAIN_Y*sy+18} ${sideX*sx-4},${MAIN_Y*sy+14}`}
              fill="rgba(126,200,255,0.5)" stroke="#7ec8ff" strokeWidth="0.7"
            />
          )}

          {/* Player trail */}
          {trail.length > 1 && (
            <polyline
              fill="none" stroke="#d83a2e" strokeWidth="1.2" strokeOpacity="0.55"
              strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 2"
              points={trail.map(([x, y]) => `${x * sx},${y * sy}`).join(' ')}
            />
          )}

          {/* Start / Finish */}
          <circle cx={startX  * sx} cy={MAIN_Y * sy} r="3" fill="#7ce69a" stroke="#0a0d12" strokeWidth="1" />
          <circle cx={finishX * sx} cy={MAIN_Y * sy} r="4" fill="#f5b81d" stroke="#0a0d12" strokeWidth="1" />
          <text x={finishX * sx} y={MAIN_Y * sy - 7}
                fill="#f5b81d" fontSize="7" fontWeight="700" textAnchor="middle" letterSpacing="0.5">
            END
          </text>

          {/* Player ping */}
          <circle cx={game.car.x * sx} cy={game.car.y * sy} r="10" fill="url(#mmPing)">
            <animate attributeName="r"       values="6;14;6"    dur="1.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0;0.8" dur="1.8s" repeatCount="indefinite" />
          </circle>
          <g transform={`translate(${game.car.x * sx},${game.car.y * sy}) rotate(${headingDeg})`}>
            <polygon points="-3,-3 5,0 -3,3" fill="#fff" stroke="#d83a2e" strokeWidth="1" />
          </g>
        </svg>

        <ScaleBar />
        <Coords />
      </div>
    </div>
  );
}

function Defs() {
  return (
    <defs>
      <radialGradient id="mmPing" cx="50%" cy="50%" r="50%">
        <stop offset="0%"   stopColor="#d83a2e" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#d83a2e" stopOpacity="0"   />
      </radialGradient>
      <pattern id="mmGrid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(126,200,255,0.06)" strokeWidth="0.5" />
      </pattern>
    </defs>
  );
}

function Header() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '8px 12px 6px',
    }}>
      <span style={{ fontSize: 9, letterSpacing: 2, color: '#7ec8ff', fontWeight: 600 }}>TACTICAL MAP</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 9, color: 'rgba(255,255,255,0.5)' }}>
        <svg width="10" height="10" viewBox="0 0 10 10">
          <path d="M5 1 L7 7 L5 5.5 L3 7 Z" fill="#ff7a6a" />
          <path d="M5 9 L7 3 L5 4.5 L3 3 Z" fill="rgba(255,255,255,0.4)" />
        </svg>
        <span style={{ fontWeight: 600, letterSpacing: 1 }}>N</span>
      </div>
    </div>
  );
}

function ScaleBar() {
  return (
    <div style={{
      position: 'absolute', bottom: 6, left: 8,
      color: 'rgba(255,255,255,0.55)', fontSize: 8,
      display: 'flex', alignItems: 'center', gap: 4,
    }}>
      <div style={{ position: 'relative', width: 36, height: 2, background: 'rgba(255,255,255,0.55)' }}>
        <div style={{ position: 'absolute', left:  0, top: -2, width: 1, height: 6, background: 'rgba(255,255,255,0.55)' }} />
        <div style={{ position: 'absolute', right: 0, top: -2, width: 1, height: 6, background: 'rgba(255,255,255,0.55)' }} />
      </div>
      <span style={{ letterSpacing: 0.5 }}>100 m</span>
    </div>
  );
}

function Coords() {
  return (
    <div style={{
      position: 'absolute', bottom: 6, right: 8,
      color: 'rgba(255,255,255,0.45)', fontSize: 8,
      fontVariantNumeric: 'tabular-nums', letterSpacing: 0.5,
    }}>
      36°47′S · 174°45′E
    </div>
  );
}
