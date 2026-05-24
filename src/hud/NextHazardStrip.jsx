// Centred hazard callout below the progress bar.
// Gives the player advance warning of what's coming up.

export default function NextHazardStrip({ hazard, distance, isMobile }) {
  if (!hazard) return null;

  return (
    <div style={{
      position: 'absolute',
      top: 84,
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex', alignItems: 'center', gap: isMobile ? 6 : 10,
      background: 'rgba(8,12,22,0.94)',
      border: `1px solid ${hazard.color}55`,
      borderRadius: 22,
      padding: isMobile ? '4px 12px 4px 6px' : '7px 16px 7px 10px',
      backdropFilter: 'blur(12px)',
      color: '#fff',
      boxShadow: `0 4px 20px ${hazard.color}22, 0 8px 24px rgba(0,0,0,0.4)`,
      pointerEvents: 'none',
      zIndex: 15,
      // transformOrigin: 'left top',
      // transform: isMobile ? 'scale(0.85)' : 'translateX(-50%)',
    }}>
      {/* Icon badge */}
      <div style={{
        width: isMobile ? 24 : 30, height: isMobile ? 24 : 30, borderRadius: 7, flexShrink: 0,
        background: `${hazard.color}20`,
        border: `1.5px solid ${hazard.color}70`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: isMobile ? 12 : 14,
      }}>
        {hazard.icon}
      </div>

      {/* Label */}
      <div>
        <div style={{
          fontSize: isMobile ? 7 : 9, letterSpacing: 2, color: 'rgba(255,255,255,0.5)',
          fontWeight: 700, marginBottom: 2,
        }}>
          NEXT AHEAD
        </div>
        <div style={{ fontSize: isMobile ? 11 : 13, fontWeight: 700, lineHeight: 1.2 }}>
          {hazard.label}
        </div>
      </div>

      {/* Distance */}
      <div style={{
        marginLeft: isMobile ? 4 : 6,
        fontSize: isMobile ? 13 : 15, fontWeight: 800, color: hazard.color,
        fontVariantNumeric: 'tabular-nums',
        minWidth: '3em'
      }}>
        {distance} m
      </div>
    </div>
  );
}
