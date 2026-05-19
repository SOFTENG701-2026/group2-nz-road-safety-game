// Top-level Mission HUD: owns the game hook and lays out every panel.
// Each panel is its own file — see ../hud/*.jsx.
import './animations.css';
import { useGame } from '../engine/useGame.js';

import TopStrip       from './TopStrip.jsx';
import ProgressBar    from './ProgressBar.jsx';
import ObjectivesPanel from './ObjectivesPanel.jsx';
import NextHazardStrip from './NextHazardStrip.jsx';
import Minimap        from './Minimap.jsx';
import SpeedPanel     from './SpeedPanel.jsx';
import RadioLog       from './RadioLog.jsx';
import FinishCard     from './FinishCard.jsx';
import ClickOverlay   from './ClickOverlay.jsx';
import KeyHint        from './KeyHint.jsx';

export default function MissionVariant({
  active,
  onActivate,
  onBack,
  level,
  difficulty = 'easy',
  hudDensity = 'full', // reserved for future low-density mode
  width  = 720,
  height = 500,
}) {
  const { canvasRef, game, reset } = useGame({ width, height, active, level, difficulty });

  // Next hazard ahead on the x-axis (or null past the finish)
  const hazards = game.level?.hazards ?? [];
  const upcoming = hazards.find((h) => h.x > game.car.x + 20) || null;
  const distance = upcoming ? Math.round((upcoming.x - game.car.x) * 0.45) : 0;

  return (
    <div style={{
      position: 'relative', width, height,
      background: '#0a0d12',
      fontFamily: '"Space Grotesk", ui-sans-serif, system-ui',
      overflow: 'hidden',
    }}>
      <canvas ref={canvasRef} />

      {/* Soft tactical vignette */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(120% 80% at 50% 50%, transparent 55%, rgba(0,0,0,0.45) 100%)',
      }} />

      <TopStrip       score={game.score} onReset={reset} onBack={onBack} level={game.level} />
      <ProgressBar    carX={game.car.x} level={game.level} />
      <NextHazardStrip hazard={!game.finished ? upcoming : null} distance={distance} />
      <Minimap        game={game} />
      <SpeedPanel     car={game.car} level={game.level} />
      <ObjectivesPanel
        objectives={game.objectives}
        upcoming={upcoming}
        distance={distance}
        finished={game.finished}
      />
      <RadioLog       game={game} />

      <div style={{
        position: 'absolute', bottom: 14, left: 200,
        display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start',
      }}>
        <KeyHint />
        <span style={{ fontSize: 8, letterSpacing: 1.5, color: 'rgba(255,255,255,0.35)' }}>
          R · RESET
        </span>
      </div>

      {game.finished && <FinishCard game={game} onReset={reset} onBack={onBack} />}
      <ClickOverlay active={active} onActivate={onActivate} />
    </div>
  );
}
