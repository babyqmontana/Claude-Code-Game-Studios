/* ======================= V6 STORY II: cinematic camera moves, living actors, intro, chapters 3–4 ======================= */
V6CSS.textContent+=`
#card{position:fixed;inset:0;z-index:9;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#000;opacity:0;pointer-events:none;transition:opacity .6s}
#card.on{opacity:1}#card .c1{font:600 clamp(12px,1.8vw,16px) 'Exo 2',sans-serif;letter-spacing:.5em;color:#ffd84d;margin-bottom:10px}
#card .c2{font:italic 900 clamp(30px,7vw,70px)/1 'Exo 2',sans-serif;color:#fff;letter-spacing:.04em;text-shadow:0 0 30px rgba(255,80,160,.45)}
#card .c3{font:500 clamp(12px,1.7vw,15px) 'Exo 2',sans-serif;color:rgba(255,255,255,.6);margin-top:14px;letter-spacing:.2em}
#grain{position:fixed;inset:-50%;z-index:6;pointer-events:none;opacity:0;transition:opacity .5s;mix-blend-mode:overlay}
body.cine #grain{opacity:.22;animation:grain .5s steps(4) infinite}
@keyframes grain{0%{transform:translate(0,0)}25%{transform:translate(-3%,2%)}50%{transform:translate(2%,-3%)}75%{transform:translate(-2%,-1%)}}
#sub.vo b{color:#9fd0ff}
#skip{bottom:auto!important;top:calc(11vh + 10px)}`;
(()=>{const c=document.createElement('div');c.id='card';c.innerHTML='<div class="c1"></div><div class="c2"></div><div class="c3"></div>';document.body.appendChild(c);
  const[cv,g]=mk(128,128);const id=g.createImageData(128,128);for(let i=0;i<id.data.length;i+=4){const v=Math.random()*255;id.data[i]=id.data[i+1]=id.data[i+2]=v;id.data[i+3]=255;}g.putImageData(id,0,0);
  const gr=document.createElement('div');gr.id='grain';gr.style.backgroundImage='url('+cv.toDataURL()+')';document.body.appendChild(gr);})();
function showCard(c,dur){const el=$('#card');el.querySelector('.c1').textContent=c[0]||'';el.querySelector('.c2').textContent=c[1]||'';el.querySelector('.c3').textContent=c[2]||'';el.classList.add('on');
  clearTimeout(showCard.tm);showCard.tm=setTimeout(()=>el.classList.remove('on'),Math.max(600,(dur-0.7)*1000));}
/* camera moves: orbit around a point, track an actor in its own frame, crane up/down */
const shotK=dur=>smooth(Math.min(1,(CAMS.shot?CAMS.shot.t:0)/dur));
function orbitShot(c,r,h,a0,a1,dur,lookY,fov){return{from:()=>{const a=lerp(a0,a1,shotK(dur));return[c.x+Math.sin(a)*r,h,c.z+Math.cos(a)*r];},look:()=>[c.x,lookY??1.4,c.z],fov:fov||48,ease:false};}
function trackShot(who,off,lookOff,fov){return{from:()=>{const h=who.h||0,c=Math.cos(h),s=Math.sin(h);return[who.x+off[0]*c+off[2]*s,(who.y||0)+off[1],who.z-off[0]*s+off[2]*c];},
  look:()=>{const h=who.h||0,c=Math.cos(h),s=Math.sin(h),lo=lookOff||[0,1.4,0];return[who.x+lo[0]*c+lo[2]*s,(who.y||0)+lo[1],who.z-lo[0]*s+lo[2]*c];},fov:fov||50,ease:false};}
function craneShot(c,r,a,h0,h1,dur,fov){return{from:()=>{const k=shotK(dur);return[c.x+Math.sin(a)*lerp(r,r*1.6,k),lerp(h0,h1,k),c.z+Math.cos(a)*lerp(r,r*1.6,k)];},look:()=>[c.x,lerp(1.4,3,shotK(dur)),c.z],fov:fov||55,ease:false};}
/* actor verbs */
function runAct(a){const[v,who,...r]=a;const ch=who===pl?pl.ch:who&&who.ch;
  if(v==='go'){if(who===pl)pl.cineGo={x:r[0],z:r[1],spd:r[2]||1.6};else who.goto={x:r[0],z:r[1],spd:r[2]||1.5};}
  else if(v==='face'){if(who===pl){pl.h=pl.th=Math.atan2(r[0].x-pl.x,r[0].z-pl.z);}else{who.look=r[0];}}
  else if(v==='pose'){ch.pose=r[0];}else if(v==='gest'){ch.gest={k:r[0],t:0,d:r[1]||1.4};}else if(v==='talk'){ch.talk=r[0]||2;}}
const _va2=V6.anim;V6.anim=function(ch,dt,spd,o){_va2(ch,dt,spd,o);const G=ch.gest;if(!G)return;G.t+=dt;const k=Math.sin(Math.min(1,G.t/G.d)*Math.PI),t=time*8;
  if(G.k==='point'){addP('UpperArmR',-1.45*k,0.2*k,-0.3*k);addP('ForeArmR',0,0.15*k,0);addP('Head',0,0.15*k,0);}
  else if(G.k==='dap'){addP('UpperArmR',-1.05*k,-0.25*k,0);addP('ForeArmR',0,0.35*k,0);addP('Spine2',0.1*k,0.2*k,0);}
  else if(G.k==='shrug'){addP('UpperArmL',0,0,0.25*k);addP('UpperArmR',0,0,-0.25*k);addP('ForeArmL',-1.35*k,0,0);addP('ForeArmR',-1.35*k,0,0);addP('Head',0.1*k,0,0.15*k);}
  else if(G.k==='give'){addP('UpperArmR',-1.0*k,-0.3*k,0);addP('ForeArmR',0,0.4*k,0);addP('Spine1',0.15*k,0,0);}
  else if(G.k==='spray'){addP('UpperArmR',-1.6*k,0.2,0);addP('ForeArmR',0,0.6*k+0.25*Math.sin(t*2.5)*k,0);addP('Head',-0.1*k,0.2*k,0);}
  else if(G.k==='laugh'){addP('Spine1',-0.2*k,0,0);addP('Head',-0.35*k+0.06*Math.sin(t*1.6)*k,0,0);addP('UpperArmL',0,0,0.25*k);}
  else if(G.k==='look'){addP('Head',0,0.9*k,0);addP('Spine2',0,0.35*k,0);}
  else if(G.k==='wave'){addP('UpperArmR',-0.3*k,0,-2.2*k);addP('ForeArmR',0,0.5*Math.sin(t*1.2)*k,0);}
  if(G.t>=G.d)ch.gest=null;};
{const vp=V6.player;V6.player=function(dt,inp){const g=pl.cineGo;if(g&&!pl.inCar){const dx=g.x-pl.x,dz=g.z-pl.z,L=Math.hypot(dx,dz);let sp=0;
    if(L>0.12){sp=Math.min(g.spd,L*3);pl.x+=dx/L*sp*dt;pl.z+=dz/L*sp*dt;pl.th=Math.atan2(dx,dz);}else pl.cineGo=null;pl.h=angLerp(pl.h,pl.th,Math.min(1,dt*8));
    pl.y=groundY(pl.x,pl.z);pl.ch.root.position.set(pl.x,pl.y,pl.z);pl.ch.root.rotation.set(0,pl.h,0);animChar(pl.ch,dt,sp,null);return true;}
  return vp?vp(dt,inp):false;};}
/* ---------- INTRO (new game) ---------- */
function playIntro(){const H=HOSP,P0={x:pl.x,z:pl.z};wanted=0;const vo=(l,d)=>({dur:d||4,say:['',l],do:()=>$('#sub').classList.add('vo')});
  pl.x=H.x;pl.z=H.z;pl.h=pl.th=Math.PI;const goal={x:H.x,z:H.z-9};
  cutscene([
    {dur:3.2,card:['БÉTON 99','ГОРОД, КОТОРЫЙ НЕ СПИТ','ПРИГОРОД ПАРИЖА · 1999'],cam:craneShot({x:SIZE/2,z:SIZE/2},180,0.6,70,90,3.2,50)},
    Object.assign(vo('Сюда не возят туристов. Отсюда Эйфелева башня — просто огни на горизонте.',4.2),{cam:orbitShot({x:SIZE*0.3,z:SIZE*0.3},70,34,-0.4,0.5,4.2,4,50)}),
    Object.assign(vo('Бетон, стены в цвет, крыши из цинка. Каждая стена здесь кому-то принадлежит.',4.2),{cam:{from:[4*P,7,0.6*P],to:[4*P,4.5,1.6*P],look:[4*P,3.5,3*P],fov:55}}),
    Object.assign(vo('Меня не было полгода. Больница Сен-Рок. Долгая история.',3.6),{cam:craneShot(H,6,Math.PI,14,2.2,3.6,52),acts:[['go',pl,goal.x,goal.z,1.2]]}),
    Object.assign(vo('Но район не ждёт. Момо уже ищет меня — у него всегда есть работа.',3.8),{cam:trackShot(pl,[1.2,1.7,2.6],[0,1.5,-2],46)}),
    {dur:2.6,cam:trackShot(pl,[-0.6,1.6,-2.4],[0,1.6,0],42),acts:[['gest',pl,'look',2.4]],do:()=>{$('#sub').classList.remove('vo');}}],
    ()=>{pl.cineGo=null;$('#sub').classList.remove('vo');showMsg('Момо ждёт тебя у подъезда — жёлтая метка «M» на карте.',5);});}
/* new games start with the intro instead of the old hint */
{const sp=startPlay;startPlay=function(l){sp(l);if(!l){gameMin=18*60+35;updDayNight(true);}if(!l&&!(pl.story&&pl.story.intro)){pl.story=pl.story||{};pl.story.intro=1;setTimeout(()=>{if(state==='play')playIntro();},600);}};}
/* richer staging for chapters 1–2: replace their openings with moving actors */
const _m1=startM1;startM1=function(){_m1();const momo=STORY.actors[0];if(!momo||!CUT.steps)return;const mp={x:momo.x,z:momo.z},P_={x:pl.x,z:pl.z};
  pl.z+=3.5;momo.x-=2.5;momo.ch.pose=null;
  CUT.steps.splice(1,0,{dur:3.0,cam:trackShot(pl,[1.3,1.6,2.2],[0,1.4,-3],46),acts:[['go',pl,P_.x,P_.z,1.4],['go',momo,mp.x,mp.z,1.1]],say:['МОМО','Эй! Смотрите, кто вернулся! Живой!',momo]},
    {dur:1.8,cam:orbitShot({x:(mp.x+P_.x)/2,z:(mp.z+P_.z)/2},3.2,1.6,1.2,0.6,1.8,1.4,46),acts:[['gest',momo,'dap',1.6],['gest',pl,'dap',1.6],['face',momo,pl]]});
  CUT.steps[3].acts=[['gest',momo,'shrug',2]];CUT.steps[5].acts=[['gest',momo,'give',2],['gest',pl,'give',1.6]];CUT.steps[6].acts=[['gest',momo,'point',2.4]];CUT.steps[8].acts=[['gest',momo,'laugh',1.4]];};
const _m2=startM2;startM2=function(){_m2();const n=STORY.actors[0];if(!n||!CUT.steps)return;
  CUT.steps[1].acts=[['gest',n,'spray',3]];CUT.steps[1].cam=trackShot(n,[0.9,1.6,1.6],[0,1.5,0],42);CUT.steps[3].acts=[['gest',n,'point',2.6]];CUT.steps[4].acts=[['gest',n,'give',2],['gest',pl,'give',1.5]];
  CUT.steps[5].cam=orbitShot({x:(n.x+pl.x)/2,z:(n.z+pl.z)/2},3.6,1.7,0.3,1.2,2.6,1.4,46);};
/* ---------- CHAPTER 3: «НОЧНОЙ ПОЕЗД» ---------- */
V6.build.push(()=>{const S=STORY.spots;S.m3=freeNear(S.park.x+6,S.park.z+4);S.wall3={x:SIZE+11.8,z:SIZE*0.72};
  const pk=blocks.filter(b=>b.type==='parking').sort((a,b)=>(a.i+a.j)-(b.i+b.j));const lot=pk.find(b=>!(SKP.box&&b.x0<SKP.box.cx&&b.x1>SKP.box.cx&&b.z0<SKP.box.cz&&b.z1>SKP.box.cz)&&Math.hypot((b.x0+b.x1)/2-S.drop.x,(b.z0+b.z1)/2-S.drop.z)>30)||pk[0];
  S.lot={x:(lot.x0+lot.x1)/2,z:(lot.z0+lot.z1)/2};S.m4=freeNear(HOME.x-3,HOME.z+1.5);});
function startM3(){const S=STORY.spots,np=S.m3;STORY.cur='m3';STORY.actors=[];STORY.cars=[];STORY.foes=[];STORY.data={};wanted=0;crime=0;
  const n=actor(NPC.nadia,np.x,np.z,0);STORY.actors.push(n);n.look=pl;pl.x=np.x+1.6;pl.z=np.z+2.4;pl.h=pl.th=Math.atan2(n.x-pl.x,n.z-pl.z);n.ch.pose='sit';
  const N={x:n.x,z:n.z},P_={x:pl.x,z:pl.z};
  cutscene([
    {dur:3.2,card:['ГЛАВА 3','НОЧНОЙ ПОЕЗД','']},
    {dur:3.4,cam:orbitShot(N,5,2.2,-1.2,-0.3,3.4,1.0,50),do:()=>{gameMin=23*60+10;updDayNight(true);}},
    {dur:3.4,cam:ots(P_,N,1),say:['НАДЯ','Видел вокзал? «Хищники» закрасили всё. Даже наш кусок у путей.',n],acts:[['pose',n,null],['gest',n,'shrug',2.4]]},
    {dur:3.6,cam:trackShot(n,[0.8,1.5,1.5],[0,1.45,0],40),say:['НАДЯ','Нужен не тег. Нужен кусок, который увидит каждый поезд утром.',n],acts:[['gest',n,'point',2.8]]},
    {dur:2.4,cam:ots(N,P_,-1),say:[pl.name,'Стена у путей. Ночью. Понял.',pl],acts:[['gest',pl,'dap',1.6],['gest',n,'dap',1.6]]},
    {dur:3.2,cam:{from:[S.wall3.x-14,6,S.wall3.z-18],to:[S.wall3.x-9,3,S.wall3.z-8],look:[S.wall3.x,2,S.wall3.z],fov:50},say:['НАДЯ','Нарисуй сам. Как чувствуешь. Только быстро — там патрули.',n]}],
    ()=>{n.state='idle';n.idleT=30;n.ch.pose='lean';STORY.actors=[];STORY.stage='go';STORY.tick=m3Tick;pl.spray=Math.max(pl.spray,3);equip('spray');
      objective('Нарисуй <em>кусок на стене у путей</em> — подойди к стене и жми ОГОНЬ');setTarget(S.wall3.x-1.6,S.wall3.z);});}
STORY.onPiece=(t,cov)=>{if(STORY.cur!=='m3'||STORY.stage!=='go')return;if(Math.hypot(t.x-STORY.spots.wall3.x,t.z-STORY.spots.wall3.z)>8)return;
  if(cov<0.12){setTimeout(()=>showMsg('Слишком мало краски. Надя просила КУСОК — нарисуй больше.',3),1500);return;}
  STORY.stage='escape';clearTarget();PNT.after=()=>{const w=STORY.spots.wall3;cutscene([
    {dur:3.2,cam:craneShot({x:w.x,z:w.z},5,-Math.PI/2,1.4,7,3.2,52)},
    {dur:2.6,cam:{from:[w.x-12,1.2,w.z+16],to:[w.x-10,1.4,w.z+12],look:[w.x-4,1,w.z],fov:44},say:['','*сирены*'],do:()=>{addCrime(3.2);}}],
    ()=>{objective('<em>Уходи от полиции</em> и вернись домой');setTarget(HOME.x,HOME.z);});};};
function m3Tick(){if(pl.dead){missionFailed('Тебя взяли. Кусок закрасят к утру.');return;}
  if(STORY.stage==='escape'&&Math.hypot(HOME.x-pl.x,HOME.z-pl.z)<4){if(wanted>0){if(!STORY.data.w){STORY.data.w=1;objective('Сначала <em>сбрось хвост</em>');}return;}if(!pl.inCar)m3Outro();}}
function m3Outro(){STORY.stage='end';clearTarget();const n=actor(NPC.nadia,HOME.x+1.4,HOME.z+1.2,0);n.look=pl;pl.h=pl.th=Math.atan2(n.x-pl.x,n.z-pl.z);const N={x:n.x,z:n.z};
  cutscene([
    {dur:3.4,cam:{from:[HOME.x-20,30,HOME.z+30],to:[HOME.x-6,6,HOME.z+9],look:[HOME.x,2,HOME.z],fov:52},do:()=>{gameMin=6*60+40;updDayNight(true);}},
    {dur:3.4,cam:ots({x:pl.x,z:pl.z},N,1),say:['НАДЯ','Утренний поезд ехал медленно. Весь вагон смотрел на твою стену.',n],acts:[['gest',n,'laugh',2]]},
    {dur:3.4,cam:trackShot(n,[0.9,1.5,1.4],[0,1.45,0],40),say:['НАДЯ','Но «Хищники» это тоже видели. Будь осторожен. Они пойдут на Момо.',n],acts:[['gest',n,'look',2.6]]},
    {dur:2.6,cam:orbitShot({x:(n.x+pl.x)/2,z:(n.z+pl.z)/2},4,1.8,2.0,3.0,2.6,1.4,48),say:[pl.name,'Пусть идут.',pl]}],
    ()=>{pl.story.m3=true;n.state='idle';n.idleT=10;missionPassed('НОЧНОЙ ПОЕЗД',350);});}
/* ---------- CHAPTER 4: «ХИЩНИКИ» (finale) ---------- */
function startM4(){const S=STORY.spots,mp=S.m4;STORY.cur='m4';STORY.actors=[];STORY.cars=[];STORY.foes=[];STORY.data={};wanted=0;crime=0;
  const momo=actor(NPC.momo,mp.x,mp.z,0);momo.ch.pose='sit';STORY.actors.push(momo);momo.look=pl;pl.x=mp.x+0.4;pl.z=mp.z+2.6;pl.h=pl.th=Math.PI;const M={x:momo.x,z:momo.z},P_={x:pl.x,z:pl.z};
  cutscene([
    {dur:3.2,card:['ГЛАВА 4','ХИЩНИКИ','ФИНАЛ']},
    {dur:3.4,cam:craneShot(M,4.5,0.4,9,1.5,3.4,50),do:()=>{gameMin=19*60+40;updDayNight(true);}},
    {dur:3.4,cam:trackShot(momo,[0.7,1.0,1.4],[0,0.9,0],42),say:['МОМО','Они пришли ночью. Забрали гараж. Джамель у них.',momo],acts:[['gest',momo,'shrug',2.6]]},
    {dur:2.6,cam:ots({x:pl.x,z:pl.z},M,1),say:[pl.name,'Где они?',pl]},
    {dur:3.6,cam:ots(M,{x:pl.x,z:pl.z},-1),say:['МОМО','Старая стоянка на севере. Их главный — Стервятник. Без него они никто.',momo],acts:[['gest',momo,'point',2.8]]},
    {dur:2.8,cam:orbitShot({x:(M.x+P_.x)/2,z:(M.z+P_.z)/2},3.6,1.5,-0.6,0.5,2.8,1.1,46),say:['МОМО','Возьми это. И вернись живым, малой.',momo],acts:[['gest',momo,'give',2],['gest',pl,'give',1.6]],
      do:()=>{pl.weapons.smg=1;pl.ammo.smg+=90;pl.weapons.pistol=1;pl.ammo.pistol+=24;pl.armor=100;equip('smg');}}],
    ()=>{STORY.stage='go';STORY.tick=m4Tick;objective('Езжай на <em>стоянку «Хищников»</em>');setTarget(S.lot.x,S.lot.z);});}
function m4Tick(){const S=STORY.spots;if(pl.dead){missionFailed('«Хищники» оказались сильнее. Попробуй ещё раз.');return;}
  const d=Math.hypot(S.lot.x-pl.x,S.lot.z-pl.z);
  if(STORY.stage==='go'&&d<70&&!STORY.data.spawned){STORY.data.spawned=1;for(let k=0;k<6;k++){const a=k/6*TAU,g=spawnPed('gang',S.lot.x+Math.cos(a)*rr(5,11),S.lot.z+Math.sin(a)*rr(5,11),'x',S.lot.z,1);
      g.armed=k%3===0?'bat':'pistol';setWeapon(g.ch,g.armed);g.state='idle';g.idleT=1e9;g.ch.pose=pick(['smoke','crossed','lean']);g.hp=60;STORY.foes.push(g);}
    const boss=actor({sex:'m',top:'track',topCol:'#6a0a10',hat:'mask',bottom:'baggy',botCol:'#111',chain:1,shoe:'#111'},S.lot.x,S.lot.z-2,0);boss.type='gang';boss.armed='pistol';boss.hp=220;boss.boss=1;setWeapon(boss.ch,'pistol');STORY.data.boss=boss;STORY.foes.push(boss);
    const j=actor(NPC.jamel,S.lot.x+1.5,S.lot.z-4,0);j.ch.pose='squat';STORY.data.jamel=j;STORY.actors.push(j);}
  if(STORY.stage==='go'&&d<24){STORY.stage='fight';const b=STORY.data.boss;b.look=pl;if(pl.inCar&&Math.abs(pl.inCar.speed)<30)pl.inCar.speed*=0.3;
    cutscene([
      {dur:2.6,cam:trackShot(b,[0.6,1.7,2.0],[0,1.6,0],38),say:['СТЕРВЯТНИК','Смотрите-ка. Художник приехал.',b],acts:[['gest',b,'laugh',2]]},
      {dur:2.6,cam:orbitShot({x:b.x,z:b.z},6,2.4,0,1.4,2.6,1.2,52),say:['СТЕРВЯТНИК','Здесь твои стены и закончатся. Валите его!',b],acts:[['gest',b,'point',2.2]]}],
      ()=>{for(const g of STORY.foes){g.state='attack';g.ch.pose=null;}b.state='attack';objective('Победи <em>Стервятника</em> и его банду');});}
  if(STORY.stage==='fight'){const alive=STORY.foes.filter(p=>p.state!=='dead'&&peds.includes(p)).length;const b=STORY.data.boss;
    objective((b.state==='dead'?'':'<em>Стервятник</em> жив · ')+'врагов: '+alive);if(!alive){STORY.stage='end';setTimeout(m4Outro,1200);}}}
function m4Outro(){const S=STORY.spots,j=STORY.data.jamel;if(pl.inCar)exitCar(true);pl.x=j.x-1.2;pl.z=j.z+1.6;pl.h=pl.th=Math.atan2(j.x-pl.x,j.z-pl.z);j.look=pl;j.ch.pose=null;const J={x:j.x,z:j.z};
  cutscene([
    {dur:3.0,cam:craneShot(J,3,0.8,1.2,5,3.0,50),acts:[['gest',j,'look',2.4]],do:()=>{gameMin=6*60+10;updDayNight(true);}},
    {dur:3.0,cam:ots({x:pl.x,z:pl.z},J,1),say:['ДЖАМЕЛЬ','Я знал, что ты придёшь. Момо сказал — ты псих.',j],acts:[['gest',j,'laugh',2],['gest',pl,'dap',1.6]]},
    {dur:3.4,cam:trackShot(j,[0.8,1.5,1.4],[0,1.45,0],40),say:['ДЖАМЕЛЬ','Стервятника больше нет. Район снова наш. Твои стены — тоже.',j],acts:[['gest',j,'point',2.6]]},
    {dur:4.4,cam:craneShot({x:S.lot.x,z:S.lot.z},10,2.2,3,60,4.4,55),say:[pl.name,'Это не мой район. Это наш.',pl]},
    {dur:4,card:['BÉTON 99','КОНЕЦ ПЕРВОЙ ЧАСТИ','СВОБОДНАЯ ИГРА: РИСУЙ, КАТАЙ, ЖИВИ']}],
    ()=>{pl.story.m4=true;j.state='idle';j.idleT=15;STORY.actors=[];missionPassed('ХИЩНИКИ',600);});}
/* offers for chapters 3 and 4 */
{const ro=refreshOffers;refreshOffers=function(){ro();const s=pl.story||{};if(STORY.avail||!s.m2)return;
  if(!s.m3)STORY.avail=Object.assign({letter:'N',start:startM3},STORY.spots.m3);else if(!s.m4)STORY.avail=Object.assign({letter:'M',start:startM4},STORY.spots.m4);
  if(STORY.avail){STORY.offerMk=markerMesh(0xffd84d,STORY.avail.letter);STORY.offerMk.position.set(STORY.avail.x,groundY(STORY.avail.x,STORY.avail.z),STORY.avail.z);}};}
