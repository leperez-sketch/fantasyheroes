import * as THREE from 'three';
import { world } from '../game/state.js';

export function spawnBarricades() {
    const positions = [
        { x: -8, z: -5 }, { x: 8, z: -5 },
        { x: -8, z: 5 }, { x: 8, z: 5 },
        { x: 0, z: -10 }, { x: 0, z: 10 },
    ];

    positions.forEach((pos) => {
        const geo = new THREE.BoxGeometry(2.5, 1.5, 1.5);
        const mat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
        const box = new THREE.Mesh(geo, mat);
        box.position.set(pos.x, 0.75, pos.z);
        box.castShadow = true;
        box.receiveShadow = true;
        world.scene.add(box);

        world.barricades.push({
            mesh: box,
            hp: 100,
            maxHp: 100,
            pos: box.position,
        });
    });
}
