/* ======================= V6 STREETWEAR: repainted faces, hairstyles, baggy clothes, new pieces ======================= */
/* --- options (also used by randApp, so street peds dress the same way) --- */
SKINS.length=0;SKINS.push('#3a2118','#4b2c1f','#5e3826','#734530','#8c5a3c','#a8724b','#c48d64','#e0b48e');
HAIRCOLS.length=0;HAIRCOLS.push('#0e0b0a','#1c130e','#2e1d12','#4a2f1a','#7a4a22','#c9a24a');
TOPCOLS.length=0;TOPCOLS.push('#f4f4f2','#121212','#1b2a5a','#8a1414','#1e5a34','#d8b13a','#6e6e72','#3a2468','#d9641c','#7fb2e5','#e7b8c8','#4a5a3a','#b52a2a','#0f6e7a');
BOTCOLS.length=0;BOTCOLS.push('#2b3d63','#1b2a4a','#56708f','#121212','#3a3a3a','#6b5a3a','#8a8a7a','#2a3a2a');
SHOECOLS.length=0;SHOECOLS.push('#f4f4f4','#111111','#c41e1e','#2a4bd4','#d8a030','#8a8a8a');
HATCOLS.length=0;HATCOLS.push('#121212','#f2f2f2','#1b2a5a','#8a1414','#3a5a2a','#d8b13a','#6a2a8a');
const row=k=>CREATOR.find(r=>r.k===k);
CREATOR.splice(CREATOR.indexOf(row('hairCol')),0,{k:'hair',l:'ПРИЧЁСКА',o:['fade','cornrows','waves','dreads','afro','braids','bald','long'],n:['ФЕЙД','КОСИЧКИ-РЯДЫ','ВОЛНЫ','ДРЕДЫ','АФРО','БРЕЙДЫ','ЛЫСЫЙ','ДЛИННЫЕ']},
  {k:'beard',l:'БОРОДА',o:[0,1,2,3],n:['НЕТ','ЩЕТИНА','ЭСПАНЬОЛКА','БОРОДА']});
Object.assign(row('hat'),{o:['none','fitted','back','cap','durag','bonnet','hood','mask','bandana'],n:['НИЧЕГО','ФИТТЕД','КЕПКА НАЗАД','КЕПКА','ДЮРАГ','ШАПКА','КАПЮШОН','МАСКА','БАНДАНА']});
Object.assign(row('top'),{o:['tee','teelong','jersey','hoodie','puffer','track','long','tank'],n:['ОВЕРСАЙЗ ФУТБОЛКА','ФУТБОЛКА + ЛОНГ','БАСКЕТ. МАЙКА','ХУДИ','ПУХОВИК','ОЛИМПИЙКА','ЛОНГСЛИВ','МАЙКА']});
Object.assign(row('bottom'),{o:['baggy','jog','cargo','short','jorts'],n:['МЕШКОВАТЫЕ ДЖИНСЫ','ТРЕНИКИ','КАРГО','ШОРТЫ','ДЖИНС. ШОРТЫ']});
CREATOR.splice(CREATOR.indexOf(row('shoe'))+1,0,{k:'shoeType',l:'МОДЕЛЬ ОБУВИ',o:['runner','hitop','boot'],n:['КРОССОВКИ','ХАЙ-ТОПЫ','БОТИНКИ']});
row('chain').o=[0,1,2];row('chain').n=['НЕТ','ЗОЛОТО','ЗОЛОТО + КУЛОН'];
Object.assign(DEFAULT_APP,{sex:'m',skin:'#5e3826',hair:'fade',hairCol:'#0e0b0a',beard:2,hat:'none',hatCol:'#121212',top:'tee',topCol:'#f4f4f2',print:0,bottom:'baggy',botCol:'#2b3d63',shoe:'#f4f4f4',shoeType:'runner',chain:1,num:93});
{const ra=randApp;randApp=function(type){const a=ra(type);const R=Math.random;
  a.skin=R()<0.7?pick(SKINS.slice(0,5)):pick(SKINS);a.hairCol=R()<0.85?pick(HAIRCOLS.slice(0,3)):pick(HAIRCOLS);
  const f=a.sex==='f';a.hair=f?pick(['braids','braids','long','afro','cornrows','waves']):pick(['fade','fade','cornrows','waves','dreads','afro','bald']);a.beard=f?0:pick([0,1,1,2,2,3]);
  a.top=pick(type==='gang'?['hoodie','puffer','jersey','tee','track']:['tee','tee','hoodie','teelong','jersey','puffer','long','track']);a.bottom=pick(['baggy','baggy','jog','cargo','baggy']);
  a.shoeType=pick(['runner','runner','hitop','boot']);a.shoe=a.shoeType==='boot'?'#d8a030':pick(['#f4f4f4','#f4f4f4','#111111',pick(SHOECOLS)]);
  if(type==='gang')a.hat=pick(['durag','fitted','back','hood','mask','bonnet']);else if(type!=='cop')a.hat=R()<0.55?pick(['fitted','back','durag','bonnet','cap']):'none';
  if(type==='cop')Object.assign(a,{hat:'cap',top:'track',topCol:'#1d2a5a',bottom:'jog',botCol:'#141a33',shoe:'#111111',shoeType:'boot',chain:0,beard:R()<0.3?1:0});
  a.num=Math.floor(R()*99)+1;a.print=R()<0.5?0:a.print;return a;};}
/* --- face & scalp repaint over the atlas (head lives at x 0..80, y 172..256; face centre on x = 80) --- */
const HEADSRC={};
function headSrc(fem){const k=fem?'f':'m';if(HEADSRC[k])return HEADSRC[k];const[c,g]=mk(128,256);g.drawImage(PS2.img[k],0,0);return HEADSRC[k]=g.getImageData(0,0,128,256).data;}
function noise2(x,y){const s=Math.sin(x*127.1+y*311.7)*43758.5453;return s-Math.floor(s);}
function paintHead(g,app){const fem=app.sex==='f',src=headSrc(fem),id=g.getImageData(0,0,80,256),d=id.data,sk=hexRGB(app.skin),hc=hexRGB(app.hairCol),style=app.hair||'fade';
  for(let y=172;y<256;y++)for(let x=0;x<80;x++){const j=(y*128+x)*4,i=(y*80+x)*4,r=src[j],gg=src[j+1],b=src[j+2],L=(r*0.3+gg*0.59+b*0.11)/255;
    const skinP=r>gg+8&&gg>=b-4&&r>60&&r-b>28,eye=x>=55&&x<=70&&y>=214&&y<=222&&L<0.13,brow=x>=50&&x<=75&&y>=204&&y<=213;
    if(eye){d[i]=d[i+1]=d[i+2]=8;continue;}
    const hairZ=!skinP&&!brow&&L<0.42;
    // skin with soft modelling: darker toward the back of the head and under the jaw
    let k=skinP?clamp(L/0.74,0.8,1.08):0.92;k*=0.9+0.1*clamp(x/60,0,1);if(y>248)k*=0.93;
    let col=[sk[0]*k,sk[1]*k,sk[2]*k];
    if(hairZ||y<176){const n=noise2(x,y);let dens=1;
      if(style==='fade'){dens=y<200?1:clamp((232-y)/26,0,1);dens=dens>n*0.9?1:0.15;}
      else if(style==='bald'){dens=0;}
      else if(style==='cornrows'){const ry=(y+Math.round(x*0.08))%6;dens=ry<4?1:0.1;}
      else if(style==='waves'){dens=1;}
      if(dens>0){const sh=style==='waves'?0.75+0.5*(0.5+0.5*Math.sin((x*0.9+Math.sin(y*0.5)*3)*1.3)):style==='cornrows'?0.65+0.35*(((x+(y%6<2?2:0))%4)<2?1:0.5):0.7+0.45*n;
        const hcol=[hc[0]*sh+6,hc[1]*sh+5,hc[2]*sh+4],sc=[sk[0]*0.8,sk[1]*0.8,sk[2]*0.8];col=[lerp(sc[0],hcol[0],dens),lerp(sc[1],hcol[1],dens),lerp(sc[2],hcol[2],dens)];}
      else col=[sk[0]*0.92*(0.95+0.08*n),sk[1]*0.92,sk[2]*0.92];}
    d[i]=clamp(col[0],0,255);d[i+1]=clamp(col[1],0,255);d[i+2]=clamp(col[2],0,255);d[i+3]=255;}
  g.putImageData(id,0,0);
  const S=(m,a)=>`rgba(${Math.round(sk[0]*m)},${Math.round(sk[1]*m)},${Math.round(sk[2]*m)},${a})`,E=(cx,cy,rx,ry,f)=>{g.fillStyle=f;g.beginPath();g.ellipse(cx,cy,rx,ry,0,0,TAU);g.fill();};
  // cheekbone and temple shading, nose, lips
  E(58,229,9,6,S(0.6,0.16));E(74,223,4.5,8,S(0.55,0.22));E(79,216,1.6,9,'rgba(255,255,255,.07)');
  E(74.5,229.5,5.2,2.8,S(0.5,0.42));E(76.5,230.3,1.6,1,'rgba(10,5,5,.75)');E(79,227,1.4,2.2,'rgba(255,255,255,.08)');
  const lipU=fem?'rgba(70,24,34,.82)':S(0.5,0.85),lipL=fem?'rgba(110,40,52,.8)':S(0.62,0.85);
  E(73.5,238.6,8.2,2.1,lipU);E(74,241.8,7.4,2.7,lipL);g.fillStyle='rgba(15,6,6,.8)';g.fillRect(65.5,239.9,14.5,0.9);E(75,242.3,3,0.7,'rgba(255,255,255,.12)');
  E(72,247,8,3,S(0.7,0.18));
  // brows: thick, low, slightly angled
  g.fillStyle=`rgb(${Math.round(hc[0]*0.5+8)},${Math.round(hc[1]*0.5+6)},${Math.round(hc[2]*0.5+6)})`;g.beginPath();
  if(fem){g.moveTo(55,210);g.quadraticCurveTo(62,205.6,73,207.6);g.lineTo(73,209.4);g.quadraticCurveTo(63,207.6,55.5,211.2);}
  else{g.moveTo(54,211);g.lineTo(60,207.2);g.lineTo(73.5,207.6);g.lineTo(74,210.6);g.lineTo(61,210.4);}g.closePath();g.fill();
  if(fem){g.fillStyle='rgba(8,4,4,.9)';g.fillRect(56,213.2,14,1.2);}
  // facial hair
  const bd=fem?0:+app.beard||0;if(bd){const hcs=`rgba(${hc[0]+4},${hc[1]+3},${hc[2]+3},`;
    const dots=(x0,y0,x1,y1,dn,a)=>{for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++)if(noise2(x*1.7,y*2.3)<dn){g.fillStyle=hcs+a+')';g.fillRect(x,y,1,1);}};
    if(bd===1){dots(30,226,80,256,0.45,0.45);}
    else if(bd===2){dots(63,234,80,238,0.95,0.92);dots(66,244,80,256,0.9,0.92);dots(63,238,66,248,0.8,0.85);dots(30,230,63,256,0.25,0.35);}
    else{for(let y=226;y<256;y++)for(let x=26;x<80;x++){const inJaw=y>247||(x<62&&y>232+((x-26)*0.1))||(x>=62&&y>244);if(inJaw&&noise2(x*1.7,y*2.3)<0.8){g.fillStyle=hcs+'0.9)';g.fillRect(x,y,1,1);}}dots(64,234.5,80,237.5,0.9,0.9);}}
  // ear shadow so the ear reads
  E(33,227,3,4.5,S(0.6,0.25));}
{const ca=charAtlasPS2;charAtlasPS2=function(app){const m=ca(Object.assign({},app,{top:app.top==='jersey'?'tank':app.top==='puffer'?'long':app.top})),t=m.map,c=t.image,g=c.getContext('2d');app=Object.assign({},DEFAULT_APP,app);paintHead(g,app);
  // jersey: number and trim; puffer: quilting; boots: wheat nubuck with a dark sole
  if(app.top==='jersey'){const tc=lightCol(app.topCol)?'#141414':'#f4f4f4';g.fillStyle=tc;g.fillRect(64,0,64,3);g.fillRect(64,104,64,4);
    for(const[cx,flip]of[[112,-1],[80,1]]){g.save();g.save();g.beginPath();g.rect(cx-16,8,32,96);g.clip();g.translate(cx,48);g.scale(flip*1,1);g.font="900 19px Impact,'Arial Black',sans-serif";g.textAlign='center';g.textBaseline='middle';g.lineWidth=4;g.strokeStyle=tc==='#141414'?'#f4f4f4':'#141414';g.strokeText(String(app.num||23),0,0);g.fillStyle=tc;g.fillText(String(app.num||23),0,0);g.restore();g.restore();}}
  if(app.top==='puffer'){for(let y=0;y<216;y+=14){const gr=g.createLinearGradient(0,y,0,y+14);gr.addColorStop(0,'rgba(255,255,255,.22)');gr.addColorStop(0.55,'rgba(255,255,255,0)');gr.addColorStop(0.85,'rgba(0,0,0,.25)');gr.addColorStop(1,'rgba(0,0,0,.45)');g.fillStyle=gr;g.fillRect(64,y,64,14);}}
  if(app.top==='hoodie'||app.top==='puffer'){g.fillStyle='rgba(0,0,0,.35)';g.fillRect(65,0,62,4);}
  if(app.shoeType==='boot'){const sh=hexRGB(app.shoe);g.fillStyle=`rgba(${sh[0]},${sh[1]},${sh[2]},.9)`;g.fillRect(0,128,61,40);g.fillStyle='#2a1a10';g.fillRect(0,160,61,8);speck(g,61,40,200,'rgba(60,30,10,.25)');for(let i=0;i<5;i++){g.fillStyle='#e8d8b0';g.fillRect(14+i*6,134,2,2);}}
  if(app.shoeType==='runner'&&lightCol(app.shoe)){g.fillStyle='#e0e0e0';g.fillRect(0,160,61,8);g.fillStyle='rgba(0,0,0,.12)';g.fillRect(20,140,24,3);}
  if(app.bottom==='baggy'){g.fillStyle='rgba(255,255,255,.07)';for(let y=10;y<128;y+=22){g.fillRect(2,y,28,3);g.fillRect(34,y+8,28,3);}g.fillStyle='rgba(0,0,0,.18)';for(const y of[52,58,116,122])g.fillRect(0,y,64,2);}
  if(app.bottom==='cargo'){g.fillStyle='rgba(0,0,0,.28)';g.fillRect(36,30,14,16);g.fillRect(6,30,14,16);g.fillStyle='rgba(255,255,255,.08)';g.fillRect(36,30,14,2);g.fillRect(6,30,14,2);}
  g.drawImage(c,79,172,1,84,80,172,8,84);t.needsUpdate=true;return m;};}
/* --- baggy shells: copies of the cloth parts of the body mesh pushed out along smoothed normals, on the same skeleton --- */
const SHELLG=new Map();
function shellGeo(src,app,part){const key=src.uuid+part+app.top+app.bottom+app.sex;if(SHELLG.has(key))return SHELLG.get(key);
  const P_=src.attributes.position,N=src.attributes.normal,U=src.attributes.uv,idx=src.index?src.index.array:null,triN=(idx?idx.length:P_.count)/3;
  src.computeBoundingBox();const bb=src.boundingBox,H=bb.max.y-bb.min.y;
  const sm=new Map(),kq=i=>Math.round(P_.getX(i)*500)+','+Math.round(P_.getY(i)*500)+','+Math.round(P_.getZ(i)*500);
  for(let i=0;i<P_.count;i++){const k=kq(i),v=sm.get(k)||[0,0,0];v[0]+=N.getX(i);v[1]+=N.getY(i);v[2]+=N.getZ(i);sm.set(k,v);}
  const sleeve=app.top,shortL=app.bottom==='short'||app.bottom==='jorts';
  const inTop=(px,py)=>px>=64&&py<215&&!(px>=96&&py>=162&&(sleeve==='tee'||sleeve==='tank'||sleeve==='jersey'))&&!(px>=96&&py>=108&&(sleeve==='tank'||sleeve==='jersey'));
  const inBot=(px,py)=>px<64&&py<128&&!(shortL&&(py%64)>30);
  const keep=[];for(let t=0;t<triN;t++){let cx=0,cy=0;for(let e=0;e<3;e++){const i=idx?idx[t*3+e]:t*3+e;cx+=U.getX(i)*128/3;cy+=U.getY(i)*256/3;}if(part==='top'?inTop(cx,cy):inBot(cx,cy))keep.push(t);}
  const amt=part==='top'?({tee:0.038,teelong:0.034,jersey:0.024,hoodie:0.042,puffer:0.11,track:0.03,long:0.018,tank:0.012}[sleeve]||0.02):({baggy:0.06,jog:0.024,cargo:0.05,short:0.03,jorts:0.03}[app.bottom]||0.02);
  const geo=new THREE.BufferGeometry(),names=Object.keys(src.attributes),out={};names.forEach(n=>out[n]=[]);
  for(const t of keep)for(let e=0;e<3;e++){const i=idx?idx[t*3+e]:t*3+e;for(const n of names){const A=src.attributes[n];for(let c=0;c<A.itemSize;c++)out[n].push(A.array[i*A.itemSize+c]);}
    const v=sm.get(kq(i)),L=Math.hypot(v[0],v[1],v[2])||1,h=(P_.getY(i)-bb.min.y)/H;
    let off=amt*H;if(part==='bot'){off*=1+1.9*clamp((0.5-h)/0.45,0,1);}else{off*=1+0.5*clamp((0.62-h)/0.1,0,1);}
    const pi=out.position.length-3;out.position[pi]+=v[0]/L*off;out.position[pi+1]+=v[1]/L*off*(part==='bot'?0.25:0.6);out.position[pi+2]+=v[2]/L*off;
    if(part==='bot'&&h<0.1){out.position[pi+1]=Math.max(out.position[pi+1],bb.min.y+H*0.045);}}
  for(const n of names){const A=src.attributes[n];geo.setAttribute(n,new THREE.BufferAttribute(new A.array.constructor(out[n]),A.itemSize,A.normalized));}
  SHELLG.set(key,geo);return geo;}
/* --- hair, durag, caps, earrings as head attachments --- */
function headGear(ch,app){const hc=new THREE.Color(app.hairCol),H=ch.head,covered=['hood','bonnet','durag','mask'].includes(app.hat);
  ch.inner.traverse(o=>{if(o.isSkinnedMesh&&o.material&&PS2.hairMat&&o.material.map===PS2.hairMat.map&&app.hair!=='long')o.visible=false;});
  const hm=LM({color:hc,map:imgTex(ASSETS.img.jersey_g,3,3)});
  if(!covered){if(app.hair==='afro'){const a=new THREE.Mesh(new THREE.IcosahedronGeometry(0.15,2),hm);a.scale.set(1.08,0.92,1.08);a.position.set(0,0.13,-0.03);H.add(a);}
    else if(app.hair==='dreads'||app.hair==='braids'){const n=app.hair==='dreads'?16:22,len=app.hair==='dreads'?0.2:(app.sex==='f'?0.36:0.22),r=app.hair==='dreads'?0.016:0.01;
      const top=new THREE.Mesh(new THREE.SphereGeometry(0.12,14,8,0,TAU,0,Math.PI*0.46),hm);top.scale.set(1.02,1.0,1.08);top.position.set(0,0.09,-0.016);H.add(top);
      for(let i=0;i<n;i++){const a=Math.PI*0.35+i/(n-1)*Math.PI*1.3,s=new THREE.Mesh(new THREE.CylinderGeometry(r,r*0.75,len,5),hm);s.position.set(Math.cos(a)*0.112,0.11-len/2,-Math.sin(a)*0.105-0.01);s.rotation.set(Math.sin(a)*0.25,0,Math.cos(a)*0.25);H.add(s);}}}
  if(app.hat==='durag'){const dm=LM({color:new THREE.Color(app.hatCol).multiplyScalar(0.9),emissive:new THREE.Color(app.hatCol).multiplyScalar(0.18)});
    const cap=new THREE.Mesh(new THREE.SphereGeometry(0.123,16,9,0,TAU,0,Math.PI*0.48),dm);cap.scale.set(1,1.02,1.1);cap.position.set(0,0.088,-0.016);H.add(cap);
    const tail=new THREE.Mesh(new THREE.PlaneGeometry(0.06,0.3),new THREE.MeshLambertMaterial({color:dm.color,side:THREE.DoubleSide}));tail.position.set(0,-0.06,-0.13);tail.rotation.x=0.15;H.add(tail);ch.durag=tail;
    const band=new THREE.Mesh(new THREE.TorusGeometry(0.118,0.008,4,20),dm);band.rotation.x=Math.PI/2;band.scale.set(1,1.1,1);band.position.set(0,0.094,-0.012);H.add(band);}
  if(app.hat==='fitted'||app.hat==='back'){const m=LM({color:new THREE.Color(app.hatCol)}),G=new THREE.Group();
    const d=new THREE.Mesh(new THREE.SphereGeometry(0.122,16,7,0,TAU,0,Math.PI*0.52),m);d.scale.set(1,1.02,1.08);d.position.y=0.075;G.add(d);
    const br=new THREE.Mesh(new THREE.BoxGeometry(0.2,0.012,0.12),m);br.position.set(0,0.09,0.17);br.rotation.x=app.hat==='fitted'?-0.04:0.12;G.add(br);
    const lg=rtex(32,32,(g)=>{g.fillStyle='#fff';g.font="900 22px Georgia,serif";g.textAlign='center';g.fillText('P',16,25);});const l=new THREE.Mesh(new THREE.PlaneGeometry(0.06,0.06),new THREE.MeshBasicMaterial({map:lg,transparent:true}));l.position.set(0,0.13,0.125);l.rotation.x=-0.35;G.add(l);
    if(app.hat==='fitted'){const st=new THREE.Mesh(new THREE.PlaneGeometry(0.035,0.035),new THREE.MeshBasicMaterial({color:0xd8d8d8}));st.position.set(0.05,0.0965,0.18);st.rotation.x=-Math.PI/2;G.add(st);}
    else G.rotation.y=Math.PI;H.add(G);}
  if(false){const em=LM({color:0xe2b33c,emissive:0x3a2a00});for(const s of[-1,1]){const e=new THREE.Mesh(app.sex==='f'?new THREE.TorusGeometry(0.022,0.004,4,12):new THREE.SphereGeometry(0.008,5,4),em);e.position.set(s*0.118,0.0,0.0);e.rotation.y=Math.PI/2;H.add(e);}}
  if(+app.chain===2){const pd=new THREE.Mesh(new THREE.CylinderGeometry(0.035,0.035,0.01,12).rotateX(Math.PI/2),LM({color:0xe2b33c,emissive:0x4a3400}));pd.position.set(0,0.035,0.135);ch.chest.add(pd);}}
{const mk2=makeChar;makeChar=function(app,m,n){const ch=mk2(app,m,n);if(!ch.ps2||m)return ch;app=Object.assign({},DEFAULT_APP,app);
  // old hat code draws 'cap','bonnet','hood','mask'; the new ones are added here
  headGear(ch,app);
  const body=[];ch.inner.traverse(o=>{if(o.isSkinnedMesh&&o.visible&&o.material===ch.mat)body.push(o);});
  for(const o of body)for(const part of['top','bot']){const g=shellGeo(o.geometry,app,part);if(!g.attributes.position.count)continue;const s=new THREE.SkinnedMesh(g,ch.mat);s.bind(o.skeleton,o.bindMatrix);s.frustumCulled=false;o.parent.add(s);}
  return ch;};}
/* durag tail sways */
{const va=V6.anim;V6.anim=function(ch,dt,spd,o){va(ch,dt,spd,o);if(ch.durag)ch.durag.rotation.x=0.15+Math.sin(time*3+ch.phase)*0.08+Math.min(0.6,spd*0.1);};}
/* story people in streetwear */
Object.assign(NPC.momo,{skin:'#4b2c1f',hair:'fade',beard:3,hat:'durag',hatCol:'#121212',top:'track',topCol:'#121212',bottom:'baggy',botCol:'#1b2a4a',shoe:'#f4f4f4',shoeType:'runner',chain:2});
Object.assign(NPC.nadia,{skin:'#734530',hair:'braids',hairCol:'#0e0b0a',hat:'none',top:'hoodie',topCol:'#3a2468',bottom:'baggy',botCol:'#56708f',shoe:'#f4f4f4',shoeType:'hitop',chain:1});
Object.assign(NPC.jamel,{skin:'#3a2118',hair:'cornrows',beard:2,hat:'none',top:'puffer',topCol:'#121212',bottom:'cargo',botCol:'#3a3a3a',shoe:'#d8a030',shoeType:'boot',chain:1});
