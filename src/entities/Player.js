import * as THREE from 'three';
import { HERO_CLASSES } from '../data/heroes.js';
import { audio, world } from '../game/state.js';
import { spawnBloodExplosion, spawnDamageText } from '../fx/effects.js';

export class Player {
    constructor(id, classKey) {
        this.id = id;
        this.classKey = classKey;
        this.config = HERO_CLASSES[classKey];
        this.maxHp = this.config.hp;
        this.hp = this.config.hp;
        this.speed = this.config.speed;
        this.armor = 0;

        this.cd1 = 0;
        this.cd2 = 0;
        this.dashCd = 0;

        this.pos = new THREE.Vector3((Math.random() - 0.5) * 6, 0, (Math.random() - 0.5) * 6);
        this.targetAngle = 0;

        this.mesh = this.createMesh();
        this.mesh.position.copy(this.pos);
        world.scene.add(this.mesh);
    }

    createMesh() {
        const group = new THREE.Group();

        const bodyGeo = new THREE.CylinderGeometry(0.5, 0.6, 1.4, 8);
        const bodyMat = new THREE.MeshStandardMaterial({ color: this.config.color });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = 0.7;
        body.castShadow = true;
        group.add(body);

        const headGeo = new THREE.SphereGeometry(0.35, 8, 8);
        const headMat = new THREE.MeshStandardMaterial({ color: 0xfde047 });
        const head = new THREE.Mesh(headGeo, headMat);
        head.position.y = 1.6;
        group.add(head);

        const weaponGeo = new THREE.BoxGeometry(0.15, 0.8, 0.15);
        const weaponMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8 });
        const weapon = new THREE.Mesh(weaponGeo, weaponMat);
        weapon.position.set(0.6, 1.0, 0.3);
        group.add(weapon);

        return group;
    }

    update(dt) {
        if (this.hp <= 0) return;

        if (this.cd1 > 0) this.cd1 -= dt;
        if (this.cd2 > 0) this.cd2 -= dt;
        if (this.dashCd > 0) this.dashCd -= dt;

        this.mesh.position.lerp(this.pos, 0.2);
        this.mesh.rotation.y = THREE.MathUtils.lerp(this.mesh.rotation.y, this.targetAngle, 0.2);
    }

    takeDamage(amount) {
        const finalDamage = Math.max(1, amount - this.armor);
        this.hp -= finalDamage;
        spawnDamageText(this.pos, Math.ceil(finalDamage), '#ef4444');
        audio.playHit();

        if (this.hp <= 0) {
            this.hp = 0;
            this.mesh.rotation.z = Math.PI / 2;
            spawnBloodExplosion(this.pos);
        }
    }

    heal(amount) {
        this.hp = Math.min(this.maxHp, this.hp + amount);
        spawnDamageText(this.pos, Math.ceil(amount), '#10b981');
        audio.playHeal();
    }
}
