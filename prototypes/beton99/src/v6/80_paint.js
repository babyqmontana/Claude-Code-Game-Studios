/* ======================= V6 GRAFFITI PAINTING: draw your own piece on the wall ======================= */
V6CSS.textContent+=`
#paint{position:fixed;inset:0;z-index:20;display:none;background:rgba(6,6,14,.35);touch-action:none;font:700 13px 'Exo 2',sans-serif;color:#fff}
#paint.on{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:max(8px,env(safe-area-inset-top)) 8px max(8px,env(safe-area-inset-bottom))}
#paint .pt{font:900 clamp(14px,2.4vw,20px) 'Exo 2',sans-serif;letter-spacing:.14em;text-shadow:0 2px 0 #000}
#pcv{width:min(94vw,calc((100vh - 150px)*1.6));aspect-ratio:1.6;border:3px solid #111;box-shadow:0 10px 40px rgba(0,0,0,.6);border-radius:4px;touch-action:none;cursor:crosshair;background:#777}
#paint .row{display:flex;gap:6px;flex-wrap:wrap;justify-content:center;align-items:center;max-width:96vw}
#paint .sw{width:30px;height:30px;border-radius:50%;border:3px solid rgba(255,255,255,.35);cursor:pointer}#paint .sw.on{border-color:#fff;transform:scale(1.15)}
#paint .pb{background:#22222e;border:1px solid rgba(255,255,255,.25);border-radius:14px;padding:7px 12px;cursor:pointer;letter-spacing:.06em}#paint .pb.on{background:#ffd84d;color:#111}
#paint .pb.go{background:#2f8a3a}body.painting #hud,body.painting #touch,body.painting #pausebtn,body.painting #xh{display:none!important}#paint .cans{color:#ffd84d}
@media (max-height:520px){#pcv{width:min(64vw,calc((100vh - 70px)*1.6))}#paint.on{flex-direction:row;flex-wrap:wrap}#paint .pt{width:100%;text-align:center}#paint .side{display:flex;flex-direction:column;gap:6px;max-width:30vw}#paint .sw{width:24px;height:24px}}`;
const PNT={on:false,cv:null,g:null,col:'#e8231e',size:22,tool:'spray',drips:true,last:null,still:0,guide:null,colors:new Set(),wall:null};
const SPCOL=['#e8231e','#f2c418','#ff7a12','#2ac43a','#18b7c4','#1f4fd6','#8a2fd6','#ff4fa8','#f4f4f4','#111111','#c0c0c0','#6a3a1a'];
(()=>{const d=document.createElement('div');d.id='paint';
  d.innerHTML='<div class="pt">ГРАФФИТИ · <span class="cans" id="pcans"></span></div><canvas id="pcv" width="512" height="320"></canvas><div class="side"><div class="row" id="pcol"></div>'+
   '<div class="row"><span class="pb" data-t="spray">СПРЕЙ</span><span class="pb" data-t="marker">МАРКЕР</span><span class="pb" data-s="10">S</span><span class="pb" data-s="22">M</span><span class="pb" data-s="40">L</span><span class="pb" id="pdrip">ПОДТЁКИ</span></div>'+
   '<div class="row"><span class="pb" id="pguide">ТРАФАРЕТ</span><span class="pb" id="pclear">ОЧИСТИТЬ</span><span class="pb" id="pcancel">ОТМЕНА</span><span class="pb go" id="pdone">НА СТЕНУ!</span></div></div>';
  document.body.appendChild(d);PNT.cv=$('#pcv');PNT.g=PNT.cv.getContext('2d',{willReadFrequently:true});PNT.bg=document.createElement('canvas');PNT.bg.width=512;PNT.bg.height=320;
  SPCOL.forEach(c=>{const s=document.createElement('span');s.className='sw';s.style.background=c;s.onclick=()=>{PNT.col=c;paintUI();};$('#pcol').appendChild(s);});
  d.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{PNT.tool=b.dataset.t;paintUI();});d.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{PNT.size=+b.dataset.s;paintUI();});
  $('#pdrip').onclick=()=>{PNT.drips=!PNT.drips;paintUI();};$('#pguide').onclick=()=>{PNT.guide=PNT.guide===null?0:PNT.guide+1>=6?null:PNT.guide+1;paintRedraw();paintUI();};
  $('#pclear').onclick=()=>{PNT.layer.getContext('2d').clearRect(0,0,512,320);PNT.colors.clear();paintRedraw();};$('#pcancel').onclick=()=>paintEnd(false);$('#pdone').onclick=()=>paintEnd(true);
  d.addEventListener('pointerdown',e=>e.stopPropagation());d.addEventListener('keydown',e=>e.stopPropagation());
  const pos=e=>{const r=PNT.cv.getBoundingClientRect();return[(e.clientX-r.left)/r.width*512,(e.clientY-r.top)/r.height*320];};
  PNT.cv.addEventListener('pointerdown',e=>{e.preventDefault();try{PNT.cv.setPointerCapture(e.pointerId);}catch(er){}PNT.last=pos(e);PNT.down=true;sprayAt(...PNT.last,true);});
  PNT.cv.addEventListener('pointermove',e=>{if(!PNT.down)return;const p=pos(e),l=PNT.last,d=Math.hypot(p[0]-l[0],p[1]-l[1]),n=Math.max(1,Math.ceil(d/(PNT.tool==='marker'?2:4)));
    for(let i=1;i<=n;i++)sprayAt(l[0]+(p[0]-l[0])*i/n,l[1]+(p[1]-l[1])*i/n,false);if(d>2)PNT.still=0;PNT.last=p;});
  const up=()=>{PNT.down=false;};PNT.cv.addEventListener('pointerup',up);PNT.cv.addEventListener('pointercancel',up);})();
function paintUI(){$('#paint').querySelectorAll('.sw').forEach((s,i)=>s.classList.toggle('on',SPCOL[i]===PNT.col));$('#paint').querySelectorAll('[data-t]').forEach(b=>b.classList.toggle('on',b.dataset.t===PNT.tool));
  $('#paint').querySelectorAll('[data-s]').forEach(b=>b.classList.toggle('on',+b.dataset.s===PNT.size));$('#pdrip').classList.toggle('on',PNT.drips);$('#pguide').classList.toggle('on',PNT.guide!==null);
  $('#pguide').textContent=PNT.guide===null?'ТРАФАРЕТ':'ТРАФАРЕТ: '+PWORDS[PNT.guide];$('#pcans').textContent='БАЛЛОНЧИКОВ: '+pl.spray;}
const PWORDS=['BÉTON','ZONE','93','KAOS','RIVA','NÉON'];
/* the wall behind the piece: its own colour and grain so the paint sits on it */
function paintWallBg(){const g=PNT.bg.getContext('2d');const base=pick(['#8a8478','#9a8f80','#7c7a76','#a49a8a','#6f6e6c']);g.fillStyle=base;g.fillRect(0,0,512,320);
  const im=ASSETS.img.dirtyconc_g||ASSETS.img.plaster_g;if(im){g.globalAlpha=0.55;g.globalCompositeOperation='multiply';for(let y=0;y<320;y+=256)for(let x=0;x<512;x+=256)g.drawImage(im,x,y,256,256);g.globalCompositeOperation='source-over';g.globalAlpha=1;}
  speck(g,512,320,900,'rgba(0,0,0,.12)');for(let i=0;i<4;i++){g.fillStyle='rgba(0,0,0,.08)';g.fillRect(Math.random()*512,0,2+Math.random()*4,320);}
  if(Math.random()<0.6){g.globalAlpha=0.35;scrawl(g,rr(20,300),rr(200,290),rr(80,160),22,Math.random);g.globalAlpha=1;}}
function paintRedraw(){const g=PNT.g;g.clearRect(0,0,512,320);g.drawImage(PNT.bg,0,0);g.drawImage(PNT.layer,0,0);
  if(PNT.guide!==null){g.save();g.globalAlpha=0.28;const[c,gg]=mk(512,320);piece(gg,256,150,96,PWORDS[PNT.guide],470,()=>0.5);g.drawImage(c,0,0);g.restore();}}
function sprayAt(x,y,start){const L=PNT.layer.getContext('2d'),s=PNT.size;PNT.colors.add(PNT.col);
  if(PNT.tool==='marker'){L.fillStyle=PNT.col;L.beginPath();L.arc(x,y,s*0.32,0,TAU);L.fill();}
  else{const gr=L.createRadialGradient(x,y,0,x,y,s);const c=new THREE.Color(PNT.col),rgb=`${Math.round(c.r*255)},${Math.round(c.g*255)},${Math.round(c.b*255)}`;
    gr.addColorStop(0,`rgba(${rgb},0.55)`);gr.addColorStop(0.45,`rgba(${rgb},0.25)`);gr.addColorStop(1,`rgba(${rgb},0)`);L.fillStyle=gr;L.beginPath();L.arc(x,y,s,0,TAU);L.fill();
    L.fillStyle=`rgba(${rgb},0.8)`;for(let i=0;i<s*0.6;i++){const a=Math.random()*TAU,r=s*(0.6+Math.random()*0.9);L.fillRect(x+Math.cos(a)*r,y+Math.sin(a)*r,1,1);}}
  PNT.still+=1;if(PNT.drips&&PNT.tool==='spray'&&PNT.still>14&&Math.random()<0.25){PNT.still=0;const len=rr(18,60),w=rr(1.5,3.5);const dg=L.createLinearGradient(x,y,x,y+len);dg.addColorStop(0,PNT.col);dg.addColorStop(1,PNT.col+'00');L.fillStyle=dg;L.fillRect(x-w/2,y,w,len);L.beginPath();L.arc(x,y+len-1,w*0.7,0,TAU);L.fillStyle=PNT.col;L.globalAlpha=0.6;L.fill();L.globalAlpha=1;}
  if(!PNT.dirty){PNT.dirty=true;requestAnimationFrame(()=>{PNT.dirty=false;paintRedraw();});}if(AU.c&&Math.random()<0.06)nz(0.12,4200,'highpass',0.12);}
/* open the canvas when spraying at a wall */
function paintStart(){if(PNT.on)return true;const fx=Math.sin(yaw),fz=Math.cos(yaw);let hit=null,hx=0,hz=0;
  for(let t=0.3;t<2.6;t+=0.1){const x=pl.x+fx*t,z=pl.z+fz*t;if(blockedAt(x,z,1.2)){hit=1;hx=x;hz=z;break;}}
  if(!hit){showMsg('ПОДОЙДИ К СТЕНЕ, ЧТОБЫ РИСОВАТЬ',1.8);return true;}const n=wallNormal(hx,hz);if(!n)return true;
  if(pl.spray<=0){showMsg('НЕТ БАЛЛОНЧИКОВ — КУПИ В СТРОЙМАГЕ',2);return true;}
  PNT.on=true;PNT.wall={x:n[2],z:n[3],nx:n[0],nz:n[1]};PNT.layer=PNT.layer||document.createElement('canvas');PNT.layer.width=512;PNT.layer.height=320;PNT.colors.clear();PNT.guide=null;
  paintWallBg();paintRedraw();paintUI();$('#paint').classList.add('on');document.body.classList.add('painting');if(locked)document.exitPointerLock();mouseFire=false;CINE.on=true;
  pl.h=pl.th=Math.atan2(-n[0],-n[1]);const w=PNT.wall,rx=w.nz,rz=-w.nx;camShot({from:[w.x+w.nx*4.2+rx*1.8,1.9,w.z+w.nz*4.2+rz*1.8],to:[w.x+w.nx*3.8+rx*1.3,1.8,w.z+w.nz*3.8+rz*1.3],look:[w.x,1.6,w.z],dur:3,hold:true,fov:52});
  return true;}
function paintEnd(apply){$('#paint').classList.remove('on');document.body.classList.remove('painting');PNT.on=false;CINE.on=false;
  if(!apply){CAMS.shot=null;CAMS.init=false;return;}
  // coverage → respect
  const d=PNT.layer.getContext('2d').getImageData(0,0,512,320).data;let cov=0;for(let i=3;i<d.length;i+=64)if(d[i]>60)cov++;cov/=d.length/64;
  if(cov<0.02){showMsg('СТЕНА ПОЧТИ ЧИСТАЯ — НАРИСУЙ ЧТО-НИБУДЬ',2);CAMS.shot=null;CAMS.init=false;return;}
  const[c,g]=mk(512,320);g.drawImage(PNT.layer,0,0);const tex=new THREE.CanvasTexture(c);sharpTex(tex);
  const mat=new THREE.MeshLambertMaterial({map:tex,transparent:true,opacity:0,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-3});
  const w=PNT.wall,mesh=new THREE.Mesh(new THREE.PlaneGeometry(3.2,2),mat);mesh.position.set(w.x+w.nx*0.05,1.65,w.z+w.nz*0.05);mesh.rotation.y=Math.atan2(w.nx,w.nz);scene.add(mesh);
  const near=tags.some(t=>Math.hypot(t.x-w.x,t.z-w.z)<2.5);const t={x:w.x,z:w.z,mesh,own:1};tags.push(t);if(tags.length>40){const o=tags.shift();scene.remove(o.mesh);}
  pl.spray--;pl.stats.tags++;PNT.anim={t:0,mat};pl.ch.aim=1;
  const pay=near?3:Math.round(10+cov*70+PNT.colors.size*4);pl.money+=pay;
  setTimeout(()=>{pop('+'+pay+' € РЕСПЕКТА','#7dff9a');banner(cov>0.35?'ШЕДЕВР!':cov>0.15?'КУСОК!':'ТЕГ!',PNT.colors.size+' цв. · '+Math.round(cov*100)+'% стены',2);},1300);
  if(typeof m2Tagged==='function'&&STORY.cur==='m2'&&STORY.stage==='tag')setTimeout(()=>m2Tagged(t),1400);
  if(STORY.onPiece)STORY.onPiece(t,cov);
  addCrime(near?0.2:0.6);if(pl.spray<=0)setTimeout(()=>{equip('fists');showMsg('БАЛЛОНЧИКИ КОНЧИЛИСЬ',1.5);},1600);}
V6.upd.push(dt=>{const a=PNT.anim;if(!a)return;a.t+=dt;a.mat.opacity=Math.min(1,a.t/1.3);pl.ch.aim=1;
  if(Math.random()<dt*20){const w=PNT.wall;emit(w.x+w.nx*0.3+rr(-1.2,1.2)*w.nz,rr(1,2.3),w.z+w.nz*0.3-rr(-1.2,1.2)*w.nx,1,PNT.col,0.4,0.4,0.6,0);}
  if(Math.random()<dt*6)nz(0.3,4200,'highpass',0.12);
  if(a.t>1.6){PNT.anim=null;pl.ch.aim=0;if(!CUT.steps){CAMS.shot=null;CAMS.init=false;}if(PNT.after){const f=PNT.after;PNT.after=null;f();}}});
/* spray weapon now paints instead of stamping a random tag */
doTag=function(){paintStart();};
addEventListener('keydown',e=>{if(PNT.on&&e.code==='Escape'){e.stopImmediatePropagation();paintEnd(false);}},true);
