// Speed instrument panel — dark tactical style, bottom-left.
// Large numbers, colour-coded limit roundel, red panel + glow when over limit.
import { inSchoolZone } from '../engine/geofence.js';
import { pxToKmh } from '../engine/units.js';

function getActiveLimit(car, level) {
  const cfg = level?.config ?? {};
  if (cfg.schoolZone && inSchoolZone(car.x, cfg.schoolZone)) {
    return level?.id === 'mountain' ? 30 : 40; // icy road = 30, school zone = 40
  }
  if (cfg.gravelZone && car.x >= cfg.gravelZone.x1 && car.x <= cfg.gravelZone.x2) return 60;
  return level?.speedLimit ?? 50;
}

export default function SpeedPanel({ car, level }) {
  const kmh   = Math.round(pxToKmh(Math.abs(car.speed)));
  const limit  = getActiveLimit(car, level);
  const over   = kmh > limit;

  const barScale = limit / 0.65;
  const barFill  = Math.min(100, (kmh / barScale) * 100);
  const limitPct = Math.min(100, (limit / barScale) * 100);

  return (
    <div style={{
      position: 'absolute', bottom: 14, left: 16,
      background: over ? 'rgba(170,18,12,0.97)' : 'rgba(8,12,22,0.97)',
      border: `2px solid ${over ? 'rgba(255,88,68,0.95)' : 'rgba(255,255,255,0.11)'}`,
      borderRadius: 12,
      padding: '14px 20px 12px',
      color: '#fff',
      display: 'flex', flexDirection: 'column', gap: 10,
      boxShadow: over
        ? '0 0 36px rgba(255,48,28,0.7), 0 12px 32px rgba(0,0,0,0.6)'
        : '0 8px 28px rgba(0,0,0,0.55)',
      backdropFilter: 'blur(14px)',
      animation: over ? 'mmSpeedFlash 0.65s ease-in-out infinite' : 'none',
      transition: 'background 0.25s, border-color 0.25s, box-shadow 0.25s',
      minWidth: 190,
    }}>
      {/* Speed + limit roundel */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 14 }}>
        <div>
          <div style={{
            fontSize: 10, letterSpacing: 2.5, fontWeight: 800, marginBottom: 4,
            color: over ? '#ffbbbb' : 'rgba(255,255,255,0.45)',
          }}>
            {over ? '⚠  OVER LIMIT' : 'SPEED'}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{
              fontSize: 58, fontWeight: 900, lineHeight: 1, letterSpacing: -3,
              color: over ? '#ffe8e4' : '#fff',
              fontVariantNumeric: 'tabular-nums',
              transition: 'color 0.15s',
            }}>
              {kmh}
            </span>
            <span style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.55)', marginBottom: 6 }}>
              km/h
            </span>
          </div>
        </div>

        <div style={{ textAlign: 'center', paddingBottom: 2 }}>
          <div style={{
            fontSize: 10, letterSpacing: 2, fontWeight: 700, marginBottom: 6,
            color: 'rgba(255,255,255,0.45)',
          }}>
            LIMIT
          </div>
          <div style={{
            width: 58, height: 58, borderRadius: 29,
            background: '#fff',
            border: `5px solid ${over ? '#ff5533' : '#c0282a'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: 22, color: '#1a1a1a',
            boxShadow: over ? '0 0 14px rgba(255,80,48,0.9)' : 'none',
            animation: limit === 30 && !over ? 'mmLimitPulse 1.5s ease-in-out infinite' : 'none',
            transition: 'box-shadow 0.2s, border-color 0.2s',
          }}>
            {limit}
          </div>
        </div>
      </div>

      {/* Speed bar with limit tick */}
      <div style={{ position: 'relative', height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3 }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, borderRadius: 3,
          width: `${barFill}%`,
          background: over
            ? `linear-gradient(90deg, #ff7760 ${limitPct}%, #ff2800)`
            : '#7ce69a',
          transition: 'width 0.12s',
        }} />
        <div style={{
          position: 'absolute',
          left: `${limitPct}%`,
          top: -3, width: 2, height: 12, borderRadius: 1,
          transform: 'translateX(-1px)',
          background: over ? 'rgba(255,220,210,0.9)' : '#f5b81d',
        }} />
      </div>
    </div>
  );
}
