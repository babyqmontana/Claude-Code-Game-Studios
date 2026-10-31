# BÉTON 99 — PC build

Windows installer: `BETON99-Setup-<version>.exe` (Electron 31). Everything is inside: three.js, the glTF loaders,
every model, texture and font. The game makes no network requests. Saves live in the app profile.

Controls: WASD, mouse (click to capture), Shift run, Space jump, E action, R weapon/radio, I bag, M map, Esc pause,
F11 or Alt+Enter toggles fullscreen.

## Build
```
cd prototypes/beton99
python3 tools/build.py && python3 tools/bundle.py   # dist/index.html, one self-contained file
cp dist/index.html desktop/game/index.html
cd desktop && npm install
npm run dist:win      # release/BETON99-Setup-*.exe  (on Linux needs wine + wine32)
npm run dist:linux    # release/BETON99-*.AppImage
```
