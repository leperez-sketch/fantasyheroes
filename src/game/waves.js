import { world } from './state.js';
import { Enemy } from '../entities/Enemy.js';
import { ROGUE_PERKS } from '../data/perks.js';
import { showEndgameModal } from '../ui/modals.js';

export function startWave(w) {
    world.wave = w;
    world.isWaveActive = true;
    document.getElementById('wave-num').innerText = `WAVE ${world.wave}`;

    const tutBanner = document.getElementById('tutorial-banner');
    if (world.wave === 1) {
        tutBanner.classList.remove('hidden');
        document.getElementById('tutorial-title').innerText = 'TUTORIAL WAVE 1: MOVEMENT & ATTACK';
        document.getElementById('tutorial-text').innerText = 'Use WASD or Mobile Joystick to move. Click Attack to defeat the Goblins!';
    } else if (world.wave === 2) {
        tutBanner.classList.remove('hidden');
        document.getElementById('tutorial-title').innerText = 'TUTORIAL WAVE 2: SKILLS & BARRICADES';
        document.getElementById('tutorial-text').innerText = 'Use Skills 1 & 2 to unleash power attacks. Take cover behind wooden crates!';
    } else {
        tutBanner.classList.add('hidden');
    }

    const isBossWave = world.wave % 5 === 0;
    document.getElementById('boss-hud').classList.toggle('hidden', !isBossWave);

    world.enemies = [];
    if (isBossWave) {
        world.enemies.push(new Enemy('boss', world.wave));
        for (let i = 0; i < 4; i++) world.enemies.push(new Enemy('orc', world.wave));
    } else if (world.wave === 1) {
        for (let i = 0; i < 3; i++) world.enemies.push(new Enemy('goblin', world.wave));
    } else if (world.wave === 2) {
        for (let i = 0; i < 3; i++) world.enemies.push(new Enemy('goblin', world.wave));
        for (let i = 0; i < 2; i++) world.enemies.push(new Enemy('orc', world.wave));
    } else {
        const count = 4 + world.wave * 2;
        for (let i = 0; i < count; i++) {
            const types = ['goblin', 'orc', 'centaur', 'ogre'];
            const t = types[Math.floor(Math.random() * types.length)];
            world.enemies.push(new Enemy(t, world.wave));
        }
    }
}

export function checkWaveProgress() {
    if (!world.isWaveActive) return;

    document.getElementById('enemy-count').innerText = world.enemies.length;
    document.getElementById('hero-count').innerText = Object.keys(world.players).length;

    const totalPlayers = Object.keys(world.players).length;
    const alivePlayers = Object.values(world.players).filter((p) => p.hp > 0).length;

    if (totalPlayers > 0 && alivePlayers === 0) {
        world.isWaveActive = false;
        showEndgameModal(false);
        return;
    }

    const activeBoss = world.enemies.find((e) => e.type === 'boss');
    if (activeBoss) {
        const pct = Math.max(0, (activeBoss.hp / activeBoss.maxHp) * 100);
        document.getElementById('boss-hp-bar').style.width = `${pct}%`;
        document.getElementById('boss-hp-text').innerText = `${Math.ceil(pct)}%`;
    }

    if (world.enemies.length === 0) {
        world.isWaveActive = false;
        showPerkSelection();
    }
}

export function showPerkSelection() {
    const container = document.getElementById('perks-container');
    const perkModal = document.getElementById('perk-modal');

    if (!container || !perkModal) {
        setTimeout(() => startWave(world.wave + 1), 1000);
        return;
    }

    container.innerHTML = '';

    const shuffled = [...ROGUE_PERKS].sort(() => 0.5 - Math.random()).slice(0, 3);
    shuffled.forEach((perk) => {
        const card = document.createElement('div');
        card.className = 'glass-panel p-4 rounded-xl flex flex-col items-center justify-between hover:border-amber-400 cursor-pointer transition transform hover:-translate-y-1 border border-slate-700';
        card.innerHTML = `
            <div class="text-3xl mb-2">${perk.icon}</div>
            <div class="font-cinzel font-bold text-amber-300 text-sm mb-1">${perk.name}</div>
            <div class="text-xs text-slate-300 mb-4">${perk.desc}</div>
            <button class="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition">Select Blessing</button>
        `;
        card.onclick = () => selectPerk(perk.id);
        container.appendChild(card);
    });

    perkModal.classList.remove('hidden');
}

function selectPerk(perkId) {
    world.activePerks.push(perkId);

    if (perkId === 'titan') {
        Object.values(world.players).forEach((p) => {
            p.maxHp += 40;
            p.hp += 40;
            p.armor += 8;
        });
    } else if (perkId === 'swiftness') {
        Object.values(world.players).forEach((p) => {
            p.speed *= 1.25;
        });
    }

    const perkModal = document.getElementById('perk-modal');
    if (perkModal) perkModal.classList.add('hidden');
    startWave(world.wave + 1);
}
