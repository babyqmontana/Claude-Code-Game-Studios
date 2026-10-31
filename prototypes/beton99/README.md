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

## v6 — a city to live in
Code for the new systems lives in `src/v6/*.js` and is inlined into `index.html` by `python3 tools/build.py`
(edit the module, then rebuild; the core in `index.html` exposes hooks through the `V6` object).
- **Paris banlieue look:** zinc mansard roofs with dormers and chimney pots, cornices, wrought-iron balconies, striped
  awnings on Centre-ville shops; loggias with painted parapets, satellite dishes and laundry on the HLM towers;
  wheat-pasted posters and tags at street level; bollards, benches, bins, bike racks, plane trees in grates, Morris
  columns, newspaper kiosks, bus shelters and drinks machines along every street.
- **Street life:** crews at tower entrances with a boombox (you hear it as you approach), people on benches, kids
  playing football on the courts with a ball you can kick. Sit on a bench, buy a drink, do pull-ups or dance with
  the crew — each activity has its own animation and camera.
- **Interiors:** every shop is a room you walk into (kebab, bakery, tabac, pharmacy, DIY, surplus, garage). Talk to
  the shopkeeper at the counter; clothes are tried on at the mirror in FRINGUES STREET with an orbiting camera,
  live preview and prices, GTA-style.
- **Guns:** over-the-shoulder aim (right mouse or while firing), recoil kick, muzzle light, ejected casings, bullet
  holes, blood spray and pools, hit markers, flinches, slow-motion kill cam, echoing shots, phone vibration.
- **Story:** a cutscene system (letterbox, named subtitles, shot/reverse-shot, skip) and two missions —
  «Посылка» (deliver Momo's bag, then a shoot-out) and «Стены говорят» (tag three walls for Nadia, meet her in the park).
- **Skate and BMX tricks (THPS-style):** ollie/bunny hop, flips, grabs, spins, grinds on every curb, bench, ledge
  and rail, manuals with a balance meter, combos with a multiplier, bails. A skatepark with quarter pipes (vert air),
  a funbox, kickers, ledges and rails. After mission 2 you carry your own board (B / ДОСКА button).
- **Cars:** skid marks, tyre smoke, sparks and a camera kick on impacts, engine sound with gear changes.
- **Menu and style:** the title screen flies over the city at dusk with a news ticker; new options for hair (short,
  afro, braids, bald), stubble, glasses and a crossbody bag (street peds use them too).
- Fixed: 270k bollard instances from a nested loop, aircon spam (1M triangles), hats on the face, crossed-arms pose,
  cutscene timing tied to frame rate, messages covering the middle of the screen.

## v7 — story, painting, a smooth city
- **The city is no longer a grid on screen.** `src/v6/05_warp.js` bends every vertex (and the camera) through one
  smooth field at render time, so streets flow in long curves and blocks lose their right angles; AI, traffic,
  collisions and the minimap still work on the underlying grid.
- **Sharper look:** 720p internal resolution by default, mipmaps and anisotropic filtering on every texture,
  facades drawn at 10 px/m, ground and wall textures refetched at 512 px, and a world-space concrete/grain detail
  layer on walls, props and street furniture so neighbouring objects share one material. Bloom now only catches real
  lights instead of smearing bright paint.
- **Graffiti painting:** with a spray can, fire at a wall to open a canvas on that wall: spray (soft, overspray,
  drips) or marker, 12 colours, three nozzle sizes, an optional stencil of letters to trace. The finished piece is
  sprayed onto the wall with a short camera move; respect pays by coverage and colours.
- **Story:** an intro (title card, crane and orbit shots over the city, voice-over, tracking shot of the hero) and four
  chapters — «Посылка», «Стены говорят», «Ночной поезд» (paint the wall by the tracks, escape the police) and the
  finale «Хищники» (take the rivals' lot, beat Стервятник). Cutscenes use orbit, crane, dolly, tracking and
  shoulder shots, chapter cards and film grain; actors walk, turn, point, shrug, dap, laugh and shake spray cans
  while they talk.

## v8 — same game everywhere, fairer police, livelier people
- **Why the published page could look different from the screenshots:** assets had a 25-second loading timeout,
  after which the world was built with the old procedural people, cars and canvas textures — on a phone over mobile
  data that happened. Loading now waits for everything (progress on the title screen) and only gives up after
  3 minutes. New games also start at dusk (18:35) instead of at night.
- **Balance:** the player takes half damage, heals slowly back to 50 when out of trouble, falls hurt only from real
  heights; police and gangs shoot less often and less accurately, fewer cops per star, stars fade faster, painting
  only draws heat when a cop is near.
- **Alive:** characters blink; idle stance shifts weight and breathes, with fidgets (scratch the head, look around,
  tug the hoodie, roll the neck); walking has more swagger.
- **French voices:** cutscene and shop lines are spoken in French through the browser's speech synthesis (different
  pitch per character, Russian subtitles stay), plus street barks — greetings from crews, threats when a fight
  starts, police shouts, yelps when hit. Uses whatever French voice the device has; silent if there is none.

## v9 — a round city
- The bending field (`src/v6/05_warp.js`) now has six swirls around crossroads on top of the long waves. A swirl
  rotates points by an angle that fades with distance from its centre, so it can never fold the city over itself;
  streets near a centre turn into arcs around a round plaza, and blocks between swirls become wedges and ovals.
- Round plazas (`src/v6/07_round.js`) sit on the swirl centres: a cobbled island with a flower bed, a kerb and a
  dashed give-way ring.
- Long flat geometry (roads, pavements, walls, balconies) is cut into ~3 m triangles at load so it bends smoothly.
- The minimap and the big map are resampled through the same field (exact inverse of the swirls, fixed-point
  inverse of the waves), and the map rotation and player arrow use the on-screen heading.

## v9.1 — fixes
- Models vanishing while playing: frustum culling tested objects at their grid position, not where the bend draws
  them, so peds, cars and props popped out near curves. Culling now moves each bounding sphere through the bend
  (`src/v6/12_mapfix.js`).
- The map is drawn as vector curves in the bent space (1024 px) instead of resampling a pixel image.
- A real loading screen (progress bar, tips) stays up until the city is built; the menu never shows the fallback
  boxy character, and the menu flyover is bent like the game.

## v10 — one file, no stretching, streetwear
- **Published build is one self-contained file.** `python3 tools/build.py && python3 tools/bundle.py` writes
  `dist/index.html` with three.js, the glTF loaders (`vendor/`) and every model and texture inlined. If a CDN or a
  relative asset request failed in the artifact viewer, the game used to fall back to boxy placeholder people; now
  it has nothing to fetch. Tested with all network requests blocked: every ped and car is a real model.
- **No more stretching when the camera turns.** The swirls in the bend field stretched space 2.2x on average (up to
  6x); they are gone. The field is now long waves only (streets drift up to ~24 m in wide arcs, average local
  stretch ~9 %). People, cars, pickups, rats and balls are not bent at all: each frame they are moved rigidly to
  their bent position and turned with the street (`src/v6/13_rigid.js`), and the camera is placed rigidly around the
  bent target. Measured over full camera turns at four spots: distance, screen position and on-screen height of the
  player stay constant.
- **Streetwear people (`src/v6/95_street.js`).** Faces repainted: wider nose, full lips, thick brows, brown eyes;
  hair painted or modelled — fade, cornrows, waves, dreads, afro, braids, bald; stubble, goatee or a boxed beard.
  Clothes get a baggy shell (a copy of the cloth parts of the body pushed out along smoothed normals, on the same
  skeleton): oversized tees and hoodies, baggy jeans, cargos, basketball jersey with a number, quilted puffer;
  fitted caps (forward or back), durag with a tail, wheat boots, a thin gold chain with an optional medallion.
  Skin tones and street peds lean darker; the clothes shop sells the new pieces.
