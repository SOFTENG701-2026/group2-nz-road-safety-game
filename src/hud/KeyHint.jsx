// Small row of <kbd> chips, e.g. [Up][Down][Left][Right][Space].

export default function KeyHint({ keys = ['Up', 'Down', 'Left', 'Right', 'Space'], style }) {
  return (
    <div style={{ display: 'flex', gap: 4, ...style }}>
      {keys.map((k, i) => (
        <kbd
          key={i}
          style={{
            background: 'rgba(255,255,255,0.12)',
            border:     '1px solid rgba(255,255,255,0.25)',
            color:      '#fff',
            borderRadius: 4,
            padding:    '2px 6px',
            fontSize:   10,
            fontFamily: 'ui-monospace, monospace',
          }}
        >
          {k}
        </kbd>
      ))}
    </div>
  );
}
