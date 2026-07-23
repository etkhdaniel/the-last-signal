import { ASCII, ENDINGS, LOCATIONS, TRANSMISSIONS, UPGRADES } from './content.js';

const $ = selector => document.querySelector(selector);
const create = (tag, className, text) => { const el = document.createElement(tag); if (className) el.className = className; if (text != null) el.textContent = text; return el; };

export class UI {
  constructor(game, handlers) { this.game = game; this.handlers = handlers; this.activeTab = 'field'; this.bindStatic(); }
  bindStatic() {
    document.querySelectorAll('[data-tab]').forEach(button => button.addEventListener('click', () => { this.activeTab = button.dataset.tab; this.render(this.game.state); }));
    $('#save-export').addEventListener('click', this.handlers.exportSave);
    $('#save-import').addEventListener('click', this.handlers.importSave);
    $('#save-reset').addEventListener('click', this.handlers.resetSave);
  }
  render(state, options = {}) {
    this.renderStats(state);
    if (!options.quiet) { this.renderScene(state); this.renderSidebar(state); this.renderTabs(); }
    else this.renderLiveValues(state);
  }
  renderStats(state) {
    const values = { signal: Math.floor(state.resources.signal), power: `${Math.floor(state.resources.power)}/${state.stats.maxPower}`, scrap: state.resources.scrap, rations: state.resources.rations, intel: state.resources.intel, health: `${Math.max(0, state.stats.health)}/${state.stats.maxHealth}`, damage: state.stats.damage, range: state.stats.range, keys: state.resources.relayKeys };
    for (const [id, value] of Object.entries(values)) $(`#stat-${id}`).textContent = value;
  }
  renderLiveValues(state) { $('#stat-signal').textContent = Math.floor(state.resources.signal); $('#stat-power').textContent = `${Math.floor(state.resources.power)}/${state.stats.maxPower}`; }
  renderTabs() { document.querySelectorAll('[data-tab]').forEach(button => button.classList.toggle('active', button.dataset.tab === this.activeTab)); }
  renderScene(state) {
    const scene = $('#scene'); const actions = $('#scene-actions'); actions.innerHTML = '';
    if (state.combat) return this.renderCombat(state, scene, actions);
    const location = LOCATIONS.find(item => item.id === state.currentLocation) || LOCATIONS[0];
    scene.textContent = `${state.ending ? ASCII.victory : location.ascii}\n\n${state.ending ? ENDINGS[state.ending].text : location.desc}`;
    if (state.ending) return;
    if (location.id === 'shelter') {
      this.action(actions, 'Listen (-1 power)', () => this.game.listen(), 'primary');
      this.action(actions, 'Broadcast (-3 signal, -1 power)', () => this.game.broadcast());
      this.action(actions, 'Scavenge nearby (-2 power)', () => this.game.scavenge());
      this.action(actions, 'Rest (-1 ration)', () => this.game.rest());
    } else {
      const progress = state.cleared[location.id] || 0; const total = location.encounters?.length || 0;
      if (location.id === 'far-horizon' && state.gameWon) {
        this.action(actions, 'Open the channel', () => this.game.chooseEnding('human'), 'primary');
        this.action(actions, 'Join the Carrier', () => this.game.chooseEnding('machine'), 'danger');
      } else if (progress < total) this.action(actions, `Explore (${progress}/${total})`, () => this.game.explore(), 'primary');
      else actions.append(create('p', 'complete', 'AREA CLEARED // residual scavenging available in future updates.'));
      this.action(actions, 'Return to shelter', () => this.game.travel('shelter'));
    }
  }
  renderCombat(state, scene, actions) {
    const c = state.combat;
    scene.textContent = `${c.ascii}\n\n${c.name}\nIntegrity ${Math.max(0, c.currentHealth)}/${c.health}\nTurn ${c.turn}`;
    this.action(actions, 'Strike', () => this.game.attack(), 'primary');
    this.action(actions, 'Guard', () => this.game.guard());
    if (state.stats.medkit > 0) this.action(actions, 'Emergency repair (-4 scrap)', () => this.game.repair());
    this.action(actions, 'Retreat', () => this.game.retreat(), 'danger');
  }
  renderSidebar(state) {
    const content = $('#tab-content'); content.innerHTML = '';
    if (this.activeTab === 'field') this.renderMap(state, content);
    if (this.activeTab === 'workbench') this.renderWorkbench(state, content);
    if (this.activeTab === 'archive') this.renderArchive(state, content);
    if (this.activeTab === 'log') this.renderLog(state, content);
  }
  renderMap(state, content) {
    content.append(create('h2', null, 'Field Map'));
    for (const location of LOCATIONS) {
      const available = this.game.isLocationAvailable(location); if (!available && !state.unlocked.includes(location.id)) continue;
      const card = create('button', `location-card ${state.currentLocation === location.id ? 'selected' : ''}`);
      card.disabled = !available || !!state.combat;
      card.innerHTML = `<strong>${location.name}</strong><span>Range ${location.range} // ${(state.cleared[location.id] || 0)}/${location.encounters?.length || 0} cleared</span><small>${location.desc}</small>`;
      card.addEventListener('click', () => this.game.travel(location.id)); content.append(card);
    }
  }
  renderWorkbench(state, content) {
    content.append(create('h2', null, 'Workbench'));
    for (const upgrade of UPGRADES) {
      const owned = state.upgrades.includes(upgrade.id); const requirementsMet = (upgrade.requires || []).every(id => state.upgrades.includes(id));
      const card = create('button', `upgrade-card ${owned ? 'owned' : ''}`); card.disabled = owned || !requirementsMet;
      card.innerHTML = `<strong>${owned ? 'INSTALLED // ' : ''}${upgrade.name}</strong><span>${upgrade.desc}</span><small>${this.game.formatCost(upgrade.cost)}${!requirementsMet ? ' // prerequisite missing' : ''}</small>`;
      card.addEventListener('click', () => this.game.buyUpgrade(upgrade.id)); content.append(card);
    }
  }
  renderArchive(state, content) {
    content.append(create('h2', null, 'Transmission Archive'));
    if (!state.discoveredTransmissions.length) content.append(create('p', 'muted', 'No coherent transmissions recovered.'));
    for (const id of state.discoveredTransmissions) { const tx = TRANSMISSIONS.find(item => item.id === id); const card = create('article', 'archive-card'); card.innerHTML = `<strong>${id.toUpperCase()}</strong><p>${tx?.text || 'corrupted'}</p>`; content.append(card); }
    content.append(create('p', 'muted', `${state.listens} listens // ${state.broadcasts} broadcasts // ${state.scavenges} scavenges`));
  }
  renderLog(state, content) {
    content.append(create('h2', null, 'Event Log')); const log = create('div', 'log-list');
    [...state.log].reverse().forEach((message, index) => { const item = create('p', index === 0 ? 'latest' : '', message); log.append(item); }); content.append(log);
  }
  action(container, label, fn, className = '') { const button = create('button', className, label); button.addEventListener('click', fn); container.append(button); }
}
