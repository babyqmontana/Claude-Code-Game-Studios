/* ======================= V6 CUTSCENES + STORY MISSIONS ======================= */
V6CSS.textContent+=`body.cine #hud,body.cine #touch,body.cine #pausebtn,body.cine #xh,body.cine #obj{display:none!important}`;
const CUT={steps:null,i:0,t:0,onEnd:null};
function cutscene(steps,onEnd){CINE.on=true;document.body.classList.add('cine');$('#lbox').classList.add('on');$('#skip').classList.add('on');if(locked)document.exitPointerLock();
  pl.aimT=0;mouseFire=false;CUT.steps=steps;CUT.i=-1;CUT.onEnd=onEnd;cutNext();}
function cutNext(){CUT.i++;CUT.t=0;CUT.t0=performance.now();const s=CUT.steps[CUT.i];if(!s){cutEnd();return;}
  if(s.do)s.do();if(s.cam)camShot(Object.assign({hold:true,dur:s.dur||3},s.cam));
  if(s.say){say(s.say[0],s.say[1]);if(s.say[2]&&s.say[2].ch)s.say[2].ch.talk=s.dur||3;}else $('#sub').classList.remove('on');}
function cutEnd(){const f=CUT.onEnd;CUT.steps=null;CINE.on=false;document.body.classList.remove('cine');$('#lbox').classList.remove('on');$('#skip').classList.remove('on');$('#sub').classList.remove('on');
  CAMS.shot=null;CAMS.init=false;yaw=pl.h;pitch=0.25;if(f)f();}
function cutSkip(){if(!CUT.steps)return;for(let i=CUT.i+1;i<CUT.steps.length;i++){const s=CUT.steps[i];if(s.do)s.do();}cutEnd();}
$('#skip').style.pointerEvents='auto';$('#skip').addEventListener('pointerdown',e=>{e.stopPropagation();cutSkip();});
addEventListener('keydown',e=>{if(CUT.steps&&(e.code==='Space'||e.code==='Enter'))cutSkip();});
V6.upd.push(()=>{if(!CUT.steps)return;const s=CUT.steps[CUT.i];CUT.t=(performance.now()-CUT.t0)/1000;if(s&&CUT.t>=(s.dur||3))cutNext();});
{const op=openPause;openPause=function(){if(CUT.steps){cutSkip();return;}op();};}
/* actors: peds that stand still, face someone and talk */
function actor(app,x,z,h){const p=spawnPed('actor',x,z,'x',z,1);scene.remove(p.ch.root);disposeChar(p.ch);p.ch=makeChar(Object.assign({},DEFAULT_APP,app));scene.add(p.ch.root);
  p.x=x;p.z=z;p.h=p.th=h;p.state='actor';p.hp=400;setWeapon(p.ch,null);return p;}
function dropActor(p){const i=peds.indexOf(p);if(i>=0)removePed(i);}
const _vped=V6.ped;V6.ped=function(p,dt,d){if(p.state==='actor'){if(p.look){p.th=Math.atan2(p.look.x-p.x,p.look.z-p.z);}return 0;}return _vped(p,dt,d);};
const at=(o,dx,dy,dz)=>[o.x+(dx||0),(o.y||0)+(dy||0),o.z+(dz||0)];
/* shot helpers: over-the-shoulder from a onto b, two-shot from the side */
function ots(a,b,side,dist){const dx=b.x-a.x,dz=b.z-a.z,L=Math.hypot(dx,dz)||1,ux=dx/L,uz=dz/L,rx=uz,rz=-ux;side=side||1;dist=dist||1.4;
  return{from:[a.x-ux*dist+rx*0.55*side,1.72,a.z-uz*dist+rz*0.55*side],to:[a.x-ux*(dist-0.25)+rx*0.5*side,1.7,a.z-uz*(dist-0.25)+rz*0.5*side],look:[b.x,1.55,b.z],fov:44};}
function twoShot(a,b,dist,h){const mx=(a.x+b.x)/2,mz=(a.z+b.z)/2,dx=b.x-a.x,dz=b.z-a.z,L=Math.hypot(dx,dz)||1,rx=dz/L,rz=-dx/L;dist=dist||4;
  return{from:[mx+rx*dist,h||1.6,mz+rz*dist],to:[mx+rx*(dist-0.6),(h||1.6)-0.05,mz+rz*(dist-0.6)],look:[mx,1.3,mz],fov:50};}
/* world marker: coloured beam + floating letter */
function markerMesh(col,letter){const G=new THREE.Group();const b=new THREE.Mesh(new THREE.CylinderGeometry(0.9,0.9,40,10,1,true),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:0.28,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide,fog:false}));b.position.y=20;G.add(b);
  const t=rtex(64,64,(g)=>{g.fillStyle=new THREE.Color(col).getStyle();g.beginPath();g.arc(32,32,28,0,TAU);g.fill();g.lineWidth=4;g.strokeStyle='#000';g.stroke();g.fillStyle='#000';g.font="900 36px 'Exo 2',sans-serif";g.textAlign='center';g.textBaseline='middle';g.fillText(letter||'!',32,34);});
  const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,depthTest:false}));s.scale.set(1,1,1);s.position.y=2.6;G.add(s);G.userData.s=s;
  const r=new THREE.Mesh(RINGG,new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:0.7,depthWrite:false}));r.position.y=0.2;r.scale.setScalar(1.6);G.add(r);scene.add(G);return G;}
const STORY={cur:null,mk:null,blips:[],stage:'',data:{}};
V6.blips=()=>{const B=[];if(STORY.cur&&STORY.target)B.push({x:STORY.target.x,z:STORY.target.z,col:'#ffd84d',r:4});
  if(!STORY.cur&&STORY.avail)B.push({x:STORY.avail.x,z:STORY.avail.z,col:'#ffd84d',r:4,letter:STORY.avail.letter});
  for(const p of STORY.foes||[])if(p.state!=='dead')B.push({x:p.x,z:p.z,col:'#ff3030',r:2});return B;};
function setTarget(x,z,col){STORY.target={x,z};if(STORY.mk)scene.remove(STORY.mk);STORY.mk=markerMesh(col||0xffd84d,'');STORY.mk.position.set(x,groundY(x,z),z);}
function clearTarget(){STORY.target=null;if(STORY.mk){scene.remove(STORY.mk);STORY.mk=null;}}
function missionPassed(title,reward){pl.money+=reward;pl.stats.missions++;sfx.cash();banner('МИССИЯ ПРОЙДЕНА',title+' · +'+reward+' €',3.5);
  [523,659,784,1046].forEach((f,i)=>tone(f,0.35,'square',0.08,0,AU.c&&AU.c.currentTime+i*0.12));$('#obj').classList.remove('on');STORY.cur=null;clearTarget();STORY.foes=[];refreshOffers();try{store.set(SAVEKEY,makeSave());}catch(e){}}
function missionFailed(why){banner('МИССИЯ ПРОВАЛЕНА',why,3);$('#obj').classList.remove('on');for(const a of STORY.actors||[])dropActor(a);STORY.actors=[];STORY.cur=null;clearTarget();
  for(const c of STORY.cars||[]){if(!c.dead&&c!==pl.inCar){const i=cars.indexOf(c);if(i>=0)removeCar(i);}}STORY.cars=[];STORY.foes=[];refreshOffers();}
/* offers: where the next mission starts */
const NPC={momo:{sex:'m',skin:'#5a3a26',hat:'cap',hatCol:'#111111',top:'track',topCol:'#1a1a1a',bottom:'jog',botCol:'#222222',shoe:'#efefef',chain:1,print:0},
  nadia:{sex:'f',skin:'#c89a7a',hat:'bonnet',hatCol:'#e0701a',top:'hoodie',topCol:'#6a2a9a',bottom:'baggy',botCol:'#2a4a7a',shoe:'#efefef',print:0},
  jamel:{sex:'m',skin:'#8a5a3a',hat:'none',top:'teelong',topCol:'#2a2a2a',longCol:'#6a6a6a',bottom:'baggy',botCol:'#151515',shoe:'#c41e1e',print:0}};
function freeNear(x,z){for(let r=0;r<12;r+=0.7)for(let a=0;a<8;a++){const px=x+Math.cos(a*0.785)*r,pz=z+Math.sin(a*0.785)*r;if(!blockedAt(px,pz)&&!isRoad(px,pz))return{x:px,z:pz};}return{x,z};}
function refreshOffers(){const s=pl.story||(pl.story={});STORY.avail=null;if(STORY.offerMk){scene.remove(STORY.offerMk);STORY.offerMk=null;}
  if(!s.m1)STORY.avail=Object.assign({letter:'M',start:startM1},STORY.spots.m1);else if(!s.m2)STORY.avail=Object.assign({letter:'N',start:startM2},STORY.spots.m2);
  if(STORY.avail){STORY.offerMk=markerMesh(0xffd84d,STORY.avail.letter);STORY.offerMk.position.set(STORY.avail.x,groundY(STORY.avail.x,STORY.avail.z),STORY.avail.z);}}
V6.build.push(()=>{const sp={};sp.m1=freeNear(HOME.x+3.2,HOME.z+1.6);
  const cb=blocks.filter(b=>b.type==='shops'&&b.i>=3&&b.j<3).sort((a,b)=>(b.i-a.i))[0]||blocks.find(b=>b.type==='shops');sp.m2=freeNear(cb.x0+1.2,(cb.z0+cb.z1)/2);
  const park=blocks.filter(b=>b.type==='parc').sort((a,b)=>(b.i+b.j)-(a.i+a.j))[0]||blocks[0];sp.park={x:(park.x0+park.x1)/2+4.5,z:(park.z0+park.z1)/2};
  const pk=blocks.filter(b=>b.type==='parking').sort((a,b)=>(b.i+b.j)-(a.i+a.j))[0]||blocks[blocks.length-1];sp.drop={x:(pk.x0+pk.x1)/2,z:(pk.z0+pk.z1)/2-6};
  const gare=BLD.filter(b=>(b.kind==='shop'||b.kind==='hlm')&&b.cx>3*P&&b.cz>3*P);sp.walls=[];const used=new Set();
  for(const b of gare.sort(()=>srand()-0.5)){if(sp.walls.length>=3)break;const f=faceOf(b,b.front),key=Math.round(b.cx/P)+','+Math.round(b.cz/P);if(used.has(key))continue;used.add(key);
    const t=rnd(-f.len/4,f.len/4);sp.walls.push({x:f.cx+f.tx*t,z:f.cz+f.tz*t,nx:f.nx,nz:f.nz});}
  STORY.spots=sp;});
V6.upd.push(dt=>{if(STORY.offerMk){STORY.offerMk.userData.s.position.y=2.6+Math.sin(time*2.5)*0.2;}if(STORY.mk){STORY.mk.userData.s.position.y=2.6+Math.sin(time*2.5)*0.2;}
  if(!STORY.cur&&STORY.avail&&!pl.inCar&&!CUT.steps&&wanted===0&&Math.hypot(STORY.avail.x-pl.x,STORY.avail.z-pl.z)<2.2){const f=STORY.avail.start;scene.remove(STORY.offerMk);STORY.offerMk=null;STORY.avail=null;f();}
  if(STORY.cur&&STORY.tick)STORY.tick(dt);});
/* ---------- MISSION 1: «ПОСЫЛКА» ---------- */
function startM1(){const S=STORY.spots,mp=S.m1;STORY.cur='m1';STORY.actors=[];STORY.cars=[];STORY.foes=[];wanted=0;crime=0;
  const momo=actor(NPC.momo,mp.x,mp.z,0);STORY.actors.push(momo);pl.x=mp.x;pl.z=mp.z+2.2;pl.h=pl.th=Math.PI;momo.h=momo.th=0;momo.look=pl;momo.ch.pose='crossed';
  const cx=HOME.x+7,cz=Math.ceil(HOME.z/P)*P-3.2;const car=makeCar('berline','#2f5a3a',cx,cz,Math.PI/2,'parked');car.keep=true;car.y=0.15;placeCar(car);STORY.cars.push(car);STORY.data.car=car;
  const P_={x:pl.x,z:pl.z,y:0},M={x:momo.x,z:momo.z,y:0};
  cutscene([
    {dur:3.4,cam:{from:[mp.x-14,16,mp.z+22],to:[mp.x-7,5,mp.z+10],look:[mp.x,3,mp.z],fov:55}},
    {dur:3.2,cam:ots(P_,M,1),say:['МОМО','Йо, малой! Наконец-то. Я тебя полчаса жду.',momo],do:()=>{momo.ch.pose=null;}},
    {dur:2.6,cam:ots(M,P_,-1),say:[pl.name,'Я был тут, Момо. Что за пожар?',pl]},
    {dur:3.8,cam:{from:at(M,0.9,1.65,2.0),to:at(M,0.6,1.6,1.6),look:at(M,0,1.45,0),fov:40},say:['МОМО','Видишь сумку? Её надо отвезти Джамелю, на стоянку у вокзала. Быстро и тихо.',momo]},
    {dur:3.4,cam:{from:[cx-6,2.2,cz+5],to:[cx-3,1.6,cz+4],look:[cx,0.9,cz],fov:50},say:['МОМО','Возьми мою тачку. Одна царапина — и платишь ты.',momo]},
    {dur:2.4,cam:twoShot(M,P_,4.2),say:[pl.name,'Понял. Без проблем.',pl]},
    {dur:1.6,cam:twoShot(M,P_,5.5,2.2),say:['МОМО','И не гони, слышишь? Хвоста нам не надо.',momo],do:()=>{momo.ch.pose='crossed';}}],
    ()=>{STORY.stage='car';objective('Сядь в <em>тачку Момо</em>');setTarget(car.x,car.z);STORY.tick=m1Tick;});}
function m1Tick(dt){const S=STORY.spots,car=STORY.data.car,st=STORY.stage;if(pl.dead){missionFailed('Ты в больнице. Сумка пропала.');return;}
  if(st==='car'){STORY.target={x:car.x,z:car.z};if(STORY.mk)STORY.mk.position.set(car.x,0,car.z);
    if(pl.inCar===car){STORY.stage='drive';objective('Отвези сумку <em>Джамелю</em> на стоянку у вокзала');setTarget(S.drop.x,S.drop.z);banner('BÉTON FM','Не гони — хвоста не надо',1.6);}}
  else if(st==='drive'){if(car.dead||car.hp<=0){missionFailed('Тачка Момо разбита. Сумка сгорела.');return;}
    if(pl.inCar!==car&&!pl.anim){if(!STORY.data.warn){STORY.data.warn=1;objective('Вернись в <em>тачку Момо</em>');}STORY.target={x:car.x,z:car.z};}else if(STORY.data.warn){STORY.data.warn=0;objective('Отвези сумку <em>Джамелю</em> на стоянку у вокзала');STORY.target=S.drop;}
    const d=Math.hypot(S.drop.x-car.x,S.drop.z-car.z);if(!STORY.data.jamel&&d<90){const j=actor(NPC.jamel,S.drop.x+2,S.drop.z+3,Math.PI);STORY.actors.push(j);STORY.data.jamel=j;j.ch.pose='smoke';
      for(const k of[-1,1]){const g=actor({sex:'m',top:'hoodie',topCol:k>0?'#2a2a2a':'#5a5a60',hat:'bonnet',hatCol:'#111',bottom:'jog',botCol:'#222'},S.drop.x+2+k*1.4,S.drop.z+4,Math.PI);g.ch.pose='crossed';STORY.actors.push(g);}}
    if(pl.inCar===car&&d<7&&Math.abs(car.speed)<4)m1Arrive();}
  else if(st==='fight'){const alive=STORY.foes.filter(p=>p.state!=='dead'&&peds.includes(p));objective('Разберись с <em>«Хищниками»</em> · осталось '+alive.length);
    if(!alive.length){STORY.stage='done';setTimeout(m1Outro,900);}}}
function m1Arrive(){const S=STORY.spots,j=STORY.data.jamel,car=STORY.data.car;STORY.stage='talk';clearTarget();car.speed=0;exitCar(true);pl.x=car.x+Math.cos(car.h)*1.6;pl.z=car.z-Math.sin(car.h)*1.6;
  pl.x=j.x;pl.z=j.z-1.5;pl.h=pl.th=0;const P_={x:pl.x,z:pl.z},J={x:j.x,z:j.z};j.look=pl;j.ch.pose=null;
  const rx=S.drop.x-16,rz=S.drop.z-2;
  cutscene([
    {dur:2.8,cam:twoShot(P_,J,6,2.4),say:['ДЖАМЕЛЬ','Ты от Момо? Давай сюда, не светись.',j]},
    {dur:2.6,cam:ots({x:pl.x,z:pl.z},J,1),say:['ДЖАМЕЛЬ','Так... всё на месте. Момо не обманывает.',j]},
    {dur:2.6,cam:{from:[rx-6,2.5,rz+8],to:[rx-2,1.6,rz+5],look:[rx,1,rz],fov:48},say:['','*визг шин*'],do:()=>{const c=makeCar('sedan','#151515',rx,rz,Math.PI/2,'parked');c.keep=true;c.y=0.15;placeCar(c);STORY.cars.push(c);sfx.horn();nz(0.8,2200,'bandpass',0.35);
      for(let k=0;k<3;k++){const g=spawnPed('gang',rx+rr(-1.5,1.5),rz+2+k*0.8,'x',rz,1);g.armed=k<2?'pistol':'bat';setWeapon(g.ch,g.armed);g.state='idle';g.idleT=1e9;g.hp=55;g.ch.pose=null;g.rival=true;g.h=g.th=Math.PI/2;STORY.foes.push(g);}}},
    {dur:2.6,cam:{from:at(J,-0.7,1.7,-1.6),to:at(J,-0.5,1.65,-1.2),look:at(J,0,1.5,0),fov:42},say:['ДЖАМЕЛЬ','Чёрт! «Хищники»! Они за тобой ехали!',j]},
    {dur:2.4,cam:twoShot({x:pl.x,z:pl.z},J,3.5),say:['ДЖАМЕЛЬ','Держи ствол. Разберись с ними — мы прикроем сумку.',j],do:()=>{pl.weapons.pistol=1;pl.ammo.pistol+=36;equip('pistol');}}],
    ()=>{STORY.stage='fight';for(const g of STORY.foes){g.state='attack';}for(const a of STORY.actors){a.ch.pose='crossed';}j.ch.pose='crossed';});}
function m1Outro(){const j=STORY.data.jamel;pl.aimT=0;if(pl.inCar)exitCar(true);pl.x=j.x;pl.z=j.z-2.2;pl.h=pl.th=0;const J={x:j.x,z:j.z},P_={x:pl.x,z:pl.z};j.look=pl;
  cutscene([
    {dur:2.8,cam:twoShot(P_,J,5,2.0),say:['ДЖАМЕЛЬ','Красиво сработал. Момо в тебе не ошибся.',j]},
    {dur:3.2,cam:ots({x:j.x,z:j.z-2.2},J,-1),say:['ДЖАМЕЛЬ','Вот твоя доля. Заходи в гараж — для тебя всегда найдётся работа.',j]},
    {dur:2.6,cam:{from:[j.x+5,4,j.z-6],to:[j.x+8,8,j.z-10],look:[j.x,1.2,j.z-1],fov:55},say:[pl.name,'Ещё увидимся.',pl]}],
    ()=>{pl.story.m1=true;for(const a of STORY.actors)a.state='idle',a.idleT=20;STORY.actors=[];missionPassed('ПОСЫЛКА',300);});}
/* ---------- MISSION 2: «СТЕНЫ ГОВОРЯТ» ---------- */
function startM2(){const S=STORY.spots,np=S.m2;STORY.cur='m2';STORY.actors=[];STORY.cars=[];STORY.foes=[];STORY.data={done:0};wanted=0;crime=0;
  const n=actor(NPC.nadia,np.x,np.z,0);STORY.actors.push(n);n.look=pl;pl.x=np.x+0.2;pl.z=np.z+2.2;pl.h=pl.th=Math.PI;n.ch.pose='lean';
  const P_={x:pl.x,z:pl.z},N={x:n.x,z:n.z};
  cutscene([
    {dur:3.2,cam:{from:[np.x+10,9,np.z+12],to:[np.x+5,3,np.z+6],look:[np.x,1.5,np.z],fov:52}},
    {dur:3.0,cam:ots(P_,N,1),say:['НАДЯ','Это ты разрулил с «Хищниками»? Неплохо для новенького.',n],do:()=>{n.ch.pose=null;}},
    {dur:2.2,cam:ots(N,P_,-1),say:[pl.name,'Слухи быстро ходят.',pl]},
    {dur:3.8,cam:{from:at(N,1.0,1.6,1.8),to:at(N,0.7,1.6,1.4),look:at(N,0,1.5,0),fov:40},say:['НАДЯ','Эти клоуны закрашивают наши куски по всему району. Пора напомнить, чей это город.',n]},
    {dur:3.6,cam:twoShot(P_,N,3.8),say:['НАДЯ','Три стены у вокзала. Держи баллоны. Копы взбесятся — не попадайся.',n],do:()=>{pl.spray+=6;equip('spray');}},
    {dur:2.6,cam:ots(P_,N,-1),say:['НАДЯ','Как закончишь — жду у фонтана в парке.',n]}],
    ()=>{STORY.stage='tag';STORY.tick=m2Tick;n.ch.pose='lean';n.state='idle';n.idleT=15;STORY.actors=[];m2Marks();});}
function m2Marks(){const S=STORY.spots;STORY.data.marks=S.walls.map(w=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(3,2),new THREE.MeshBasicMaterial({color:0xffd84d,transparent:true,opacity:0.35,depthWrite:false,blending:THREE.AdditiveBlending}));
    m.position.set(w.x+w.nx*0.06,1.6,w.z+w.nz*0.06);m.rotation.y=Math.atan2(w.nx,w.nz);scene.add(m);return{w,m,done:false};});m2Obj();}
function m2Obj(){const left=STORY.data.marks.filter(k=>!k.done);objective('Тегни <em>стены у вокзала</em> · осталось '+left.length+(isTouch?'':' · подойди к стене и жми ОГОНЬ'));
  const n=left.sort((a,b)=>Math.hypot(a.w.x-pl.x,a.w.z-pl.z)-Math.hypot(b.w.x-pl.x,b.w.z-pl.z))[0];if(n)setTarget(n.w.x+n.w.nx*1.5,n.w.z+n.w.nz*1.5);}
{const dt0=doTag;doTag=function(){const n=tags.length,last=tags[tags.length-1];dt0();const t=tags[tags.length-1];if(t&&t!==last&&STORY.cur==='m2'&&STORY.stage==='tag')m2Tagged(t);};}
function m2Tagged(t){for(const k of STORY.data.marks){if(k.done)continue;if(Math.hypot(k.w.x-t.x,k.w.z-t.z)<3.2){k.done=true;scene.remove(k.m);STORY.data.done++;addCrime(1.6);
    const nx=k.w.nx,nz=k.w.nz,rx=nz,rz=-nx;slowmo(0.4,0.6);camShot({from:[t.x+nx*4+rx*2.5,1.4,t.z+nz*4+rz*2.5],to:[t.x+nx*3.4+rx*1.6,1.7,t.z+nz*3.4+rz*1.6],look:[t.x,1.6,t.z],dur:1.6,fov:48});
    pop('ТЕГ '+STORY.data.done+'/3','#ffd84d');
    if(STORY.data.done>=3){STORY.stage='meet';objective('Встреться с <em>Надей</em> у фонтана в парке');setTarget(STORY.spots.park.x,STORY.spots.park.z);}else m2Obj();return;}}}
function m2Tick(){if(pl.dead){for(const k of STORY.data.marks||[])scene.remove(k.m);missionFailed('Тебя приняли. Стены остались серыми.');return;}
  if(STORY.stage==='tag'&&pl.spray<=0&&pl.money<10){}
  if(STORY.stage==='meet'){const pk=STORY.spots.park,d=Math.hypot(pk.x-pl.x,pk.z-pl.z);
    if(wanted>0&&d<30){if(!STORY.data.w){STORY.data.w=1;objective('Сначала <em>сбрось хвост</em> — копы на районе');}return;}
    if(STORY.data.w&&wanted===0){STORY.data.w=0;objective('Встреться с <em>Надей</em> у фонтана в парке');}
    if(!STORY.data.n&&d<70){const n=actor(NPC.nadia,pk.x+1.2,pk.z+1.2,0);n.ch.pose='sit';STORY.actors.push(n);STORY.data.n=n;}
    if(d<3&&!pl.inCar)m2Outro();}}
function m2Outro(){STORY.stage='end';clearTarget();const n=STORY.data.n,pk=STORY.spots.park;n.look=pl;n.ch.pose=null;const N={x:n.x,z:n.z};pl.x=n.x-1.6;pl.z=n.z+1.3;pl.h=pl.th=Math.atan2(n.x-pl.x,n.z-pl.z);
  cutscene([
    {dur:3.6,cam:{from:[pk.x-20,26,pk.z+20],to:[pk.x-6,6,pk.z+8],look:[pk.x,1.5,pk.z],fov:55},do:()=>{gameMin=22*60+30;updDayNight(true);}},
    {dur:3.0,cam:ots({x:pl.x,z:pl.z},N,1),say:['НАДЯ','Видела твою работу. Весь вокзал теперь говорит нашими буквами.',n]},
    {dur:2.2,cam:ots(N,{x:pl.x,z:pl.z},-1),say:[pl.name,'И что дальше?',pl]},
    {dur:3.6,cam:{from:at(N,1.1,1.5,-1.4),to:at(N,0.8,1.45,-1.1),look:at(N,0,1.4,0),fov:40},say:['НАДЯ','Дальше? Держи мою доску. Говорят, ты катаешь не хуже, чем рисуешь.',n],do:()=>{pl.board=1;}},
    {dur:3.4,cam:{from:[pk.x+4,2,pk.z+6],to:[pk.x+12,14,pk.z+18],look:[pk.x,2,pk.z],fov:58},say:['НАДЯ','Скейтпарк на старой стоянке — метка S на карте. Покажи им, кто хозяин района.',n]}],
    ()=>{pl.story.m2=true;STORY.actors=[];n.state='idle';n.idleT=30;missionPassed('СТЕНЫ ГОВОРЯТ',250);banner('НОВОЕ: СКЕЙТ','Доска у тебя. Найди её в скейтпарке.',3.5);if(window.SKATE_UNLOCK)SKATE_UNLOCK();});}
/* hook start of play: show offers */
{const sp=startPlay;startPlay=function(l){sp(l);pl.story=pl.story||{};refreshOffers();if(!pl.story.m1)setTimeout(()=>showMsg('Момо ждёт тебя у подъезда — жёлтая метка «M» на карте.',5),3200);};}
