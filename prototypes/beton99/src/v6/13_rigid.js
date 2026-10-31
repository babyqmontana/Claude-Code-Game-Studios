/* ======================= V6 RIGID MOVERS: people, cars, pickups are placed on the bent city, never bent themselves ======================= */
const RIGC=new Map();const SHAREDM=new Set();
function rigidMat(m){if(!m||m.userData.rigid)return m;
  if(SHAREDM.has(m)){let c=RIGC.get(m);if(!c){c=m.clone();c.userData=Object.assign({},m.userData,{rigid:1});c.customProgramCacheKey=()=>'rigid';RIGC.set(m,c);}return c;}
  m.userData.rigid=1;if(!m.customProgramCacheKey||m.customProgramCacheKey===THREE.Material.prototype.customProgramCacheKey)m.customProgramCacheKey=()=>'rigid';m.needsUpdate=true;return m;}
function rigidify(root){if(!root)return root;root.userData.rigid=1;root.traverse(o=>{if(!o.material)return;o.userData.rigidObj=1;o.material=Array.isArray(o.material)?o.material.map(rigidMat):rigidMat(o.material);});return root;}
/* materials the static city also uses must be copied, not flipped */
SHAREDM.add(VCMAT);
V6.build.unshift(()=>{for(const k in ASSETS.mdl)for(const q of ASSETS.mdl[k])SHAREDM.add(q.m);
  const dyn=new Set();cars.forEach(c=>dyn.add(c.root));peds.forEach(p=>dyn.add(p.ch.root));
  scene.traverse(o=>{if(!o.material)return;let a=o;while(a&&!dyn.has(a))a=a.parent;if(a)return;for(const m of Array.isArray(o.material)?o.material:[o.material])SHAREDM.add(m);});
  cars.forEach(c=>rigidify(c.root));peds.forEach(p=>rigidify(p.ch.root));pickups.forEach(k=>rigidify(k.m));});
/* each frame: move them onto the bend for the draw, then put them back for the game logic */
const RIGSAVE=[];
function rigidPre(){RIGSAVE.length=0;const put=o=>{if(!o||o.parent!==scene||!o.visible)return;const x=o.position.x,z=o.position.z,w=warpRaw(x,z);RIGSAVE.push(o,x,z,o.rotation.y);o.position.x=w[0];o.position.z=w[1];o.rotation.y+=warpRot(x,z);};
  for(const c of cars)put(c.root);for(const p of peds)put(p.ch.root);if(pl.ch)put(pl.ch.root);for(const k of pickups)put(k.m);
  if(typeof rats!=='undefined')for(const r of rats)put(r.m);if(typeof LIFE!=='undefined')for(const b of LIFE.balls)put(b.m);}
function rigidPost(){for(let i=0;i<RIGSAVE.length;i+=4){const o=RIGSAVE[i];o.position.x=RIGSAVE[i+1];o.position.z=RIGSAVE[i+2];o.rotation.y=RIGSAVE[i+3];o.updateMatrixWorld(true);}RIGSAVE.length=0;}
