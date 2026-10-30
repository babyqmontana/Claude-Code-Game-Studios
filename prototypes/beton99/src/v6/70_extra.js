/* ======================= V6 STYLE OPTIONS, MENU FLYOVER, CAR FX ======================= */
/* more character options: they also feed randApp, so street peds get them too */
CREATOR.splice(3,0,{k:'hair',l:'ПРИЧЁСКА',o:['base','short','afro','braids','bald'],n:['ДЛИННЫЕ','КОРОТКО','АФРО','КОСИЧКИ','ЛЫСЫЙ']},{k:'beard',l:'ЩЕТИНА',o:[0,1],n:['НЕТ','ЕСТЬ']});
CREATOR.push({k:'glasses',l:'ОЧКИ',o:[0,0,1,2],n:['НЕТ','НЕТ','СОЛНЕЧНЫЕ','СПОРТ']},{k:'bag',l:'САКОШ',o:[0,1],n:['НЕТ','ЧЕРЕЗ ПЛЕЧО']});
CREATOR.find(r=>r.k==='glasses').o=[0,1,2];CREATOR.find(r=>r.k==='glasses').n=['НЕТ','СОЛНЕЧНЫЕ','СПОРТ'];
Object.assign(DEFAULT_APP,{hair:'base',glasses:0,bag:0});
const STY={};
function braidTex(col){const k='b'+col;if(STY[k])return STY[k];return STY[k]=rtex(32,32,(g)=>{g.fillStyle=col;g.fillRect(0,0,32,32);g.fillStyle='rgba(0,0,0,.55)';for(let x=1;x<32;x+=5)g.fillRect(x,0,1.5,32);g.fillStyle='rgba(255,255,255,.12)';for(let x=3;x<32;x+=5)for(let y=0;y<32;y+=4)g.fillRect(x,y,1,2);});}
{const mk0=makeChar;makeChar=function(app,m,n){const ch=mk0(app,m,n);if(!ch.ps2||m)return ch;app=Object.assign({},DEFAULT_APP,app);
  const hc=new THREE.Color(app.hairCol||'#141010'),covered=app.hat==='hood'||app.hat==='bonnet';
  if(app.hair&&app.hair!=='base'){ch.inner.traverse(o=>{if(o.isSkinnedMesh&&o.material&&PS2.hairMat&&o.material.map===PS2.hairMat.map)o.visible=false;});
    if(!covered&&app.hair!=='bald'){const G=new THREE.Group();ch.head.add(G);
      if(app.hair==='afro'){const a=new THREE.Mesh(new THREE.IcosahedronGeometry(0.15,1),LM({color:hc,map:imgTex(ASSETS.img.jersey_g,3,3)}));a.scale.set(1.05,0.95,1.05);a.position.set(0,0.13,-0.03);G.add(a);}
      else{const cap=new THREE.Mesh(new THREE.SphereGeometry(0.118,14,8,0,TAU,0,Math.PI*0.52),LM({color:0xffffff,map:app.hair==='braids'?braidTex(hc.getStyle()):null}));if(app.hair!=='braids')cap.material.color.copy(hc);
        cap.scale.set(1,1.02,1.1);cap.position.set(0,0.065,-0.012);G.add(cap);if(app.hair==='braids'){for(const s of[-1,1]){const b=new THREE.Mesh(new THREE.CylinderGeometry(0.012,0.008,0.16,5),LM({color:hc}));b.position.set(s*0.05,0.0,-0.1);b.rotation.x=0.3;G.add(b);}}}}}
  if(app.glasses){const G=new THREE.Group();ch.head.add(G);const fm=LM({color:app.glasses===1?0x111111:0xd4302a}),lm=new THREE.MeshLambertMaterial({color:app.glasses===1?0x0a0a10:0x4a2a10,emissive:app.glasses===2?0x3a2000:0x000000,transparent:true,opacity:0.88});
    for(const s of[-1,1]){const l=new THREE.Mesh(new THREE.BoxGeometry(0.05,app.glasses===1?0.032:0.026,0.008),lm);l.position.set(s*0.034,0.075,0.098);G.add(l);}
    const br=new THREE.Mesh(new THREE.BoxGeometry(0.14,0.008,0.008),fm);br.position.set(0,0.09,0.1);G.add(br);for(const s of[-1,1]){const t=new THREE.Mesh(new THREE.BoxGeometry(0.006,0.006,0.1),fm);t.position.set(s*0.07,0.085,0.05);G.add(t);}}
  if(app.bag){const G=new THREE.Group();ch.chest.add(G);const bm=LM({color:0x161616}),st=LM({color:0x2a2a2a});const b=new THREE.Mesh(new THREE.BoxGeometry(0.16,0.12,0.05),bm);b.position.set(0.1,-0.12,0.13);b.rotation.z=0.15;G.add(b);
    const lg=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.02,0.002),LM({color:0xd8d8d8}));lg.position.set(0.1,-0.11,0.156);lg.rotation.z=0.15;G.add(lg);
    const strap=new THREE.Mesh(new THREE.BoxGeometry(0.03,0.62,0.012),st);strap.position.set(0.0,0.06,0.12);strap.rotation.z=-0.62;G.add(strap);const s2=strap.clone();s2.position.z=-0.11;G.add(s2);}
  return ch;};}
/* main menu: slow flyover of the city at dusk behind the character */
const FLY={cam:new THREE.PerspectiveCamera(55,1,0.5,1400),t:rr(0,100)};
V6.menuBg=function(rdt){if(!worldBuilt||state!=='menu')return false;FLY.t+=rdt;const t=FLY.t*0.035,R=SIZE*0.42,cx=SIZE/2,cz=SIZE/2;
  FLY.cam.aspect=innerWidth/innerHeight;FLY.cam.updateProjectionMatrix();FLY.cam.position.set(cx+Math.cos(t)*R,26+Math.sin(t*1.7)*6,cz+Math.sin(t)*R);FLY.cam.lookAt(cx+Math.cos(t+0.9)*R*0.35,6,cz+Math.sin(t+0.9)*R*0.35);
  if(!FLY.tod){FLY.tod=1;gameMin=20*60+30;updDayNight(true);}updFlicker();updTrafficLights();
  mscene.background=null;renderer.render(scene,FLY.cam);return true;};
{const tt=toTitle;toTitle=function(){tt();FLY.tod=0;};}
V6CSS.textContent+=`#ticker{position:fixed;left:0;right:0;bottom:calc(max(10px,2.5vmin) + env(safe-area-inset-bottom,0px) + 2px);height:22px;overflow:hidden;z-index:30;pointer-events:none;display:none;background:linear-gradient(90deg,transparent,rgba(8,10,40,.75) 10%,rgba(8,10,40,.75) 90%,transparent)}
#ticker span{position:absolute;white-space:nowrap;font:600 12px/22px 'Exo 2',sans-serif;color:#cfd6ff;letter-spacing:.06em;animation:tick 60s linear infinite}#ticker b{color:#ffd84d;margin:0 12px}
@keyframes tick{from{transform:translateX(100vw)}to{transform:translateX(-100%)}}
#s-title .mi{transition:transform .15s,letter-spacing .15s}#s-title .mi.sel{transform:translateX(8px);letter-spacing:.06em}
#s-title .logo{animation:logoPulse 4s ease-in-out infinite}@keyframes logoPulse{50%{text-shadow:0 0 18px rgba(255,216,77,.55),0 0 2px #fff}}`;
(()=>{const d=document.createElement('div');d.id='ticker';d.innerHTML='<span>'+['BÉTON FM 99.3','«Хищники» снова замечены у вокзала','В скейтпарке на старой стоянке новые рейлы','Кебаб «Grill» — тот же соус с 1994 года','Полиция усилила патрули в Квартале Вокзала','Ищут свидетелей граффити на мэрии','Новая поставка кроссов в FRINGUES STREET','Погода: туман к вечеру, +12°'].map(t=>'<b>◆</b>'+t).join('')+'</span>';document.body.appendChild(d);})();
V6.upd.push(()=>{});
setInterval(()=>{const tk=$('#ticker');if(tk)tk.style.display=state==='menu'&&UI.screen==='s-title'?'block':'none';if(state!=='menu'&&mscene.background===null)mscene.background=new THREE.Color('#1f34ee');},300);
/* skid marks, tyre smoke and sparks */
const SKID={n:0,max:500,im:null,M:new THREE.Matrix4(),Q:new THREE.Quaternion(),S:new V3(0.22,1,0.5),last:new Map()};
V6.build.push(()=>{const g=new THREE.PlaneGeometry(1,1).rotateX(-Math.PI/2);SKID.im=new THREE.InstancedMesh(g,new THREE.MeshBasicMaterial({color:0x0a0a0c,transparent:true,opacity:0.55,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2}),SKID.max);
  SKID.im.count=0;SKID.im.frustumCulled=false;scene.add(SKID.im);});
function skidAt(x,z,h){const i=SKID.n%SKID.max;SKID.Q.setFromAxisAngle(new V3(0,1,0),h);SKID.M.compose(new V3(x,groundY(x,z)+0.02,z),SKID.Q,SKID.S);SKID.im.setMatrixAt(i,SKID.M);SKID.n++;SKID.im.count=Math.min(SKID.n,SKID.max);SKID.im.instanceMatrix.needsUpdate=true;}
V6.upd.push(dt=>{const c=pl.inCar;if(!c||c.T.bike||!SKID.im)return;const slip=Math.abs(angDiff(c.vh===undefined?c.h:c.vh,c.h)),sp=Math.abs(c.speed);
  const skid=(slip>0.16&&sp>6)||(c.braking&&sp>9)||(c.accV>0.8&&sp<6&&sp>1);if(!skid){SKID.last.delete(c);return;}
  const fx=Math.sin(c.h),fz=Math.cos(c.h),rx=Math.cos(c.h),rz=-Math.sin(c.h),back=c.T.l*0.36;const prev=SKID.last.get(c)||0;if(time-prev<0.035)return;SKID.last.set(c,time);
  for(const s of[-1,1]){const x=c.x-fx*back+rx*s*c.T.w*0.4,z=c.z-fz*back+rz*s*c.T.w*0.4;skidAt(x,z,c.vh||c.h);if(Math.random()<0.6)emit(x,0.3,z,1,'#b8b4c4',0.8,1,1.4,-0.5);}
  if(AU.c&&Math.random()<dt*10)nz(0.2,1400+Math.random()*600,'bandpass',0.09,0,4);});
V6.carHit=(c,imp)=>{if(imp<5)return;const fx=Math.sin(c.h),fz=Math.cos(c.h),x=c.x+fx*c.T.l/2*Math.sign(c.speed),z=c.z+fz*c.T.l/2*Math.sign(c.speed);
  emit(x,0.6,z,Math.min(18,Math.floor(imp)),'#ffd27a',4,3,0.35,10);emit(x,0.8,z,4,'#d0d0d0',1.2,1.5,0.6,2);if(c===pl.inCar){CAMS.kick+=Math.min(0.08,imp*0.004);slowmo(imp>16?0.45:0.8,0.08);tone(rr(700,1100),0.12,'square',0.05,300);}};
