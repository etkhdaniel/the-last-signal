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

## Structure

```text
index.html
styles/main.css
js/
  combat.js
  content.js
  game.js
  main.js
  state.js
  storage.js
  ui.js
```

Content is data-driven in `js/content.js`, so new locations, upgrades, enemies, transmissions, and endings can be added without rewriting the engine.

## Roadmap

The long-term target is a larger open-source incremental game with 50+ locations, 150+ upgrades, 100+ ASCII scenes, 30+ enemies, 20+ bosses, prestige systems, crafting, factions, and additional endings.

## License

All code and original game content are available under the MIT License.
