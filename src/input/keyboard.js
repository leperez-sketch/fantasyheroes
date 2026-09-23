import { world } from '../game/state.js';
import { handlePlayerInput } from '../game/combat.js';

const keys = {};

export function bindHostKeyboard() {
    window.addEventListener('keydown', (e) => {
        keys[e.key.toLowerCase()] = true;
    });
    window.addEventListener('keyup', (e) => {
        keys[e.key.toLowerCase()] = false;
    });
    setInterval(processHostKeyboard, 1000 / 60);
}

function processHostKeyboard() {
    const host = world.players.local_host;
    if (!host) return;

    const move = { x: 0, z: 0 };
    if (keys.w || keys.arrowup) move.z -= 1;
    if (keys.s || keys.arrowdown) move.z += 1;
    if (keys.a || keys.arrowleft) move.x -= 1;
    if (keys.d || keys.arrowright) move.x += 1;

    if (move.x !== 0 || move.z !== 0) {
        handlePlayerInput(host, { move });
    }

    if (keys[' ']) handlePlayerInput(host, { action: 'ATTACK' });
    if (keys['1']) handlePlayerInput(host, { action: 'SKILL1' });
    if (keys['2']) handlePlayerInput(host, { action: 'SKILL2' });
    if (keys.shift) handlePlayerInput(host, { action: 'DODGE' });
}
