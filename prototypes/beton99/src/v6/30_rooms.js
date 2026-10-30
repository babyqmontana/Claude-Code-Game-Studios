/* ======================= V6 INTERIORS (enter shops like a door, not a menu) ======================= */
const ROOMS={cam:new THREE.PerspectiveCamera(62,1,0.05,60),cache:{},cur:null,mode:'walk',shot:null,
  scene(){return this.cur?this.cur.scene:scene;},outPos(){return this.cur?[this.cur.out.x,this.cur.out.z]:[pl.x,pl.z];}};
addEventListener('resize',()=>{ROOMS.cam.aspect=innerWidth/innerHeight;ROOMS.cam.fov=innerWidth<innerHeight?80:62;ROOMS.cam.updateProjectionMatrix();});
const RKIND={kebab:'kebab',boulang:'bakery',tabac:'store',pharma:'store',brico:'store',surplus:'store',fringues:'clothes',garage:'garage'};
const KEEPER_LINES={
  kebab:['Salam, frère! Как обычно — с белым соусом и харриссой?','Заходи-заходи, мясо только что сняли.','Картошку внутрь или отдельно, а?'],
  bakery:['Bonjour! Круассаны ещё тёплые.','Багет только из печи, бери пока горячий.'],
  store:['Чего надо? Только быстро, я закрываюсь.','Смотри, но руками не трогай.','Лотерейку? Сегодня везёт, я чувствую.'],
  garage:['Дверь закрой. Что тебе показать?','Тебя Момо прислал? Ладно, смотри.','Тут без чеков. Платишь — забираешь.'],
  clothes:['Йо! Новая поставка кроссов, глянь.','Примерочная там, у зеркала.']};
/* canvas helpers */
function rtex(w,h,f,rep){const[c,g]=mk(w,h);f(g,w,h);const t=new THREE.CanvasTexture(c);if(rep){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rep[0],rep[1]);}t.magFilter=t.minFilter=texFilter();return t;}
function linoTex(a,b){return rtex(64,64,(g)=>{g.fillStyle=a;g.fillRect(0,0,64,64);g.fillStyle=b;g.fillRect(0,0,32,32);g.fillRect(32,32,32,32);speck(g,64,64,260,'rgba(0,0,0,.08)');speck(g,64,64,90,'rgba(255,255,255,.06)');
  g.fillStyle='rgba(0,0,0,.18)';g.fillRect(0,0,64,1);g.fillRect(0,0,1,64);g.fillRect(0,32,64,1);g.fillRect(32,0,1,64);},[1,1]);}
function wallTex(col,dado){return rtex(64,64,(g)=>{g.fillStyle=col;g.fillRect(0,0,64,64);speck(g,64,64,220,'rgba(0,0,0,.06)');if(dado){g.fillStyle=dado;g.fillRect(0,44,64,20);g.fillStyle='rgba(0,0,0,.25)';g.fillRect(0,44,64,1);
  for(let x=0;x<64;x+=8){g.fillStyle='rgba(255,255,255,.08)';g.fillRect(x,45,7,19);}}g.fillStyle='rgba(0,0,0,.2)';g.fillRect(0,62,64,2);},[1,1]);}
const PCOLS=['#d6261f','#f2c418','#1f6fd6','#2a9b3a','#f07a12','#e8e8e8','#7a2fb5','#111','#e83a8a','#18b7c4'];
function productTex(kind,seed){let s=seed;const rnd_=()=>{s=(s*9301+49297)%233280;return s/233280;};return rtex(64,64,(g)=>{
  for(let i=0;i<4;i++)for(let j=0;j<4;j++){const x=i*16,y=j*16,c=PCOLS[Math.floor(rnd_()*PCOLS.length)];
    if(kind==='can'){g.fillStyle=c;g.fillRect(x+2,y+2,12,13);g.fillStyle='rgba(255,255,255,.55)';g.fillRect(x+4,y+3,2,11);g.fillStyle='#bbb';g.fillRect(x+2,y+1,12,2);}
    else if(kind==='bottle'){g.fillStyle=c;g.fillRect(x+5,y+5,6,10);g.fillRect(x+7,y+1,2,4);g.fillStyle='#fff';g.fillRect(x+5,y+9,6,3);}
    else if(kind==='box'){g.fillStyle=c;g.fillRect(x+1,y+2,14,13);g.fillStyle='rgba(255,255,255,.75)';g.fillRect(x+3,y+6,10,3);g.fillStyle='rgba(0,0,0,.3)';g.fillRect(x+1,y+14,14,1);}
    else if(kind==='paint'){g.fillStyle='#ccc';g.fillRect(x+2,y+3,12,12);g.fillStyle=c;g.fillRect(x+2,y+7,12,5);g.fillStyle='#888';g.fillRect(x+2,y+3,12,1);}
    else if(kind==='shoe'){g.fillStyle='#e8e2d6';g.fillRect(x+1,y+3,14,11);g.fillStyle=c;g.beginPath();g.moveTo(x+2,y+12);g.quadraticCurveTo(x+4,y+5,x+9,y+6);g.lineTo(x+14,y+10);g.lineTo(x+14,y+12);g.fill();g.fillStyle='#fff';g.fillRect(x+2,y+12,12,2);}
    else if(kind==='bread'){g.fillStyle='#b8742c';g.beginPath();g.ellipse(x+8,y+9,7,4,0,0,TAU);g.fill();g.fillStyle='#e0a858';g.fillRect(x+4,y+8,2,1);g.fillRect(x+8,y+7,2,1);}
    else if(kind==='cig'){g.fillStyle=c;g.fillRect(x+3,y+2,10,13);g.fillStyle='#fff';g.fillRect(x+3,y+2,10,5);g.fillStyle='#111';g.fillRect(x+4,y+11,8,2);}}});}
function menuBoardTex(){return rtex(256,96,(g)=>{g.fillStyle='#1a1410';g.fillRect(0,0,256,96);const it=[['KEBAB','6 €','#c87a3a'],['TACOS XL','8 €','#e0b040'],['AMÉRICAIN','7 €','#a85020'],['ASSIETTE','10 €','#d89a50']];
  it.forEach(([n,p,c],i)=>{const x=6+i*63;g.fillStyle='#2a2018';g.fillRect(x,6,58,84);g.fillStyle=c;g.beginPath();g.ellipse(x+29,32,22,15,0,0,TAU);g.fill();g.fillStyle='#f4ead0';g.fillRect(x+10,26,38,4);g.fillStyle='#6a2a10';g.fillRect(x+14,34,30,5);
    g.fillStyle='#ffd400';g.font="bold 11px 'Arial Black',sans-serif";g.textAlign='center';g.fillText(n,x+29,64);g.fillStyle='#fff';g.font="bold 14px 'Arial Black',sans-serif";g.fillText(p,x+29,82);});});}
function signTex(txt,bg,fg){return rtex(256,48,(g)=>{g.fillStyle=bg;g.fillRect(0,0,256,48);g.fillStyle=fg;g.font="bold 26px 'Arial Black',Impact,sans-serif";g.textAlign='center';g.textBaseline='middle';g.fillText(txt,128,26);});}
function tvTex(){const t=rtex(64,48,(g)=>{g.fillStyle='#2a7a2a';g.fillRect(0,0,64,48);});t.userData={draw(tt){const g=t.image.getContext('2d');g.fillStyle='#2f8a2f';g.fillRect(0,0,64,48);g.fillStyle='rgba(255,255,255,.5)';g.fillRect(31,0,1,48);g.strokeStyle='rgba(255,255,255,.5)';g.strokeRect(2,2,60,44);
  for(let i=0;i<10;i++){g.fillStyle=i<5?'#e33':'#33e';g.fillRect(8+((i*13+tt*7*(i%3+1))%48),6+((i*17+tt*5)%36),2,3);}g.fillStyle='#fff';g.fillRect(30+Math.sin(tt*2)*20,22+Math.cos(tt*1.4)*12,2,2);
  g.fillStyle='rgba(0,0,0,.6)';g.fillRect(0,0,30,7);g.fillStyle='#fff';g.font='6px monospace';g.fillText('PSG 1-0',2,6);t.needsUpdate=true;}};return t;}
/* builder */
function buildRoom(id){const kind=RKIND[id]||'store',def=SHOPS[id],S=new THREE.Scene();S.background=new THREE.Color('#05060a');
  const R={id,kind,def,scene:S,col:[],upd:[],W:kind==='garage'?9:kind==='clothes'?8:7,D:kind==='garage'?9:kind==='clothes'?9:8,H:3.1,npcs:[]};const W=R.W,D=R.D,H=R.H;
  const box=(w,h,d,mat,x,y,z,ry,col)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.rotation.y=ry||0;S.add(m);if(col){const c=Math.abs(Math.cos(ry||0))>0.5;const hw=c?w/2:d/2,hd=c?d/2:w/2;R.col.push([x-hw,z-hd,x+hw,z+hd]);}return m;};
  const plane=(w,h,mat,x,y,z,ry,rx)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),mat);m.position.set(x,y,z);m.rotation.set(rx||0,ry||0,0,'YXZ');S.add(m);return m;};
  R.box=box;R.plane=plane;
  const pal={kebab:['#e7d9b8','#b8452a','#d8cfc0','#a89a88'],bakery:['#f2e6cf','#8a5a2a','#efe6d6','#c8b89c'],store:['#dfe3e6','#2a5f9a','#d6d6d0','#9aa0a8'],clothes:['#1a1a1e','#d4302a','#2a2a30','#141418'],garage:['#7c7a72','#3a3a36','#55534c','#3e3c36']}[kind];
  const fl=linoTex(pal[2],pal[3]);fl.repeat.set(W/1.2,D/1.2);plane(W,D,LM({map:kind==='garage'?imgTex(ASSETS.img.dirtyconc_g||ASSETS.img.asphalt,W/3,D/3):kind==='bakery'?imgTex(ASSETS.img.floor,W/2,D/2):fl,color:kind==='garage'?0x8a8a80:0xffffff}),0,0,0,0,-Math.PI/2);
  plane(W,D,LM({color:kind==='clothes'?0x101014:0xd8d8d0}),0,H,0,0,Math.PI/2);
  const wt=kind==='garage'?null:wallTex(pal[0],kind==='clothes'?null:pal[1]);const wm=w=>{if(kind==='garage')return LM({map:imgTex(ASSETS.img.blockwall,w/3,1),color:0x9a968a});const t=wt.clone();t.needsUpdate=true;t.repeat.set(w/2.2,1);return LM({map:t});};
  plane(W,H,wm(W),0,H/2,-D/2,0);plane(D,H,wm(D),-W/2,H/2,0,Math.PI/2);plane(D,H,wm(D),W/2,H/2,0,-Math.PI/2);
  // front wall with glass door + shop window showing the night street
  const glass=rtex(64,64,(g)=>{const gr=g.createLinearGradient(0,0,0,64);gr.addColorStop(0,'#1a2050');gr.addColorStop(1,'#3a2a4a');g.fillStyle=gr;g.fillRect(0,0,64,64);for(let i=0;i<6;i++){g.fillStyle=['#ffcc66','#ff6688','#88ccff'][i%3];g.globalAlpha=.6;g.beginPath();g.arc(rr(4,60),rr(30,58),rr(1,3),0,TAU);g.fill();}g.globalAlpha=1;g.fillStyle='rgba(255,255,255,.12)';g.fillRect(8,0,4,64);g.fillRect(40,0,10,64);});
  const fw=(W-1.6)/2;plane(fw,H,wm(fw),-(0.8+fw/2),H/2,D/2,Math.PI);plane(fw,H,wm(fw),0.8+fw/2,H/2,D/2,Math.PI);plane(1.6,H-2.3,wm(1.6),0,H-(H-2.3)/2,D/2,Math.PI);
  plane(1.5,2.25,new THREE.MeshBasicMaterial({map:glass}),0,1.13,D/2-0.01,Math.PI);
  for(const s of[-1,1])plane(fw-0.6,1.4,new THREE.MeshBasicMaterial({map:glass}),s*(0.8+fw/2),1.55,D/2-0.02,Math.PI);
  const ring=new THREE.Mesh(RINGG,new THREE.MeshBasicMaterial({color:0x7dff9a,transparent:true,opacity:0.5,depthWrite:false}));ring.position.set(0,0.02,D/2-0.7);ring.scale.setScalar(0.7);S.add(ring);
  R.door={x:0,z:D/2-0.7};
  // light
  S.add(new THREE.HemisphereLight(kind==='clothes'?'#8a90b0':'#d8d4c8',kind==='garage'?'#2a2420':'#3a3430',kind==='garage'?0.55:0.85));
  const tubeM=new THREE.MeshBasicMaterial({color:kind==='garage'?0xffe0a0:0xf4f8ff});
  const lights=kind==='garage'?[[0,0]]:[[-W/4,-D/4],[W/4,-D/4],[0,D/4]];
  lights.forEach(([x,z])=>{if(kind==='garage'){const sh=new THREE.Mesh(new THREE.ConeGeometry(0.35,0.3,10,1,true),LM({color:0x2a2a28,side:THREE.DoubleSide}));sh.position.set(x,H-0.6,z);S.add(sh);const b=new THREE.Mesh(new THREE.SphereGeometry(0.1,8,6),tubeM);b.position.set(x,H-0.72,z);S.add(b);
      const cord=new THREE.Mesh(new THREE.CylinderGeometry(0.01,0.01,0.6),LM({color:0x111}));cord.position.set(x,H-0.3,z);S.add(cord);const L=new THREE.PointLight(0xffc88a,1.5,12,1.6);L.position.set(x,H-0.9,z);S.add(L);R.upd.push((dt,t)=>{sh.rotation.z=Math.sin(t*0.9)*0.05;});}
    else{box(1.3,0.05,0.16,tubeM,x,H-0.03,z);const L=new THREE.PointLight(kind==='clothes'?0xffe4c8:0xf0f4ff,0.8,9,1.5);L.position.set(x,H-0.4,z);S.add(L);}});
  const decorate={kebab:roomKebab,bakery:roomBakery,store:roomStore,clothes:roomClothes,garage:roomGarage}[kind];decorate(R);
  // shopkeeper behind the counter
  const app=randApp('civ');if(kind==='garage'){app.top='track';app.topCol='#1a1a1a';}if(kind==='bakery'){app.topCol='#f2f2f2';app.top='tee';}
  const kp=makeChar(app);S.add(kp.root);kp.root.position.set(R.counter.kx,0,R.counter.kz);kp.root.rotation.y=0;R.keeper=kp;
  // a customer browsing
  if(kind!=='garage'){const c=makeChar(randApp('civ'));S.add(c.root);const pts=R.browse||[[-W/2+1,-0.5],[-W/2+1,1.5]];R.npcs.push({ch:c,pts,i:0,x:pts[0][0],z:pts[0][1],h:0,wait:rr(1,3)});}
  return R;}
function counterBlock(R,w,frontMat,topMat,z,x){x=x||0;const{box}=R;box(w,1.0,0.7,frontMat,x,0.5,z,0,true);box(w+0.06,0.06,0.78,topMat,x,1.03,z);R.counter={x,z:z+0.9,kx:x,kz:z-0.75};}
function roomKebab(R){const{box,plane,W,D,H,scene:S}=R;const steel=LM({color:0xb8bcc4,emissive:0x101418}),wood=LM({map:imgTex(ASSETS.img.wood,2,1),color:0x9a6a4a});
  counterBlock(R,4.2,steel,LM({color:0xd8dce0}),-D/2+2.2);
  const gl=new THREE.Mesh(new THREE.BoxGeometry(3.4,0.35,0.5),new THREE.MeshBasicMaterial({color:0xcfe8ff,transparent:true,opacity:0.25}));gl.position.set(0,1.25,-D/2+2.2);S.add(gl);
  ['#d8b060','#c03020','#2a8a2a','#f0f0e0','#a05030'].forEach((c,i)=>box(0.55,0.08,0.35,LM({color:c,emissive:0x221100}),-1.2+i*0.6,1.1,-D/2+2.2));
  // doner spit + grill wall
  const spit=new THREE.Mesh(new THREE.CylinderGeometry(0.18,0.26,0.9,10),LM({map:imgTex(ASSETS.img.rust,1,1),color:0xb8743a,emissive:0x3a1a00}));spit.position.set(-1,1.45,-D/2+0.45);S.add(spit);
  box(0.04,1.2,0.04,steel,-1,1.45,-D/2+0.45);const hot=box(0.5,0.9,0.06,new THREE.MeshBasicMaterial({color:0xff6a20}),-1,1.45,-D/2+0.12);R.upd.push((dt,t)=>{spit.rotation.y+=dt*0.8;hot.material.color.setRGB(1,0.38+Math.sin(t*9)*0.04,0.12);});
  const hl=new THREE.PointLight(0xff7a30,0.9,3,2);hl.position.set(-1,1.4,-D/2+0.6);S.add(hl);
  box(1.4,0.9,0.6,steel,1.2,0.95,-D/2+0.4);plane(3.6,1.3,LM({map:menuBoardTex(),emissive:0x333333}),0,2.35,-D/2+0.02,0);
  // fridge with cans
  const fr=box(1.1,2.0,0.6,LM({color:0xe8e8e8}),W/2-0.35,1.0,-D/2+3.4,-Math.PI/2,true);plane(0.9,1.6,new THREE.MeshBasicMaterial({map:productTex('can',7)}),W/2-0.66,1.05,-D/2+3.4,-Math.PI/2);
  // tables
  for(const z of[0.4,2.0]){box(0.7,0.04,0.7,wood,-W/2+0.8,0.75,z);box(0.08,0.75,0.08,LM({color:0x333}),-W/2+0.8,0.37,z);R.col.push([-W/2+0.4,z-0.4,-W/2+1.2,z+0.4]);
    for(const dz of[-0.6,0.6]){box(0.38,0.05,0.38,LM({color:0xc4161c}),-W/2+0.8,0.45,z+dz);box(0.38,0.4,0.05,LM({color:0xc4161c}),-W/2+0.8,0.68,z+dz*1.25);}}
  const tv=tvTex();plane(0.9,0.6,new THREE.MeshBasicMaterial({map:tv}),-W/2+0.02,2.3,1.2,Math.PI/2);box(0.1,0.66,0.96,LM({color:0x111}),-W/2+0.06,2.3,1.2);R.upd.push((dt,t)=>{if(Math.random()<0.3)tv.userData.draw(t);});
  plane(2.2,0.45,new THREE.MeshBasicMaterial({map:signTex('KEBAB GRILL','#c4161c','#ffd400')}),0,H-0.3,-D/2+0.03,0);
  R.browse=[[W/2-1.4,-D/2+3.4],[-W/2+1.7,1.2]];}
function roomBakery(R){const{box,plane,W,D,H,scene:S}=R;const wood=LM({map:imgTex(ASSETS.img.wood,2,1),color:0xc89a6a});
  counterBlock(R,4.6,wood,LM({color:0xf0e8d8}),-D/2+2.2);
  const gl=new THREE.Mesh(new THREE.BoxGeometry(4,0.4,0.55),new THREE.MeshBasicMaterial({color:0xfff4e0,transparent:true,opacity:0.22}));gl.position.set(0,1.27,-D/2+2.2);S.add(gl);
  plane(3.8,0.5,new THREE.MeshBasicMaterial({map:productTex('bread',3)}),0,1.1,-D/2+2.2,0,-Math.PI/2);
  for(let y=0;y<4;y++)box(4.2,0.04,0.5,wood,0,0.7+y*0.45,-D/2+0.3);for(let y=0;y<4;y++){plane(4,0.4,new THREE.MeshLambertMaterial({map:productTex('bread',11+y),transparent:true,alphaTest:0.3}),0,0.92+y*0.45,-D/2+0.36,0);}
  plane(2.4,0.45,new THREE.MeshBasicMaterial({map:signTex('BOULANGERIE','#f1e3c0','#6b3b12')}),0,H-0.3,-D/2+0.03,0);
  for(const x of[-1.6,1.6])box(0.6,0.04,0.6,LM({color:0x6a4a2a}),x,0.72,1.8);R.browse=[[-1.4,1.0],[1.4,0.6]];}
function roomStore(R){const{box,plane,W,D,H,scene:S,id}=R;const shelfM=LM({color:0xd8dce0}),dark=LM({color:0x2a2e34});
  counterBlock(R,2.6,LM({map:imgTex(ASSETS.img.wood,1,1),color:0xa07a5a}),LM({color:0x303438}),-D/2+2.0,-W/2+1.8);
  box(0.5,0.3,0.4,dark,-W/2+2.2,1.2,-D/2+2.0);
  const kinds=id==='pharma'?['box','bottle','box']:id==='brico'?['paint','box','paint']:id==='surplus'?['box','box','bottle']:['can','box','bottle'];
  // back-wall cigarette / product wall behind the till
  plane(2.6,1.2,new THREE.MeshLambertMaterial({map:productTex(id==='tabac'?'cig':kinds[0],5)}),-W/2+1.8,1.9,-D/2+0.03,0);
  // gondolas
  for(const gx of[0.6,2.4]){box(0.9,1.5,3.4,shelfM,gx,0.75,0.6,0,true);for(const s of[-1,1])for(let y=0;y<3;y++){box(0.12,0.03,3.3,dark,gx+s*0.5,0.35+y*0.45,0.6);
      const p=plane(3.2,0.36,new THREE.MeshLambertMaterial({map:productTex(kinds[(y+(s>0?1:0))%3],gx*10+y*3+(s>0?7:0)),transparent:true,alphaTest:0.3}),gx+s*0.47,0.55+y*0.45,0.6,s*Math.PI/2);}}
  // wall shelves right
  for(let y=0;y<4;y++){box(0.4,0.03,5,dark,W/2-0.2,0.5+y*0.5,0.4);plane(4.8,0.42,new THREE.MeshLambertMaterial({map:productTex(kinds[y%3],40+y),transparent:true,alphaTest:0.3}),W/2-0.25,0.73+y*0.5,0.4,-Math.PI/2);}
  R.col.push([W/2-0.45,-2.2,W/2,3]);
  const fr=box(1.6,2.0,0.6,LM({color:0xe8e8e8}),1.5,1.0,-D/2+0.35,0,true);plane(1.4,1.6,new THREE.MeshBasicMaterial({map:productTex('can',21)}),1.5,1.05,-D/2+0.66,0);
  plane(2.4,0.45,new THREE.MeshBasicMaterial({map:signTex(R.def.sign,R.def.band,R.def.txt)}),-W/2+1.8,H-0.3,-D/2+0.03,0);
  if(id==='pharma'){const cr=rtex(32,32,(g)=>{g.fillStyle='#0d8a3a';g.fillRect(11,2,10,28);g.fillRect(2,11,28,10);});plane(0.6,0.6,new THREE.MeshBasicMaterial({map:cr,transparent:true}),1.5,2.5,-D/2+0.03,0);}
  R.browse=[[1.5,-1.0],[1.5,2.8],[3.0,2.8]];}
function roomClothes(R){const{box,plane,W,D,H,scene:S}=R;const metal=LM({color:0x9a9aa4,emissive:0x111}),black=LM({color:0x1a1a1e});
  counterBlock(R,2.4,black,LM({color:0xd4302a}),-D/2+1.8,W/2-1.8);
  // racks of hanging tees
  const shirt=rtex(32,32,(g)=>{g.fillStyle='#fff';g.beginPath();g.moveTo(6,4);g.lineTo(26,4);g.lineTo(31,10);g.lineTo(26,13);g.lineTo(25,30);g.lineTo(7,30);g.lineTo(6,13);g.lineTo(1,10);g.closePath();g.fill();});
  const rack=(x,z,ry)=>{box(1.8,0.03,0.03,metal,x,1.65,z,ry);for(const s of[-0.85,0.85])box(0.03,1.65,0.03,metal,x+Math.cos(ry)*s,0.83,z-Math.sin(ry)*s);
    for(let i=0;i<9;i++){const t=-0.75+i*0.19,c=pick(TOPCOLS);const m=plane(0.5,0.62,LM({map:shirt,color:c,transparent:true,alphaTest:0.5,side:THREE.DoubleSide}),x+Math.cos(ry)*t,1.3,z-Math.sin(ry)*t,ry+Math.PI/2+rr(-0.15,0.15));}
    R.col.push([x-1,z-0.35,x+1,z+0.35]);};
  rack(-1.6,0.2,0);rack(-1.6,2.0,0);
  // sneaker wall on the left, lit boxes
  for(let y=0;y<5;y++){box(0.32,0.03,4.6,metal,-W/2+0.17,0.6+y*0.42,-0.8);plane(4.4,0.32,new THREE.MeshLambertMaterial({map:productTex('shoe',60+y),transparent:true,alphaTest:0.3,emissive:0x222222}),-W/2+0.2,0.78+y*0.42,-0.8,Math.PI/2);}
  R.col.push([-W/2,-3.2,-W/2+0.4,1.6]);
  // folded tees table
  box(1.6,0.8,0.9,LM({map:imgTex(ASSETS.img.wood,1,1),color:0x6a4a3a}),0.4,0.4,-0.9,0,true);for(let i=0;i<6;i++)box(0.4,0.08,0.35,LM({color:pick(TOPCOLS)}),-0.1+(i%3)*0.5,0.84+Math.floor(i/3)*0.08,-1.05+Math.floor(i/3)*0.25);
  // mirror + podium where the player tries clothes on
  const mir=rtex(32,64,(g)=>{const gr=g.createLinearGradient(0,0,32,64);gr.addColorStop(0,'#c8d4e4');gr.addColorStop(0.5,'#7a8aa4');gr.addColorStop(1,'#a8b8cc');g.fillStyle=gr;g.fillRect(0,0,32,64);g.fillStyle='rgba(255,255,255,.4)';g.fillRect(6,0,3,64);g.fillRect(14,0,1,64);});
  box(1.2,2.3,0.08,LM({color:0x111}),W/2-0.08,1.25,1.3,Math.PI/2);plane(1.0,2.1,new THREE.MeshBasicMaterial({map:mir}),W/2-0.13,1.25,1.3,-Math.PI/2);
  const pod=new THREE.Mesh(new THREE.CylinderGeometry(0.7,0.7,0.12,20),LM({color:0x2a2a30,emissive:0x101010}));pod.position.set(W/2-1.4,0.06,1.3);S.add(pod);
  const spot=new THREE.SpotLight(0xffffff,1.6,7,0.5,0.5,1);spot.position.set(W/2-1.4,H-0.1,2.4);spot.target.position.set(W/2-1.4,0,1.3);S.add(spot,spot.target);
  const pr=new THREE.Mesh(RINGG,new THREE.MeshBasicMaterial({color:0xffd84d,transparent:true,opacity:0.6,depthWrite:false}));pr.position.set(W/2-1.4,0.13,1.3);pr.scale.setScalar(0.7);S.add(pr);
  R.mirror={x:W/2-1.4,z:1.3};
  plane(2.6,0.5,new THREE.MeshBasicMaterial({map:signTex('FRINGUES STREET','#111','#f2f2f2')}),W/2-1.8,H-0.3,-D/2+0.03,0);
  const pst=rtex(64,96,(g)=>{g.fillStyle='#d4302a';g.fillRect(0,0,64,96);g.fillStyle='#111';g.font="bold 16px Impact,sans-serif";g.textAlign='center';g.fillText('DROP',32,22);g.fillText('99',32,42);g.fillStyle='#fff';g.beginPath();g.moveTo(10,80);g.quadraticCurveTo(18,56,40,60);g.lineTo(56,74);g.lineTo(56,82);g.lineTo(10,84);g.fill();});
  plane(0.8,1.2,LM({map:pst}),-0.6,1.8,-D/2+0.03,0);plane(0.8,1.2,LM({map:pst}),0.6,1.8,-D/2+0.03,0);
  R.browse=[[-0.4,1.1],[-0.4,3.0],[1.0,3.2]];}
function roomGarage(R){const{box,plane,W,D,H,scene:S}=R;const metal=LM({map:imgTex(ASSETS.img.rust,1,1),color:0x8a8478}),dark=LM({color:0x2a2826});
  // workbench as the counter
  counterBlock(R,3.0,metal,LM({map:imgTex(ASSETS.img.wood,2,1),color:0x6a5040}),-D/2+2.0,W/2-2.2);
  // guns laid on the bench, rack on the wall
  const gm=LM({color:0x1e1e22,emissive:0x0a0a0a});['pistol','smg','shotgun'].forEach((w,i)=>{const m=new THREE.Mesh(weaponGeo(w),VCMAT);m.rotation.set(-Math.PI/2,0,Math.PI/2);m.position.set(W/2-3.1+i*0.8,1.08,-D/2+2.0);m.scale.setScalar(1.3);S.add(m);});
  box(2.6,1.3,0.05,LM({color:0x3a5a3a}),W/2-2.2,2.0,-D/2+0.04);for(let i=0;i<5;i++){const m=new THREE.Mesh(weaponGeo(i%2?'smg':'shotgun'),VCMAT);m.rotation.set(0,Math.PI/2,Math.PI/2);m.position.set(W/2-3.2+i*0.5,2.0,-D/2+0.12);m.scale.setScalar(1.4);S.add(m);}
  // car on a lift
  const model=CARM.car2||CARM.car1;if(model){const v=CARTEX.car2_blue||CARTEX.car||Object.values(CARTEX).find(x=>x);const m=new THREE.Mesh(model.geo,v);m.scale.setScalar(CARSC);m.rotation.y=Math.PI/2;m.position.set(-W/2+2.4,0.9-model.bb.min.y*CARSC,0.5);S.add(m);}
  for(const z of[-1.2,2.2])box(2.6,0.12,0.3,LM({color:0xd4b020}),-W/2+2.4,0.85,z);for(const x of[-W/2+1.0,-W/2+3.8])box(0.2,0.9,0.2,LM({color:0xd4b020}),x,0.45,0.5);
  R.col.push([-W/2+0.6,-1.8,-W/2+4.2,2.8]);
  const tm=modelGroup('tyre',1);for(let i=0;i<4;i++){const t=modelGroup('tyre',1);if(t){t.position.set(W/2-0.5,0+i*0.22,2.8);S.add(t);}}R.col.push([W/2-1,2.3,W/2,3.3]);
  const ob=modelGroup('box',1);if(ob){ob.position.set(-W/2+0.6,0,-D/2+0.6);S.add(ob);}
  const rad=modelGroup('boombox',1.2);if(rad){rad.position.set(W/2-3.6,1.06,-D/2+2.0);S.add(rad);}
  plane(W,0.5,LM({color:0x1e1e1e}),0,H-0.25,-D/2+0.02,0);plane(2.0,0.4,new THREE.MeshBasicMaterial({map:signTex('GARAGE','#1e1e1e','#d4302a')}),W/2-2.2,H-0.3,-D/2+0.03,0);
  const oil=rtex(64,64,(g)=>{g.fillStyle='rgba(0,0,0,.6)';g.beginPath();g.ellipse(32,32,28,18,0.3,0,TAU);g.fill();});plane(2.4,1.6,new THREE.MeshBasicMaterial({map:oil,transparent:true,depthWrite:false}),-W/2+2.4,0.01,0.5,0,-Math.PI/2);}

/* entering / leaving */
function roomFor(s){if(!ROOMS.cache[s.id]){const R=buildRoom(s.id);sharpen(R.scene);detailScene(R.scene,1.3,0.4,o=>o.material.map&&!o.material.map.wrapS);ROOMS.cache[s.id]=R;}return ROOMS.cache[s.id];}
function enterRoom(s){if(ROOMS.busy)return;ROOMS.busy=true;fadeTo(1,250);sfx.door();
  setTimeout(()=>{const R=roomFor(s);ROOMS.cur=R;R.out=outsidePoint(s);state='room';UI.ret='room';if(pl.ch.root.parent)pl.ch.root.parent.remove(pl.ch.root);R.scene.add(pl.ch.root);
    pl.x=R.door.x;pl.z=R.door.z-0.2;pl.y=0;pl.h=pl.th=Math.PI;ROOMS.mode='walk';ROOMS.camInit=false;setWeapon(pl.ch,null);
    banner(R.def.label,R.def.sign,1.6);fadeTo(0,350);ROOMS.busy=false;},270);}
function exitRoom(){if(ROOMS.busy)return;ROOMS.busy=true;fadeTo(1,250);sfx.door();
  setTimeout(()=>{const R=ROOMS.cur;R.scene.remove(pl.ch.root);scene.add(pl.ch.root);state='play';UI.ret='play';pl.x=R.out.x;pl.z=R.out.z;pl.y=groundY(pl.x,pl.z);pl.h=pl.th=R.out.h;yaw=R.out.h;pitch=0.25;CAMS.init=false;
    setWeapon(pl.ch,pl.cur==='fists'?null:pl.cur);ROOMS.cur=null;fadeTo(0,350);ROOMS.busy=false;},270);}
function outsidePoint(s){let best=null;for(let a=0;a<4;a++){const h=a*Math.PI/2,x=s.x+Math.sin(h)*1.2,z=s.z+Math.cos(h)*1.2;if(!blockedAt(x,z)&&!blockedAt(s.x-Math.sin(h)*0.1,s.z-Math.cos(h)*0.1)){if(!best||blockedAt(s.x-Math.sin(h)*2.5,s.z-Math.cos(h)*2.5))best={x:s.x+Math.sin(h)*0.4,z:s.z+Math.cos(h)*0.4,h};}}return best||{x:s.x,z:s.z,h:0};}
V6.interact.push(()=>{if(state!=='play')return null;for(const s of shopsPts)if(Math.hypot(s.x-pl.x,s.z-pl.z)<1.7)return{type:'door',label:'ВОЙТИ: '+s.label,run:()=>enterRoom(s)};return null;});

/* in-room update */
ROOMS.update=function(dt,inp){const R=this.cur;if(!R)return;
  for(const f of R.upd)f(dt,time);
  // shopkeeper idles, glances at the player
  const kp=R.keeper;kp.root.rotation.y=angLerp(kp.root.rotation.y,clamp(Math.atan2(pl.x-R.counter.kx,pl.z-R.counter.kz),-0.9,0.9),Math.min(1,dt*2));animChar(kp,dt,0,null);
  for(const n of R.npcs){const tp=n.pts[n.i];const d=Math.hypot(tp[0]-n.x,tp[1]-n.z);let spd=0;
    if(d>0.15){spd=1.1;n.h=angLerp(n.h,Math.atan2(tp[0]-n.x,tp[1]-n.z),Math.min(1,dt*6));n.x+=Math.sin(n.h)*spd*dt;n.z+=Math.cos(n.h)*spd*dt;}
    else{n.wait-=dt;n.ch.pose='phone';if(n.wait<=0){n.i=(n.i+1)%n.pts.length;n.wait=rr(2,5);n.ch.pose=null;}}
    n.ch.root.position.set(n.x,0,n.z);n.ch.root.rotation.y=n.h;animChar(n.ch,dt,spd,null);}
  if(this.mode==='dress'){dressUpdate(dt,inp);return;}
  if(this.mode==='talk'){this.talkT-=dt;animChar(pl.ch,dt,0,null);roomCam(dt);if(this.talkT<=0){this.mode='walk';openShop(R.id);this.shopCam=true;}return;}
  if(this.shopCam&&state==='room'){this.shopCam=false;$('#sub').classList.remove('on');}
  // walk (camera-relative, camera looks roughly toward -z)
  const cyaw=Math.atan2(pl.x-this.cam.position.x,pl.z-this.cam.position.z);const fx=Math.sin(cyaw),fz=Math.cos(cyaw),rx=-Math.cos(cyaw),rz=Math.sin(cyaw);
  let dx=fx*inp.mz+rx*inp.mx,dz=fz*inp.mz+rz*inp.mx;const mag=Math.min(1,Math.hypot(inp.mx,inp.mz)),spd=mag<0.08?0:mag*(inp.run?4:2.2);
  if(spd){const L=Math.hypot(dx,dz);pl.x+=dx/L*spd*dt;pl.z+=dz/L*spd*dt;pl.th=Math.atan2(dx,dz);}
  pl.x=clamp(pl.x,-R.W/2+0.3,R.W/2-0.3);pl.z=clamp(pl.z,-R.D/2+0.3,R.D/2-0.3);
  for(const[x0,z0,x1,z1]of R.col){if(pl.x>x0-0.3&&pl.x<x1+0.3&&pl.z>z0-0.3&&pl.z<z1+0.3){const l=pl.x-(x0-0.3),r=x1+0.3-pl.x,t=pl.z-(z0-0.3),b=z1+0.3-pl.z,m=Math.min(l,r,t,b);if(m===l)pl.x=x0-0.3;else if(m===r)pl.x=x1+0.3;else if(m===t)pl.z=z0-0.3;else pl.z=z1+0.3;}}
  pl.h=angLerp(pl.h,pl.th,Math.min(1,dt*12));pl.ch.root.position.set(pl.x,0,pl.z);pl.ch.root.rotation.set(0,pl.h,0);animChar(pl.ch,dt,spd,null);
  roomCam(dt);
  const it=roomInteract(R);const lbl=it?(isTouch?it.label:'E — '+it.label):'';if(lbl!==lastPrompt){hud.prompt.textContent=lbl;lastPrompt=lbl;document.querySelector('.tb[data-b=action]').classList.toggle('hl',!!it);}
  if(inp.inv){openInv();return;}
  if(inp.action&&it)it.run();
  updHUD(dt);};
function roomInteract(R){if(Math.hypot(pl.x-R.door.x,pl.z-R.door.z)<0.9)return{label:'ВЫЙТИ НА УЛИЦУ',run:exitRoom};
  if(R.mirror&&Math.hypot(pl.x-R.mirror.x,pl.z-R.mirror.z)<1.0)return{label:'ПРИМЕРИТЬ ОДЕЖДУ',run:()=>dressStart(R)};
  if(Math.hypot(pl.x-R.counter.x,pl.z-R.counter.z)<1.3&&R.kind!=='clothes')return{label:R.kind==='garage'?'ПОГОВОРИТЬ':'К КАССЕ',run:()=>talkStart(R)};
  if(R.kind==='clothes'&&Math.hypot(pl.x-R.counter.x,pl.z-R.counter.z)<1.3)return{label:'ПОГОВОРИТЬ',run:()=>{say('ПРОДАВЕЦ',pick(KEEPER_LINES.clothes),2.5);}};return null;}
function say(who,line,dur){const s=$('#sub');s.innerHTML='<b>'+who+'</b>'+line;s.classList.add('on');clearTimeout(say.tm);if(dur)say.tm=setTimeout(()=>s.classList.remove('on'),dur*1000);}
function talkStart(R){ROOMS.mode='talk';ROOMS.talkT=1.6;pl.th=pl.h=Math.atan2(R.counter.kx-pl.x,R.counter.kz-pl.z);say(R.kind==='garage'?'ДЖАМЕЛЬ':'ПРОДАВЕЦ',pick(KEEPER_LINES[R.kind]),3.2);
  R.keeper.talk=1.5;
  const k=R.keeper.root.position;ROOMS.shot={p:[pl.x+0.7,1.75,pl.z+1.1],l:[k.x,1.5,k.z]};}
function roomCam(dt){const R=ROOMS.cur,c=ROOMS.cam;let px,py,pz,lx,ly,lz;
  if(ROOMS.shot&&(ROOMS.mode==='talk'||state!=='room')){[px,py,pz]=ROOMS.shot.p;[lx,ly,lz]=ROOMS.shot.l;}
  else{ROOMS.shot=null;px=clamp(pl.x*0.55,-R.W/2+0.4,R.W/2-0.4);pz=Math.min(R.D/2-0.25,pl.z+3.3);py=R.H-0.45;lx=pl.x;ly=1.0;lz=pl.z-0.6;}
  if(!ROOMS.camInit){c.position.set(px,py,pz);ROOMS.camInit=true;ROOMS.lk=new V3(lx,ly,lz);}
  const k=1-Math.exp(-dt*6);c.position.x=lerp(c.position.x,px,k);c.position.y=lerp(c.position.y,py,k);c.position.z=lerp(c.position.z,pz,k);ROOMS.lk.x=lerp(ROOMS.lk.x,lx,k);ROOMS.lk.y=lerp(ROOMS.lk.y,ly,k);ROOMS.lk.z=lerp(ROOMS.lk.z,lz,k);c.lookAt(ROOMS.lk);}
