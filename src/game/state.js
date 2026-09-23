import { SoundEngine } from '../audio/SoundEngine.js';

export const audio = new SoundEngine();

export const world = {
    scene: null,
    camera: null,
    renderer: null,
    peer: null,
    socket: null,
    myPlayerId: 'local_host',
    wave: 1,
    isWaveActive: true,
    players: {},
    enemies: [],
    projectiles: [],
    particles: [],
    bloodDecals: [],
    barricades: [],
    activePerks: [],
};
