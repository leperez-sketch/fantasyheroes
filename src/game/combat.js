import * as THREE from 'three';
import { audio, world } from './state.js';
import { Projectile } from '../entities/Projectile.js';

export function handlePlayerInput(p, data) {
    if (p.hp <= 0) return;

    if (data.move) {
        p.pos.x += data.move.x * p.speed;
        p.pos.z += data.move.z * p.speed;
        p.targetAngle = Math.atan2(data.move.x, data.move.z);
    }

    const cdMult = world.activePerks.includes('frenzy') ? 0.8 : 1.0;

    if (data.action === 'ATTACK') {
        performAttack(p);
    } else if (data.action === 'DODGE' && p.dashCd <= 0) {
        p.dashCd = 2.0 * cdMult;
        const dashDir = new THREE.Vector3(Math.sin(p.targetAngle), 0, Math.cos(p.targetAngle));
        p.pos.addScaledVector(dashDir, 4.0);
    } else if (data.action === 'SKILL1' && p.cd1 <= 0) {
        p.cd1 = p.config.s1Cd * cdMult;
        useSkill1(p);
    } else if (data.action === 'SKILL2' && p.cd2 <= 0) {
        p.cd2 = p.config.s2Cd * cdMult;
        useSkill2(p);
    }
}

function performAttack(p) {
    audio.playSlash();
    const forward = new THREE.Vector3(Math.sin(p.targetAngle), 0, Math.cos(p.targetAngle));

    let dmg = p.config.damage;
    if (world.activePerks.includes('lethal')) dmg *= 1.3;

    if (p.config.range > 4) {
        world.projectiles.push(new Projectile(
            p.pos.clone().add(new THREE.Vector3(0, 1.2, 0)),
            forward,
            true,
            dmg,
        ));
    } else {
        world.enemies.forEach((e) => {
            if (p.pos.distanceTo(e.pos) < p.config.range) {
                e.takeDamage(dmg);
                if (world.activePerks.includes('vampirism')) p.heal(dmg * 0.05);
            }
        });
    }
}

function useSkill1(p) {
    audio.playSpell();
    if (p.classKey === 'priest') {
        let lowest = p;
        Object.values(world.players).forEach((hero) => {
            if (hero.hp > 0 && hero.hp / hero.maxHp < lowest.hp / lowest.maxHp) lowest = hero;
        });
        lowest.heal(lowest.maxHp * 0.35);
    } else {
        world.enemies.forEach((e) => {
            if (p.pos.distanceTo(e.pos) < 6) {
                e.takeDamage(p.config.damage * 1.8);
            }
        });
    }
}

function useSkill2(p) {
    audio.playSpell();
    world.enemies.forEach((e) => {
        if (p.pos.distanceTo(e.pos) < 8) {
            e.takeDamage(p.config.damage * 2.5);
        }
    });
}
