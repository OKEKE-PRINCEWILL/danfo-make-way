# Danfo, Make Way!

A desktop 3D Lagos traffic puzzle built with Three.js r180 for start.ng. Slide vehicles along their lanes to free the yellow danfo. Ten solvable stops take you from off-peak Ikoyi to Apapa port gridlock.

## Play

Serve this directory with any static HTTP server, using `node server.cjs` or another static server. ES modules require HTTP hosting; opening index.html as a file does not load the 3D view. No dependency installation or build is required. Drag vehicles, or Tab to one and use arrow keys. Z undoes, R restarts, H gives a shortest-route hint. Each uninterrupted slide counts as one move.

Progress stays in localStorage. Each stop earns up to 1,000 points, minus 35 for each move beyond the shortest route, with a 100-point minimum. Your best stop scores add up to a journey score. Online profiles and leaderboards use the start.ng connect bridge and work only on a live *.start.ng domain. Guests can play every level.

## Files

- index.html, style.css, game.js: interface and start.ng integration
- engine.js: legal moves and breadth-first shortest-route solver
- levels.js: ten validated puzzles, with reference solutions
- cover.jpg: game card illustration
- verify.cjs: level validation and rule checks (`node verify.cjs`)

Publishing follows https://start.ng/docs.md: public GitHub repository, POST /games/check, then POST /games/publish and the owner's one-time approval.


The revised route uses 3, 5, 7, 9, 11, 13, 15, 17, 19 and 21 minimum moves. See TRAFFIC-SOURCES.md for the traffic-inspired order and its limits. Revised puzzles use separate local saved progress (danfo-v2).

Levels unlock sequentially: finish every earlier stop to enter the next. Completed stops remain replayable, and unlocks persist on this browser.

Hint economy: two hints for a new player; each hint consumes one credit without reducing points. The first completion of each level awards one credit. Restarts and replays do not refill credits; the balance is saved locally.

The start.ng player face appears in the danfo driver window (local preview uses a generic driver). Successful danfo slides show “Comot for road!” and play the supplied owner voice recording. The voice can be muted. The original M4A recording is served as driver-voice.mp4 because M4A uses the MP4 container and start.ng serves .mp4 assets.

## 3D rendering

Three.js renders actual mesh geometry, an orthographic angled camera with an overhead alternative, directional lighting, shadows, and raycast-driven grid-constrained dragging. The danfo has a 3D driver that leans out during the supplied voice call; the start.ng face is applied as a texture. The original DOM controls remain as keyboard and WebGL-failure fallbacks. Puzzles, saved progress and hints retain their existing keys.

- `scene.mjs`: reusable 3D environment and vehicle models
- `view3d.mjs`: WebGL renderer, animation, camera switching and pointer interaction
- `vendor/`: locally hosted Three.js r180 and its MIT license
- `verify-3d.mjs`: CPU-side scene geometry and raycast checks (`node verify-3d.mjs`)

A browser with WebGL2 is required for the 3D view.
