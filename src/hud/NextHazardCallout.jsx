// "NEXT AHEAD" mini-card shown at the bottom of the objectives panel.

export default function NextHazardCallout({ hazard, distance, isMobile }) {
  if (!hazard) return null;
  return (
    <div style={{
      marginTop: isMobile ? 6 : 10, paddingTop: isMobile ? 6 : 10,
      borderTop: '1px solid rgba(255,255,255,0.08)',
    }}>
      <div style={{
        fontSize: isMobile ? 8 : 9, letterSpacing: 2, fontWeight: 600,
        color: 'rgba(255,255,255,0.45)',
        marginBottom: 4,
      }}>NEXT AHEAD</div>

      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 6 : 8 }}>
        <div style={{
          width: isMobile ? 22 : 26, height: isMobile ? 22 : 26, borderRadius: 4,
          background: `${hazard.color}22`,
          border: `1px solid ${hazard.color}66`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: isMobile ? 12 : 14,
        }}>
          {hazard.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: isMobile ? 10 : 11, fontWeight: 600, color: '#fff',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{hazard.label}</div>
          <div style={{
            fontSize: isMobile ? 9 : 10, fontWeight: 600,
            color: hazard.color,
            fontVariantNumeric: 'tabular-nums',
          }}>{distance} m</div>
        </div>
      </div>
    </div>
  );
}
