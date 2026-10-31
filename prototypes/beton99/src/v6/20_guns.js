/* ======================= V6 GUN FEEL ======================= */
const GUN={light:null,lt:0,casings:[],ci:0,decals:[],di:0,pools:[],pi:0,matHole:null,matBlood:null,matPool:null,lastKillCam:-99};
function gunInit(){
  GUN.light=new THREE.PointLight(0xffc070,0,9,2);scene.add(GUN.light);
  const cg=new THREE.CylinderGeometry(0.012,0.012,0.045,5).rotateZ(Math.PI/2),cm=LM({color:0xd9a441,emissive:0x2a1800});
  for(let i=0;i<24;i++){const m=new THREE.Mesh(cg,cm);m.visible=false;scene.add(m);GUN.casings.push({m,vx:0,vy:0,vz:0,l:0,rx:0,ry:0});}
  const blob=(n,col,soft)=>{const[c,g]=mk(64,64);g.fillStyle=col;for(let i=0;i<n;i++){const a=Math.random()*TAU,r=Math.random()*(i?20:0),s=i?rr(3,9):18;g.globalAlpha=soft?rr(0.5,0.9):1;g.beginPath();g.arc(32+Math.cos(a)*r,32+Math.sin(a)*r,s,0,TAU);g.fill();}return new THREE.CanvasTexture(c);};
  const dm=t=>new THREE.MeshLambertMaterial({map:t,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-3,polygonOffsetUnits:-3});
  const[hc,hg]=mk(32,32);const gr=hg.createRadialGradient(16,16,1,16,16,15);gr.addColorStop(0,'rgba(10,8,8,1)');gr.addColorStop(0.35,'rgba(30,26,24,.9)');gr.addColorStop(0.6,'rgba(120,110,100,.35)');gr.addColorStop(1,'rgba(0,0,0,0)');hg.fillStyle=gr;hg.fillRect(0,0,32,32);
  GUN.matHole=dm(new THREE.CanvasTexture(hc));GUN.matBlood=dm(blob(12,'#5a0008',true));GUN.matPool=dm(blob(5,'#3d0006',false));
  const pg=new THREE.PlaneGeometry(1,1);
  for(let i=0;i<60;i++){const m=new THREE.Mesh(pg,GUN.matHole);m.visible=false;scene.add(m);GUN.decals.push(m);}
  for(let i=0;i<24;i++){const m=new THREE.Mesh(pg,GUN.matPool);m.rotation.x=-Math.PI/2;m.visible=false;scene.add(m);GUN.pools.push({m,s:0,max:0});}
  const BN=300;GUN.bn=BN;GUN.bpos=new Float32Array(BN*3).fill(-999);GUN.bv=[];for(let i=0;i<BN;i++)GUN.bv.push({l:0,vx:0,vy:0,vz:0});GUN.bi=0;
  const bg=new THREE.BufferGeometry();bg.setAttribute('position',new THREE.BufferAttribute(GUN.bpos,3));GUN.bgeo=bg;
  const bp=new THREE.Points(bg,new THREE.PointsMaterial({size:0.065,color:0x8a0010}));bp.frustumCulled=false;scene.add(bp);}
V6.build.push(gunInit);
function blood(x,y,z,n,dx,dz,force){for(let k=0;k<n;k++){const i=GUN.bi;GUN.bi=(GUN.bi+1)%GUN.bn;const v=GUN.bv[i];v.l=rr(0.4,0.9);
  v.vx=dx*rr(0.5,1)*force+rr(-0.8,0.8);v.vz=dz*rr(0.5,1)*force+rr(-0.8,0.8);v.vy=rr(0.2,2.2);GUN.bpos[i*3]=x+rr(-0.08,0.08);GUN.bpos[i*3+1]=y+rr(-0.1,0.1);GUN.bpos[i*3+2]=z+rr(-0.08,0.08);}}
function wallDecal(x,y,z,nx,nz,size,mat){const m=GUN.decals[GUN.di];GUN.di=(GUN.di+1)%GUN.decals.length;m.material=mat;m.position.set(x+nx*0.03,y,z+nz*0.03);m.rotation.set(0,Math.atan2(nx,nz),Math.random()*TAU);m.scale.set(size,size,1);m.visible=true;}
function groundDecal(x,z,size,grow){const p=GUN.pools[GUN.pi];GUN.pi=(GUN.pi+1)%GUN.pools.length;p.m.position.set(x,groundY(x,z)+0.025+GUN.pi*0.0004,z);p.m.rotation.z=Math.random()*TAU;p.s=grow?0.2:size;p.max=size;p.m.scale.set(p.s,p.s,1);p.m.visible=true;p.m.material=grow?GUN.matPool:GUN.matBlood;}
function wallNormal(x,z){const c=blockedAt(x,z,1.2);if(!c)return null;const dl=x-c.x0,dr=c.x1-x,dt_=z-c.z0,db=c.z1-z,m=Math.min(dl,dr,dt_,db);
  return m===dl?[-1,0,c.x0,z]:m===dr?[1,0,c.x1,z]:m===dt_?[0,-1,x,c.z0]:[0,1,x,c.z1];}
function ejectCasing(ch){if(!ch.wmesh)return;const c=GUN.casings[GUN.ci];GUN.ci=(GUN.ci+1)%GUN.casings.length;TMPV.set(0,0.06,0.05);ch.wmesh.localToWorld(TMPV);
  c.m.position.copy(TMPV);const h=pl.h,rx=-Math.cos(h),rz=Math.sin(h);c.vx=rx*rr(1.6,2.6)+rr(-0.4,0.4);c.vz=rz*rr(1.6,2.6)+rr(-0.4,0.4);c.vy=rr(2,3.2);c.l=2.2;c.m.visible=true;c.rx=rr(-20,20);c.ry=rr(-20,20);}
function nzAt(dur,f,type,vol,t){const c=AU.c;const s=c.createBufferSource();s.buffer=AU.noise;const fl=c.createBiquadFilter();fl.type=type;fl.frequency.value=f;const g=c.createGain();
  g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(0.001,t+dur);s.connect(fl);fl.connect(g);g.connect(AU.fx);s.start(t,Math.random()*0.5);s.stop(t+dur+0.05);}
function gunSound(w){if(!AU.c)return;const t=AU.c.currentTime,v=w.pel?1.2:w.two?0.75:1;
  tone(w.pel?55:72,w.pel?0.35:0.18,'sine',0.8*v,28);nz(w.pel?0.09:0.05,6000,'highpass',0.35*v);
  for(const[dl,vol]of[[0.11,0.2],[0.25,0.11],[0.44,0.05]])nzAt(0.24,850,'lowpass',vol*v,t+dl);}
V6.fire.push((kind,w,r,mz,ah)=>{
  if(kind==='shot'){GUN.light.position.copy(mz);GUN.light.intensity=w.pel?5:3;GUN.lt=0.06;
    CAMS.kick+=w.pel?0.075:w.two?0.018:0.045;CAMS.kickX+=rr(-1,1)*(w.two?0.012:0.008);CAMS.fovP+=w.pel?6:w.two?1.2:2.5;
    shake=Math.max(shake,w.pel?0.22:w.two?0.05:0.09);pl.ch.recoil=1;ejectCasing(pl.ch);gunSound(w);
    if(isTouch&&navigator.vibrate)try{navigator.vibrate(w.pel?40:w.two?8:18);}catch(e){}}
  else if(kind==='ray'){if(r.wall){const n=wallNormal(r.x,r.z);const y=1.3+rr(-0.25,0.35);
      if(n){wallDecal(n[2],y,n[3],n[0],n[1],rr(0.12,0.18),GUN.matHole);emit(n[2]+n[0]*0.1,y,n[3]+n[1]*0.1,6,'#d8d0c0',1.6,1.8,0.45,9);emit(n[2],y,n[3],3,'#ffd27a',3.5,2,0.12,4);
        if(Math.random()<0.4)tone(rr(1800,3200),0.05,'triangle',0.05,900);}}
    else if(r.car){emit(r.x,1,r.z,6,'#ffe9a0',4,2.5,0.18,6);tone(rr(900,1400),0.09,'square',0.06,500);}}
  else if(kind==='melee'&&r){CAMS.kick+=0.02;slowmo(0.35,0.05);}});
V6.hurt.push((p,dmg,fromPlayer,dir)=>{
  if(fromPlayer){hitmark(false);tone(2200,0.03,'square',0.05);}
  const dx=dir?dir[0]:rr(-1,1),dz=dir?dir[1]:rr(-1,1);
  blood(p.x,p.y+rr(1.0,1.4),p.z,26,dx,dz,4);
  if(Math.random()<0.6)groundDecal(p.x+dx*rr(0.6,1.6),p.z+dz*rr(0.6,1.6),rr(0.4,0.8),false);
  const n=wallNormal(p.x+dx*1.3,p.z+dz*1.3);if(n&&Math.random()<0.7)wallDecal(n[2],rr(0.8,1.6),n[3],n[0],n[1],rr(0.5,0.9),GUN.matBlood);
  if(p.ch&&p.ch.mat&&p.ch.mat.emissive){p.ch.mat.emissive.setRGB(0.55,0.05,0.05);p.ch.hitT=0.12;}
  p.ch.flinch=1;});
V6.kill.push((p,fromPlayer)=>{groundDecal(p.x,p.z,rr(1.1,1.6),true);
  if(!fromPlayer)return;hitmark(true);tone(140,0.25,'sine',0.25,60);
  const others=peds.some(q=>q!==p&&q.state==='attack'&&Math.hypot(q.x-pl.x,q.z-pl.z)<25);
  if(!pl.inCar&&time-GUN.lastKillCam>8&&(!others||Math.random()<0.25)){GUN.lastKillCam=time;slowmo(0.22,0.9);
    const d=Math.hypot(p.x-pl.x,p.z-pl.z)||1,ux=(p.x-pl.x)/d,uz=(p.z-pl.z)/d,s=Math.random()<0.5?1:-1;
    const P0=[p.x-uz*s*3.2-ux*1.2,p.y+1.4,p.z+ux*s*3.2-uz*1.2];
    camShot({from:P0,to:[P0[0]+ux*0.6,P0[1]-0.3,P0[2]+uz*0.6],look:()=>[p.x,p.y+0.8,p.z],dur:1.1,fov:46});}
  else slowmo(0.5,0.12);});
/* per-frame: light, casings, decals growing, hit flashes, weapon recoil */
V6.upd.push(dt=>{for(let i=0;i<GUN.bn;i++){const v=GUN.bv[i];if(v.l<=0)continue;v.l-=dt;v.vy-=12*dt;const j=i*3;GUN.bpos[j]+=v.vx*dt;GUN.bpos[j+1]+=v.vy*dt;GUN.bpos[j+2]+=v.vz*dt;if(GUN.bpos[j+1]<0.17){GUN.bpos[j+1]=0.17;v.vx=v.vz=v.vy=0;}if(v.l<=0)GUN.bpos[j+1]=-999;}GUN.bgeo.attributes.position.needsUpdate=true;
  if(GUN.lt>0){GUN.lt-=dt;if(GUN.lt<=0)GUN.light.intensity=0;}
  for(const c of GUN.casings){if(c.l<=0)continue;c.l-=dt;c.vy-=14*dt;c.m.position.x+=c.vx*dt;c.m.position.y+=c.vy*dt;c.m.position.z+=c.vz*dt;c.m.rotation.x+=c.rx*dt;c.m.rotation.y+=c.ry*dt;
    const g=groundY(c.m.position.x,c.m.position.z)+0.02;if(c.m.position.y<g){c.m.position.y=g;if(Math.abs(c.vy)>1.2&&AU.c&&Math.hypot(c.m.position.x-pl.x,c.m.position.z-pl.z)<6)tone(rr(3500,5200),0.03,'triangle',0.035);c.vy*=-0.35;c.vx*=0.5;c.vz*=0.5;c.rx*=0.5;c.ry*=0.5;}
    if(c.l<=0)c.m.visible=false;}
  for(const p of GUN.pools){if(p.s<p.max){p.s=Math.min(p.max,p.s+dt*0.35);p.m.scale.set(p.s,p.s,1);}}
  const all=[pl,...peds];for(const q of all){const ch=q.ch;if(!ch)continue;
    if(ch.hitT>0){ch.hitT-=dt;if(ch.hitT<=0&&ch.mat&&ch.mat.emissive)ch.mat.emissive.setRGB(0,0,0);}
    if(ch.recoil>0&&ch.wmesh){ch.recoil=Math.max(0,ch.recoil-dt*9);ch.wmesh.position.z=-0.06*ch.recoil;ch.wmesh.rotation.y=-0.35*ch.recoil;}}});
