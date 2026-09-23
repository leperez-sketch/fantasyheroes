import * as THREE from 'three';
import { world } from '../game/state.js';

export function spawnDamageText(pos, text, color) {
    const screenPos = pos.clone().project(world.camera);
    const x = (screenPos.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-(screenPos.y * 0.5) + 0.5) * window.innerHeight;

    const el = document.createElement('div');
    el.className = 'damage-number';
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.color = color;
    el.innerText = text;
    document.body.appendChild(el);

    setTimeout(() => el.remove(), 800);
}

export function spawnBloodExplosion(pos) {
    for (let i = 0; i < 12; i++) {
        const geo = new THREE.BoxGeometry(0.15, 0.15, 0.15);
        const mat = new THREE.MeshBasicMaterial({ color: 0x991b1b });
        const p = new THREE.Mesh(geo, mat);
        p.position.copy(pos);
        world.scene.add(p);

        const vel = new THREE.Vector3(
            (Math.random() - 0.5) * 0.3,
            Math.random() * 0.3,
            (Math.random() - 0.5) * 0.3,
        );

        world.particles.push({ mesh: p, vel, life: 30 });
    }
}
