# 3D Fantasy Heroes

Action RPG / fight-em-up rogue-lite. Host on a big screen; phones join as controllers (PeerJS). Built to ship on GitHub Pages and later as a dedicated renderer.

## Run

```bash
npm install
npm run dev
```

Open the printed LAN URL on the TV/PC. `WASD` move, `Space` attack, `1`/`2` skills, `Shift` dash. **Add AI Hero** fills unused classes.

## Repo layout

```
index.html                 HUD markup only
vite.config.js             base: './' for GitHub Pages
src/main.js                boot + render loop
src/styles.css
src/audio/SoundEngine.js
src/data/heroes.js         src/data/perks.js
src/engine/setup.js        scene, lights, framing camera
src/entities/              Player, Enemy, Projectile, Barricade
src/fx/effects.js
src/game/state.js          shared mutable world (no circular imports)
src/game/combat.js         src/game/waves.js
src/net/peerHost.js
src/input/keyboard.js
src/ui/modals.js
public/assets/             GLTF later (KayKit / Fantasy Heroes)
```

## Next (do not mix into this cut)

1. Controller client (`?controller=1`) — HUD exists, joystick/Peer send is not wired.
2. Copy GLTF into `public/assets` and swap primitive meshes via GLTFLoader (FBX must convert first).
3. Barricade collision + HP (meshes spawn, nothing damages them yet).
4. `gh-pages` / Vercel: `npm run build` → publish `dist`.

KayKit forest is already GLTF. KayKit Skeletons on disk currently has weapons/props under `assets/gltf`, not full character rigs. Fantasy Heroes FBX is for a later conversion pass.
