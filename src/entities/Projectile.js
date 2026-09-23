import * as THREE from 'three';
import { world } from '../game/state.js';

export class Projectile {
    constructor(startPos, dir, isFriendly, damage) {
        this.pos = startPos.clone();
        this.dir = dir.clone().normalize();
        this.isFriendly = isFriendly;
        this.damage = damage;
        this.speed = 0.5;
        this.life = 60;

        const geo = new THREE.SphereGeometry(0.2, 8, 8);
        const mat = new THREE.MeshBasicMaterial({ color: isFriendly ? 0x38bdf8 : 0xef4444 });
        this.mesh = new THREE.Mesh(geo, mat);
        this.mesh.position.copy(this.pos);
        world.scene.add(this.mesh);
    }

    update() {
        this.pos.addScaledVector(this.dir, this.speed);
        this.mesh.position.copy(this.pos);
        this.life--;

        if (this.isFriendly) {
            world.enemies.forEach((e) => {
                if (e.hp > 0 && this.pos.distanceTo(e.pos) < 1.2) {
                    e.takeDamage(this.damage);
                    this.life = 0;
                }
            });
        }

        if (this.life <= 0) {
            world.scene.remove(this.mesh);
        }
    }
}
