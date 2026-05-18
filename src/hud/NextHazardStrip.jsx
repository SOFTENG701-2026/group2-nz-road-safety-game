// Floating chip under the top bar with the next hazard. Doesn't block
// the road, just confirms what's coming so the player isn't surprised.

export default function NextHazardStrip({ hazard, distance }) {
  if (!hazard) return null;
  return (
    <div style={{
      position: 'absolute', top: 84, left: 60,
      display: 'flex', alignItems: 'center', gap: 6,
      background: 'rgba(14,18,26,0.55)',
      border: '1px solid rgba(126,200,255,0.18)',
      borderRadius: 14,
      padding: '4px 10px 4px 6px',
      backdropFilter: 'blur(8px)',
      color: '#fff',
      boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
    }}>
      <div style={{
        width: 20, height: 20, borderRadius: 3,
        background: `${hazard.color}22`,
        border: `1px solid ${hazard.color}66`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11,
      }}>{hazard.icon}</div>
      <span style={{ fontSize: 10, fontWeight: 600 }}>{hazard.label}</span>
      <span style={{
        fontSize: 10, fontWeight: 700,
        color: hazard.color, fontVariantNumeric: 'tabular-nums',
      }}>{distance}m</span>
    </div>
  );
}
