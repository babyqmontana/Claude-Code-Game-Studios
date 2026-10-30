/* ======================= V6 CORE: overlays, slow motion, camera ======================= */
const V6CSS=document.createElement('style');V6CSS.textContent=`
#lbox{position:fixed;inset:0;pointer-events:none;z-index:6}
#lbox:before,#lbox:after{content:'';position:absolute;left:0;right:0;height:0;background:#000;transition:height .5s ease}
#lbox:before{top:0}#lbox:after{bottom:0}
#lbox.on:before,#lbox.on:after{height:11vh}
#sub{position:fixed;left:50%;bottom:13vh;transform:translateX(-50%);width:min(88vw,760px);text-align:center;z-index:7;pointer-events:none;
  font:600 clamp(15px,2.4vw,22px)/1.3 'Exo 2',sans-serif;color:#fff;text-shadow:0 2px 0 #000,0 0 6px #000;opacity:0;transition:opacity .2s}
#sub b{display:block;font-size:.72em;letter-spacing:.18em;color:#ffd84d;margin-bottom:2px}
#sub.on{opacity:1}
#fade{position:fixed;inset:0;background:#000;opacity:0;pointer-events:none;z-index:8;transition:opacity .35s}
#xh{position:fixed;left:50%;top:50%;width:26px;height:26px;margin:-13px 0 0 -13px;pointer-events:none;z-index:4;opacity:0;transition:opacity .12s}
#xh i{position:absolute;background:#fff;box-shadow:0 0 2px #000}
#xh i:nth-child(1){left:12px;top:0;width:2px;height:8px}#xh i:nth-child(2){left:12px;bottom:0;width:2px;height:8px}
#xh i:nth-child(3){top:12px;left:0;height:2px;width:8px}#xh i:nth-child(4){top:12px;right:0;height:2px;width:8px}
#hm{position:fixed;left:50%;top:50%;width:30px;height:30px;margin:-15px 0 0 -15px;pointer-events:none;z-index:5;opacity:0}
#hm:before,#hm:after{content:'';position:absolute;left:14px;top:-2px;width:3px;height:34px;background:#fff;transform:rotate(45deg);box-shadow:0 0 3px #000}
#hm:after{transform:rotate(-45deg)}#hm.kill:before,#hm.kill:after{background:#ff3040}
#skip{position:fixed;right:16px;bottom:calc(11vh + 8px);z-index:9;font:700 12px 'Exo 2',sans-serif;color:#fff;background:rgba(0,0,0,.45);padding:6px 10px;border-radius:14px;display:none;letter-spacing:.1em}
#skip.on{display:block}
#obj{position:fixed;left:50%;top:clamp(70px,13vh,120px);transform:translateX(-50%);z-index:4;pointer-events:none;font:700 clamp(13px,2vw,17px) 'Exo 2',sans-serif;color:#fff;
  text-shadow:0 2px 0 #000;background:linear-gradient(90deg,transparent,rgba(10,10,30,.6),transparent);padding:5px 40px;white-space:nowrap;opacity:0;transition:opacity .3s}
#obj.on{opacity:1}#obj em{color:#ffd84d;font-style:normal}
`;document.head.appendChild(V6CSS);
(()=>{const add=(id,html)=>{const d=document.createElement('div');d.id=id;if(html)d.innerHTML=html;document.body.appendChild(d);return d;};
  add('lbox');add('sub');add('fade');add('xh','<i></i><i></i><i></i><i></i>');add('hm');add('skip','▶▶ ПРОПУСТИТЬ');add('obj');})();

/* slow motion: target scale for a real-time duration */
const SLOW={t:0,ts:1};
function slowmo(ts,dur){SLOW.ts=ts;SLOW.t=dur;}
function updSlow(rdt){if(SLOW.t>0){SLOW.t-=rdt;TS=lerp(TS,SLOW.ts,Math.min(1,rdt*14));}else TS=lerp(TS,1,Math.min(1,rdt*5));if(Math.abs(TS-1)<0.01)TS=1;}

/* screen overlays */
function hitmark(kill){const e=$('#hm');e.className=kill?'kill':'';e.style.transition='none';e.style.opacity=1;e.style.transform='scale(1.25)';
  requestAnimationFrame(()=>{e.style.transition='opacity .35s, transform .2s';e.style.opacity=0;e.style.transform='scale(1)';});}
function fadeTo(v,ms){const f=$('#fade');f.style.transitionDuration=(ms||350)+'ms';f.style.opacity=v;}
function objective(html,t){const o=$('#obj');o.innerHTML=html;o.classList.add('on');clearTimeout(objective.tm);if(t)objective.tm=setTimeout(()=>o.classList.remove('on'),t*1000);}

/* camera: follow, over-the-shoulder aim, vehicle chase with speed FOV, scripted shots */
const CAMS={shot:null,kick:0,kickX:0,fovP:0,pos:new V3(),look:new V3(),init:false,aimK:0,carK:0,fov:62};
function camShot(o){CAMS.shot=Object.assign({t:0,dur:2},o);}
function baseFov(){return innerWidth<innerHeight?78:62;}
V6.cam=function(){const rd=RDT||0.016,c=pl.inCar;updSlow(rd);
  let px,py,pz,lx,ly,lz,fov=baseFov();
  if(CAMS.shot){const s=CAMS.shot;s.t+=rd;const k=s.ease===false?Math.min(1,s.t/s.dur):smooth(Math.min(1,s.t/s.dur));
    const P0=typeof s.from==='function'?s.from():s.from,P1=s.to?(typeof s.to==='function'?s.to():s.to):P0,L0=typeof s.look==='function'?s.look():s.look,L1=s.look2?(typeof s.look2==='function'?s.look2():s.look2):L0;
    px=lerp(P0[0],P1[0],k);py=lerp(P0[1],P1[1],k);pz=lerp(P0[2],P1[2],k);lx=lerp(L0[0],L1[0],k);ly=lerp(L0[1],L1[1],k);lz=lerp(L0[2],L1[2],k);fov=s.fov||fov;
    if(s.t>=s.dur&&!s.hold){const done=s.done;CAMS.shot=null;CAMS.init=false;if(done)done();}
    CAMS.pos.set(px,py,pz);CAMS.look.set(lx,ly,lz);if(s.shake){CAMS.pos.x+=Math.sin(time*7.3)*s.shake;CAMS.pos.y+=Math.sin(time*5.1)*s.shake*0.6;}cam.position.copy(warpV(CAMS.pos.clone()));cam.lookAt(warpV(CAMS.look.clone()));setFov(fov,rd,true);return true;}
  const aimOn=!c&&!pl.dead&&pl.ch&&pl.ch.aim>0.35&&!WDEF[pl.cur].melee&&!WDEF[pl.cur].spray;
  CAMS.aimK=lerp(CAMS.aimK,aimOn?1:0,Math.min(1,rd*9));const ak=CAMS.aimK;
  let tx,ty,tz,dist,side=0;
  if(c){const sp=Math.abs(c.speed);tx=c.x+Math.sin(c.h)*clamp(c.speed,-4,30)*0.12;ty=1.5+(c.T.bh||0.5)*0.45+(c.T.bike?(c.by||0)*0.85:0);tz=c.z+Math.cos(c.h)*clamp(c.speed,-4,30)*0.12;
    dist=(c.T.bike?(innerWidth<innerHeight?5.4:4.2):(innerWidth<innerHeight?9.5:7.2))+sp*0.05;lookIdle+=rd;
    if(lookIdle>1.0&&sp>1){yaw=angLerp(yaw,c.h+(c.speed<-1?Math.PI:0),Math.min(1,rd*(2+sp*0.08)));pitch=lerp(pitch,0.2,Math.min(1,rd*2));}
    fov+=Math.min(16,sp*0.45);}
  else{tx=pl.x;ty=pl.y+lerp(1.55,1.62,ak);tz=pl.z;dist=lerp(innerWidth<innerHeight?5.6:4.2,innerWidth<innerHeight?2.6:2.2,ak);side=lerp(0,innerWidth<innerHeight?0.45:0.62,ak);fov-=10*ak;}
  const pt=clamp(pitch+CAMS.kick,-0.35,1.25),cp=Math.cos(pt),sp_=Math.sin(pt),yw=yaw+CAMS.kickX;
  const rx=-Math.cos(yw),rz=Math.sin(yw);tx+=rx*side;tz+=rz*side;
  let cx=tx-Math.sin(yw)*cp*dist,cz=tz-Math.cos(yw)*cp*dist,cy=ty+sp_*dist;
  for(let i=1;i<=14;i++){const t=i/14,x=lerp(tx,cx,t),z=lerp(tz,cz,t),y=lerp(ty,cy,t);if(blockedAt(x,z,y)){const k=Math.max(0.12,(i-1.5)/14);cx=lerp(tx,cx,k);cz=lerp(tz,cz,k);cy=lerp(ty,cy,k);break;}}
  cy=Math.max(cy,0.55);
  if(!CAMS.init){CAMS.pos.set(cx,cy,cz);CAMS.init=true;}
  const follow=c?1-Math.exp(-rd*14):1-Math.exp(-rd*30);CAMS.pos.x=lerp(CAMS.pos.x,cx,follow);CAMS.pos.y=lerp(CAMS.pos.y,cy,follow);CAMS.pos.z=lerp(CAMS.pos.z,cz,follow);
  cam.position.copy(CAMS.pos);
  if(shake>0.001){cam.position.x+=rr(-1,1)*shake*0.3;cam.position.y+=rr(-1,1)*shake*0.3;cam.position.z+=rr(-1,1)*shake*0.3;shake*=Math.pow(0.02,rd);}
  warpV(cam.position);const lk=c?0.4:0.15+0.05*ak;cam.lookAt(warpV(new V3(tx+Math.sin(yw)*(ak*6+0.01),ty+lk-Math.sin(CAMS.kick)*2,tz+Math.cos(yw)*(ak*6+0.01))));
  CAMS.kick*=Math.pow(0.0005,rd);CAMS.kickX*=Math.pow(0.001,rd);CAMS.fovP*=Math.pow(0.002,rd);
  setFov(fov-CAMS.fovP,rd);
  $('#xh').style.opacity=ak>0.6?1:0;
  return true;};
function setFov(f,rd,snap){CAMS.fov=snap?f:lerp(CAMS.fov,f,Math.min(1,rd*8));if(Math.abs(cam.fov-CAMS.fov)>0.05){cam.fov=CAMS.fov;cam.updateProjectionMatrix();}}
function smooth(k){return k*k*(3-2*k);}
/* right mouse / touch aim keeps the aim pose alive */
V6.input=function(I){if(I.aim&&!pl.inCar&&state==='play')pl.aimT=Math.max(pl.aimT,0.12);if(CINE.on){I.mx=I.mz=0;I.fire=I.run=false;I.jump=I.action=I.wpn=I.inv=0;I.aim=false;}};
const CINE={on:false};
/* hint messages live at the top, small, never across the middle of the action */
V6CSS.textContent+=`#hud #msg{top:calc(clamp(110px,18vh,150px) + env(safe-area-inset-top,0px));bottom:auto!important;font:600 clamp(13px,1.9vw,17px)/1.3 'Exo 2',sans-serif;width:min(80vw,560px);padding:6px 14px}
#hud #banner{top:22%}@media (max-height:520px){#hud #msg{top:8px;left:44%;width:min(40vw,400px);font-size:12px}#hud #banner{top:14%}#hud #banner-t{font-size:24px}}
@media (max-width:600px){#hud #msg{top:calc(150px + env(safe-area-inset-top,0px));font-size:13px}}`;
