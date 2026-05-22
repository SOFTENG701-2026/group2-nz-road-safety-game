// Persist per-level star ratings to localStorage.
// Stars: 0 = not played, 1 = passed (≥1 pt), 2 = good (≥60), 3 = perfect (≥85)

const STORAGE_KEY = 'nz-road-safety-v1';

export function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {};
  } catch {
    return {};
  }
}

export function saveLevel(levelId, score) {
  const stars    = scoreToStars(score);
  const progress = loadProgress();
  if ((progress[levelId] ?? 0) < stars) {
    progress[levelId] = stars;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); } catch { /* quota */ }
  }
  return progress;
}

export function scoreToStars(score) {
  return score >= 85 ? 3 : score >= 60 ? 2 : score > 0 ? 1 : 0;
}

// Level N is unlocked when Level N-1 has at least 1 star.
export function isLevelUnlocked(levelIndex, levels, progress) {
  if (levelIndex === 0) return true;
  const prev = levels[levelIndex - 1];
  return (progress[prev.id] ?? 0) >= 1;
}
