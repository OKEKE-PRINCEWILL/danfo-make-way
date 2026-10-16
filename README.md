# Danfo, Make Way!

A desktop Lagos traffic puzzle built for start.ng. Slide vehicles along their lanes to free the yellow danfo. Ten solvable stops take you from Ojuelegba to Victoria Island.

## Play

Serve this directory with any static HTTP server, or open index.html. No install or build is required. Drag vehicles, or Tab to one and use arrow keys. Z undoes, R restarts, H gives a shortest-route hint. Each uninterrupted slide counts as one move.

Progress stays in localStorage. Each stop earns up to 1,000 points, minus 35 for each move beyond the shortest route and 100 per hint, with a 100-point minimum. Your best stop scores add up to a journey score. Online profiles and leaderboards use the start.ng connect bridge and work only on a live *.start.ng domain. Guests can play every level.

## Files

- index.html, style.css, game.js: interface and start.ng integration
- engine.js: legal moves and breadth-first shortest-route solver
- levels.js: ten validated puzzles, with reference solutions
- cover.jpg: game card illustration
- verify.cjs: level validation and rule checks (`node verify.cjs`)

Publishing follows https://start.ng/docs.md: public GitHub repository, POST /games/check, then POST /games/publish and the owner's one-time approval.

