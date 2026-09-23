import { world } from '../game/state.js';
import { HERO_CLASSES } from '../data/heroes.js';
import { Player } from '../entities/Player.js';

function bindClick(id, fn) {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', fn);
}

export function showEndgameModal(victory) {
    const modal = document.getElementById('endgame-modal');
    modal.classList.remove('hidden');
    document.getElementById('endgame-title').innerText = victory ? 'VICTORY!' : 'PARTY WIPED';
    document.getElementById('endgame-desc').innerText = victory
        ? 'You defeated the Darkness!'
        : 'All heroes have perished in the dungeons...';
}

export function setupModalHandlers() {
    bindClick('btn-qr-modal', () => {
        document.getElementById('qr-modal').classList.remove('hidden');
    });
    bindClick('btn-close-qr', () => {
        document.getElementById('qr-modal').classList.add('hidden');
    });
    bindClick('btn-add-ai', () => {
        const classes = Object.keys(HERO_CLASSES);
        const unused = classes.filter((c) => !Object.values(world.players).some((p) => p.classKey === c));
        if (unused.length > 0) {
            const id = 'ai_' + Math.random().toString(36).substr(2, 5);
            world.players[id] = new Player(id, unused[0]);
        }
    });
    bindClick('btn-restart', () => {
        location.reload();
    });
    bindClick('btn-copy-link', () => {
        const text = document.getElementById('room-id-display')?.dataset.link || window.location.href;
        navigator.clipboard?.writeText(text);
        const btn = document.getElementById('btn-copy-link');
        if (btn) btn.innerText = '✅ Copied!';
    });
}
