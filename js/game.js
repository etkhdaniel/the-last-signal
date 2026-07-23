import { LOCATIONS, TRANSMISSIONS, UPGRADES, STORY_EVENTS, ENDINGS } from './content.js';
import { beginCombat, playerAttack, playerGuard, playerRepair } from './combat.js';
import { createState } from './state.js';
import { saveGame } from './storage.js';

const locationById = id => LOCATIONS.find(location => location.id === id);
const upgradeById = id => UPGRADES.find(upgrade => upgrade.id === id);
const random = list => list[Math.floor(Math.random() * list.length)];

export class Game {
  constructor(state, onChange) { this.state = state; this.onChange = onChange; this.timer = null; }
  start() { this.timer = setInterval(() => this.tick(), 1000); this.emit(); }
  stop() { clearInterval(this.timer); }
  replaceState(state) { this.state = state; this.emit(); }
  reset() { this.state = createState(); this.emit(); }
  emit() { saveGame(this.state); this.onChange(this.state); }
  addLog(message) { this.state.log.push(message); this.state.log = this.state.log.slice(-80); }
  tick() {
    this.state.elapsed += 1;
    this.state.resources.signal += this.state.stats.signalRate;
    this.state.resources.power = Math.min(this.state.stats.maxPower, this.state.resources.power + this.state.stats.powerRate);
    this.onChange(this.state, { quiet: true });
    if (this.state.elapsed % 10 === 0) saveGame(this.state);
  }
  canAfford(cost = {}) { return Object.entries(cost).every(([key, value]) => (this.state.resources[key] || 0) >= value); }
  pay(cost = {}) { if (!this.canAfford(cost)) return false; for (const [key, value] of Object.entries(cost)) this.state.resources[key] -= value; return true; }
  gain(reward = {}) { for (const [key, value] of Object.entries(reward)) this.state.resources[key] = (this.state.resources[key] || 0) + value; }
  unlock(id) { if (id && !this.state.unlocked.includes(id)) { this.state.unlocked.push(id); this.addLog(`LOCATION UNLOCKED // ${locationById(id)?.name || id}`); } }
  listen() {
    if (this.state.resources.power < 1) return this.addLogAndEmit('The receiver lacks power.');
    this.state.resources.power -= 1; this.state.listens += 1;
    const next = TRANSMISSIONS.find(t => t.minListens <= this.state.listens && !this.state.discoveredTransmissions.includes(t.id));
    if (next) {
      this.state.discoveredTransmissions.push(next.id); this.addLog(`TRANSMISSION // ${next.text}`); this.unlock(next.unlock);
      const reward = { ...(next.reward || {}) };
      if (reward.intel && this.state.stats.intelBonus) reward.intel += this.state.stats.intelBonus;
      this.gain(reward);
    } else {
      const staticLines = ['A voice counts backward from a number too large to finish.', 'Someone breathes on the channel, then matches your breathing.', 'A weather alert names cities erased from every map.', 'Your own call sign appears inside the static.'];
      this.addLog(`STATIC // ${random(staticLines)}`);
      if (this.state.stats.decodeBonus && Math.random() < 0.35) { const bonus = 5 + Math.floor(Math.random() * 11); this.state.resources.signal += bonus; this.addLog(`Decoder extracts ${bonus} signal.`); }
    }
    this.emit();
  }
  broadcast() {
    if (!this.pay({ signal: 3, power: 1 })) return this.addLogAndEmit('Broadcast requires 3 signal and 1 power.');
    this.state.broadcasts += 1;
    if (this.state.broadcasts === 10) { this.unlock('service-tunnels'); this.state.resources.intel += 1; this.addLog('A pulse answers from directly beneath the shelter.'); }
    else if (this.state.broadcasts === 25) { this.state.stats.damage += 2; this.addLog('The reply resolves into a weapon calibration sequence. Damage +2.'); }
    else this.addLog(random(['Your call disappears into static.', 'A distant tone repeats your call sign.', 'The network answers half a second before you transmit.']));
    this.emit();
  }
  scavenge() {
    if (!this.pay({ power: 2 })) return this.addLogAndEmit('Scavenging requires 2 power.');
    this.state.scavenges += 1;
    const scrap = 2 + Math.floor(Math.random() * 5);
    const rations = (Math.random() < 0.35 ? 1 : 0) + this.state.stats.rationBonus;
    this.gain({ scrap, rations });
    this.addLog(`Recovered ${scrap} scrap${rations ? ` and ${rations} ration` : ''}.`);
    if (this.state.scavenges === 12) { this.state.resources.intel += 1; this.addLog('Inside a corroded case: a pre-collapse network diagram. Intel +1.'); }
    this.emit();
  }
  rest() {
    if (!this.pay({ rations: 1 })) return this.addLogAndEmit('Resting requires 1 ration.');
    const amount = 12 + this.state.stats.restBonus;
    this.state.stats.health = Math.min(this.state.stats.maxHealth, this.state.stats.health + amount);
    this.state.resources.power = Math.min(this.state.stats.maxPower, this.state.resources.power + 5);
    this.addLog(`You rest beneath the receiver. Health +${amount}, power +5.`); this.emit();
  }
  travel(id) {
    const location = locationById(id);
    if (!location || !this.isLocationAvailable(location)) return;
    if (id !== 'shelter' && !this.pay({ power: Math.max(1, location.range), rations: 1 })) return this.addLogAndEmit(`Travel requires ${Math.max(1, location.range)} power and 1 ration.`);
    this.state.currentLocation = id;
    this.addLog(`ARRIVAL // ${location.name}`);
    if (STORY_EVENTS[id] && !this.state.storySeen.includes(id)) { this.state.storySeen.push(id); this.addLog(STORY_EVENTS[id]); this.state.resources.intel += 1; }
    this.emit();
  }
  explore() {
    const location = locationById(this.state.currentLocation);
    if (!location?.encounters?.length || this.state.combat) return;
    const step = this.state.cleared[location.id] || 0;
    const encounter = location.encounters[Math.min(step, location.encounters.length - 1)];
    if (location.id === 'sky-array' && encounter === 'carrier' && this.state.stats.carrierKey < 1) return this.addLogAndEmit('ACCESS DENIED // The Carrier Key is required.');
    if (encounter === 'loot') {
      const scrap = 5 + Math.floor(Math.random() * 9); const signal = 10 + Math.floor(Math.random() * 21);
      this.gain({ scrap, signal }); this.addLog(`CACHE // ${scrap} scrap, ${signal} signal.`); this.advanceLocation(location); this.emit();
    } else if (encounter === 'story') {
      this.addLog(STORY_EVENTS[location.id] || 'A damaged terminal contains one useful coordinate.'); this.state.resources.intel += 1; this.advanceLocation(location); this.emit();
    } else if (encounter === 'ending') {
      this.addLog('The horizon waits for your final choice.'); this.emit();
    } else {
      this.state.combat = beginCombat(encounter); this.addLog(`CONTACT // ${this.state.combat.name}`); this.emit();
    }
  }
  attack() { const result = playerAttack(this.state); this.resolveCombat(result); }
  guard() { const result = playerGuard(this.state); this.resolveCombat(result); }
  repair() { const result = playerRepair(this.state); this.resolveCombat(result); }
  retreat() {
    if (!this.state.combat) return; this.state.combat = null; this.state.currentLocation = 'shelter'; this.state.stats.health = Math.max(1, this.state.stats.health - 3); this.addLog('You retreat to Node 7, injured but alive.'); this.emit();
  }
  resolveCombat(result = {}) {
    if (result.won) {
      const enemy = this.state.combat; const reward = { ...enemy.reward };
      if (reward.scrap && this.state.stats.scrapMultiplier) reward.scrap = Math.ceil(reward.scrap * (1 + this.state.stats.scrapMultiplier));
      this.gain(reward); this.addLog(`TARGET DOWN // ${enemy.name}. Recovered ${this.formatCost(reward)}.`);
      if (enemy.final) { this.state.combat = null; this.state.gameWon = true; this.unlock('far-horizon'); this.addLog('The Carrier fractures. The array awaits a command.'); this.emit(); return; }
      const location = locationById(this.state.currentLocation); this.state.combat = null; this.advanceLocation(location); this.emit(); return;
    }
    if (result.lost) {
      const lostSignal = Math.min(35, Math.floor(this.state.resources.signal * 0.15)); this.state.resources.signal -= lostSignal; this.state.stats.health = this.state.stats.maxHealth; this.state.resources.power = Math.max(2, Math.floor(this.state.stats.maxPower / 2)); this.state.combat = null; this.state.currentLocation = 'shelter'; this.addLog(`SIGNAL INTERRUPTED // Emergency reboot complete. Lost ${lostSignal} signal.`);
    }
    this.emit();
  }
  advanceLocation(location) {
    const next = (this.state.cleared[location.id] || 0) + 1; this.state.cleared[location.id] = next;
    for (const candidate of LOCATIONS) if (candidate.unlockAt != null && candidate.unlockAt <= this.countBossKeys() && candidate.range <= this.state.stats.range) this.unlock(candidate.id);
  }
  countBossKeys() { return this.state.resources.relayKeys; }
  buyUpgrade(id) {
    const upgrade = upgradeById(id); if (!upgrade || this.state.upgrades.includes(id)) return;
    if ((upgrade.requires || []).some(req => !this.state.upgrades.includes(req))) return this.addLogAndEmit('Required upgrades are missing.');
    if (!this.pay(upgrade.cost)) return this.addLogAndEmit(`Need ${this.formatCost(upgrade.cost)}.`);
    this.state.upgrades.push(id);
    for (const [key, value] of Object.entries(upgrade.effects)) this.state.stats[key] = (this.state.stats[key] || 0) + value;
    this.state.stats.health = Math.min(this.state.stats.health, this.state.stats.maxHealth);
    this.addLog(`BUILT // ${upgrade.name}: ${upgrade.desc}`);
    for (const location of LOCATIONS) if (location.unlockAt != null && location.range <= this.state.stats.range && location.unlockAt <= this.countBossKeys()) this.unlock(location.id);
    this.emit();
  }
  chooseEnding(type) {
    if (!this.state.gameWon || !ENDINGS[type]) return;
    this.state.ending = type; this.addLog(`${ENDINGS[type].title} // ${ENDINGS[type].text}`); this.emit();
  }
  isLocationAvailable(location) { if (location.id === 'shelter') return true; if (location.requiresEnding && !this.state.gameWon) return false; return this.state.unlocked.includes(location.id) && location.range <= this.state.stats.range; }
  addLogAndEmit(message) { this.addLog(message); this.emit(); }
  formatCost(cost = {}) { return Object.entries(cost).filter(([, v]) => v).map(([k, v]) => `${v} ${k}`).join(', '); }
}
