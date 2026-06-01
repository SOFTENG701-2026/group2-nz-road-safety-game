// Collision modal: shown when the player crashes into traffic (game.crashed).
// Unlike FinishCard this does NOT report a score — a crash ends the run as a
// failure, so no stars/progress are saved. Only Retry / Menu are offered.

export default function CrashCard({ game, onReset, onBack, isMobile }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'rgba(15,18,26,0.72)',
      backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 50,
    }}>
      <div style={{
        background: '#fff',
        padding: isMobile ? '16px 20px' : '20px 24px',
        borderRadius: 12,
        width: isMobile ? 300 : 330,
        boxShadow: '0 20px 50px rgba(0,0,0,0.45)',
        fontFamily: 'ui-sans-serif, system-ui',
        borderTop: '4px solid #d83a2e',
        transform: isMobile ? 'scale(0.95)' : 'none',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: isMobile ? 18 : 22 }}>⚠️</span>
          <div style={{ fontSize: isMobile ? 9 : 11, color: '#d83a2e', letterSpacing: 2, fontWeight: 700 }}>
            COLLISION
          </div>
        </div>
        <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 800, color: '#1a1a1a', marginTop: 4 }}>
          Crashed!
        </div>

        {/* Coach explanation of what went wrong */}
        <p style={{
          marginTop: 12, marginBottom: 0,
          fontSize: isMobile ? 12 : 13, color: '#3a3a3a', lineHeight: 1.5,
        }}>
          {game.coach?.text || 'You collided with another vehicle. Give way and watch for traffic.'}
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
          {onBack && (
            <button onClick={onBack} style={{ ...btnSecondary, padding: isMobile ? '8px' : '10px', fontSize: isMobile ? 12 : 13 }}>
              ← Menu
            </button>
          )}
          <button onClick={onReset} style={{ ...btnDanger, padding: isMobile ? '8px' : '10px', fontSize: isMobile ? 12 : 13 }}>
            Retry
          </button>
        </div>
      </div>
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
