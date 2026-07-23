# The Last Signal

**The Last Signal** is an original incremental ASCII survival adventure for the browser. You wake in an abandoned communications shelter, rebuild a receiver, explore the storm, fight corrupted machines, recover relay keys, and decide what the network becomes.

## Play

Open the GitHub Pages deployment for this repository, or run any static web server locally:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Current playable chapter

- 12 locations
- 20 upgrades
- 12 enemies and bosses
- Passive resource generation
- Exploration and turn-based combat
- Story transmission archive
- Hidden milestones tied to listening, broadcasting, and scavenging
- Autosave plus manual save export/import
- Two endings
- Responsive desktop and mobile UI
- AdSense-ready responsive bottom banner

## Advertising setup

The bottom advertisement area is committed but does not contact Google or display live ads until valid AdSense identifiers are configured.

1. Add the deployed website to a Google AdSense account and wait for site approval.
2. In AdSense, create a responsive **Display ad** unit.
3. Open `js/ad-config.js`.
4. Replace the placeholder `client` with the publisher ID supplied by AdSense, such as `ca-pub-1234567890123456`.
5. Replace the placeholder `slot` with the numeric ad-unit ID supplied by AdSense.
6. Commit the change to `main` and allow GitHub Pages to redeploy.
7. Add the exact `ads.txt` entry provided by AdSense as `/ads.txt` when requested.

The ad loader is separate from the game engine, so an unavailable or blocked ad will not stop the game from starting. Privacy and advertising information is available at `privacy.html`.

## Structure

```text
index.html
privacy.html
styles/
  main.css
  ads.css
js/
  ad-config.js
  ads.js
  combat.js
  content.js
  game.js
  main.js
  state.js
  storage.js
  ui.js
```

Content is data-driven in `js/content.js`, so new locations, upgrades, enemies, transmissions, and endings can be added without rewriting the engine.

## Hosting note

GitHub Pages works for the current open-source project, but it is not designed to be free hosting for a site whose primary purpose becomes commercial. If advertising revenue becomes a central part of the project, migrate the same static files to a commercial-friendly static host such as Cloudflare Pages, Netlify, or Vercel.

## Roadmap

The long-term target is a larger open-source incremental game with 50+ locations, 150+ upgrades, 100+ ASCII scenes, 30+ enemies, 20+ bosses, prestige systems, crafting, factions, and additional endings.

## License

All code and original game content are available under the MIT License.
