import { ENEMIES } from './content.js';

const roll = ([min, max]) => min + Math.floor(Math.random() * (max - min + 1));

export function beginCombat(enemyId) {
  const source = ENEMIES[enemyId];
  if (!source) throw new Error(`Unknown enemy: ${enemyId}`);
  return { id: enemyId, ...source, currentHealth: source.health, turn: 1, playerGuarding: false };
}

export function playerAttack(state) {
  const combat = state.combat;
  if (!combat) return;
  const variance = Math.floor(Math.random() * 4);
  const critical = Math.random() < 0.12;
  const damage = (state.stats.damage + variance) * (critical ? 2 : 1);
  combat.currentHealth -= damage;
  state.log.push(`${critical ? 'CRITICAL // ' : ''}You strike ${combat.name} for ${damage}.`);
  if (combat.currentHealth <= 0) return { won: true };
  return enemyTurn(state);
}

export function playerGuard(state) {
  if (!state.combat) return;
  state.combat.playerGuarding = true;
  state.log.push('You brace behind the field shield.');
  return enemyTurn(state);
}

export function playerRepair(state) {
  if (!state.combat || state.stats.medkit < 1 || state.resources.scrap < 4) return;
  state.resources.scrap -= 4;
  const amount = Math.min(18, state.stats.maxHealth - state.stats.health);
  state.stats.health += amount;
  state.log.push(`Emergency repair restores ${amount} health.`);
  return enemyTurn(state);
}

export function enemyTurn(state) {
  const combat = state.combat;
  if (!combat) return;
  let incoming = roll(combat.damage);
  if (combat.playerGuarding) incoming = Math.floor(incoming * 0.45);
  if (Math.random() < state.stats.block) incoming = 0;
  state.stats.health -= incoming;
  state.log.push(incoming ? `${combat.name} hits for ${incoming}.` : `${combat.name}'s attack is absorbed.`);
  combat.playerGuarding = false;
  combat.turn += 1;
  if (state.stats.health <= 0) return { lost: true };
  return {};
}
