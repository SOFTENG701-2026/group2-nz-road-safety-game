// Top bar: mission badge / title + score + rating stars + retry button.
import StarRating from './StarRating.jsx';

export default function TopStrip({ score, onReset }) {
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0,
      padding: '10px 16px 14px',
      background: 'linear-gradient(180deg, rgba(10,13,18,0.96) 0%, rgba(10,13,18,0) 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      color: '#fff',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 4,
          background: 'rgba(126,200,255,0.12)',
          border: '1px solid rgba(126,200,255,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 700, color: '#7ec8ff', letterSpacing: 0.5,
        }}>M01</div>
        <div>
          <div style={{ fontSize: 9, letterSpacing: 2.5, color: '#7ec8ff', fontWeight: 600, opacity: 0.85 }}>
            MISSION 01 - NORTH SHORE
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, marginTop: 1, letterSpacing: 0 }}>
            The School Run
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <Stat label="SCORE" value={String(score).padStart(3, '0')} />
        <Stat label="RATING" value={<StarRating score={score} />} />
        <button onClick={onReset} style={{
          background: 'rgba(255,255,255,0.06)',
          border:     '1px solid rgba(255,255,255,0.18)',
          color:      '#fff',
          padding:    '6px 12px',
          borderRadius: 5,
          fontSize: 11,
          cursor: 'pointer',
          fontFamily: 'inherit',
          fontWeight: 500,
        }}>Retry</button>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div style={{ textAlign: 'right' }}>
      <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)', letterSpacing: 1.5 }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
    </div>
  );
}
