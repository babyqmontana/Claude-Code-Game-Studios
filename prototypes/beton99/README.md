# BÉTON 99 — prototype

**Hypothesis:** a PS1/PS2-styled open world (French banlieue at dusk, graffiti, small shops, traffic and pedestrians) is fun to roam on a phone browser, with a "memory card" menu look carrying most of the identity.

**How to run:** open `index.html` in any modern browser (desktop or mobile). Three.js r128 loads from cdnjs; everything else (textures, music, SFX) is generated at runtime.

**Status:** in-progress (v2: lofted PS2-style character models, Russian UI, bug fixes)

## What's in it
- 6×6-block city in four districts (Cité des Tilleuls, Centre-ville, Les Pavillons, Quartier Gare): HLM towers and barres, shop rows, houses, parks, parking lots, perimeter wall, skyline.
- PS1 look: vertex snapping, affine texture warp, 15-bit dither, low internal resolution, CRT lines (all toggleable in OPTIONS).
- Traffic on lanes (right-hand), pedestrians on sidewalks/crosswalks, gangs, police with a 5-level wanted system and police cars.
- Character creator / clothing shop (skin, hair, headwear, top, print, bottom, shoes, chain).
- Weapons: fists, bat, pistol, SMG, shotgun, spray can (tag walls for money). Auto-aim lock-on for touch.
- Shops (kebab, tabac, pharmacie, surplus, brico, boulangerie, fringues, garage), inventory, map, phone-booth delivery missions, save/load to localStorage.
- Controls: keyboard + mouse, touch (virtual stick, buttons), gamepad.

## Findings
_To be filled after playtests._

## v3 — CC0 assets and PS2 look
- `tools/fetch_assets.py` downloads CC0 textures and models from [Poly Haven](https://polyhaven.com) (license: CC0),
  shrinks textures to 256 px and decimates models to 250–2500 triangles. Output lives in `assets/`.
  Textures: asphalt, concrete pavers, plaster/panel facades, brick, metal shutters, denim, cotton jersey, grass, wood floor,
  roof tiles, bedspread. Models: boombox, CRT TV, ceiling fan, baseball bat, pistol, aircon units, fire escapes,
  trash bags, boxes, tyres, crates, utility boxes, road barriers, cassette player, console, pillows, rats.
- Default style is now "PS2": bilinear filtering, no vertex jitter, bloom, pink-violet fog, light cones under lamps,
  overhead cables. The PS1 look is one option away.
- New: BMX bikes (lean, hop, spinning wheels), car drift and body roll, the player's flat (save point) with a CRT TV,
  blinds light, posters and a ceiling fan, gang members carrying boomboxes, long sleeves under tees, printed jorts,
  hi-top and skate shoes.
- Run locally through a web server (assets load with fetch): `python3 -m http.server` in this folder.

## v4 — vehicles, animation, time of day
- Cars: separate wheels (front ones steer), opening driver door with walk-up/carjack/exit animations, dents that deform the
  body mesh, suspension bounce on curbs and hits, brake lights, headlight beams at night, exhaust, parked-car alarms.
  New types: taxi, sports coupe, city bus, scooter (plus BMX). Per-type acceleration, grip and mass.
- Radio stations in cars (BÉTON FM, RAP 93, PÉRIPH TECHNO, off) — `R` or the weapon button switches; on foot you hear the city.
- Traffic lights at every intersection on a shared cycle; AI traffic stops on red.
- Characters: punch–punch–kick combo, idle poses (phone, smoking with smoke puffs, arms crossed, looking around),
  civilians raise their hands when aimed at, ragdoll-ish death pose, hip sway.
- Day/night cycle (1 game minute = 1 s): sky, fog, sun, window lights, lamps and bloom follow the clock.
- City life: pigeons that scatter, steam from manholes, flickering shop signs, 20 hidden cassettes to collect.

## v5 — redo: real models, mobile layout
- Characters are now the CC0 rigged "PS2 Styled Characters" from OpenGameArt (male and female base, converted
  FBX → glTF JSON). Clothes, skin, hair and prints are painted into the 128×256 atlas at runtime; hats, hood, mask,
  chain and weapons attach to bone sockets. Animation is procedural on the skeleton: walk/run cycle with hip and
  spine counter-twist, idle breathing and look-around, two-hand aim, punch/kick/bat, phone/smoke/lean poses,
  bike riding, death.
- Cars are the CC0 "PSX Style Cars" by GGBot (OBJ → glTF JSON) with their colour variants, police and taxi skins;
  dents deform the model mesh. Normals are computed on load (the OBJs ship without them).
- Road and asphalt textures from [ambientCG](https://ambientcg.com) (CC0).
- Mobile: internal resolution is set from the short side of the screen (fixes the "melting" bottom in portrait);
  a compact layout for landscape phones moves the bag/pause buttons to the top and shrinks the HUD.
- Fixed: camera NaN when mounting a BMX/scooter (grey screen), hood facing sideways, hats sitting on the face,
  stubble pixels showing white on dark skin, the decimated pistol model rendering as noise.
