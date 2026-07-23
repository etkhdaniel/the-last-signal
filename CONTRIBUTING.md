# Contributing

The Last Signal is intentionally data-driven so new content can be added without changing the core engine.

## Adding content

Most game content lives in `js/content.js`:

- `TRANSMISSIONS` for story broadcasts
- `UPGRADES` for workbench progression
- `ENEMIES` for combat encounters
- `LOCATIONS` for exploration
- `STORY_EVENTS` and `ENDINGS` for narrative branches

Keep identifiers unique, test the full unlock path, and make sure ASCII art remains readable on narrow screens.

## Local testing

```bash
python3 -m http.server 8080
```

Run JavaScript syntax checks with:

```bash
node --check js/*.js
```
