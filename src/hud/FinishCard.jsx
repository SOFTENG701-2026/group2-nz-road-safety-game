// Mission-complete modal: stars, score breakdown, timer, next-level button.
import { useEffect, useRef } from 'react';
import { LEVELS } from '../levels/index.js';
import { scoreToStars } from '../engine/progress.js';

function starLabel(stars) {
  if (stars === 3) return 'Perfect!';
  if (stars === 2) return 'Good drive';
  if (stars === 1) return 'Passed';
  return 'Keep practising';
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function FinishCard({ game, onReset, onBack, onNextLevel, onComplete }) {
  const stars       = scoreToStars(game.score);
  const currentIdx  = LEVELS.findIndex(l => l.id === game.level?.id);
  const nextLevel   = currentIdx >= 0 && currentIdx < LEVELS.length - 1
    ? LEVELS[currentIdx + 1]
    : null;

  // Report score to App once on mount so progress can be saved
  const reported = useRef(false);
  useEffect(() => {
    if (!reported.current) {
      reported.current = true;
      onComplete?.(game.score);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'rgba(15,18,26,0.72)',
      backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 30,
    }}>
      <div style={{
        background: '#fff',
        padding: '20px 24px',
        borderRadius: 12,
        width: 330,
        boxShadow: '0 20px 50px rgba(0,0,0,0.45)',
        fontFamily: 'ui-sans-serif, system-ui',
      }}>
        {/* Header */}
        <div style={{ fontSize: 11, color: '#7a8275', letterSpacing: 2, fontWeight: 600 }}>
          MISSION COMPLETE
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#1a1a1a', marginTop: 4 }}>
          {game.level?.missionName || 'Mission Complete'}
        </div>

        {/* Stars */}
        <div style={{ display: 'flex', gap: 4, marginTop: 12 }}>
          {[0, 1, 2].map((i) => (
            <svg key={i} width="34" height="34" viewBox="0 0 20 20"
                 fill={i < stars ? '#f5b81d' : '#e0e0e0'}>
              <path d="M10 1l2.6 5.6 6.2.7-4.7 4.2 1.3 6.1L10 14.7 4.6 17.6 5.9 11.5 1.2 7.3l6.2-.7z" />
            </svg>
          ))}
          <span style={{
            marginLeft: 8, alignSelf: 'center',
            fontSize: 11, color: '#888',
          }}>
            {starLabel(stars)}
          </span>
        </div>

        {/* Score breakdown */}
        <div style={{
          marginTop: 14, padding: '12px 0',
          borderTop: '1px solid #eee', borderBottom: '1px solid #eee',
        }}>
          <Row label="Final score"    value={`${game.score} / 100`} />
          <Row label="Demerit points" value={game.demerits} />
          <Row label="Time"           value={formatTime(game.elapsed)} />
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          {onBack && (
            <button onClick={onBack} style={btnSecondary}>
              ← Menu
            </button>
          )}
          <button onClick={onReset} style={btnDanger}>
            Retry
          </button>
          {nextLevel && stars >= 1 && (
            <button onClick={onNextLevel} style={btnPrimary}>
              Next →
            </button>
          )}
        </div>

        {nextLevel && stars === 0 && (
          <p style={{ fontSize: 11, color: '#999', marginTop: 10, textAlign: 'center' }}>
            Score at least 1 point to unlock the next level.
          </p>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between',
      fontSize: 13, color: '#3a3a3a', marginTop: 4,
    }}>
      <span>{label}</span>
      <b style={{ fontVariantNumeric: 'tabular-nums' }}>{value}</b>
    </div>
  );
}

const base = {
  flex: 1, padding: '10px',
  border: 'none', borderRadius: 8,
  fontWeight: 700, fontSize: 13,
  cursor: 'pointer',
};
const btnSecondary = { ...base, background: 'transparent', color: '#555', border: '1px solid #ddd' };
const btnDanger    = { ...base, background: '#d83a2e', color: '#fff' };
const btnPrimary   = { ...base, background: '#1a6fc4', color: '#fff' };
