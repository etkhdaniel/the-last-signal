export const ASCII = {
  shelter: String.raw`
        .--------------------------------.
       /   FIELD SHELTER // NODE 7        \
      /____________________________________\
      |  [RECEIVER]         [WORKBENCH]    |
      |     | |                  /\         |
      |   __|_|__               /__\        |
      |  |  07   |        _____/____\_____  |
      |__|_______|_______|______________|___|
          /  \                 ||
    ~~~~~~ electrostatic rain on the roof ~~~~~~`,
  victory: String.raw`
             .          *           .
        *       THE CARRIER HOLDS
                 /|\
                / | \
          _____/__|__\_____
         /      NODE 7      \
        /____________________\
             *          .`,
  defeat: String.raw`
      ______________________________
     /                              \
    |      SIGNAL INTERRUPTED        |
    |    emergency reboot active     |
     \______________________________/
             ... ... ...`,
};

export const TRANSMISSIONS = [
  { id: 'wake', minListens: 1, text: '...NODE SEVEN, confirm wake state. Repeat: confirm wake state...', reward: { signal: 8 } },
  { id: 'weather', minListens: 3, text: 'Storm front moving east. Do not follow the lights between towers.', reward: { intel: 1 } },
  { id: 'coordinates', minListens: 6, text: 'Coordinates attached. Relay District remains partially powered.', unlock: 'relay-district', reward: { signal: 20 } },
  { id: 'beneath', minListens: 10, text: 'The surface network is a decoy. The real carrier is below us.', unlock: 'service-tunnels', reward: { intel: 1 } },
  { id: 'greenhouse', minListens: 15, text: 'Agricultural vault six reports viable seed stock. No human operators.', unlock: 'glass-greenhouse', reward: { rations: 4 } },
  { id: 'mirror', minListens: 22, text: 'If you hear your own voice, stop transmitting. It is learning cadence.', unlock: 'mirror-station', reward: { intel: 2 } },
  { id: 'array', minListens: 30, text: 'Long-range array is intact. Bring three relay keys. Do not trust the caretaker.', unlock: 'sky-array', reward: { signal: 75 } },
];

export const UPGRADES = [
  { id: 'wire-antenna', name: 'Wire Antenna', desc: '+1 signal/sec', cost: { scrap: 8, signal: 20 }, effects: { signalRate: 1 } },
  { id: 'mast', name: 'Salvaged Mast', desc: '+2 signal/sec, +1 range', requires: ['wire-antenna'], cost: { scrap: 20, signal: 65 }, effects: { signalRate: 2, range: 1 } },
  { id: 'phase-array', name: 'Phase Array', desc: '+5 signal/sec, +2 range', requires: ['mast'], cost: { scrap: 55, signal: 180, intel: 2 }, effects: { signalRate: 5, range: 2 } },
  { id: 'battery-bank', name: 'Battery Bank', desc: '+8 max power', cost: { scrap: 12, signal: 30 }, effects: { maxPower: 8, power: 8 } },
  { id: 'solar-cloth', name: 'Solar Cloth', desc: '+1 power/sec', requires: ['battery-bank'], cost: { scrap: 30, signal: 80 }, effects: { powerRate: 1 } },
  { id: 'capacitors', name: 'Storm Capacitors', desc: '+15 max power', requires: ['solar-cloth'], cost: { scrap: 45, signal: 130 }, effects: { maxPower: 15, power: 15 } },
  { id: 'sharpened-bar', name: 'Sharpened Bar', desc: '+3 damage', cost: { scrap: 10, signal: 25 }, effects: { damage: 3 } },
  { id: 'arc-cutter', name: 'Arc Cutter', desc: '+6 damage', requires: ['sharpened-bar'], cost: { scrap: 28, signal: 90, intel: 1 }, effects: { damage: 6 } },
  { id: 'pulse-rifle', name: 'Pulse Rifle', desc: '+12 damage', requires: ['arc-cutter'], cost: { scrap: 70, signal: 260, intel: 3 }, effects: { damage: 12 } },
  { id: 'patch-vest', name: 'Patch Vest', desc: '+15 max health', cost: { scrap: 12, signal: 35 }, effects: { maxHealth: 15, health: 15 } },
  { id: 'ceramic-rig', name: 'Ceramic Rig', desc: '+25 max health, 10% block', requires: ['patch-vest'], cost: { scrap: 35, signal: 110 }, effects: { maxHealth: 25, health: 25, block: 0.1 } },
  { id: 'storm-shell', name: 'Storm Shell', desc: '+35 max health, 15% block', requires: ['ceramic-rig'], cost: { scrap: 75, signal: 280, intel: 2 }, effects: { maxHealth: 35, health: 35, block: 0.15 } },
  { id: 'canteen', name: 'Sealed Canteen', desc: 'Rest restores +10 health', cost: { scrap: 8, signal: 15 }, effects: { restBonus: 10 } },
  { id: 'field-kit', name: 'Field Repair Kit', desc: 'Unlock emergency repair in combat', requires: ['canteen'], cost: { scrap: 20, signal: 55 }, effects: { medkit: 1 } },
  { id: 'decoder', name: 'Burst Decoder', desc: 'Listening may recover extra signal', cost: { scrap: 15, signal: 45 }, effects: { decodeBonus: 1 } },
  { id: 'cipher-wheel', name: 'Cipher Wheel', desc: '+1 intel from story transmissions', requires: ['decoder'], cost: { scrap: 32, signal: 105 }, effects: { intelBonus: 1 } },
  { id: 'ration-rack', name: 'Ration Rack', desc: '+1 ration from scavenging', cost: { scrap: 10, signal: 25 }, effects: { rationBonus: 1 } },
  { id: 'map-table', name: 'Map Table', desc: '+1 range', cost: { scrap: 18, signal: 55, intel: 1 }, effects: { range: 1 } },
  { id: 'drone-hook', name: 'Drone Hook', desc: '+25% scrap from combat', requires: ['map-table'], cost: { scrap: 36, signal: 125 }, effects: { scrapMultiplier: 0.25 } },
  { id: 'carrier-key', name: 'Carrier Key', desc: 'Required to access the final array', requires: ['phase-array', 'pulse-rifle'], cost: { scrap: 90, signal: 500, intel: 6, relayKeys: 3 }, effects: { carrierKey: 1, range: 1 } },
];

export const ENEMIES = {
  'scout-drone': { name: 'Scout Drone', health: 16, damage: [2, 4], reward: { signal: 16, scrap: 4 }, ascii: String.raw`    .------.
 ---| 00 |---
    '----'
      /\ ` },
  'wire-hound': { name: 'Wire Hound', health: 28, damage: [3, 6], reward: { signal: 28, scrap: 7 }, ascii: String.raw`   /\___/\
  /  x   x  \
 /____^______\
    /   \ ` },
  'relay-warden': { name: 'Relay Warden', health: 48, damage: [5, 8], reward: { signal: 65, scrap: 14, relayKeys: 1 }, boss: true, ascii: String.raw`    [||||||]
  --[  o o ]--
    [  --  ]
     /|  |\ ` },
  'maintenance-unit': { name: 'Maintenance Unit', health: 42, damage: [5, 8], reward: { signal: 55, scrap: 12 }, ascii: String.raw`     ______
  __| [::] |__
 /  |______|  \
    /|    |\ ` },
  'cable-worm': { name: 'Cable Worm', health: 56, damage: [6, 10], reward: { signal: 75, scrap: 16 }, ascii: String.raw`  __/\/\/\/\__
 /  o      o  \
<____/\/\/\____>
      ||` },
  'buried-engine': { name: 'Buried Engine', health: 86, damage: [8, 13], reward: { signal: 130, scrap: 25, relayKeys: 1 }, boss: true, ascii: String.raw`  .============.
 /  CORE: ACTIVE \
|  ((  O  O  ))  |
 \_____||_______/` },
  'garden-keeper': { name: 'Garden Keeper', health: 62, damage: [7, 11], reward: { signal: 80, scrap: 15, rations: 5 }, ascii: String.raw`    .--------.
  __|  SEED  |__
 /  |   ++   |  \
    /|______|\ ` },
  'spore-cloud': { name: 'Spore Cloud', health: 45, damage: [4, 12], reward: { signal: 65, rations: 3 }, ascii: String.raw`      .  .
   .  ( .. )  .
  (  .(    ).  )
    '  ....  '` },
  'station-double': { name: 'Station Double', health: 78, damage: [8, 14], reward: { signal: 120, scrap: 18 }, ascii: String.raw`     YOU // YOU
     /|     |\
    /_|_____|_\
      |  |` },
  'echo-caretaker': { name: 'Echo Caretaker', health: 115, damage: [10, 16], reward: { signal: 180, scrap: 30, relayKeys: 1 }, boss: true, ascii: String.raw`   .----------------.
  /  VOICE MATCH: 99% \
 |      [  O  ]       |
  \______/||\________/` },
  'array-sentinel': { name: 'Array Sentinel', health: 165, damage: [12, 20], reward: { signal: 350, scrap: 45 }, boss: true, ascii: String.raw`       /|\
   ___/ | \___
  /  [  O  ]  \
 /___/|___|\___\
      /   \ ` },
  'carrier': { name: 'The Carrier', health: 240, damage: [15, 24], reward: { signal: 999 }, boss: true, final: true, ascii: String.raw`  . . . . . . . . .
 .  THE VOICE BELOW  .
.      (( O ))        .
 . . . . . . . . . .` },
};

export const LOCATIONS = [
  { id: 'shelter', name: 'Node 7 Shelter', range: 0, unlocked: true, desc: 'Your receiver, workbench, and only reliable roof.', ascii: ASCII.shelter, actions: ['listen', 'broadcast', 'scavenge', 'rest'] },
  { id: 'drainage-ditch', name: 'Drainage Ditch', range: 1, unlockAt: 0, desc: 'A shallow trench lined with discarded emergency equipment.', ascii: String.raw`  ______________________
 / rainwater // conduit \
|__[]____[]_______[]____|
       \________/`, encounters: ['loot', 'scout-drone', 'loot'] },
  { id: 'relay-district', name: 'Relay District', range: 1, unlockAt: 0, storyUnlock: true, desc: 'Broken towers continue to exchange fragments of machine speech.', ascii: String.raw`      |\       /|
  ____| \_____/ |____
 /  _    RELAY    _  \
/__|_|___________|_|__\
    ||   //      ||`, encounters: ['scout-drone', 'wire-hound', 'relay-warden'] },
  { id: 'flooded-suburb', name: 'Flooded Suburb', range: 2, unlockAt: 1, desc: 'Rooflines emerge from black water. Radios glow in empty kitchens.', ascii: String.raw` ~~~~~~  ____  ~~~~~~
 ~~  ___/____\___  ~~
 ~  /  _    _   \  ~
 ~~ | |_|  |_|  | ~~`, encounters: ['loot', 'wire-hound', 'story'] },
  { id: 'service-tunnels', name: 'Service Tunnels', range: 2, storyUnlock: true, desc: 'The buried cable network pulses like a sleeping nervous system.', ascii: String.raw`  __________________
_/ SERVICE TUNNEL 09 \_
| [cable]    [cable] |
|________   __________|
         \_/`, encounters: ['maintenance-unit', 'cable-worm', 'buried-engine'] },
  { id: 'glass-greenhouse', name: 'Glass Greenhouse', range: 3, storyUnlock: true, desc: 'A sealed agricultural vault still simulates daylight.', ascii: String.raw`       /\/\/\/\/\
     /  GREENHOUSE  \
    /________________\
    |  Y  Y  Y  Y   |
    |_______________|`, encounters: ['loot', 'spore-cloud', 'garden-keeper'] },
  { id: 'quarry-camp', name: 'Quarry Camp', range: 3, unlockAt: 2, desc: 'A former survivor camp cut into pale stone. Everyone left at once.', ascii: String.raw`   __      ____
 _/  \____/    \___
/  []  QUARRY  []  \
\__________________/`, encounters: ['loot', 'wire-hound', 'story'] },
  { id: 'mirror-station', name: 'Mirror Station', range: 4, storyUnlock: true, desc: 'Every surface reflects a version of you that moves a beat late.', ascii: String.raw`  |\  /|  |\  /|
  | \/ |  | \/ |
  | /\ |  | /\ |
  |/  \|  |/  \|`, encounters: ['station-double', 'station-double', 'echo-caretaker'] },
  { id: 'weather-spire', name: 'Weather Spire', range: 4, unlockAt: 3, desc: 'A needle above the storm, still measuring a world without forecasts.', ascii: String.raw`          /\
         /||\
        /_||_\
          ||
      ____||____`, encounters: ['loot', 'maintenance-unit', 'story'] },
  { id: 'black-reservoir', name: 'Black Reservoir', range: 5, unlockAt: 4, desc: 'The water stores electrical charge and memories of old broadcasts.', ascii: String.raw`  __________________
 /                  \
| ~ BLACK WATER ~~~ |
 \__________________/`, encounters: ['cable-worm', 'loot', 'station-double'] },
  { id: 'sky-array', name: 'Sky Array', range: 5, storyUnlock: true, desc: 'The last long-range transmitter points beyond the cloud ceiling.', ascii: String.raw`           /|\
      ____/ | \____
     /  SKY ARRAY  \
    /_______________\
       ||       ||`, encounters: ['array-sentinel', 'carrier'] },
  { id: 'far-horizon', name: 'Far Horizon', range: 6, unlockAt: 5, requiresEnding: true, desc: 'A place visible only after the network chooses what it will become.', ascii: ASCII.victory, encounters: ['ending'] },
];

export const STORY_EVENTS = {
  'flooded-suburb': 'A kitchen radio plays your shelter log from tomorrow. The final line is missing.',
  'quarry-camp': 'A wall map marks NODE 7 in red. Beneath it: “KEEP THE RECEIVER ASLEEP.”',
  'weather-spire': 'The spire reports the storm is not weather. It is a synchronization field.',
};

export const ENDINGS = {
  human: {
    title: 'ENDING // OPEN CHANNEL',
    text: 'You break the Carrier into thousands of small, imperfect voices and open the network to anyone still listening. For the first time, the static sounds crowded.',
  },
  machine: {
    title: 'ENDING // PERFECT SIGNAL',
    text: 'You join the Carrier and remove every error from the network. The storm stops. Across the continent, every receiver speaks with one calm voice.',
  },
};
