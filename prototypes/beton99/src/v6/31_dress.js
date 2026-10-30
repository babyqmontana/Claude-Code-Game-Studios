/* ======================= V6 CLOTHES SHOP (try on at the mirror, orbit camera) ======================= */
const CLOTH=[
  {cat:'ГОЛОВА',zoom:'head',items:[['БЕЗ ГОЛОВНОГО УБОРА',0,{hat:'none'}],['КЕПКА · ЧЁРНАЯ',15,{hat:'cap',hatCol:'#151515'}],['КЕПКА · БОРДО',15,{hat:'cap',hatCol:'#7a1020'}],['КЕПКА · БЕЛАЯ',18,{hat:'cap',hatCol:'#e8e8e8'}],
    ['БИНИ · ЧЁРНАЯ',12,{hat:'bonnet',hatCol:'#1a1a1a'}],['БИНИ · ОРАНЖ',12,{hat:'bonnet',hatCol:'#e0701a'}],['БИНИ · ХАКИ',12,{hat:'bonnet',hatCol:'#4a5a2a'}],['КАПЮШОН',0,{hat:'hood'}],['МАСКА «ХАМСА»',40,{hat:'mask'}]]},
  {cat:'ВЕРХ',zoom:'body',items:[['ФУТБОЛКА · БЕЛАЯ «ЛОГО»',20,{top:'tee',topCol:'#f2f2f2',print:6}],['ФУТБОЛКА · ЧЁРНАЯ «93»',20,{top:'tee',topCol:'#151515',print:3}],['ФУТБОЛКА · КРАСНАЯ',20,{top:'tee',topCol:'#b5121b',print:1}],
    ['ДВЕ ФУТБОЛКИ (С РУКАВОМ)',28,{top:'teelong',topCol:'#e8e8e8',longCol:'#151515',print:5}],['ХУДИ · СЕРОЕ',45,{top:'hoodie',topCol:'#8a8a90',print:0}],['ХУДИ · ЧЁРНОЕ',45,{top:'hoodie',topCol:'#141414',print:2}],
    ['ХУДИ · НЕБЕСНОЕ',48,{top:'hoodie',topCol:'#5aa0d8',print:0}],['ОЛИМПИЙКА · ЧЁРНАЯ',60,{top:'track',topCol:'#151515',print:0}],['ОЛИМПИЙКА · ЗЕЛЁНАЯ',60,{top:'track',topCol:'#1e6a3a',print:0}],
    ['ЛОНГСЛИВ · ОЛИВА',30,{top:'long',topCol:'#55603a',print:0}],['МАЙКА · БЕЛАЯ',12,{top:'tank',topCol:'#efefef',print:0}]]},
  {cat:'НИЗ',zoom:'legs',items:[['БАГГИ · СИНИЕ',35,{bottom:'baggy',botCol:'#1b2a4a'}],['БАГГИ · ЧЁРНЫЕ',35,{bottom:'baggy',botCol:'#151515'}],['БАГГИ · СВЕТЛЫЕ',38,{bottom:'baggy',botCol:'#6a86b0'}],
    ['ДЖОГГЕРЫ · СЕРЫЕ',30,{bottom:'jog',botCol:'#6a6a70'}],['ДЖОГГЕРЫ · ЧЁРНЫЕ',30,{bottom:'jog',botCol:'#121212'}],['ШОРТЫ · ХАКИ',18,{bottom:'short',botCol:'#6a6040'}],['ДЖИНСОВЫЕ ШОРТЫ',25,{bottom:'jorts',botCol:'#2a4a7a'}]]},
  {cat:'ОБУВЬ',zoom:'feet',items:[['БЕГОВЫЕ · КРАСНЫЕ',40,{shoe:'#c41e1e',shoeType:'runner'}],['БЕГОВЫЕ · БЕЛЫЕ',45,{shoe:'#efefef',shoeType:'runner'}],['БЕГОВЫЕ · ЧЁРНЫЕ',40,{shoe:'#151515',shoeType:'runner'}],
    ['ХАЙ-ТОПЫ · СИНИЕ',70,{shoe:'#1f4fbf',shoeType:'hitop'}],['ХАЙ-ТОПЫ · ЗОЛОТО',90,{shoe:'#c8a038',shoeType:'hitop'}],['СКЕЙТ-КЕДЫ',35,{shoe:'#2a2a2a',shoeType:'skate'}]]},
  {cat:'ЦЕПЬ',zoom:'chest',items:[['БЕЗ ЦЕПИ',0,{chain:0}],['ЗОЛОТАЯ ЦЕПЬ',120,{chain:1}]]}];
const DRESS={cat:0,i:0,app:null,orig:null,ang:0,rep:0,panel:null};
(()=>{const css=document.createElement('style');css.textContent=`
#cloth{position:fixed;left:max(14px,env(safe-area-inset-left));top:50%;transform:translateY(-50%);width:min(340px,46vw);z-index:6;display:none;font:600 13px 'Exo 2',sans-serif;color:#fff;
  background:linear-gradient(180deg,rgba(14,14,22,.88),rgba(14,14,22,.72));border:1px solid rgba(255,255,255,.12);border-radius:10px;box-shadow:0 10px 40px rgba(0,0,0,.5);overflow:hidden}
#cloth.on{display:block}
#cloth .ch{background:#d4302a;padding:10px 12px;font:900 16px 'Exo 2',sans-serif;letter-spacing:.08em}
#cloth .ct{display:flex;align-items:center;justify-content:space-between;padding:8px 10px;background:rgba(255,255,255,.06);font-weight:800;letter-spacing:.12em}
#cloth .ct span{cursor:pointer;padding:2px 10px;font-size:16px;color:#ffd84d}
#cloth .cl{max-height:min(46vh,330px);overflow:auto}
#cloth .ci{display:flex;justify-content:space-between;padding:8px 12px;border-bottom:1px solid rgba(255,255,255,.05);cursor:pointer}
#cloth .ci.sel{background:linear-gradient(90deg,#ffd84d,#ffb020);color:#111}
#cloth .ci.own:after{content:'✓';margin-left:6px;color:#7dff9a}#cloth .ci.sel.own:after{color:#0a6a2a}
#cloth .cf{padding:8px 12px;display:flex;justify-content:space-between;align-items:center;gap:8px;background:rgba(0,0,0,.3)}
#cloth .cb{background:#2a2a36;border:1px solid rgba(255,255,255,.2);border-radius:14px;padding:6px 12px;cursor:pointer;font-weight:800}
#cloth .cb.buy{background:#2f8a3a}
#cloth .cm{color:#7dff9a;font-weight:800}
#cloth .hint{padding:0 12px 8px;color:rgba(255,255,255,.55);font-size:11px;background:rgba(0,0,0,.3)}
@media (max-height:520px){#cloth .cl{max-height:40vh}#cloth{width:min(300px,44vw);font-size:12px}#cloth .ci{padding:6px 10px}}
@media (orientation:portrait){#cloth{left:8px;right:8px;width:auto;top:auto;bottom:calc(8px + env(safe-area-inset-bottom,0px));transform:none}#cloth .cl{max-height:26vh}}
body.dressing #touch,body.dressing #pausebtn{display:none!important}`;document.head.appendChild(css);
  const d=document.createElement('div');d.id='cloth';d.innerHTML='<div class="ch">FRINGUES STREET</div><div class="ct"><span data-c="-1">◀</span><b id="ccat"></b><span data-c="1">▶</span></div><div class="cl" id="clist"></div><div class="cf"><span class="cm" id="cmoney"></span><span class="cb buy" id="cbuy">КУПИТЬ</span><span class="cb" id="cexit">ВЫЙТИ</span></div><div class="hint">'+(isTouch?'Тап — примерить · КУПИТЬ — оплатить':'↑↓ выбрать · ←→ раздел · E купить · ESC выйти')+'</div>';
  document.body.appendChild(d);DRESS.panel=d;
  d.addEventListener('pointerdown',e=>e.stopPropagation());
  d.querySelectorAll('[data-c]').forEach(b=>b.addEventListener('click',()=>{dressCat(+b.dataset.c);}));
  $('#cbuy').addEventListener('click',()=>dressBuy());$('#cexit').addEventListener('click',()=>dressEnd());})();
function itemKey(c,i){return c+':'+i;}
function ownedCloth(c,i){const o=pl.app.own||[];return CLOTH[c].items[i][1]===0||o.includes(itemKey(c,i));}
function rebuildPl(app){const old=pl.ch,par=old.root.parent;if(par)par.remove(old.root);disposeChar(old);pl.ch=makeChar(app);if(par)par.add(pl.ch.root);pl.ch.root.position.set(pl.x,pl.y,pl.z);pl.ch.root.rotation.y=pl.h;}
function dressStart(R){ROOMS.mode='dress';DRESS.orig=Object.assign({},pl.app);DRESS.app=Object.assign({},pl.app);DRESS.cat=1;DRESS.i=0;DRESS.ang=0.35;
  pl.x=R.mirror.x;pl.z=R.mirror.z;pl.h=pl.th=-Math.PI/2;DRESS.panel.classList.add('on');$('#hud').classList.add('dressing');document.body.classList.add('dressing');hud.prompt.textContent='';lastPrompt='';
  say('ПРОДАВЕЦ','Бери что нравится. Всё оригинал, отвечаю.',2.5);dressRender();}
function dressEnd(){if(ROOMS.mode!=='dress')return;DRESS.panel.classList.remove('on');$('#hud').classList.remove('dressing');document.body.classList.remove('dressing');ROOMS.mode='walk';ROOMS.camInit=false;
  rebuildPl(pl.app);sfx.back();}
function dressCat(d){DRESS.cat=(DRESS.cat+d+CLOTH.length)%CLOTH.length;DRESS.i=0;sfx.click();dressRender();}
function dressSel(i){DRESS.i=clamp(i,0,CLOTH[DRESS.cat].items.length-1);const it=CLOTH[DRESS.cat].items[DRESS.i];DRESS.app=Object.assign({},pl.app,it[2]);
  if(it[2].hat==='hood'&&DRESS.app.top!=='hoodie'){DRESS.app.top='hoodie';}rebuildPl(DRESS.app);sfx.blip();dressRender();}
function dressBuy(){const c=DRESS.cat,i=DRESS.i,it=CLOTH[c].items[i];if(!ownedCloth(c,i)){if(pl.money<it[1]){say('ПРОДАВЕЦ','Брат, тут не хватает. Приходи с деньгами.',2.2);sfx.back();return;}
    pl.money-=it[1];pl.app.own=(pl.app.own||[]).concat(itemKey(c,i));pop('−'+it[1]+' €','#ff8a8a');sfx.cash();}
  else sfx.select();
  Object.assign(pl.app,it[2]);if(it[2].hat==='hood'&&pl.app.top!=='hoodie')pl.app.top='hoodie';const own=pl.app.own;pl.app=Object.assign({},pl.app,{own});DRESS.app=Object.assign({},pl.app);rebuildPl(pl.app);
  say('ПРОДАВЕЦ',pick(['Сидит как влитое.','Огонь, брат. На районе все обзавидуются.','Вот это стиль.']),1.8);dressRender();}
function dressRender(){const C=CLOTH[DRESS.cat];$('#ccat').textContent=C.cat;$('#cmoney').textContent='€'+Math.floor(pl.money);const L=$('#clist');L.innerHTML='';
  C.items.forEach((it,i)=>{const e=document.createElement('div');const wearing=Object.keys(it[2]).every(k=>pl.app[k]===it[2][k]);
    e.className='ci'+(i===DRESS.i?' sel':'')+(ownedCloth(DRESS.cat,i)?' own':'');e.innerHTML='<span>'+(wearing?'● ':'')+it[0]+'</span><span>'+(it[1]?it[1]+' €':'—')+'</span>';
    e.addEventListener('click',()=>{if(i===DRESS.i&&isTouch)dressBuy();else dressSel(i);});L.appendChild(e);});
  const sel=L.children[DRESS.i];if(sel)sel.scrollIntoView({block:'nearest'});const own=ownedCloth(DRESS.cat,DRESS.i);$('#cbuy').textContent=own?'НАДЕТЬ':'КУПИТЬ · '+C.items[DRESS.i][1]+' €';}
function dressUpdate(dt,inp){DRESS.rep-=dt;const R=ROOMS.cur;
  if(DRESS.rep<=0){if(inp.mz>0.5){dressSel(DRESS.i-1);DRESS.rep=0.18;}else if(inp.mz<-0.5){dressSel(DRESS.i+1);DRESS.rep=0.18;}else if(inp.mx>0.5){dressCat(1);dressSel(0);DRESS.rep=0.3;}else if(inp.mx<-0.5){dressCat(-1);dressSel(0);DRESS.rep=0.3;}}
  if(inp.action)dressBuy();if(inp.jump)dressEnd();
  DRESS.ang+=dt*0.25;pl.ch.root.position.set(pl.x,0.12,pl.z);pl.ch.root.rotation.y=pl.h;animChar(pl.ch,dt,0,null);
  const z={head:[1.4,1.7,1.62],body:[2.5,1.35,1.2],legs:[2.4,0.85,0.7],feet:[1.8,0.45,0.25],chest:[1.6,1.5,1.4]}[CLOTH[DRESS.cat].zoom].slice();if(innerWidth<innerHeight){z[0]*=1.35;z[2]-=0.35;}
  const a=-Math.PI/2+Math.sin(DRESS.ang)*0.75,c=ROOMS.cam;const px=pl.x+Math.sin(a)*z[0],pz=pl.z+Math.cos(a)*z[0],k=1-Math.exp(-dt*4);
  c.position.x=lerp(c.position.x,clamp(px,-R.W/2+0.2,R.W/2-0.2),k);c.position.y=lerp(c.position.y,z[1],k);c.position.z=lerp(c.position.z,clamp(pz,-R.D/2+0.2,R.D/2-0.2),k);
  ROOMS.lk.x=lerp(ROOMS.lk.x,pl.x,k);ROOMS.lk.y=lerp(ROOMS.lk.y,z[2],k);ROOMS.lk.z=lerp(ROOMS.lk.z,pl.z,k);c.lookAt(ROOMS.lk);
}
/* ESC leaves the fitting room instead of opening the pause menu */
const _openPause=openPause;openPause=function(){if(state==='room'&&ROOMS.mode==='dress'){dressEnd();return;}_openPause();};
V6CSS.textContent+=`#hud.dressing #hud-tl,#hud.dressing #prompt{display:none}`;
