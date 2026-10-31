/* ======================= V6: culling that knows about the bend, a vector map, a real loading screen ======================= */
/* Frustum culling must test where an object is DRAWN, not where it is on the grid: move the bounding sphere through
   the bend and grow it (the bend stretches things by up to ~2x near a swirl). */
{const S=new THREE.Sphere(),V=new V3();
  THREE.Frustum.prototype.intersectsObject=function(o){const g=o.geometry;if(!g)return true;if(g.boundingSphere===null)g.computeBoundingSphere();
    S.copy(g.boundingSphere).applyMatrix4(o.matrixWorld);if(WARPU.value>0.5&&!o.userData.rigidObj){warpV(S.center);S.radius=S.radius*2+3;}return this.intersectsSphere(S);};
  THREE.Frustum.prototype.intersectsSprite=function(sp){S.center.set(0,0,0);S.radius=0.7071067811865476;S.applyMatrix4(sp.matrixWorld);if(WARPU.value>0.5){warpV(S.center);S.radius+=2;}return this.intersectsSphere(S);};}
/* the map, drawn as vectors in the bent space (no pixel smearing) */
function drawWarpedMap(){const N=1024,[c,g]=mk(N,N),k=N/MW,W=(x,z)=>{const w=warpRaw(x,z);return[(w[0]+MARG)*k,(w[1]+MARG)*k];};
  const poly=(pts,fill,stroke,lw)=>{g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();if(fill){g.fillStyle=fill;g.fill();}if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1;g.stroke();}};
  const rect=(x0,z0,x1,z1,step)=>{const P_=[],st=step||4;for(let x=x0;x<x1;x+=st)P_.push(W(x,z0));for(let z=z0;z<z1;z+=st)P_.push(W(x1,z));for(let x=x1;x>x0;x-=st)P_.push(W(x,z1));for(let z=z1;z>z0;z-=st)P_.push(W(x0,z));return P_;};
  const bg=g.createRadialGradient(N/2,N/2,N*0.1,N/2,N/2,N*0.7);bg.addColorStop(0,'#1d1838');bg.addColorStop(1,'#0e0b20');g.fillStyle=bg;g.fillRect(0,0,N,N);
  g.lineCap='round';g.lineJoin='round';
  // asphalt: every street as a smooth stroked curve, then the centre dashes
  const line=(ax,az,bx,bz)=>{g.beginPath();const n=Math.ceil(Math.hypot(bx-ax,bz-az)/3);for(let i=0;i<=n;i++){const p=W(lerp(ax,bx,i/n),lerp(az,bz,i/n));i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]);}g.stroke();};
  g.strokeStyle='#8f8ab0';g.lineWidth=(ROAD+1.5)*k;for(let i=0;i<=NB;i++){line(-HALF,i*P,SIZE+HALF,i*P);line(i*P,-HALF,i*P,SIZE+HALF);}
  g.strokeStyle='#b4b0cf';g.lineWidth=ROAD*k;for(let i=0;i<=NB;i++){line(-HALF,i*P,SIZE+HALF,i*P);line(i*P,-HALF,i*P,SIZE+HALF);}
  g.setLineDash([3*k,4*k]);g.strokeStyle='rgba(255,255,255,.35)';g.lineWidth=Math.max(1,0.25*k);for(let i=0;i<=NB;i++){line(-HALF,i*P,SIZE+HALF,i*P);line(i*P,-HALF,i*P,SIZE+HALF);}g.setLineDash([]);
  // blocks with soft outlines
  const bc={cite:'#3f3460',shops:'#55404a',pav:'#2f4630',parc:'#2a5230',parking:'#3c3c46'};
  blocks.forEach(b=>poly(rect(b.x0,b.z0,b.x1,b.z1,3),bc[b.type],'rgba(0,0,0,.35)',1.5));
  overlay.filter(o=>o.tex==='grass'||o.tex==='court').forEach(o=>{o.g.computeBoundingBox();const bb=o.g.boundingBox;poly(rect(bb.min.x,bb.min.z,bb.max.x,bb.max.z,3),o.tex==='grass'?'#2f5a34':'#7a3a2a');});
  // buildings, with a light edge so shapes read
  colliders.forEach(cc=>{if(cc.h<2||cc.x1-cc.x0>100||cc.z1-cc.z0>100||(cc.x1-cc.x0)<0.9)return;poly(rect(cc.x0,cc.z0,cc.x1,cc.z1,2.5),'#7a729e','rgba(220,215,255,.35)',1);});
  // round plazas
  for(const[cx,cz]of PLAZAS){if(cx<=0||cz<=0||cx>=SIZE||cz>=SIZE)continue;const p=W(cx,cz);g.fillStyle='#4a6a3a';g.beginPath();g.arc(p[0],p[1],3.4*k,0,TAU);g.fill();g.strokeStyle='#e6e2f2';g.lineWidth=1.2;g.beginPath();g.arc(p[0],p[1],5.6*k,0,TAU);g.stroke();}
  // perimeter wall
  g.strokeStyle='#6a6680';g.lineWidth=2*k;g.beginPath();rect(-13,-13,SIZE+13,SIZE+13,6).forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.stroke();
  return c;}
buildMapImage=function(){mapImg=drawWarpedMap();};
/* loading screen */
V6CSS.textContent+=`
#loading{z-index:200!important;display:flex!important;flex-direction:column;align-items:center;justify-content:center;gap:14px;background:radial-gradient(ellipse at 50% 40%,#2a1e5a 0%,#0b0918 70%)!important;transition:opacity .6s;font:600 14px 'Exo 2',sans-serif!important}
#loading[hidden]{display:none!important}#loading.done{opacity:0}
#loading .lg{font:italic 900 clamp(40px,10vw,84px)/1 'Exo 2',sans-serif;color:#fff;letter-spacing:.02em;text-shadow:0 0 30px rgba(255,80,160,.45)}#loading .lg span{color:#ffd84d}
#loading .ls{color:#9aa0d8;letter-spacing:.4em;font-size:12px}
#loading .lb{width:min(72vw,420px);height:10px;border-radius:6px;background:rgba(255,255,255,.1);overflow:hidden;border:1px solid rgba(255,255,255,.2)}
#loading .lb i{display:block;height:100%;width:0;background:linear-gradient(90deg,#ff4fa8,#ffd84d);transition:width .25s}
#loading .lp{color:#fff;letter-spacing:.2em;font-size:13px}#loading .lt{color:#cfd3ff;max-width:min(80vw,460px);text-align:center;min-height:2.6em;font-weight:500;opacity:.85}
#loading .can{width:22px;height:44px;border-radius:5px 5px 3px 3px;background:linear-gradient(90deg,#c4161c,#ff5a4a,#c4161c);position:relative;animation:shake .5s ease-in-out infinite}
#loading .can:before{content:'';position:absolute;top:-8px;left:7px;width:8px;height:8px;background:#ddd;border-radius:2px}
@keyframes shake{50%{transform:rotate(14deg) translateY(-3px)}}`;
(()=>{const L=document.getElementById('loading');if(!L)return;L.hidden=false;
  L.innerHTML='<div class="can"></div><div class="lg">BÉTON<span>99</span></div><div class="ls">ПРИГОРОД ПАРИЖА · 1999</div><div class="lb"><i id="ldbar"></i></div><div class="lp" id="ldpct">ЗАГРУЗКА… 0%</div><div class="lt" id="ldtip"></div>';
  const tips=['Стреляй баллончиком в стену — откроется холст, рисуй пальцем.','На доске: ПРЫЖОК — олли, ОГОНЬ в воздухе — флип, ОРУЖ. — мэнуал.','В любой магазин можно зайти: подойди к двери с красной меткой.',
    'Жёлтая метка с буквой — начало главы сюжета.','Скамейки, автоматы, турники — подойди и нажми ДЕЙСТВ.','Сбросить розыск проще в переулках, подальше от копов.'];let ti=0;
  const tip=()=>{const e=document.getElementById('ldtip');if(e)e.textContent=tips[ti++%tips.length];};tip();const iv=setInterval(()=>{if(L.hidden)clearInterval(iv);else tip();},3200);})();
V6.progress=(d,n,label)=>{const p=Math.round(d/n*100),b=document.getElementById('ldbar'),t=document.getElementById('ldpct');if(b)b.style.width=p+'%';if(t)t.textContent=label||('ЗАГРУЗКА… '+p+'%');};
