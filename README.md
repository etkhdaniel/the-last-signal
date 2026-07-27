# The Last Signal

**The Last Signal** is an original incremental ASCII survival adventure for the browser. You wake in an abandoned communications shelter, rebuild a receiver, explore the storm, fight corrupted machines, recover relay keys, and decide what the network becomes.

## Live structure

The deployed website now separates editorial content from the interactive game:

- `/` — content-rich homepage and game overview
- `/play.html` — the ad-free gameplay screen
- `/how-to-play.html` — beginner guide
- `/strategy-guide.html` — progression and resource guide
- `/world-and-lore.html` — original lore reference
- `/development.html` — design and engineering notes
- `/privacy.html` — privacy and advertising information
- `/ads.txt` — authorized advertising seller record

The game remains a static web application and keeps its save in local browser storage. Moving gameplay from `/` to `/play.html` does not change the storage origin, so existing saves continue to work.

## Run locally

Use any static web server:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080` for the homepage or `http://localhost:8080/play.html` for the game.

## Current playable chapter

- 12 locations
- 20 upgrades
- 12 enemies and bosses
- Passive resource generation
- Exploration and turn-based combat
- Story transmission archive
- Hidden milestones tied to listening, broadcasting, and scavenging
- Repeatable late-game archive decoding
- Autosave plus manual save export/import
- Two endings
- Responsive desktop and mobile UI

## Advertising approach

The AdSense publisher script is included on the static, content-oriented pages for verification and future monetization. The interactive gameplay page intentionally omits Google ad code so ads are not placed next to repeated game controls.

The project also includes:

- a root-level `ads.txt`
- a detailed privacy page
- crawlable static HTML content
- `robots.txt`
- `sitemap.xml`

AdSense approval and ad serving remain controlled by Google. The site should not add manual ad units to `play.html` unless a future layout can keep them clearly separated from interactive controls and comply with Google Publisher Policies.

## Structure

```text
index.html
play.html
how-to-play.html
strategy-guide.html
world-and-lore.html
development.html
privacy.html
ads.txt
robots.txt
sitemap.xml
styles/
  main.css
  site.css
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

Game content is data-driven in `js/content.js`, so new locations, upgrades, enemies, transmissions, and endings can be added without rewriting the engine.

## Hosting

The production site is deployed through Cloudflare Workers Static Assets from `main`. The Wrangler configuration uploads the repository as a static website, and Git-connected deployments rebuild after merged changes.

## Roadmap

The long-term target is a larger open-source incremental game with more locations, upgrades, ASCII scenes, enemies, bosses, crafting, factions, prestige systems, and additional endings. Near-term work prioritizes balance, onboarding, accessibility, testing, and content quality.

## License

All code and original game content are available under the MIT License.
