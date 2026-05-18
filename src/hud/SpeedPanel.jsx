// Bottom-left speed + limit module. Limit roundel pulses when in a 30 zone.
import { inSchoolZone } from '../engine/geofence.js';
import { pxToKmh } from '../engine/units.js';

export default function SpeedPanel({ car, level }) {
  const kmh   = pxToKmh(Math.abs(car.speed));
  const schoolLimit = level?.config?.schoolZone ? (inSchoolZone(car.x, level.config.schoolZone) ? 30 : null) : null;
  const defaultLimit = level?.id === 'urban' ? 50 : 100;
  const limit = schoolLimit ?? defaultLimit;
  const over  = kmh > limit;

  return (
    <div style={{
      position: 'absolute', bottom: 14, left: 16,
      background: 'rgba(14,18,26,0.92)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 6,
      padding: '8px 14px',
      color: '#fff',
      display: 'flex', alignItems: 'center', gap: 14,
      boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
      backdropFilter: 'blur(8px)',
    }}>
      <Speed kmh={kmh} over={over} />
      <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,0.1)' }} />
      <LimitRoundel limit={limit} />
    </div>
  );
}

function Speed({ kmh, over }) {
  return (
    <div>
      <div style={{ fontSize: 8, letterSpacing: 1.5, color: 'rgba(255,255,255,0.45)' }}>SPEED</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{
          fontSize: 26, fontWeight: 800, lineHeight: 1,
          color: over ? '#ff7a6a' : '#fff',
          fontVariantNumeric: 'tabular-nums',
          transition: 'color 0.15s',
        }}>{kmh}</span>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>km/h</span>
      </div>
      <div style={{
        width: 60, height: 2, marginTop: 4,
        background: 'rgba(255,255,255,0.1)',
        borderRadius: 1,
      }}>
        <div style={{
          width: `${Math.min(100, (kmh / 80) * 100)}%`,
          height: '100%', borderRadius: 1,
          background: over ? '#ff7a6a' : '#7ce69a',
          transition: 'width 0.15s',
        }} />
      </div>
    </div>
  );
}

function LimitRoundel({ limit }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 8, letterSpacing: 1.5, color: 'rgba(255,255,255,0.45)', marginBottom: 2 }}>LIMIT</div>
      <div style={{
        width: 36, height: 36, borderRadius: 18,
        background: '#fff', border: '3px solid #c0282a',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 800, fontSize: 13, color: '#1a1a1a',
        animation: limit === 30 ? 'mmLimitPulse 1.5s ease-in-out infinite' : 'none',
      }}>{limit}</div>
    </div>
  );
}
