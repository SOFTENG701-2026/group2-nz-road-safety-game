// Top-level Mission HUD — dark tactical style.
import './animations.css';
import { useState }       from 'react';
import { useGame }        from '../engine/useGame.js';
import TopStrip           from './TopStrip.jsx';
import ProgressBar        from './ProgressBar.jsx';
import ObjectivesPanel    from './ObjectivesPanel.jsx';
import NextHazardStrip    from './NextHazardStrip.jsx';
import Minimap            from './Minimap.jsx';
import SpeedPanel         from './SpeedPanel.jsx';
import RadioLog           from './RadioLog.jsx';
import FinishCard         from './FinishCard.jsx';
import ClickOverlay       from './ClickOverlay.jsx';
import KeyHint            from './KeyHint.jsx';
import TouchControls      from './TouchControls.jsx';
import TutorialOverlay, { TUTORIAL_KEY } from './TutorialOverlay.jsx';
import KeyHintModal      from './KeyHintModal.jsx';

const IS_TOUCH = globalThis.window !== undefined
  && ('ontouchstart' in globalThis || navigator.maxTouchPoints > 0);

export default function MissionVariant({
  active,
  onActivate,
  onBack,
  onNextLevel,
  onComplete,
  level,
  difficulty = 'normal',
  width  = 720,
  height = 500,
  isMobile = false,
}) {
  const [showTutorialKey, setShowTutorialKey] = useState(
    () => localStorage.getItem(TUTORIAL_KEY)
  );

  const { canvasRef, game, reset, setKey } = useGame({
    width, height,
    active: active && (showTutorialKey !== 'done'),   // pause game while tutorial is open
    level, difficulty,
  });

  const hazards  = game.level?.hazards ?? [];
  const upcoming = hazards.find(h => h.x > game.car.x + 20) || null;
  const distance = upcoming ? Math.round((upcoming.x - game.car.x) * 0.45) : 0;
  const levelBg  = game.level?.bgColor ?? '#7fb35a';

  return (
    <div style={{
      position: 'relative', width, height,
      background: levelBg,
      fontFamily: '"Space Grotesk", ui-sans-serif, system-ui',
      overflow: 'hidden',
    }}>
      <canvas ref={canvasRef} />

      {/* Soft vignette */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(120% 80% at 50% 50%, transparent 55%, rgba(0,0,0,0.45) 100%)',
      }} />

      <TopStrip
        score={game.score}
        elapsed={game.elapsed}
        onReset={reset}
        onBack={onBack}
        level={game.level}
        isMobile={isMobile}
      />

      <ProgressBar carX={game.car.x} level={game.level} isMobile={isMobile} />

      <NextHazardStrip hazard={game.finished ? null : upcoming} distance={distance} isMobile={isMobile} />

      <Minimap game={game} isMobile={isMobile} />

      <SpeedPanel car={game.car} level={game.level} isMobile={isMobile} />

      <ObjectivesPanel
        objectives={game.objectives}
        upcoming={upcoming}
        distance={distance}
        finished={game.finished}
        isMobile={isMobile}
      />

      <RadioLog game={game} isMobile={isMobile} />

      {/* Key hint */}
      {!isMobile && (
        <div style={{
          position: 'absolute',
          bottom: 14,
          left: 240,
          display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start',
          pointerEvents: 'none',
        }}>
          <KeyHint />
          <span style={{ fontSize: 11, letterSpacing: 1.2, color: 'rgba(255,255,255,0.45)' }}>
            R — RESET
          </span>
        </div>
      )}

      {(isMobile || IS_TOUCH) && <TouchControls setKey={setKey} isMobile={isMobile} />}

      {game.finished && (
        <FinishCard
          game={game}
          onReset={reset}
          onBack={onBack}
          onNextLevel={onNextLevel}
          onComplete={onComplete}
          isMobile={isMobile}
        />
      )}

      {showTutorialKey === 'keyboard' && (
        <KeyHintModal onComplete={() => setShowTutorialKey('done')} />
      )}

      {!showTutorialKey && (
        <TutorialOverlay
          isMobile={isMobile}
          onDone={() => {
            localStorage.setItem(TUTORIAL_KEY, 'keyboard');
            setShowTutorialKey('keyboard');
          }}
        />
      )}
    </div>
  );
}
