// 0-3 gold stars based on score thresholds.

export default function StarRating({ score }) {
  const stars = score >= 85 ? 3 : score >= 60 ? 2 : score > 0 ? 1 : 0;
  return (
    <div style={{ display: 'inline-flex', gap: 2 }}>
      {[0, 1, 2].map((i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 20 20"
          fill={i < stars ? '#f5b81d' : 'rgba(255,255,255,0.2)'}
        >
          <path d="M10 1l2.6 5.6 6.2.7-4.7 4.2 1.3 6.1L10 14.7 4.6 17.6 5.9 11.5 1.2 7.3l6.2-.7z" />
        </svg>
      ))}
    </div>
  );
}
