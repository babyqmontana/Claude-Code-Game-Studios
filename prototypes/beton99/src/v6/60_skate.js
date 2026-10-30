/* ======================= V6 SKATE + BMX TRICKS (THPS-style) ======================= */
const SKP={feat:[],rails:[],box:null,boards:[]};
V6CSS.textContent+=`
#trick{position:fixed;left:50%;bottom:clamp(150px,30vh,260px);transform:translateX(-50%);z-index:4;pointer-events:none;text-align:center;font:900 clamp(15px,2.6vw,24px) 'Exo 2',sans-serif;color:#fff;
  text-shadow:0 2px 0 #000,0 0 8px rgba(0,0,0,.6);letter-spacing:.04em;white-space:nowrap;opacity:0;transition:opacity .2s}
#trick.on{opacity:1}#trick .tl{font-size:.62em;color:#ffd84d;max-width:90vw;overflow:hidden;text-overflow:ellipsis}#trick .ts{font-size:1.15em}#trick .ts i{font-style:normal;color:#7dff9a}
#trick.bank .ts{color:#7dff9a;transform:scale(1.2)}#trick.bail .ts{color:#ff4d5a}
#bal{position:fixed;left:50%;bottom:clamp(128px,25vh,220px);width:180px;height:10px;margin-left:-90px;background:rgba(0,0,0,.55);border:2px solid #fff;border-radius:6px;z-index:4;display:none}
#bal i{position:absolute;top:-4px;width:4px;height:14px;background:#ffd84d;left:88px;box-shadow:0 0 6px #ffd84d}
#bal:before{content:'';position:absolute;left:70px;width:40px;top:0;bottom:0;background:rgba(125,255,154,.35)}
#tb-board{position:fixed;right:max(16px,env(safe-area-inset-right));bottom:calc(195px + env(safe-area-inset-bottom));z-index:3}`;
(()=>{const t=document.createElement('div');t.id='trick';t.innerHTML='<div class="tl"></div><div class="ts"></div>';document.body.appendChild(t);const b=document.createElement('div');b.id='bal';b.innerHTML='<i></i>';document.body.appendChild(b);})();
/* board mesh: deck with kicks, griptape, trucks, wheels */
function makeSkateMesh(col){const G=new THREE.Group(),L=[];const deck=new THREE.Group();G.add(deck);
  const grip=rtex(16,64,(g)=>{g.fillStyle='#1a1a1c';g.fillRect(0,0,16,64);speck(g,16,64,80,'rgba(255,255,255,.12)');});
  const art=rtex(16,64,(g)=>{g.fillStyle=col;g.fillRect(0,0,16,64);g.fillStyle='#fff';g.fillRect(3,20,10,3);g.fillRect(3,40,10,3);g.fillStyle='#111';g.font='bold 9px sans-serif';g.save();g.translate(11,14);g.rotate(Math.PI/2);g.fillText('B99',0,0);g.restore();});
  const dm=[LM({color:new THREE.Color(col)}),LM({color:new THREE.Color(col)}),LM({map:grip}),LM({map:art}),LM({color:0xd8c8a0}),LM({color:0xd8c8a0})];
  const mid=new THREE.Mesh(new THREE.BoxGeometry(0.21,0.025,0.6),dm);mid.position.y=0.1;deck.add(mid);
  for(const s of[-1,1]){const k=new THREE.Mesh(new THREE.BoxGeometry(0.21,0.025,0.16),dm);k.position.set(0,0.125,s*0.37);k.rotation.x=-s*0.32;deck.add(k);}
  const W=[];for(const s of[-1,1]){W.push(cbx(0.17,0.03,0.04,'#bfc0c4',0,0.07,s*0.24));for(const x of[-1,1])W.push(colorize(new THREE.CylinderGeometry(0.03,0.03,0.035,8).rotateZ(Math.PI/2).translate(x*0.095,0.035,s*0.24),'#f0ece0'));}
  deck.add(new THREE.Mesh(mergeGeos(W),VCMAT));return{G,wheels:null,deck};}
/* skatepark on an old parking lot */
function skateparkBuild(){const S=STORY.spots||{},taken=S.drop;const pk=blocks.filter(b=>b.type==='parking'&&!(taken&&Math.abs((b.x0+b.x1)/2-taken.x)<20&&Math.abs((b.z0+b.z1)/2-taken.z-6)<20)).sort((a,b)=>Math.hypot((a.x0+a.x1)/2-SIZE/2,(a.z0+a.z1)/2-SIZE/2)-Math.hypot((b.x0+b.x1)/2-SIZE/2,(b.z0+b.z1)/2-SIZE/2))[0];
  if(!pk)return;const x0=pk.x0+4,z0=pk.z0+5,x1=pk.x1-12,z1=pk.z1-4,cx=(x0+x1)/2,cz=(z0+z1)/2;SKP.box={x0,z0,x1,z1,cx,cz};
  for(let i=cars.length-1;i>=0;i--){const c=cars[i];if(c.x>x0-2&&c.x<x1+2&&c.z>z0-2&&c.z<z1+2)removeCar(i);}
  const conc=LM({map:imgTex(ASSETS.img.dirtyconc_g||ASSETS.img.asphalt,1,1),color:0xb8b4ac}),wood=LM({map:imgTex(ASSETS.img.wood,1,1),color:0xb08860}),metal=LM({color:0x9aa0a8,emissive:0x111111});
  const F=SKP.feat,R=SKP.rails;
  // feature types: kicker (linear rise), qp (quarter pipe, curved, vert), box (flat top)
  const wedge=(x,z,w,l,h,dir,mat,curve)=>{const g=new THREE.BufferGeometry(),N=curve?12:1,P_=[],U=[];const pt=t=>[t*l,curve?h*(1-Math.sqrt(Math.max(0,1-t*t))):h*t];
    for(let i=0;i<N;i++){const a=pt(i/N),b=pt((i+1)/N);P_.push(-w/2,a[1],a[0], w/2,a[1],a[0], w/2,b[1],b[0], -w/2,a[1],a[0], w/2,b[1],b[0], -w/2,b[1],b[0]);
      for(const s of[-1,1]){P_.push(s*w/2,0,a[0], s*w/2,b[1],b[0], s*w/2,a[1],a[0], s*w/2,0,a[0], s*w/2,0,b[0], s*w/2,b[1],b[0]);}}
    P_.push(-w/2,0,l, -w/2,h,l, w/2,h,l, -w/2,0,l, w/2,h,l, w/2,0,l);
    g.setAttribute('position',new THREE.Float32BufferAttribute(P_,3));for(let i=0;i<P_.length;i+=3)U.push(P_[i]/2,(P_[i+1]+P_[i+2])/2);g.setAttribute('uv',new THREE.Float32BufferAttribute(U,2));g.computeVertexNormals();
    const m=new THREE.Mesh(g,mat);m.material.side=THREE.DoubleSide;const ry=dir==='+z'?0:dir==='-z'?Math.PI:dir==='+x'?Math.PI/2:-Math.PI/2;m.rotation.y=ry;m.position.set(x,0.15,z);scene.add(m);
    F.push({x,z,w,l,h,ry,curve,vert:curve});return m;};
  const box=(x,z,w,d,h,mat,edges)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,0.15+h/2,z);scene.add(m);F.push({x,z,w,l:d,h,box:1,ry:0});
    if(edges)for(const s of[-1,1]){R.push({ax:x-w/2,az:z+s*d/2,bx:x+w/2,bz:z+s*d/2,y:0.15+h,n:'Слайд'});const e=new THREE.Mesh(new THREE.BoxGeometry(w,0.04,0.04),metal);e.position.set(x,0.15+h,z+s*d/2);scene.add(e);}return m;};
  const rail=(ax,az,bx,bz,h)=>{const L=Math.hypot(bx-ax,bz-az),g=new THREE.Mesh(new THREE.CylinderGeometry(0.035,0.035,L,8).rotateX(Math.PI/2),metal);g.position.set((ax+bx)/2,0.15+h,(az+bz)/2);g.rotation.y=Math.atan2(bx-ax,bz-az);scene.add(g);
    for(const t of[0.1,0.9]){const p=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,h,6),metal);p.position.set(lerp(ax,bx,t),0.15+h/2,lerp(az,bz,t));scene.add(p);}R.push({ax,az,bx,bz,y:0.15+h,n:'Рейл'});};
  // two facing quarter pipes on the long axis
  const W=x1-x0-2;wedge(cx,z0+2.8,W,2.6,2.2,'-z',wood,true);wedge(cx,z1-2.8,W,2.6,2.2,'+z',wood,true);
  for(const[zz,s]of[[z0-0.4,-1],[z1+0.4,1]]){box(cx,zz,W,1.2,2.2,wood,false);const cp=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.05,W,8).rotateZ(Math.PI/2),metal);cp.position.set(cx,2.37,zz-s*0.6);scene.add(cp);
    R.push({ax:cx-W/2,az:zz-s*0.62,bx:cx+W/2,bz:zz-s*0.62,y:2.37,n:'Копинг'});addCol(cx-W/2,zz-0.6,cx+W/2,zz+0.6,2.3);}
  // funbox in the middle: kickers both sides + flat top with a rail
  box(cx,cz,4,3,0.6,conc,true);wedge(cx,cz-1.5-1.6,4,1.6,0.6,'+z',conc);wedge(cx,cz+1.5+1.6,4,1.6,0.6,'-z',conc);rail(cx-1.3,cz-1.4,cx-1.3,cz+1.4,0.95);
  // kickers and ledges along the sides
  wedge(x0+2,cz-7,2,1.8,0.7,'+z',wood);wedge(x1-2,cz+7,2,1.8,0.7,'-z',wood);
  box(x0+1.2,cz+4,0.9,7,0.45,conc,false);R.push({ax:x0+1.65,az:cz+0.5,bx:x0+1.65,bz:cz+7.5,y:0.6,n:'Лэдж'});R.push({ax:x0+0.75,az:cz+0.5,bx:x0+0.75,bz:cz+7.5,y:0.6,n:'Лэдж'});
  box(x1-1.2,cz-4,0.9,7,0.45,conc,false);R.push({ax:x1-1.65,az:cz-7.5,bx:x1-1.65,bz:cz-0.5,y:0.6,n:'Лэдж'});R.push({ax:x1-0.75,az:cz-7.5,bx:x1-0.75,bz:cz-0.5,y:0.6,n:'Лэдж'});
  rail(x1-3.2,cz+2,x1-3.2,cz+9,0.55);rail(x0+3.2,cz-9,x0+3.2,cz-2,0.55);
  // graffiti on the ramps, floodlights, a sign
  const tg=CITY.mat.tag;for(let k=0;k<4;k++){const q=new THREE.Mesh(new THREE.PlaneGeometry(3,1.8),tg);const i=k%8,u=(i%4)/4,v=1-Math.floor(i/4)/2;const a=q.geometry.attributes.uv;for(let j=0;j<a.count;j++)a.setXY(j,u+0.25*a.getX(j),v-0.5+0.5*a.getY(j));
    q.position.set(cx-W/3+k*W/4.5,1.1,k%2?z1+0.01-0.0:z0-0.01);q.rotation.y=k%2?0:Math.PI;scene.add(q);}
  const sg=rtex(128,40,(g)=>{g.fillStyle='#111';g.fillRect(0,0,128,40);g.fillStyle='#ffd84d';g.font="900 22px Impact,sans-serif";g.textAlign='center';g.fillText('SKATEPARK',64,28);});
  const sm=new THREE.Mesh(new THREE.PlaneGeometry(3,0.95),LM({map:sg,emissive:0x333333}));sm.position.set(x0-0.6,3.2,cz);sm.rotation.y=-Math.PI/2;scene.add(sm);for(const s of[-1,1]){const pole=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.05,3.2,6),metal);pole.position.set(x0-0.6,1.6,cz+s*1.3);scene.add(pole);}
  // free boards to try
  for(const[bx,bz,c]of[[x0+3,z0+6,'#c4161c'],[x1-3,z1-6,'#1f6fd6']]){const b=makeCar('skate',c,bx,bz,0,'parked');b.keep=true;b.y=0;placeCar(b);SKP.boards.push(b);}
  // every curb, bench and wall top in the city is grindable
  for(const b of blocks){const y=0.15;R.push({ax:b.x0,az:b.z0,bx:b.x1,bz:b.z0,y,n:'Бордюр',curb:1},{ax:b.x0,az:b.z1,bx:b.x1,bz:b.z1,y,n:'Бордюр',curb:1},{ax:b.x0,az:b.z0,bx:b.x0,bz:b.z1,y,n:'Бордюр',curb:1},{ax:b.x1,az:b.z0,bx:b.x1,bz:b.z1,y,n:'Бордюр',curb:1});}
  for(const b of CITY.benches){const ux=Math.cos(b.h),uz=-Math.sin(b.h);R.push({ax:b.x-ux*0.85,az:b.z-uz*0.85,bx:b.x+ux*0.85,bz:b.z+uz*0.85,y:0.62,n:'Скамейка'});}}
V6.build.push(skateparkBuild);
/* surface height for boards: ground + skatepark features; returns [h, slopeAlongHeading] */
function featH(f,x,z){const c=Math.cos(-f.ry),s=Math.sin(-f.ry),dx=x-f.x,dz=z-f.z,lx=dx*c+dz*s,lz=-dx*s+dz*c;
  if(f.box){if(Math.abs(dx)<=f.w/2&&Math.abs(dz)<=f.l/2)return f.h;return -1;}
  if(Math.abs(lx)>f.w/2||lz<0||lz>f.l)return -1;const t=lz/f.l;return f.curve?f.h*(1-Math.sqrt(Math.max(0,1-t*t))):f.h*t;}
function surfH(x,z){let h=groundY(x,z);SKP.vert=false;const B=SKP.box;if(B&&x>B.x0-4&&x<B.x1+4&&z>B.z0-4&&z<B.z1+4){for(const f of SKP.feat){const v=featH(f,x,z);if(v>=0&&0.15+v>=h){h=0.15+v;SKP.vert=!!f.curve&&v>0.05;}}}return h;}
/* trick tables */
const TRK={skate:{flip:[['Кикфлип',100],['Хилфлип',100],['Поп-шовит',80],['360-флип',300]],grab:[['Мелон',150],['Инди',150],['Носграб',170]],grind:['50-50','5-0','Кроокед','Смит'],manual:'Мэнуал'},
  bmx:{flip:[['Тейлвип',250],['Барспин',150],['Супермен',200],['Тейлвип 360',400]],grab:[['Ноу-хендер',180],['Кан-кан',150],['Икс-ап',170]],grind:['Дабл-пег','Фибл','Айспик','Смит'],manual:'Мэнуал'}};
function skUI(S){const el=$('#trick');if(S.bankT>0)return;if(!S.combo.length){el.classList.remove('on');return;}
  el.className='on';el.querySelector('.tl').textContent=S.combo.slice(-5).map(t=>t.n+(t.x>1?' ×'+t.x:'')).join(' + ');el.querySelector('.ts').innerHTML=Math.round(S.pts)+' <i>× '+S.combo.length+'</i>';}
function addTrick(S,n,p){const last=S.combo[S.combo.length-1];if(last&&last.n===n){last.x++;S.pts+=Math.round(p*0.5);}else{S.combo.push({n,x:1});S.pts+=p;}S.lastT=time;skUI(S);}
function bank(S){if(!S.combo.length)return;const total=Math.round(S.pts*S.combo.length);const el=$('#trick');el.className='on bank';el.querySelector('.ts').innerHTML='+'+total;
  if(total>(pl.skBest||0))pl.skBest=total;pl.money+=Math.floor(total/250);if(total>=2000){slowmo(0.6,0.25);tone(880,0.12,'square',0.08);tone(1320,0.2,'square',0.08,0,AU.c&&AU.c.currentTime+0.1);}else tone(660,0.1,'square',0.06);
  S.combo=[];S.pts=0;S.bankT=1.4;}
function bail(c,S,why){if(S.st==='bail')return;S.st='bail';S.bt=0;const el=$('#trick');el.className='on bail';el.querySelector('.ts').textContent=why||'ПАДЕНИЕ!';el.querySelector('.tl').textContent='';S.combo=[];S.pts=0;S.bankT=1.4;
  sfx.thud(0.9);shake=0.3;hurtPlayer(4);c.speed*=0.2;pl.ch.dead=true;pl.ch.root.rotation.z=1.3;$('#bal').style.display='none';}
/* main controller: takes over the player while riding a board or BMX */
const _vp=V6.player;
V6.player=function(dt,inp){const c=pl.inCar;if(!c||!c.T.bike||c.T.motor)return _vp?_vp(dt,inp):false;
  const S=c.sk||(c.sk={st:'ground',y:surfH(c.x,c.z),vy:0,combo:[],pts:0,spin:0,trick:null,bal:0,grind:null,landT:0,bankT:0,push:0});const T=TRK[c.T.skate?'skate':'bmx'];
  if(inp.inv){openInv();return true;}c.steerV=lerp(c.steerV||0,inp.mx,Math.min(1,dt*6));
  if(S.bankT>0){S.bankT-=RDT;if(S.bankT<=0)skUI(S);}
  const sp=Math.abs(c.speed);let anim={skate:!!c.T.skate,bike:!c.T.skate,st:S.st,crouch:0};
  if(!S.hint&&!pl.skHint){S.hint=pl.skHint=1;showMsg(isTouch?'ПРЫЖОК — олли · ОГОНЬ в воздухе — флип · ДЕЙСТВ. в воздухе — грэб · ОРУЖ. — мэнуал · джойстик в воздухе — вращение':'ПРОБЕЛ — олли · K/ЛКМ в воздухе — флип (W/S — другой) · E в воздухе — грэб · R — мэнуал · A/D в воздухе — вращение',8);}
  if(S.st==='bail'){S.bt+=dt;c.speed*=Math.pow(0.1,dt);if(S.bt>1.3){pl.ch.dead=false;pl.ch.root.rotation.z=0;S.st='ground';if(S.exitAfter){S.exitAfter=false;exitBoard(c);return true;}}moveBoard(c,S,dt,false);finish(c,S,dt,anim);return true;}
  if(S.st==='ground'||S.st==='manual'){
    const thr=inp.mz;if(thr>0.2&&c.speed<c.T.vmax){c.speed+=(c.T.acc)*thr*dt;S.push+=dt*thr;}else if(thr<-0.2){c.speed-=8*(-thr)*dt;if(c.speed<0)c.speed=Math.max(c.speed,-3);}
    c.speed-=c.speed*(S.st==='manual'?0.05:0.1)*dt;
    c.h-=inp.mx*(c.T.skate?2.4:2.7)*dt*clamp(c.speed/3,-1,1);c.vh=c.h;
    if(inp.jump){S.st='air';S.vy=(c.T.skate?5.4:5.0)+sp*0.05;addTrick(S,c.T.skate?'Олли':'Банни-хоп',c.T.skate?50:40);sfx.thud(0.35);nz(0.05,3000,'highpass',0.2);S.spin=0;S.trick=null;}
    else if(inp.action){if(sp>7){bail(c,S,'СПРЫГНУЛ!');S.exitAfter=true;}else{exitBoard(c);return true;}}
    else if(inp.wpn&&sp>2.5){if(S.st==='manual')S.st='ground';else{S.st='manual';S.bal=rr(-0.15,0.15);addTrick(S,T.manual,40);}}
    if(S.st==='manual'){S.bal+=(S.bal*1.6+rr(-0.5,0.5))*dt-inp.mz*1.8*dt;S.pts+=40*dt;skUI(S);if(Math.abs(S.bal)>1){bail(c,S);}}
    else if(S.combo.length&&time-S.lastT>0.8)bank(S);
    if(S.st==='ground'&&S.landT>0)S.landT-=dt;}
  else if(S.st==='air'){S.vy-=15*dt;c.h+=inp.mx*-5.2*dt;S.spin+=Math.abs(inp.mx)*5.2*dt;
    if(inp.fire&&!S.trick){const k=c.T.skate?(Math.abs(inp.mx)>0.5?3:inp.mz>0.5?1:inp.mz<-0.5?2:0):(Math.abs(inp.mx)>0.5?3:inp.mz>0.5?1:inp.mz<-0.5?2:0);const t=T.flip[k];S.trick={n:t[0],p:t[1],t:0,dur:c.T.skate?0.42:0.5,kind:'flip',k};}
    if(inp.action&&!S.trick){const k=inp.mz>0.5?1:inp.mz<-0.5?2:0,t=T.grab[k];S.trick={n:t[0],p:t[1],t:0,dur:0.65,kind:'grab',k};}
    if(S.trick){S.trick.t+=dt;if(S.trick.t>=S.trick.dur&&!S.trick.done){S.trick.done=true;addTrick(S,S.trick.n,S.trick.p);if(S.trick.kind==='grab')S.trick=null;else{S.trick=null;}}}
    // spin points as they happen
    const sn=Math.floor((S.spin+0.6)/Math.PI);if(sn>(S.spinD||0)){S.spinD=sn;addTrick(S,(sn*180)+'°',sn*90);}
    // grind catch
    if(S.vy<0){const g=findRail(c,S);if(g){S.st='grind';S.grind=g;S.y=g.y;S.vy=0;S.bal=rr(-0.2,0.2);const nm=g.n==='Бордюр'||g.n==='Скамейка'||g.n==='Лэдж'||g.n==='Слайд'?T.grind[Math.floor(Math.random()*4)]:g.n==='Копинг'?(c.T.skate?'Рок-н-ролл':'Фибл'):T.grind[0];
        S.gname=nm+(g.n==='Копинг'?'':' · '+g.n.toLowerCase());addTrick(S,S.gname,120);sfx.thud(0.4);S.trick=null;S.spin=0;S.spinD=0;}}}
  else if(S.st==='grind'){const g=S.grind,dx=g.bx-g.ax,dz=g.bz-g.az,L=Math.hypot(dx,dz),ux=dx/L,uz=dz/L;
    const dir=Math.sign(Math.sin(c.vh)*ux+Math.cos(c.vh)*uz)||1;c.h=c.vh=Math.atan2(ux*dir,uz*dir);c.speed=Math.max(c.speed,4)-0.6*dt;
    S.bal+=(S.bal*1.5+rr(-0.7,0.7))*dt-inp.mx*2.0*dt;S.pts+=60*dt;skUI(S);if(Math.random()<dt*25)emit(c.x,S.y+0.05,c.z,1,'#ffd27a',1.5,1.5,0.25,8);
    if(Math.abs(S.bal)>1){bail(c,S);}
    else{const t=((c.x-g.ax)*ux+(c.z-g.az)*uz)/L;if(t<-0.02||t>1.02){S.st='air';S.vy=1.6;$('#bal').style.display='none';}
      if(inp.jump){S.st='air';S.vy=5;addTrick(S,c.T.skate?'Олли':'Банни-хоп',50);S.spin=0;S.spinD=0;$('#bal').style.display='none';}}}
  moveBoard(c,S,dt,true);finish(c,S,dt,anim);return true;};
function findRail(c,S){const fx=Math.sin(c.vh),fz=Math.cos(c.vh);let best=null,bd=0.42;
  for(const g of SKP.rails){if(c.x<Math.min(g.ax,g.bx)-1||c.x>Math.max(g.ax,g.bx)+1||c.z<Math.min(g.az,g.bz)-1||c.z>Math.max(g.az,g.bz)+1)continue;
    if(S.y<g.y-0.25||S.y>g.y+0.45)continue;const dx=g.bx-g.ax,dz=g.bz-g.az,L=Math.hypot(dx,dz),ux=dx/L,uz=dz/L;if(Math.abs(fx*ux+fz*uz)<0.72)continue;
    const t=((c.x-g.ax)*ux+(c.z-g.az)*uz);if(t<0.1||t>L-0.1)continue;const px=g.ax+ux*t,pz=g.az+uz*t,d=Math.hypot(c.x-px,c.z-pz);if(d<bd){bd=d;best={...g,px,pz};}}
  if(best){c.x=best.px;c.z=best.pz;}return best;}
function moveBoard(c,S,dt,coll){const nx=c.x+Math.sin(c.vh)*c.speed*dt,nz=c.z+Math.cos(c.vh)*c.speed*dt;
  const hs=surfH(nx,nz);
  if(S.st==='grind'){c.x=nx;c.z=nz;S.y=S.grind.y;}
  else if(S.st==='air'){if(coll&&blockedAt(nx,nz,S.y+0.3)){c.speed*=-0.3;}else{c.x=nx;c.z=nz;}S.y+=S.vy*dt;
    if(S.y<=hs){// landing
      const tr=S.trick;const d=Math.abs(angDiff(c.h,c.vh)),m=Math.min(d,Math.PI-d);
      if(tr&&!tr.done&&tr.kind==='flip'){S.y=hs;bail(c,S,'НЕ ДОКРУТИЛ!');}
      else if(m>0.6){S.y=hs;bail(c,S,'КРИВО ПРИЗЕМЛИЛСЯ!');}
      else{if(d>Math.PI/2){c.h=c.vh+Math.PI;c.vh=c.h;S.fakie=!S.fakie;}else{c.h=c.vh;}S.y=hs;S.st='ground';S.vy=0;S.trick=null;S.spin=0;S.spinD=0;S.landT=0.2;sfx.thud(0.5);
        if(S.combo.length>4)shake=Math.max(shake,0.08);}}}
  else{// on the ground: follow the surface, take off from lips, climb small steps only
    const rise=hs-S.y,steep=rise/(Math.abs(c.speed*dt)+0.01);
    const onV=SKP.vert||S.onVert;S.onVert=SKP.vert;
    if(onV&&steep>1.1&&Math.abs(c.speed)>2.5){S.st='air';S.vy=Math.min(13,Math.abs(c.speed)*0.95);S.vrot=Math.PI/(2*S.vy/15);c.speed*=0.06;S.vert=1;S.spin=0;S.spinD=0;S.trick=null;S.y=Math.max(S.y,Math.min(hs,S.y+0.3));addTrick(S,'Верт',60);c.y=0;c.by=S.y;pl.x=c.x;pl.z=c.z;return;}
    if(rise>0.22&&steep>1.4&&coll){c.speed*=-0.35;sfx.thud(0.5);if(Math.abs(c.speed)>4)bail(c,S,'ВРЕЗАЛСЯ!');}
    else{const vs=(hs-S.y)/Math.max(dt,0.001);if(hs<S.y-0.08){S.st='air';S.vy=clamp(S.lastVs||0,-2,14);S.spin=0;S.spinD=0;S.trick=null;}else{S.y=hs;S.lastVs=vs;}
      c.speed-=Math.sign(rise)*Math.min(Math.abs(rise)/Math.max(Math.abs(c.speed*dt),0.01),3)*9.8*dt*Math.sign(c.speed)*0.6;
      if(coll&&blockedAt(nx,nz,S.y+0.4)){c.speed*=-0.3;if(Math.abs(c.speed)>3){sfx.thud(0.6);bail(c,S,'В СТЕНУ!');}}else{c.x=nx;c.z=nz;}
}}
  if(S.st==='air'&&S.vert){c.h+=(S.vrot||3)*dt;}
  if(S.st!=='air')S.vert=0;
  c.y=0;c.by=S.y;pl.x=c.x;pl.z=c.z;}
function finish(c,S,dt,anim){const bal=$('#bal');if(S.st==='grind'||S.st==='manual'){bal.style.display='block';bal.firstChild.style.left=(88+clamp(S.bal,-1,1)*86)+'px';}else bal.style.display='none';
  // board visuals: flips, tilt, wheels
  const dk=c.T.skate&&c.sk&&c.mesh.children[0];if(dk){const tr=S.trick;dk.rotation.set(0,0,0);
    if(tr&&tr.kind==='flip'){const k=Math.min(1,tr.t/tr.dur);if(tr.k===0)dk.rotation.z=k*TAU;else if(tr.k===1)dk.rotation.z=-k*TAU;else if(tr.k===2)dk.rotation.y=k*Math.PI;else{dk.rotation.z=k*TAU;dk.rotation.y=k*TAU;}dk.position.y=0.25*Math.sin(k*Math.PI);}
    else dk.position.y=S.st==='air'?0.12:0;if(S.st==='manual')dk.rotation.x=-0.22;if(S.st==='grind')dk.rotation.y=0.25;}
  if(!c.T.skate){c.mesh.rotation.z=clamp(-c.steerV*Math.abs(c.speed)*0.035,-0.45,0.45);c.mesh.rotation.x=S.st==='manual'?-0.45:S.st==='air'?-0.15:0;
    const tr=S.trick;c.mesh.rotation.y=tr&&tr.kind==='flip'&&(tr.k===0||tr.k===3)?Math.min(1,tr.t/tr.dur)*TAU:0;if(c.wheels)c.wheels.forEach(w=>w.rotation.x+=c.speed*dt/0.31);}
  const tr=S.trick;Object.assign(anim,{st:S.st,trick:tr&&tr.kind,tk:tr&&tr.k,bal:S.bal,push:S.push,spd:Math.abs(c.speed)});pl.ch.skateA=anim;
  animChar(pl.ch,dt,c.T.skate?0:Math.abs(c.speed)*0.9,c.T.skate?{skate:1}:{bike:1});
  if(S.st!=='bail')pl.ch.root.rotation.z=0;
  if(AU.c){AU.engG.gain.value=0;}
  // rolling sound
  if(AU.c&&S.st==='ground'&&Math.abs(c.speed)>1&&Math.random()<dt*14)nz(0.08,c.T.skate?500:300,'lowpass',0.05*Math.min(1,Math.abs(c.speed)/8));}
function exitBoard(c){const S=c.sk;if(S){S.combo=[];$('#trick').classList.remove('on');$('#bal').style.display='none';}c.speed=0;exitCar(true);if(c.T.skate&&c.own){const i=cars.indexOf(c);if(i>=0)removeCar(i);}}
/* rider poses */
const _va=V6.anim;V6.anim=function(ch,dt,spd,o){_va(ch,dt,spd,o);const A=ch.skateA;if(!o||!A||ch!==pl.ch||!pl.inCar)return;
  if(o.skate){for(const k in POSE)if(/Leg|Foot|Spine|Hips|Head|Arm/.test(k))delete POSE[k];addP('UpperArmL',0,0,-1.32);addP('UpperArmR',0,0,1.32);
    const cr=A.st==='air'?1:A.st==='grind'?0.6:0.35;addP('UpperLegL',-0.45*cr-0.1,0,0.22);addP('UpperLegR',-0.45*cr-0.1,0,-0.22);addP('LowerLegL',0.9*cr+0.15,0,0);addP('LowerLegR',0.9*cr+0.15,0,0);addP('FootL',-0.3*cr,0,-0.2);addP('FootR',-0.3*cr,0,0.2);
    addP('UpperArmL',-0.2,0,0.85);addP('UpperArmR',-0.2,0,-0.85);addP('ForeArmL',0,-0.5,0);addP('ForeArmR',0,0.5,0);addP('Spine2',0.1,-0.55,0);addP('Head',0,-0.95,0);ch.bob=-0.14*cr;
    if(A.st==='ground'&&A.spd<11){const pp=Math.sin(A.push*6);if(Math.abs(pp)>0.2&&A.spd<10){addP('UpperLegR',-0.5*pp,0,0.2);addP('LowerLegR',0.3,0,0);}}
    if(A.st==='grind'){addP('UpperArmL',0,0,0.6);addP('UpperArmR',0,0,-0.6);addP('Spine1',0,0,A.bal*0.45);}
    if(A.st==='manual'){addP('Spine1',-0.3,0,A.bal*0.3);addP('UpperArmL',-0.5,0,0.2);addP('UpperArmR',-0.5,0,-0.2);}
    if(A.trick==='grab'){addP('UpperArmR',0.4,0,0.8);addP('ForeArmR',0,0.3,0);addP('Spine1',0.35,0,0);addP('UpperLegL',-0.5,0,0);addP('UpperLegR',-0.5,0,0);addP('LowerLegL',0.6,0,0);addP('LowerLegR',0.6,0,0);ch.bob=-0.3;}
    if(A.trick==='flip'){addP('UpperLegL',-0.4,0,0);addP('UpperLegR',-0.4,0,0);addP('LowerLegL',0.5,0,0);addP('LowerLegR',0.5,0,0);ch.bob=-0.05;}
    if(A.st==='bail'){for(const k in POSE)delete POSE[k];addP('UpperArmL',-1.2,0,0.3);addP('UpperArmR',-1.2,0,-0.3);addP('UpperLegL',-0.6,0,0);addP('LowerLegL',0.8,0,0);}}
  else if(o.bike){if(A.trick==='flip'&&A.tk===2){addP('UpperLegL',1.4,0,0);addP('UpperLegR',1.4,0,0);addP('LowerLegL',-1.3,0,0);addP('LowerLegR',-1.3,0,0);addP('Spine1',-0.2,0,0);}
    if(A.trick==='grab'){if(A.tk===0){addP('UpperArmL',-1.4,0,0.4);addP('UpperArmR',-1.4,0,-0.4);}else if(A.tk===1){addP('UpperLegL',0.3,0,1.0);addP('LowerLegL',-1.0,0,0);}else{addP('UpperArmL',0,-0.5,0);addP('UpperArmR',0,0.5,0);}}
    if(A.st==='manual')addP('Spine1',-0.35,0,0);if(A.st==='grind'){addP('UpperLegL',0.3,0,0.2);addP('UpperLegR',0.3,0,-0.2);}}};
/* own board: B key / touch button drops it under your feet */
function deployBoard(){if(!pl.board||pl.inCar||pl.act||state!=='play'||CINE.on)return;const b=makeCar('skate','#7a2fb5',pl.x,pl.z,pl.h,'parked');b.own=true;b.y=0;placeCar(b);b.sk=null;enterCar(b);lookIdle=2;}
addEventListener('keydown',e=>{if(e.code==='KeyB'&&inGame())deployBoard();});
(()=>{const b=document.createElement('div');b.className='tb';b.id='tb-board';b.textContent='ДОСКА';b.style.display='none';document.getElementById('touch').appendChild(b);
  b.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();audioInit();if(pl.inCar&&pl.inCar.own)exitBoard(pl.inCar);else deployBoard();});})();
V6.upd.push(()=>{const b=$('#tb-board');if(b)b.style.display=pl.board&&!CINE.on?'':'none';});
window.SKATE_UNLOCK=()=>{showMsg('Доска твоя: жми B (или кнопку ДОСКА), чтобы встать на неё где угодно.',6);};
{const ob=V6.blips;V6.blips=()=>{const B=ob();if(SKP.box)B.push({x:SKP.box.cx,z:SKP.box.cz,col:'#7dff9a',r:3,letter:'S'});return B;};}
