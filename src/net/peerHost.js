import Peer from 'peerjs';
import QRCode from 'qrcode';
import { world } from '../game/state.js';
import { HERO_CLASSES } from '../data/heroes.js';
import { Player } from '../entities/Player.js';
import { handlePlayerInput } from '../game/combat.js';

export async function initPeerJS() {
    try {
        world.peer = new Peer();
        world.peer.on('open', async (id) => {
            const roomDisplay = document.getElementById('room-id-display');
            const joinUrl = `${window.location.origin}${window.location.pathname}?room=${id}&controller=1`;
            if (roomDisplay) {
                roomDisplay.innerText = `Room: ${id.substring(0, 8)}`;
                roomDisplay.dataset.link = joinUrl;
            }

            const qrContainer = document.getElementById('qrcode-container');
            if (qrContainer) {
                qrContainer.innerHTML = '';
                const img = document.createElement('img');
                img.alt = 'Join QR';
                img.width = 160;
                img.height = 160;
                img.src = await QRCode.toDataURL(joinUrl, { width: 160, margin: 1 });
                qrContainer.appendChild(img);
            }
        });

        world.peer.on('connection', (conn) => {
            conn.on('data', (data) => {
                if (data.type === 'JOIN') {
                    const heroClasses = Object.keys(HERO_CLASSES);
                    const taken = Object.values(world.players).map((p) => p.classKey);
                    const available = heroClasses.filter((c) => !taken.includes(c));

                    if (available.length > 0) {
                        const selectedClass = available[0];
                        world.players[conn.peer] = new Player(conn.peer, selectedClass);
                        conn.send({ type: 'ASSIGN_CLASS', classKey: selectedClass });
                    }
                } else if (data.type === 'INPUT' && world.players[conn.peer]) {
                    handlePlayerInput(world.players[conn.peer], data);
                }
            });
        });

        world.peer.on('error', () => {
            const roomDisplay = document.getElementById('room-id-display');
            if (roomDisplay) roomDisplay.innerText = 'Offline (Sandbox Mode)';
        });
    } catch {
        const roomDisplay = document.getElementById('room-id-display');
        if (roomDisplay) roomDisplay.innerText = 'P2P Restricted';
    }
}
