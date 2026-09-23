import { audio, world } from './game/state.js';
import { initEngine, updateCamera } from './engine/setup.js';
import { Player } from './entities/Player.js';
import { startWave, checkWaveProgress } from './game/waves.js';
import { setupModalHandlers } from './ui/modals.js';
import { initPeerJS } from './net/peerHost.js';
import { bindHostKeyboard } from './input/keyboard.js';

document.addEventListener('click', () => audio.init(), { once: true });
document.addEventListener('touchstart', () => audio.init(), { once: true });

function gameLoop() {
    requestAnimationFrame(gameLoop);

    const now = performance.now();
    const dt = (now - (gameLoop.lastTime || now)) / 1000;
    gameLoop.lastTime = now;

    Object.values(world.players).forEach((p) => p.update(dt));

    world.enemies.forEach((e, idx) => {
        e.update();
        if (e.hp <= 0) world.enemies.splice(idx, 1);
    });

    world.projectiles.forEach((p) => p.update());

    world.particles.forEach((p, idx) => {
        p.mesh.position.add(p.vel);
        p.life--;
        if (p.life <= 0) {
            world.scene.remove(p.mesh);
            world.particles.splice(idx, 1);
        }
    });

    updateCamera();
    checkWaveProgress();
    world.renderer.render(world.scene, world.camera);
}

window.onload = function boot() {
    initEngine();
    setupModalHandlers();
    bindHostKeyboard();

    world.players.local_host = new Player('local_host', 'dwarf');
    startWave(1);
    initPeerJS();
    gameLoop();
};
