# Architecture

This is a one-page primer on how the code fits together. Read this before making larger changes.

## Three Layers

```text
HUD (React)          src/hud/
  reads game state
  draws overlays

Engine (plain JS)    src/engine/
  owns the game object
  ticks it every frame

Render (canvas)      src/render/
  pure context drawing functions
  no React state
```

The engine is the source of truth. The game state is a single mutable object created by `createGame()` in `engine/state.js`. Every frame, `tick(g, dt)` mutates it.

The render layer is a tree of drawing functions. `drawWorld(ctx, g, camera)` paints the scene from `g` and the camera offset. Render functions should not read or write React state.

The HUD layer is React components that read `g` and render overlays. They should not mutate the game.

## Frame Loop

The frame loop lives in `src/engine/useGame.js`. Each `requestAnimationFrame`:

1. Computes `dt`, clamped to 50 ms to survive tab-switch stalls.
2. Calls `tick(g, dt)` to update the game state.
3. Moves the camera toward the car with smoothing.
4. Calls `drawWorld(ctx, g, camera)` to paint the canvas.
5. Calls `force()` every 6 frames so the HUD updates at roughly 10 fps.

## Game State Shape

See `createGame()` in `engine/state.js`. The important slices are:

- `car`: `{ x, y, angle, speed }`
- `keys`: input state set by `keydown` and `keyup` listeners
- `npc`, `ped`: positions and state machines
- `flags`: one-shot booleans so events fire once
- `score`, `demerits`
- `coach`: `{ id, text, tone, shown }`
- `objectives`: array of `{ id, label, done, fail }`
- `events`: ring buffer of recent score events

## Adding A New Objective

1. Add an entry to `objectives` in `engine/state.js`.
2. In `engine/coach-events.js`, detect the condition and set `.done` or `.fail`.
3. Optionally add a line in `engine/coach-lines.js` and call `setCoach(g, id)`.

The HUD's `ObjectivesPanel` picks it up automatically.

## Adding A New HUD Panel

1. Create `src/hud/MyPanel.jsx`.
2. Pass in what it needs as props.
3. Import and place it in `src/hud/MissionVariant.jsx`.

If the panel needs a derived value, put the derivation in a custom hook. `useTrail.js` and `useRadioLog.js` are existing examples.

## Adding A New Level

Right now the level is hard-coded in `engine/constants.js`, `engine/scenery.js`, and `engine/signs-data.js`. To make levels swappable:

1. Move those constants into a `levels/level-01.js` module.
2. Have `createGame()` take a `level` argument.
3. Have render functions read level data from `game.level` instead of importing constants directly.

This is not implemented yet.
