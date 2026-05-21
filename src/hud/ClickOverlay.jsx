// Click-to-focus splash shown when the game is not yet active.

export default function ClickOverlay({
  active,
  onActivate,
  label = 'Click to play - Arrow keys + Space',
}) {
  if (active) return null;
  return (
    <div
      onClick={onActivate}
      style={{
        position: 'absolute', inset: 0,
        background: 'rgba(15,18,26,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', zIndex: 50,
        backdropFilter: 'blur(2px)',
      }}
    >
      <div style={{
        background: '#fff',
        padding: '14px 22px',
        borderRadius: 10,
        boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
        display: 'flex', gap: 14, alignItems: 'center',
        fontFamily: 'ui-sans-serif, system-ui',
        fontWeight: 600,
        color: '#1a1a1a',
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 16,
          background: '#d83a2e',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 16,
        }}>Play</div>
        <div>
          <div style={{ fontSize: 13 }}>{label}</div>
          <div style={{ fontSize: 11, fontWeight: 400, color: '#666' }}>
            Up accelerate - Down reverse - Left/Right steer - Space brake - R reset
          </div>
        </div>
      </div>
    </div>
  );
}
