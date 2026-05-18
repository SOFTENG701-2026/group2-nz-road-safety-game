// Append each new coach line to a rolling log with a mm:ss timestamp.
import { useRef } from 'react';

export function useRadioLog(game) {
  const log         = useRef([]);
  const lastCoachId = useRef(null);

  // Reset on fresh game
  if (game.t < 0.1) {
    log.current = [];
    lastCoachId.current = null;
  }

  if (game.coach.id && game.coach.id !== lastCoachId.current) {
    lastCoachId.current = game.coach.id;
    const mm = String(Math.floor(game.t / 60)).padStart(2, '0');
    const ss = String(Math.floor(game.t % 60)).padStart(2, '0');
    log.current.unshift({
      id:   game.coach.id,
      text: game.coach.text,
      tone: game.coach.tone,
      ts:   `${mm}:${ss}`,
    });
    if (log.current.length > 3) log.current.pop();
  }

  return log.current;
}
