/* ======================= V6 CITY DRESSING: Paris roofs, balconies, street furniture ======================= */
const CITY={inter:[],geo:{vc:[],zinc:[],iron:[],awn:[],post:[],tag:[],glass:[],win:[]},mat:{}};
const FRONTN={n:[0,-1],s:[0,1],e:[1,0],w:[-1,0]};
function faceOf(b,side){const[nx,nz]=FRONTN[side];const ns=nz!==0;return{nx,nz,tx:ns?1:0,tz:ns?0:1,cx:b.cx+nx*b.w/2,cz:b.cz+nz*b.d/2,len:ns?b.w:b.d};}
/* a flat quad (w×h) centred at (x,y,z) facing direction (nx,nz), with a UV sub-rect */
function quadG(w,h,x,y,z,nx,nz,uv,tilt){const g=new THREE.PlaneGeometry(w,h);if(tilt)g.rotateX(tilt);g.rotateY(Math.atan2(nx,nz));g.translate(x,y,z);
  if(uv){const a=g.attributes.uv;for(let i=0;i<a.count;i++)a.setXY(i,uv[0]+(uv[2]-uv[0])*a.getX(i),uv[1]+(uv[3]-uv[1])*a.getY(i));}return g;}
function mansardG(w,d,rh,ins){const W=w/2,D=d/2,iw=W-ins,id=D-ins,P_=[];const q=(a,b,c,dd)=>{P_.push(...a,...b,...c,...a,...c,...dd);};
  q([-W,0,D],[W,0,D],[iw,rh,id],[-iw,rh,id]);q([W,0,-D],[-W,0,-D],[-iw,rh,-id],[iw,rh,-id]);q([W,0,D],[W,0,-D],[iw,rh,-id],[iw,rh,id]);q([-W,0,-D],[-W,0,D],[-iw,rh,id],[-iw,rh,-id]);
  q([-iw,rh,id],[iw,rh,id],[iw,rh,-id],[-iw,rh,-id]);
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P_,3));const uv=[];
  for(let i=0;i<P_.length;i+=3){const x=P_[i],y=P_[i+1],z=P_[i+2];uv.push((Math.abs(x)>Math.abs(z)*w/d?z:x)/2.2,y/1.6+(y>=rh-0.01&&i>=P_.length-18?z/2:0));}
  g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.computeVertexNormals();return g;}
function cityTextures(){const M=CITY.mat;
  M.zinc=LM({map:rtex(64,64,(g)=>{g.fillStyle='#6f7c8c';g.fillRect(0,0,64,64);for(let x=0;x<64;x+=8){g.fillStyle='rgba(255,255,255,.12)';g.fillRect(x,0,1,64);g.fillStyle='rgba(0,0,0,.25)';g.fillRect(x+1,0,1,64);}speck(g,64,64,160,'rgba(0,0,0,.1)');
    const gr=g.createLinearGradient(0,0,0,64);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(30,20,10,.25)');g.fillStyle=gr;g.fillRect(0,0,64,64);},[1,1])});
  M.iron=new THREE.MeshLambertMaterial({map:rtex(64,32,(g)=>{g.strokeStyle='#14110f';g.lineWidth=2;g.strokeRect(1,1,62,30);g.beginPath();g.moveTo(0,5);g.lineTo(64,5);g.stroke();
    for(let x=4;x<64;x+=8){g.beginPath();g.moveTo(x,5);g.lineTo(x,31);g.stroke();g.beginPath();g.arc(x+4,18,3.5,0,TAU);g.stroke();}},[1,1]),transparent:true,alphaTest:0.5,side:THREE.DoubleSide});
  const awc=['#b5121b','#1f5f3a','#1d3b7a','#c47a12','#5a1a6a','#222'];M.awn=LM({map:rtex(128,32,(g)=>{for(let i=0;i<6;i++){const y=0;g.fillStyle=awc[i];g.fillRect(0,i*0,0,0);}
    for(let r=0;r<6;r++)for(let x=0;x<128;x+=8){g.fillStyle=(x/8)%2?'#efe8d8':awc[r];g.fillRect(x,0,8,32);}
    g.fillStyle='rgba(0,0,0,.25)';g.fillRect(0,28,128,4);}),side:THREE.DoubleSide});
  // 6 awning colourways stacked in one atlas row each
  const[ac,ag]=mk(64,192);for(let r=0;r<6;r++){for(let x=0;x<64;x+=8){ag.fillStyle=(x/8)%2?'#efe8d8':awc[r];ag.fillRect(x,r*32,8,32);}ag.fillStyle='rgba(0,0,0,.3)';ag.fillRect(0,r*32+26,64,6);
    for(let x=0;x<64;x+=8){ag.fillStyle=awc[r];ag.beginPath();ag.moveTo(x,r*32+26);ag.lineTo(x+8,r*32+26);ag.lineTo(x+4,r*32+31);ag.fill();}}
  M.awn=LM({map:new THREE.CanvasTexture(ac),side:THREE.DoubleSide});M.awn.map.magFilter=M.awn.map.minFilter=texFilter();
  // poster atlas: 4×2 bill posters glued on walls
  const[pc,pg]=mk(256,192);const PST=[['SOIRÉE','RAP 93','#e8c420','#111'],['КОНЦЕРТ','БÉTON FM','#c4161c','#fff'],['MANIF','SAMEDI 14H','#f0f0f0','#c4161c'],['PERDU','CHAT GRIS','#fff','#111'],
    ['CIRQUE','MÉDRANO','#1d3b7a','#ffd400'],['BATTLE','DANSE','#7a2fb5','#fff'],['ЛОТО','LOTO','#2a8f2a','#fff'],['SOLDES','-50%','#ff4fa8','#111']];
  PST.forEach(([a,b,bg,fg],i)=>{const x=(i%4)*64,y=Math.floor(i/4)*96;pg.fillStyle=bg;pg.fillRect(x+2,y+2,60,92);pg.fillStyle=fg;pg.font="bold 13px Impact,'Arial Black',sans-serif";pg.textAlign='center';pg.fillText(a,x+32,y+26);
    pg.font="bold 9px 'Arial Black',sans-serif";pg.fillText(b,x+32,y+80);pg.fillStyle=fg;pg.globalAlpha=.6;pg.beginPath();pg.arc(x+32,y+52,14,0,TAU);pg.fill();pg.globalAlpha=1;
    pg.fillStyle='rgba(255,255,255,.18)';for(let k=0;k<5;k++)pg.fillRect(x+2+Math.random()*50,y+2+Math.random()*80,rr(4,12),1);speck(pg,256,192,40,'rgba(0,0,0,.15)');});
  M.post=LM({map:new THREE.CanvasTexture(pc),transparent:true,polygonOffset:true,polygonOffsetFactor:-2});
  // tag atlas: 4×2 graffiti throw-ups
  const[tc,tg]=mk(512,256);for(let i=0;i<8;i++){const x=(i%4)*128,y=Math.floor(i/4)*128;tg.save();tg.beginPath();tg.rect(x,y,128,128);tg.clip();
    if(i<5)piece(tg,x+64,y+60,i%2?34:40,rpick(WORDS),118,Math.random);else scrawl(tg,x+10,y+40,108,36,Math.random);if(Math.random()<0.5)scrawl(tg,x+12,y+96,70,14,Math.random);tg.restore();}
  M.tag=new THREE.MeshLambertMaterial({map:new THREE.CanvasTexture(tc),transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2});
  M.glass=new THREE.MeshBasicMaterial({color:0x9fc0e0,transparent:true,opacity:0.22,side:THREE.DoubleSide,depthWrite:false});
  M.win=LM({map:rtex(32,32,(g)=>{g.fillStyle='#d8cfbe';g.fillRect(0,0,32,32);g.fillStyle='#1a2236';g.fillRect(6,6,20,26);g.fillStyle='#d8cfbe';g.fillRect(15,6,2,26);g.fillRect(6,16,20,2);g.fillStyle='rgba(120,150,200,.35)';g.fillRect(7,7,7,8);})});}
function dressBuildings(){const G=CITY.geo;
  for(const b of BLD){
    if(b.kind==='shop'){// Haussmann: cornice, iron balconies, zinc mansard with dormers and chimney stacks, awning over the shop
      const rh=Math.min(2.6,b.h*0.22),ins=1.25;G.zinc.push(mansardG(b.w,b.d,rh,ins).translate(b.cx,b.h,b.cz));
      G.vc.push(cbx(b.w+0.5,0.32,b.d+0.5,'#d9cfbb',b.cx,b.h-0.02,b.cz),cbx(b.w+0.2,0.18,b.d+0.2,'#cfc4ae',b.cx,4.05,b.cz));
      for(const side of['n','s','e','w']){const f=faceOf(b,side),long=f.len>8;
        if(long){for(let t=-f.len/2+1.6;t<f.len/2-1;t+=3.2){const x=b.cx+f.tx*t+f.nx*(b.w/2-ins*0.55),z=b.cz+f.tz*t+f.nz*(b.d/2-ins*0.55);
            G.vc.push(cbx(f.tx?1.0:0.9,1.15,f.tx?0.9:1.0,'#6a7686',x,b.h+rh*0.42+0.25,z),cbx(f.tx?1.2:1.0,0.14,f.tx?1.0:1.2,'#5a6676',x,b.h+rh*0.42+0.85,z));
            G.win.push(quadG(0.7,0.85,x+f.nx*0.47,b.h+rh*0.42+0.2,z+f.nz*0.47,f.nx,f.nz));}}
        if(b.h>9.5&&(side===b.front||srand()<0.5)){for(const y of[7.0,b.h-0.95]){if(y<6)continue;const L=f.len-0.6;
            G.vc.push(cbx(f.tx?L:0.55,0.12,f.tx?0.55:L,'#cfc4ae',f.cx+f.nx*0.27,y-0.45,f.cz+f.nz*0.27));
            G.iron.push(quadG(L,0.9,f.cx+f.nx*0.54,y,f.cz+f.nz*0.54,f.nx,f.nz,[0,0,L/1.6,1]));}}}
      const f=faceOf(b,b.front),aw=Math.floor(srand()*6),L=f.len-1.2;
      G.awn.push(quadG(L,1.5,f.cx+f.nx*0.68,3.45,f.cz+f.nz*0.68,f.nx,f.nz,[0,(5-aw)/6+0.005,L/2.4,(6-aw)/6-0.005],-1.0));
      const ch=1+Math.floor(srand()*3);for(let k=0;k<ch;k++){const x=b.cx+rnd(-b.w/2+1.5,b.w/2-1.5),z=b.cz+rnd(-b.d/2+1.5,b.d/2-1.5),y=b.h+rh;
        G.vc.push(cbx(0.9,1.3,0.5,'#9a5a3a',x,y+0.55,z),cbx(1.0,0.12,0.6,'#d9cfbb',x,y+1.25,z));for(let q=0;q<3;q++)G.vc.push(cbx(0.13,0.32,0.13,'#c46a3a',x-0.3+q*0.3,y+1.47,z));}}
    else if(b.kind==='hlm'){// loggias with painted parapets, satellite dishes, laundry; rooftop lift housing and antennas
      const pcol=pick(['#c86a3a','#3a6a9a','#c8b04a','#6a8a4a','#b04a4a','#d8d8d0']);
      for(const side of['n','s']){const f=faceOf(b,b.front===side||b.d>=b.w?side:side);if(f.len<10)continue;
        const cols=Math.floor((f.len-2)/4.4);for(let c=0;c<cols;c++){const t=-f.len/2+2.2+(c+0.5)*((f.len-4.4)/cols);
          for(let y=3.6+2.8;y<b.h-1;y+=2.8){if(srand()<0.12)continue;const x=f.cx+f.tx*t,z=f.cz+f.tz*t;
            G.vc.push(cbx(f.tx?2.8:0.9,0.16,f.tx?0.9:2.8,'#a8a49c',x+f.nx*0.45,y-1.3,z+f.nz*0.45),cbx(f.tx?2.8:0.08,0.95,f.tx?0.08:2.8,srand()<0.75?pcol:'#9a968e',x+f.nx*0.88,y-0.75,z+f.nz*0.88));
            const r=srand();if(r<0.22){const dx=x+f.tx*rnd(-1,1)+f.nx*1.0,dz=z+f.tz*rnd(-1,1)+f.nz*1.0;G.vc.push(colorize(new THREE.CylinderGeometry(0.34,0.3,0.06,10).rotateX(Math.PI/2).rotateY(Math.atan2(f.nx,f.nz)+rnd(-0.4,0.4)).translate(dx,y-0.3,dz),'#e8e8e4'),cbx(0.05,0.05,0.35,'#888',dx-f.nx*0.15,y-0.3,dz-f.nz*0.15));}
            else if(r<0.4){for(let q=0;q<4;q++)G.vc.push(cbx(f.tx?0.32:0.02,0.42,f.tx?0.02:0.32,pick(['#e8e8e8','#c4161c','#1f6fd6','#f2c418','#111']),x+f.tx*(-0.9+q*0.5)+f.nx*0.95,y-0.15,z+f.tz*(-0.9+q*0.5)+f.nz*0.95));}
            else if(r<0.5)G.vc.push(colorize(new THREE.IcosahedronGeometry(0.3,0).translate(x+f.nx*0.6,y-0.95,z+f.nz*0.6),'#3a6a2a'));}}}
      G.vc.push(cbx(4,2.2,4,'#9a968e',b.cx+rnd(-b.w/4,b.w/4),b.h+1.1,b.cz));for(let k=0;k<4;k++){const x=b.cx+rnd(-b.w/2+1,b.w/2-1),z=b.cz+rnd(-b.d/2+1,b.d/2-1);G.vc.push(cbx(0.06,rnd(1.5,3),0.06,'#555',x,b.h+1.2,z),cbx(0.9,0.04,0.04,'#555',x,b.h+2,z));}
      G.vc.push(cbx(b.w+0.3,0.4,b.d+0.3,'#8a867e',b.cx,b.h+0.2,b.cz));
      // entrance canopy on the front
      const f=faceOf(b,b.front);G.vc.push(cbx(f.tx?3.6:1.6,0.2,f.tx?1.6:3.6,'#8a867e',f.cx+f.nx*0.8,2.9,f.cz+f.nz*0.8));CITY.entrances.push({x:f.cx+f.nx*2.2,z:f.cz+f.nz*2.2,h:Math.atan2(f.nx,f.nz)});}
    else if(b.kind==='house'){G.vc.push(cbx(0.7,1.6,0.7,'#8a5a42',b.cx+rnd(-2,2),b.h+1.6,b.cz+rnd(-1.5,1.5)));}
    // wheat-pasted posters and tags at street level on every exposed face
    for(const side of['n','s','e','w']){const f=faceOf(b,side);if(b.kind==='house')continue;const n=Math.floor(f.len/9);
      for(let k=0;k<n;k++){const t=rnd(-f.len/2+1.5,f.len/2-1.5),x=f.cx+f.tx*t+f.nx*0.04,z=f.cz+f.tz*t+f.nz*0.04;const r=srand();
        if(r<0.35){const i=Math.floor(srand()*8),u=(i%4)/4,v=1-Math.floor(i/4)/2;for(let q=0;q<(srand()<0.5?3:1);q++)G.post.push(quadG(0.95,1.4,x+f.tx*q*1.0,1.9,z+f.tz*q*1.0,f.nx,f.nz,[u+0.005,v-0.5,u+0.245,v]));}
        else if(r<0.75){const i=Math.floor(srand()*8),u=(i%4)/4,v=1-Math.floor(i/4)/2;const s=rnd(1.6,2.8);G.tag.push(quadG(s,s*0.62,x+f.nx*0.02,rnd(0.9,1.7),z+f.nz*0.02,f.nx,f.nz,[u,v-0.5,u+0.25,v]));}}}}}
/* street furniture placed along every inner curb, away from crossings, lamps and trees */
function streetFurniture(){const G=CITY.geo,inst={bollard:[],bench:[],bin:[],rack:[],tree:[]};const used=[];const free=(x,z,r)=>{for(const[a,b,c]of used)if(Math.hypot(a-x,b-z)<r+c)return false;if(blockedAt(x,z))return false;for(const t of treesPos)if(Math.hypot(t[0]-x,t[1]-z)<r+0.8)return false;return true;};
  const take=(x,z,r)=>used.push([x,z,r]);
  for(let k=0;k<=NB;k++)for(let s=0;s<NB;s++)for(const side of[-1,1]){const line=k*P+side*6.35;if(line<0||line>SIZE)continue;
    for(const ax of['x','z']){const a0=s*P+9.5,a1=(s+1)*P-9.5;
      const n=3+Math.floor(srand()*4);for(let q=0;q<n;q++){const a=rnd(a0+1,a1-1),off=side*0.55,x=ax==='x'?a:line+off,z=ax==='x'?line+off:a,h=ax==='x'?(side>0?Math.PI:0):(side>0?-Math.PI/2:Math.PI/2);
        if(!free(x,z,1.1))continue;take(x,z,1.1);const r=srand();
        if(r<0.4){inst.bench.push(MX(x,0.15,z,h,1));addCol(x-(ax==='x'?0.9:0.3),z-(ax==='x'?0.3:0.9),x+(ax==='x'?0.9:0.3),z+(ax==='x'?0.3:0.9),0.9);
          CITY.inter.push({x:x+Math.sin(h)*0.7,z:z+Math.cos(h)*0.7,r:1.1,kind:'bench',h,sx:x+Math.sin(h)*0.1,sz:z+Math.cos(h)*0.1});CITY.benches.push({x,z,h});}
        else if(r<0.65){inst.bin.push(MX(x,0.15,z,0,1));addCol(x-0.25,z-0.25,x+0.25,z+0.25,1);}
        else if(r<0.8){inst.rack.push(MX(x,0.15,z,h+Math.PI/2,1));}
        else if(r<0.9&&ax==='x'){CITY.vend.push({x:x,z:z+(side>0?0.2:-0.2),h});}}}}
  for(let k=0;k<=NB;k++)for(let s=0;s<NB;s++)for(const side of[-1,1]){const line=k*P+side*6.35;if(line<0||line>SIZE)continue;for(const ax of['x','z'])for(let a=s*P+9.5;a<=(s+1)*P-9.5;a+=2.0){const x=ax==='x'?a:line,z=ax==='x'?line:a;if(free(x,z,0.15))inst.bollard.push(MX(x,0.15,z,0,1));}}
  // Paris plane trees in grates along the Centre-ville boulevards
  for(let k=0;k<=NB;k++)for(let s=3;s<NB;s++)for(const side of[-1,1]){const line=k*P+side*6.9;if(line<0||line>SIZE)continue;for(let a=s*P+12;a<(s+1)*P-12;a+=9){const x=a,z=line;if(free(x,z,0.6)&&k<4){inst.tree.push(MX(x,0.15,z,rnd(0,6),rnd(0.9,1.2)));take(x,z,0.6);addCol(x-0.25,z-0.25,x+0.25,z+0.25,3);}}}
  const bollardG=mergeGeos([colorize(new THREE.CylinderGeometry(0.06,0.07,0.85,5,1,true).translate(0,0.43,0),'#3d2f24'),colorize(new THREE.ConeGeometry(0.07,0.1,5,1,true).translate(0,0.9,0),'#3d2f24'),colorize(new THREE.CylinderGeometry(0.073,0.073,0.05,5,1,true).translate(0,0.7,0),'#b08a3a')]);
  const benchG=mergeGeos([cbx(1.8,0.06,0.42,'#3a6a44',0,0.46,0.02),cbx(1.8,0.38,0.05,'#3a6a44',0,0.72,-0.2),cbx(0.07,0.45,0.42,'#1e2a22',-0.8,0.22,0),cbx(0.07,0.45,0.42,'#1e2a22',0.8,0.22,0),cbx(0.07,0.42,0.07,'#1e2a22',-0.8,0.7,-0.21),cbx(0.07,0.42,0.07,'#1e2a22',0.8,0.7,-0.21)]);
  const binG=mergeGeos([colorize(new THREE.CylinderGeometry(0.24,0.2,0.75,8,1,true).translate(0,0.5,0),'#9aa09a'),colorize(new THREE.TorusGeometry(0.25,0.025,4,10).rotateX(Math.PI/2).translate(0,0.88,0),'#2a5a3a'),cbx(0.05,0.9,0.05,'#2a5a3a',0,0.45,-0.27)]);
  const rackG=mergeGeos([colorize(new THREE.TorusGeometry(0.4,0.03,4,10,Math.PI).translate(0,0.35,0),'#777'),cbx(0.06,0.35,0.06,'#777',-0.4,0.17,0),cbx(0.06,0.35,0.06,'#777',0.4,0.17,0)]);
  const treeG=mergeGeos([colorize(new THREE.CylinderGeometry(0.13,0.2,3.4,6).translate(0,1.7,0),'#6a6050'),colorize(new THREE.IcosahedronGeometry(1.5,1).translate(0,4.2,0),'#3d5a2c'),colorize(new THREE.IcosahedronGeometry(1.15,1).translate(0.9,3.6,0.5),'#4a6a32'),
    colorize(new THREE.IcosahedronGeometry(1.1,1).translate(-0.8,3.7,-0.4),'#34502a'),cbx(1.1,0.03,1.1,'#2a2a2a',0,0.02,0)]);
  const add=(g,list)=>{const ch={},V=new V3();for(const m of list){V.setFromMatrixPosition(m);const k=Math.floor(V.x/96)+','+Math.floor(V.z/96);(ch[k]=ch[k]||[]).push(m);}
    for(const k in ch){const L=ch[k],gg=g.clone(),im=new THREE.InstancedMesh(gg,VCMAT,L.length);L.forEach((m,i)=>im.setMatrixAt(i,m));const[cx,cz]=k.split(',').map(Number);
      gg.boundingSphere=new THREE.Sphere(new V3(cx*96+48,3,cz*96+48),76);scene.add(im);}};
  add(bollardG,inst.bollard);add(benchG,inst.bench);add(binG,inst.bin);add(rackG,inst.rack);add(treeG,inst.tree);
  // Morris columns, kiosks, bus shelters (few, unique meshes)
  const spots=[];for(let k=1;k<NB;k++)for(let s=0;s<NB;s++){const a=s*P+P/2+rnd(-12,12),side=srand()<0.5?-1:1;spots.push([a,k*P+side*7.0,side]);}
  spots.sort(()=>srand()-0.5);
  spots.slice(0,10).forEach(([x,z,side],i)=>{if(!free(x,z,1.2))return;take(x,z,1.4);const t=i%3;
    if(t===0)morrisColumn(x,z);else if(t===1)busShelter(x,z+side*0.4,side);else kiosk(x,z,side);});
  CITY.vend.forEach(v=>vendingMachine(v.x,v.z,v.h));}
function morrisColumn(x,z){const pc=rtex(128,64,(g)=>{g.fillStyle='#e8e0cc';g.fillRect(0,0,128,64);const C=['#c4161c','#1d3b7a','#e8c420','#2a8f2a','#111'];for(let i=0;i<5;i++){g.fillStyle=C[i];g.fillRect(i*26,4,24,56);g.fillStyle='#fff';g.font="bold 7px 'Arial Black',sans-serif";g.textAlign='center';g.fillText(['THÉÂTRE','OPÉRA','CINÉ','EXPO','JAZZ'][i],i*26+12,20);}});
  const m=new THREE.Mesh(new THREE.CylinderGeometry(0.62,0.62,2.2,14,1,true),LM({map:pc}));m.position.set(x,1.45,z);scene.add(m);
  const dk=LM({color:0x22402e});const base=new THREE.Mesh(new THREE.CylinderGeometry(0.7,0.75,0.35,14),dk);base.position.set(x,0.33,z);scene.add(base);
  const top=new THREE.Mesh(new THREE.CylinderGeometry(0.78,0.66,0.25,14),dk);top.position.set(x,2.65,z);scene.add(top);const dome=new THREE.Mesh(new THREE.SphereGeometry(0.62,14,6,0,TAU,0,Math.PI/2),dk);dome.scale.y=0.55;dome.position.set(x,2.75,z);scene.add(dome);
  const fin=new THREE.Mesh(new THREE.ConeGeometry(0.1,0.4,6),dk);fin.position.set(x,3.25,z);scene.add(fin);addCol(x-0.65,z-0.65,x+0.65,z+0.65,3);}
function busShelter(x,z,side){const M=CITY.mat,fr=LM({color:0x4a4a52});const g=[];const h=side>0?0:Math.PI;
  const G=new THREE.Group();G.position.set(x,0.15,z);G.rotation.y=h;scene.add(G);const box=(w,hh,d,m,px,py,pz)=>{const k=new THREE.Mesh(new THREE.BoxGeometry(w,hh,d),m);k.position.set(px,py,pz);G.add(k);return k;};
  box(3.4,0.08,1.4,fr,0,2.35,0);box(0.08,2.35,0.08,fr,-1.65,1.17,-0.6);box(0.08,2.35,0.08,fr,1.65,1.17,-0.6);box(3.3,2.1,0.03,M.glass,0,1.2,-0.62);box(0.03,2.1,1.2,M.glass,1.65,1.2,0);
  const ad=rtex(64,96,(g)=>{const gr=g.createLinearGradient(0,0,0,96);gr.addColorStop(0,'#ff4fa8');gr.addColorStop(1,'#3a1a6a');g.fillStyle=gr;g.fillRect(0,0,64,96);g.fillStyle='#fff';g.font="bold 12px Impact,sans-serif";g.textAlign='center';g.fillText('NOUVEAU',32,20);g.font="bold 20px Impact,sans-serif";g.fillText('PARFUM',32,46);
    g.fillStyle='#ffd84d';g.beginPath();g.ellipse(32,72,10,14,0,0,TAU);g.fill();});
  const p=box(1.0,1.6,0.06,new THREE.MeshBasicMaterial({map:ad}),-1.65,1.2,0.1);p.rotation.y=Math.PI/2;box(1.6,0.06,0.35,fr,0,0.48,-0.4);
  const sign=rtex(64,32,(g)=>{g.fillStyle='#1d3b7a';g.fillRect(0,0,64,32);g.fillStyle='#fff';g.font="bold 14px 'Arial Black',sans-serif";g.textAlign='center';g.fillText('BUS 147',32,21);});box(0.9,0.45,0.05,LM({map:sign}),1.2,2.7,0.5);
  addCol(x-1.75,z-0.75,x+1.75,z+0.75,2.4);CITY.inter.push({x:x+Math.sin(h)*0.15,z:z+Math.cos(h)*0.15,r:1.0,kind:'bench',h:h,sx:x-Math.sin(h)*0.35,sz:z-Math.cos(h)*0.35});CITY.benches.push({x,z,h});}
function kiosk(x,z,side){const k=new THREE.Group();k.position.set(x,0.15,z);scene.add(k);const dk=LM({color:0x22402e});
  const tx=rtex(128,64,(g)=>{g.fillStyle='#22402e';g.fillRect(0,0,128,64);for(let i=0;i<12;i++){g.fillStyle=pick(['#e8e0cc','#c4161c','#f0f0f0','#e8c420','#1d3b7a']);g.fillRect(4+(i%6)*20,8+Math.floor(i/6)*26,17,22);g.fillStyle='#111';g.fillRect(6+(i%6)*20,12+Math.floor(i/6)*26,13,3);}});
  const b=new THREE.Mesh(new THREE.BoxGeometry(2.2,2.2,1.6),[dk,dk,dk,dk,LM({map:tx}),LM({map:tx})]);b.position.y=1.1;k.add(b);
  const r=new THREE.Mesh(new THREE.ConeGeometry(1.7,0.7,8),dk);r.scale.z=0.75;r.position.y=2.55;k.add(r);
  const s=rtex(128,24,(g)=>{g.fillStyle='#22402e';g.fillRect(0,0,128,24);g.fillStyle='#e8d9a0';g.font="bold 14px Georgia,serif";g.textAlign='center';g.fillText('JOURNAUX',64,18);});
  for(const d of[-1,1]){const p=new THREE.Mesh(new THREE.PlaneGeometry(2,0.35),LM({map:s}));p.position.set(0,2.05,d*0.81);if(d<0)p.rotation.y=Math.PI;k.add(p);}addCol(x-1.15,z-0.85,x+1.15,z+0.85,2.5);}
function vendingMachine(x,z,h){if(blockedAt(x,z))return;const t=rtex(64,128,(g)=>{g.fillStyle='#b5121b';g.fillRect(0,0,64,128);g.fillStyle='#111';g.fillRect(6,8,40,84);
    for(let i=0;i<12;i++){g.fillStyle=PCOLS[i%PCOLS.length];g.fillRect(9+(i%4)*9,12+Math.floor(i/4)*26,7,20);}g.fillStyle='#fff';g.font="bold 10px 'Arial Black',sans-serif";g.fillText('FRAIS',8,108);g.fillStyle='#ffd400';g.fillRect(50,30,8,30);g.fillStyle='#222';g.fillRect(8,112,30,10);});
  const m=new THREE.Mesh(new THREE.BoxGeometry(0.9,1.9,0.7),[LM({color:0x8a0e14}),LM({color:0x8a0e14}),LM({color:0x8a0e14}),LM({color:0x8a0e14}),LM({map:t,emissive:0x552222,emissiveMap:t}),LM({color:0x8a0e14})]);
  m.position.set(x,1.1,z);m.rotation.y=h;scene.add(m);addCol(x-0.45,z-0.45,x+0.45,z+0.45,2);
  CITY.inter.push({x:x+Math.sin(h)*0.9,z:z+Math.cos(h)*0.9,r:1.0,kind:'vend',h:h+Math.PI});}
CITY.benches=[];CITY.vend=[];CITY.entrances=[];
V6.build.unshift(()=>{cityTextures();dressBuildings();streetFurniture();const G=CITY.geo,M=CITY.mat;
  const put=(list,mat)=>{if(list.length)scene.add(new THREE.Mesh(mergeGeos(list),mat));};
  put(G.vc.map(g=>{if(!g.attributes.color)colorize(g,'#888');return g;}),VCMAT);put(G.zinc,M.zinc);put(G.iron,M.iron);put(G.awn,M.awn);put(G.post,M.post);put(G.tag,M.tag);put(G.win,M.win);
  M.zinc.map.wrapS=M.zinc.map.wrapT=THREE.RepeatWrapping;M.iron.map.wrapS=THREE.RepeatWrapping;M.awn.map.wrapS=THREE.RepeatWrapping;});
