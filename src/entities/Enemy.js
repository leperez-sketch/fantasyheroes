import * as THREE from 'three';
import { audio, world } from '../game/state.js';
import { spawnBloodExplosion, spawnDamageText } from '../fx/effects.js';

export class Enemy {
    constructor(type, waveNum) {
        this.type = type;
        this.pos = new THREE.Vector3((Math.random() - 0.5) * 50, 0, (Math.random() - 0.5) * 50);
        if (this.pos.length() < 12) this.pos.setLength(15);

        const speedMult = 1 + (waveNum * 0.08);
        const hpMult = 1 + (waveNum * 0.25);

        if (type === 'goblin') {
            this.maxHp = 40 * hpMult;
            this.speed = 0.045 * speedMult;
            this.damage = 8;
            this.color = 0x15803d;
            this.scale = 0.8;
        } else if (type === 'orc') {
            this.maxHp = 80 * hpMult;
            this.speed = 0.035 * speedMult;
            this.damage = 14;
            this.color = 0xb91c1c;
            this.scale = 1.1;
        } else if (type === 'centaur') {
            this.maxHp = 110 * hpMult;
            this.speed = 0.05 * speedMult;
            this.damage = 18;
            this.color = 0xca8a04;
            this.scale = 1.3;
        } else if (type === 'ogre') {
            this.maxHp = 220 * hpMult;
            this.speed = 0.025 * speedMult;
            this.damage = 28;
            this.color = 0x475569;
            this.scale = 1.7;
        } else if (type === 'boss') {
            this.maxHp = 800 * hpMult;
            this.speed = 0.03 * speedMult;
            this.damage = 35;
            this.color = 0x581c87;
            this.scale = 2.4;
        }

        this.hp = this.maxHp;
        this.mesh = this.createMesh();
        this.mesh.position.copy(this.pos);
        world.scene.add(this.mesh);
    }

    createMesh() {
        const group = new THREE.Group();
        const geo = new THREE.BoxGeometry(1 * this.scale, 1.6 * this.scale, 1 * this.scale);
        const mat = new THREE.MeshStandardMaterial({ color: this.color, roughness: 0.7 });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.y = (1.6 * this.scale) / 2;
        mesh.castShadow = true;
        group.add(mesh);
        return group;
    }

    update() {
        if (this.hp <= 0) return;

        let closestHero = null;
        let minDist = Infinity;

        Object.values(world.players).forEach((p) => {
            if (p.hp > 0) {
                const dist = this.pos.distanceTo(p.pos);
                if (dist < minDist) {
                    minDist = dist;
                    closestHero = p;
                }
            }
        });

        if (closestHero) {
            const dir = new THREE.Vector3().subVectors(closestHero.pos, this.pos).normalize();
            this.pos.addScaledVector(dir, this.speed);
            this.mesh.position.copy(this.pos);
            this.mesh.rotation.y = Math.atan2(dir.x, dir.z);

            if (minDist < 1.8 * this.scale) {
                closestHero.takeDamage(this.damage * 0.016);
            }
        }
    }

    takeDamage(amount) {
        this.hp -= amount;
        spawnDamageText(this.pos, Math.ceil(amount), '#f59e0b');
        audio.playHit();

        if (this.hp <= 0) {
            world.scene.remove(this.mesh);
            spawnBloodExplosion(this.pos);
        }
    }
}
