import { Game } from './game.js?v=3';
import { UI } from './ui.js?v=3';
import { eraseGame, exportGame, importGame, loadGame } from './storage.js?v=3';

let game;
let ui;

const handlers = {
  exportSave: async () => {
    const encoded = exportGame(game.state);
    await navigator.clipboard.writeText(encoded);
    game.addLogAndEmit('SAVE EXPORTED // copied to clipboard.');
  },
  importSave: () => {
    const encoded = prompt('Paste exported save data:');
    if (!encoded) return;
    try { game.replaceState(importGame(encoded)); game.addLogAndEmit('SAVE IMPORTED // synchronization complete.'); }
    catch { alert('That save data could not be read.'); }
  },
  resetSave: () => {
    if (!confirm('Erase all progress and restart Node 7?')) return;
    eraseGame(); game.reset();
  },
};

game = new Game(loadGame(), (state, options) => ui?.render(state, options));
ui = new UI(game, handlers);
game.start();
