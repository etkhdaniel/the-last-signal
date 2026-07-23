export const SAVE_VERSION = 2;

export function createState() {
  return {
    version: SAVE_VERSION,
    resources: { signal: 0, power: 12, scrap: 4, rations: 3, intel: 0, relayKeys: 0 },
    stats: { signalRate: 1, powerRate: 0, maxPower: 12, health: 30, maxHealth: 30, damage: 3, block: 0, range: 1, restBonus: 0, decodeBonus: 0, intelBonus: 0, rationBonus: 0, scrapMultiplier: 0, medkit: 0, carrierKey: 0 },
    upgrades: [],
    unlocked: ['shelter', 'drainage-ditch'],
    cleared: {},
    discoveredTransmissions: [],
    storySeen: [],
    log: ['The receiver wakes with a low green pulse. Somewhere beyond the storm, a carrier wave repeats.'],
    currentLocation: 'shelter',
    combat: null,
    listens: 0,
    broadcasts: 0,
    scavenges: 0,
    elapsed: 0,
    ending: null,
    gameWon: false,
  };
}

export function normalizeState(raw) {
  const base = createState();
  if (!raw || typeof raw !== 'object') return base;
  const merged = {
    ...base,
    ...raw,
    resources: { ...base.resources, ...(raw.resources || {}) },
    stats: { ...base.stats, ...(raw.stats || {}) },
    cleared: { ...base.cleared, ...(raw.cleared || {}) },
  };
  merged.version = SAVE_VERSION;
  merged.combat = null;
  merged.log = Array.isArray(merged.log) ? merged.log.slice(-80) : base.log;
  return merged;
}
