/* ======================= V6 SPOTS + RESPECT: the best walls in the district, and what painting them unlocks ======================= */
/* 14 marked walls across the city. A piece on a spot pays respect by coverage and colours and draws one star.
   Respect levels unlock colours and a bigger nozzle. Progress lives in pl.story (saved with the game). */
const SPOTS=[];const RLEV=[0,150,400,800,1400,2200];const RNAME=['ТОЙ','ТЕГЕР','РАЙТЕР','КИНГ','ЛЕГЕНДА','ИКОНА РАЙОНА'];
const LOCKED_COLS={2:['#c8a038','#9a9aa4'],3:['#00e0a0','#ff2266'],4:['#7a00ff','#fff04a']};
V6CSS.textContent+=`#resp{font:700 12px 'Exo 2',sans-serif;color:#ff9ad0;text-align:right;letter-spacing:.06em;margin-top:2px;text-shadow:0 1px 0 #000}
#resp b{color:#fff}@media (max-height:520px){#resp{font-size:10px}}`;
(()=>{const m=$('#money');if(!m)return;const d=document.createElement('div');d.id='resp';m.parentNode.insertBefore(d,m.nextSibling);})();
function respLevel(r){let l=0;for(let i=0;i<RLEV.length;i++)if(r>=RLEV[i])l=i;return l;}
function respUI(){const st=pl.story||{},r=st.respect||0,l=respLevel(r),nx=RLEV[l+1];const e=$('#resp');if(e)e.innerHTML='РЕСПЕКТ <b>'+r+'</b>'+(nx?' / '+nx:'')+' · '+RNAME[l];}
function addRespect(n){const st=pl.story||(pl.story={});const l0=respLevel(st.respect||0);st.respect=(st.respect||0)+Math.round(n);const l1=respLevel(st.respect);respUI();
  if(l1>l0){banner('НОВЫЙ УРОВЕНЬ: '+RNAME[l1],l1>=5?'Весь район знает твоё имя':l1===1?'Открыто: сопло XL':'Открыты новые цвета',3.2);[523,784,1046].forEach((f,i)=>tone(f,0.25,'square',0.07,0,AU.c&&AU.c.currentTime+i*0.1));applyUnlocks();}}
function applyUnlocks(){const l=respLevel((pl.story&&pl.story.respect)||0);
  for(const k in LOCKED_COLS)for(const c of LOCKED_COLS[k]){if(l>=+k&&!SPCOL.includes(c)){SPCOL.push(c);const s=document.createElement('span');s.className='sw';s.style.background=c;s.onclick=()=>{PNT.col=c;paintUI();};$('#pcol').appendChild(s);}}
  if(l>=1&&!document.querySelector('#paint [data-s="64"]')){const b=document.createElement('span');b.className='pb';b.dataset.s='64';b.textContent='XL';b.onclick=()=>{PNT.size=64;paintUI();};document.querySelector('#paint [data-s="40"]').after(b);}}
/* pick big, street-facing walls spread over the map */
V6.build.push(()=>{const cand=[];for(const b of BLD){if(b.kind==='house'||b.h<6)continue;const f=faceOf(b,b.front);if(f.len<10)continue;
    const x=f.cx+f.nx*0.05,z=f.cz+f.nz*0.05;if(isRoad(x+f.nx*6,z+f.nz*6)||isRoad(x+f.nx*9,z+f.nz*9))cand.push({x,z,nx:f.nx,nz:f.nz,len:f.len,h:b.h});}
  cand.sort((a,b)=>b.len*b.h-a.len*a.h);
  for(const c of cand){if(SPOTS.length>=14)break;if(SPOTS.some(s=>Math.hypot(s.x-c.x,s.z-c.z)<55))continue;SPOTS.push(c);}
  const frameTex=rtex(64,40,(g)=>{g.strokeStyle='#ff4fa8';g.lineWidth=3;g.setLineDash([6,4]);g.strokeRect(2,2,60,36);g.setLineDash([]);g.fillStyle='rgba(255,79,168,.12)';g.fillRect(2,2,60,36);});
  const iconTex=rtex(64,64,(g)=>{g.fillStyle='#ff4fa8';g.beginPath();g.arc(32,32,30,0,TAU);g.fill();g.fillStyle='#111';g.fillRect(24,20,16,30);g.fillRect(28,14,8,6);g.fillStyle='#fff';g.fillRect(26,28,12,4);});
  SPOTS.forEach((s,i)=>{s.id=i;const fm=new THREE.Mesh(new THREE.PlaneGeometry(3.8,2.4),new THREE.MeshBasicMaterial({map:frameTex,transparent:true,depthWrite:false}));fm.position.set(s.x+s.nx*0.06,1.7,s.z+s.nz*0.06);fm.rotation.y=Math.atan2(s.nx,s.nz);scene.add(fm);s.frame=fm;
    const ic=new THREE.Sprite(new THREE.SpriteMaterial({map:iconTex,depthTest:false}));ic.scale.set(0.8,0.8,1);ic.position.set(s.x+s.nx*0.8,3.6,s.z+s.nz*0.8);scene.add(ic);s.icon=ic;});});
function spotsSync(){const done=(pl.story&&pl.story.spots)||[];for(const s of SPOTS){const d=done.includes(s.id);s.frame.visible=!d;s.icon.visible=!d;}respUI();applyUnlocks();}
{const sp=startPlay;startPlay=function(l){sp(l);setTimeout(spotsSync,50);};}
V6.upd.push(()=>{for(const s of SPOTS)if(s.icon.visible)s.icon.position.y=3.6+Math.sin(time*2.4+s.id)*0.15;});
{const ob=V6.blips;V6.blips=()=>{const B=ob(),done=(pl.story&&pl.story.spots)||[];for(const s of SPOTS)if(!done.includes(s.id))B.push({x:s.x+s.nx*2,z:s.z+s.nz*2,col:'#ff4fa8',r:2.5});return B;};}
/* respect from every finished piece; spots pay much more and remember they are yours */
{const pe=paintEnd;paintEnd=function(apply){const w=PNT.wall,before=tags.length;pe(apply);if(!apply||tags.length===before||!w)return;
  const d=PNT.layer.getContext('2d').getImageData(0,0,512,320).data;let cov=0;for(let i=3;i<d.length;i+=64)if(d[i]>60)cov++;cov/=d.length/64;
  const s=SPOTS.find(q=>Math.hypot(q.x-w.x,q.z-w.z)<3.5),st=pl.story||(pl.story={});st.spots=st.spots||[];
  if(s&&!st.spots.includes(s.id)){st.spots.push(s.id);const r=60+cov*260+PNT.colors.size*15;setTimeout(()=>{addRespect(r);pop('+'+Math.round(r)+' РЕСПЕКТА · ТОЧКА '+st.spots.length+'/'+SPOTS.length,'#ff9ad0');spotsSync();addCrime(1.2);
      if(st.spots.length===SPOTS.length)banner('ВСЕ ТОЧКИ ТВОИ','Район подписан твоим именем',4);},1500);}
  else setTimeout(()=>addRespect(8+cov*40),1500);};}
/* tricks and story chapters add a little respect too */
{const mp=missionPassed;missionPassed=function(t,r){mp(t,r);addRespect(120);};}
