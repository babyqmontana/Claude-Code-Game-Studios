/* ======================= V6 STREET LIFE: crews, sitters, football, player activities ======================= */
const LIFE={spots:[],balls:[],booms:[],tick:0,courts:[]};
function lifeBuild(){
  // crews at tower entrances, with a boombox on the ground
  CITY.entrances.forEach((e,i)=>{if(srand()<0.25)return;const n=3+Math.floor(srand()*3),bx=e.x+Math.sin(e.h)*0.6,bz=e.z+Math.cos(e.h)*0.6;
    const boom=srand()<0.7&&modelGroup('boombox',0.9);if(boom){boom.position.set(bx,groundY(bx,bz)+0.02,bz);boom.rotation.y=e.h+Math.PI;scene.add(boom);LIFE.booms.push({x:bx,z:bz,m:boom});CITY.inter.push({x:bx+Math.sin(e.h)*1.2,z:bz+Math.cos(e.h)*1.2,r:1.2,kind:'dance',h:e.h+Math.PI});}
    for(let k=0;k<n;k++){const a=e.h+Math.PI+(k-(n-1)/2)*0.75,r=1.6+srand()*0.4,x=bx+Math.sin(a)*r,z=bz+Math.cos(a)*r;
      LIFE.spots.push({x,z,h:Math.atan2(bx-x,bz-z),pose:pick(boom&&k%2?['dance','crossed']:['squat','smoke','crossed','lean','phone']),type:srand()<0.6?'gang':'civ'});}});
  // people on benches
  CITY.benches.forEach(b=>{if(srand()<0.45)LIFE.spots.push({x:b.x+Math.sin(b.h)*0.1,z:b.z+Math.cos(b.h)*0.1,h:b.h,pose:'sit',type:'civ',dy:0.12});});
  // courts: ball, pull-up bars, kids
  overlay.filter(o=>o.tex==='court').forEach(o=>{o.g.computeBoundingBox();const bb=o.g.boundingBox,cx=(bb.min.x+bb.max.x)/2,cz=(bb.min.z+bb.max.z)/2;LIFE.courts.push({cx,cz,w:bb.max.x-bb.min.x,d:bb.max.z-bb.min.z});
    const ball=new THREE.Mesh(new THREE.IcosahedronGeometry(0.16,1),LM({map:rtex(32,16,(g)=>{g.fillStyle='#f4f4f4';g.fillRect(0,0,32,16);g.fillStyle='#111';for(let i=0;i<5;i++){g.beginPath();g.arc(3+i*7,i%2?4:11,2.4,0,TAU);g.fill();}})}));
    ball.position.set(cx,0.35,cz);scene.add(ball);LIFE.balls.push({m:ball,x:cx,z:cz,y:0.36,vx:0,vy:0,vz:0,court:{cx,cz,w:bb.max.x-bb.min.x,d:bb.max.z-bb.min.z},last:0});
    for(let k=0;k<2;k++)LIFE.spots.push({x:cx+rnd(-4,4),z:cz+rnd(-3,3),h:0,pose:null,type:'civ',kid:true,ball:LIFE.balls.length-1});
    const px=cx+(bb.max.x-bb.min.x)/2+1.2,pz=cz;const G=[cbx(0.1,2.6,0.1,'#4a4a52',px,1.3,pz-0.7),cbx(0.1,2.6,0.1,'#4a4a52',px,1.3,pz+0.7),colorize(new THREE.CylinderGeometry(0.03,0.03,1.5,6).rotateX(Math.PI/2).translate(px,2.5,pz),'#9a9aa4')];
    scene.add(new THREE.Mesh(mergeGeos(G),VCMAT));CITY.inter.push({x:px,z:pz,r:1.0,kind:'pullup',h:Math.PI/2});});}
V6.build.push(lifeBuild);
/* spawn/despawn hang-out peds around the player */
V6.upd.push(dt=>{if(dt>0){LIFE.psp=lerp(LIFE.psp||0,Math.hypot(pl.x-(LIFE.px??pl.x),pl.z-(LIFE.pz??pl.z))/dt,0.3);}LIFE.px=pl.x;LIFE.pz=pl.z;LIFE.tick-=dt;if(LIFE.tick<=0){LIFE.tick=0.5;const ox=pl.inCar?pl.inCar.x:pl.x,oz=pl.inCar?pl.inCar.z:pl.z;
    for(const s of LIFE.spots){if(s.active&&(!peds.includes(s.active)||s.active.state==='dead')){s.active=null;s.cool=time+40;}s.d=Math.hypot(s.x-ox,s.z-oz);
      if(s.active&&s.d>60&&s.active.state==='idle'){const i=peds.indexOf(s.active);if(i>=0)removePed(i);s.active=null;}}
    const cand=LIFE.spots.filter(s=>!s.active&&!(s.cool&&time<s.cool)&&s.d<48&&s.d>16).sort((a,b)=>a.d-b.d);
    for(const s of cand){if(peds.length>=44)break;
      const p=spawnPed(s.type,s.x,s.z,'x',s.z,1);p.x=s.x;p.z=s.z;p.h=p.th=s.h;p.hang=s;s.active=p;setWeapon(p.ch,null);
      if(s.kid){p.state='ball';p.spd=3.2;p.ball=LIFE.balls[s.ball];}else{p.state='idle';p.idleT=1e9;p.ch.pose=s.pose;}if(p.ch.boom){p.ch.boom=false;}}}
  // hangers who get angry pull their weapon out
  for(const p of peds)if(p.hang&&p.state==='attack'&&!p.wset){p.wset=true;p.ch.pose=null;setWeapon(p.ch,p.armed);}
  // seated peds sit slightly higher (bench seat)
  for(const p of peds)if(p.hang&&p.hang.dy&&p.state==='idle'){p.ch.root.position.y=p.y+p.hang.dy;}
  // balls
  for(const b of LIFE.balls){b.vy-=14*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;b.z+=b.vz*dt;const g=groundY(b.x,b.z)+0.16;if(b.y<g){b.y=g;b.vy=Math.abs(b.vy)>1.5?-b.vy*0.5:0;b.vx*=0.985;b.vz*=0.985;}
    b.vx*=Math.pow(0.6,dt);b.vz*=Math.pow(0.6,dt);if(blockedAt(b.x,b.z,b.y)){b.x-=b.vx*dt*1.5;b.z-=b.vz*dt*1.5;b.vx*=-0.6;b.vz*=-0.6;}
    const sp=Math.hypot(b.vx,b.vz);b.m.position.set(b.x,b.y,b.z);b.m.rotation.x+=b.vz*dt*6;b.m.rotation.z-=b.vx*dt*6;
    if(!pl.inCar&&!pl.act){const dx=b.x-pl.x,dz=b.z-pl.z,d=Math.hypot(dx,dz);if(d<0.55&&time-b.last>0.35){const ps=LIFE.psp||3;b.last=time;const f=Math.max(4,ps*1.6+3);b.vx=Math.sin(pl.h)*f+dx;b.vz=Math.cos(pl.h)*f+dz;b.vy=ps>4?3.5:1.5;pl.ch.kick=1;sfx.thud(0.6);}}
    for(const c of cars)if(Math.abs(c.x-b.x)<3&&Math.abs(c.z-b.z)<3){const[lx,lz]=carLocal(c,b.x,b.z);if(Math.abs(lx)<c.T.w/2+0.15&&Math.abs(lz)<c.T.l/2+0.15){b.vx=Math.sin(c.h)*(c.speed+2)+rr(-2,2);b.vz=Math.cos(c.h)*(c.speed+2)+rr(-2,2);b.vy=3;}}
    if(Math.hypot(b.x-b.court.cx,b.z-b.court.cz)>45){b.x=b.court.cx;b.z=b.court.cz;b.vx=b.vz=0;}}});
/* kids chase and kick the ball */
V6.ped=function(p,dt,d){if(p.state!=='ball')return 0;const b=p.ball;if(!b){p.state='idle';p.idleT=1e9;return 0;}
  const dx=b.x-p.x,dz=b.z-p.z,dd=Math.hypot(dx,dz);if(dd<0.6&&time-b.last>0.6){const c=b.court,tx=c.cx+rnd(-c.w/2,c.w/2),tz=c.cz+rnd(-c.d/2,c.d/2),L=Math.hypot(tx-b.x,tz-b.z)||1,f=rr(4,8);
    b.vx=(tx-b.x)/L*f;b.vz=(tz-b.z)/L*f;b.vy=rr(0.5,3);b.last=time;p.ch.kick=1;if(d<25)sfx.thud(0.4);return 0;}
  if(dd>0.5){const spd=dd>3?3.6:1.8;moveFree(p,dx,dz,spd,dt);return spd;}return 0;};
/* boombox music near crews */
V6.music=()=>{if(state!=='play')return 0;let best=0;for(const b of LIFE.booms){const d=Math.hypot(b.x-pl.x,b.z-pl.z);if(d<16)best=Math.max(best,(1-d/16)*0.9);}return best;};
/* player activities: sit, drink, pull-ups, dance — the camera frames each one */
V6.interact.push(()=>{if(pl.act)return null;let best=null,bd=9;for(const it of CITY.inter){const d=Math.hypot(it.x-pl.x,it.z-pl.z);if(d<it.r&&d<bd){bd=d;best=it;}}
  if(!best)return null;const L={bench:'СЕСТЬ',vend:'ГАЗИРОВКА · 2 €',pullup:'ПОДТЯГИВАТЬСЯ',dance:'ТАНЦЕВАТЬ'}[best.kind];return{label:L,run:()=>startAct(best)};});
function startAct(it){if(it.kind==='vend'){if(pl.money<2){showMsg('НУЖНО 2 €',1.4);return;}pl.money-=2;sfx.cash();tone(180,0.25,'square',0.12,90);}
  setWeapon(pl.ch,null);pl.act={k:it.kind,it,t:0,reps:0};pl.aimT=0;pl.ch.aim=0;
  const pose={bench:'sit',vend:'drink',pullup:'pullup',dance:'dance'}[it.kind];pl.ch.pose=null;pl.act.pose=pose;
  const sx=it.sx??it.x,sz=it.sz??it.z;pl.act.from={x:pl.x,z:pl.z};pl.act.to={x:sx,z:sz};pl.h=pl.th=it.h;
  const side=Math.random()<0.5?1:-1,h=it.h,fx=Math.sin(h),fz=Math.cos(h),rx=Math.cos(h),rz=-Math.sin(h);
  const shots={bench:[[sx+fx*2.6+rx*side*1.6,1.2,sz+fz*2.6+rz*side*1.6],[sx,0.9,sz]],vend:[[sx+fx*1.4+rx*side*1.2,1.7,sz+fz*1.4+rz*side*1.2],[sx,1.5,sz]],pullup:[[sx+fx*3.2+rx*1.5,1.5,sz+fz*3.2+rz*1.5],[sx,1.9,sz]],dance:[[sx+fx*3.5+rx*side*2,1.6,sz+fz*3.5+rz*side*2],[sx,1.1,sz]]}[it.kind];
  camShot({from:shots[0],to:[shots[0][0]+rx*side*0.6,shots[0][1]+0.15,shots[0][2]+rz*side*0.6],look:shots[1],dur:6,hold:true,fov:52});}
function endAct(){const a=pl.act;if(!a)return;pl.ch.pose=null;pl.act=null;CAMS.shot=null;CAMS.init=false;pl.ch.root.position.y=pl.y;setWeapon(pl.ch,pl.cur==='fists'?null:pl.cur);if(a.k==='bench'){pl.x=a.it.x;pl.z=a.it.z;}}
V6.player=function(dt,inp){const a=pl.act;if(!a)return false;a.t+=dt;
  const k=Math.min(1,a.t/0.35);pl.x=lerp(a.from.x,a.to.x,k);pl.z=lerp(a.from.z,a.to.z,k);if(k>=1)pl.ch.pose=a.pose;
  const dy=a.k==='bench'?0.12:a.k==='pullup'?0.02:0;pl.y=groundY(pl.x,pl.z);pl.ch.root.position.set(pl.x,pl.y+dy*k,pl.z);pl.ch.root.rotation.set(0,pl.h,0);animChar(pl.ch,dt,0,null);
  if(a.k==='vend'&&a.t>3.2){pl.hp=Math.min(100,pl.hp+15);pop('ОЗ +15','#ff8a9a');endAct();return true;}
  if(a.k==='pullup'){const r=Math.floor((a.t-0.4)*2.2/TAU*2);if(r>a.reps){a.reps=r;pop('×'+r,'#ffe36b');if(r%10===0){pl.money+=5;pop('+5 € РЕСПЕКТ','#7dff9a');}}}
  if(a.k==='dance'&&a.t>0.5&&Math.floor(a.t/6)>Math.floor((a.t-dt)/6)){pl.money+=3;pop('+3 € · ВАЙБ','#7dff9a');peds.forEach(p=>{if(p.hang&&Math.hypot(p.x-pl.x,p.z-pl.z)<5&&p.state==='idle'){p.ch.talk=1.5;}});}
  if(a.t>0.5&&(Math.hypot(inp.mx,inp.mz)>0.3||inp.action||inp.jump))endAct();
  if(pl.hurtT>0)endAct();
  return true;};
