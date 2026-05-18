// Mission-complete modal: stars, score breakdown, drive-again button.

export default function FinishCard({ game, onReset }) {
  const stars = game.score >= 85 ? 3 : game.score >= 60 ? 2 : game.score > 0 ? 1 : 0;

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'rgba(15,18,26,0.7)',
      backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 30,
    }}>
      <div style={{
        background: '#fff',
        padding: '20px 24px',
        borderRadius: 12,
        width: 320,
        boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
        fontFamily: 'ui-sans-serif, system-ui',
      }}>
        <div style={{ fontSize: 11, color: '#7a8275', letterSpacing: 2, fontWeight: 600 }}>
          MISSION COMPLETE
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#1a1a1a', marginTop: 4 }}>
          The School Run
        </div>

        <div style={{ display: 'flex', gap: 4, marginTop: 12 }}>
          {[0, 1, 2].map((i) => (
            <svg key={i} width="32" height="32" viewBox="0 0 20 20"
                 fill={i < stars ? '#f5b81d' : '#e0e0e0'}>
              <path d="M10 1l2.6 5.6 6.2.7-4.7 4.2 1.3 6.1L10 14.7 4.6 17.6 5.9 11.5 1.2 7.3l6.2-.7z" />
            </svg>
          ))}
        </div>

        <div style={{
          marginTop: 14, padding: '12px 0',
          borderTop:    '1px solid #eee',
          borderBottom: '1px solid #eee',
        }}>
          <Row label="Final score"    value={`${game.score} / 100`} />
          <Row label="Demerit points" value={game.demerits} />
        </div>

        <button onClick={onReset} style={{
          marginTop: 14, width: '100%',
          padding: '10px',
          background: '#d83a2e', color: '#fff',
          border: 'none', borderRadius: 8,
          fontWeight: 700, fontSize: 13,
          cursor: 'pointer',
        }}>
          Drive again
        </button>
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
