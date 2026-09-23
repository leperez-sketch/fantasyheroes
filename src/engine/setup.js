import * as THREE from 'three';
import { world } from '../game/state.js';
import { spawnBarricades } from '../entities/Barricade.js';

export function initEngine() {
    world.scene = new THREE.Scene();
    world.scene.background = new THREE.Color(0x090d16);
    world.scene.fog = new THREE.FogExp2(0x090d16, 0.025);

    world.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    world.camera.position.set(0, 22, 20);
    world.camera.lookAt(0, 0, 0);

    world.renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('game-canvas'), antialias: true });
    world.renderer.setSize(window.innerWidth, window.innerHeight);
    world.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    world.renderer.shadowMap.enabled = true;

    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    world.scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xfff5ea, 1.2);
    sun.position.set(15, 30, 15);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;
    world.scene.add(sun);

    const groundGeo = new THREE.PlaneGeometry(60, 60);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    world.scene.add(ground);

    const grid = new THREE.GridHelper(60, 30, 0x334155, 0x1e293b);
    grid.position.y = 0.01;
    world.scene.add(grid);

    spawnBarricades();

    window.addEventListener('resize', () => {
        world.camera.aspect = window.innerWidth / window.innerHeight;
        world.camera.updateProjectionMatrix();
        world.renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

export function updateCamera() {
    const alive = Object.values(world.players).filter((p) => p.hp > 0);
    if (alive.length === 0) return;

    const center = new THREE.Vector3();
    alive.forEach((p) => center.add(p.pos));
    center.divideScalar(alive.length);

    let maxDist = 0;
    alive.forEach((p) => {
        const d = p.pos.distanceTo(center);
        if (d > maxDist) maxDist = d;
    });

    const targetCamPos = new THREE.Vector3(
        center.x,
        Math.max(18, 16 + maxDist * 0.8),
        center.z + Math.max(16, 14 + maxDist * 0.8),
    );

    world.camera.position.lerp(targetCamPos, 0.05);
    world.camera.lookAt(center);
}
