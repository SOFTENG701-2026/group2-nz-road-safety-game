// Distance bar between START and FINISH with hazard ticks + player dot.
import { START_X, FINISH_X } from '../engine/constants.js';
import { MISSION_HAZARDS } from '../engine/hazards.js';

export default function ProgressBar({ carX }) {
  const progress = clamp01((carX - START_X) / (FINISH_X - START_X));

  return (
    <div style={{ position: 'absolute', top: 56, left: 16, right: 210 }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        fontSize: 8, letterSpacing: 1.5, color: 'rgba(255,255,255,0.45)',
        marginBottom: 4,
      }}>
        <span>START · MILFORD</span>
        <span style={{ fontVariantNumeric: 'tabular-nums' }}>{Math.round(progress * 100)}%</span>
        <span>DEST · TAKAPUNA</span>
      </div>

      <div style={{
        position: 'relative', height: 3,
        background: 'rgba(255,255,255,0.08)',
        borderRadius: 2,
      }}>
        {/* Filled portion */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: `${progress * 100}%`,
          background: 'linear-gradient(90deg, #7ec8ff, #7ce69a)',
          borderRadius: 2,
        }} />

        {/* Hazard ticks */}
        {MISSION_HAZARDS.map((h) => {
          const p = (h.x - START_X) / (FINISH_X - START_X);
          return (
            <div
              key={h.id}
              title={h.label}
              style={{
                position: 'absolute',
                left: `${p * 100}%`,
                top: -3, width: 2, height: 9,
                background: h.color, opacity: 0.85,
                transform: 'translateX(-1px)',
                borderRadius: 1,
              }}
            />
          );
        })}

        {/* Player dot */}
        <div style={{
          position: 'absolute',
          left: `${progress * 100}%`,
          top: -4,
          width: 11, height: 11, borderRadius: 6,
          background: '#d83a2e',
          border: '2px solid #fff',
          transform: 'translate(-50%, 0)',
          boxShadow: '0 0 0 3px rgba(216,58,46,0.25)',
        }} />
      </div>
    </div>
  );
}

function clamp01(v) { return Math.max(0, Math.min(1, v)); }
