/* ======================= V6 ALIVE: blinking, idle fidgets, gentle health regen, French street voices ======================= */
/* --- blinking: each character gets a skin-coloured eyelid texture swapped in for a few frames --- */
{const mk1=makeChar;makeChar=function(app,m,n){const ch=mk1(app,m,n);if(!ch.ps2||m)return ch;const a=Object.assign({},DEFAULT_APP,app);
  const[c,g]=mk(2,2);const col=new THREE.Color(a.skin).multiplyScalar(0.82);g.fillStyle=col.getStyle();g.fillRect(0,0,2,2);ch.lid=new THREE.CanvasTexture(c);ch.eyes=[];
  ch.inner.traverse(o=>{if(o.userData&&o.userData.eye)ch.eyes.push(o.material);});ch.blinkT=rr(1,4);return ch;};}
function blink(ch,dt){if(!ch.eyes||!ch.eyes.length)return;ch.blinkT-=dt;
  if(ch.blinkT<=0&&!ch.blinking){ch.blinking=0.11;ch.eyeMap=ch.eyeMap||ch.eyes[0].map;for(const m of ch.eyes)m.map=ch.lid;}
  if(ch.blinking){ch.blinking-=dt;if(ch.blinking<=0){ch.blinking=0;for(const m of ch.eyes)m.map=ch.eyeMap;ch.blinkT=Math.random()<0.15?0.18:rr(2,5.5);}}
  if(ch.dead&&ch.eyes[0].map!==ch.lid){for(const m of ch.eyes)m.map=ch.lid;ch.blinkT=1e9;}}
/* --- idle life: weight shifts, breathing, small fidgets; walking gets more swagger --- */
const _va3=V6.anim;V6.anim=function(ch,dt,spd,o){_va3(ch,dt,spd,o);blink(ch,dt);if(o&&(o.bike||o.skate))return;
  const t=time+ch.phase*1.7;
  if(spd<0.2&&!ch.pose&&ch.aim<0.1&&!ch.dead&&!ch.gest){const w=Math.sin(t*0.55);
    addP('Hips',0,0.05*w,0.035*w);addP('Spine1',0.02*Math.sin(t*1.9),0,-0.03*w);addP('UpperLegL',-0.04*Math.max(0,w),0,0);addP('LowerLegL',0.12*Math.max(0,w),0,0);addP('UpperLegR',-0.04*Math.max(0,-w),0,0);addP('LowerLegR',0.12*Math.max(0,-w),0,0);
    addP('UpperArmL',0,0,0.03*Math.sin(t*1.9));addP('UpperArmR',0,0,-0.03*Math.sin(t*1.9));
    ch.fidT=(ch.fidT??rr(3,9))-dt;if(ch.fidT<=0){ch.fidT=rr(5,12);ch.gest={k:pick(['scratch','look','shrugl','tug','neck']),t:0,d:rr(1.2,2)};}}
  if(spd>0.6&&!o?.two&&ch.aim<0.1){const s=Math.sin(ch.phase);addP('Spine2',0,0.06*s,0.03*Math.cos(ch.phase));addP('Head',0.03*Math.abs(s),-0.05*s,0);}
  const G=ch.gest;if(G){const k=Math.sin(Math.min(1,G.t/G.d)*Math.PI);
    if(G.k==='scratch'){addP('UpperArmR',-0.6*k,0.4*k,-1.1*k);addP('ForeArmR',0,2.0*k,0);addP('Head',0.12*k,0,0.1*k);}
    else if(G.k==='shrugl'){addP('UpperArmL',0,0,0.18*k);addP('UpperArmR',0,0,-0.18*k);addP('Head',0,0,0.12*k);}
    else if(G.k==='tug'){addP('UpperArmL',-0.35*k,0,0.25*k);addP('ForeArmL',0,-1.3*k,0);addP('UpperArmR',-0.35*k,0,-0.25*k);addP('ForeArmR',0,1.3*k,0);}
    else if(G.k==='neck'){addP('Head',0,0.25*Math.sin(G.t*6)*k,0.2*k);addP('Neck',0,0,0.15*k);}}};
/* --- the player slowly heals back to 50 when out of trouble --- */
V6.upd.push(dt=>{if(!pl.dead&&pl.hp<50&&time-(pl.lastHurt||-99)>6&&wanted<2)pl.hp=Math.min(50,pl.hp+dt*2.5);});
/* --- French voices through the browser's speech synthesis (Russian subtitles stay on screen) --- */
const VOX={fr:null,ok:'speechSynthesis' in window,last:0};
function voxVoices(){if(!VOX.ok)return;const v=speechSynthesis.getVoices().filter(x=>/^fr/i.test(x.lang));VOX.fr=v.length?v:null;}
if(VOX.ok){voxVoices();speechSynthesis.onvoiceschanged=voxVoices;}
const VOICE={'МОМО':[0.8,1.06,0],'ДЖАМЕЛЬ':[0.9,1.0,1],'НАДЯ':[1.25,1.05,2],'СТЕРВЯТНИК':[0.55,0.9,3],'ПРОДАВЕЦ':[1.0,1.1,1],'':[0.85,0.95,0]};
function speak(fr,who,vol){if(!VOX.ok||!VOX.fr||!fr||SET.sfx<=0)return;try{const u=new SpeechSynthesisUtterance(fr);const p=VOICE[who]||[0.95,1.05,0];
    const pool=VOX.fr,fem=who==='НАДЯ',pickV=pool.find(v=>fem?/female|femme|amelie|aurelie|audrey|marie|julie|celine|hortense|virginie/i.test(v.name):/male|homme|thomas|daniel|nicolas|paul|henri|claude|antoine/i.test(v.name));
    u.voice=pickV||pool[p[2]%pool.length];u.lang=u.voice.lang;u.pitch=p[0];u.rate=p[1];u.volume=clamp((vol??1)*SET.sfx/10,0,1);speechSynthesis.cancel();speechSynthesis.speak(u);VOX.last=time;}catch(e){}}
const FR={
 'Йо, малой! Наконец-то. Я тебя полчаса жду.':"Yo, p'tit! Enfin. Ça fait une demi-heure que j't'attends.",
 'Видишь сумку? Её надо отвезти Джамелю, на стоянку у вокзала. Быстро и тихо.':"Tu vois le sac? Tu l'amènes à Djamel, au parking de la gare. Vite fait, discret.",
 'Возьми мою тачку. Одна царапина — и платишь ты.':"Prends ma caisse. Une rayure, et c'est toi qui paies.",
 'И не гони, слышишь? Хвоста нам не надо.':"Et roule tranquille, hein? On veut pas d'embrouilles.",
 'Ты от Момо? Давай сюда, не светись.':"C'est Momo qui t'envoie? Donne, et fais pas l'malin.",
 'Так... всё на месте. Момо не обманывает.':"Bon... tout est là. Momo, il est réglo.",
 'Чёрт! «Хищники»! Они за тобой ехали!':"Putain! Les Rapaces! Ils t'ont suivi!",
 'Держи ствол. Разберись с ними — мы прикроем сумку.':"Tiens. Occupe-toi d'eux, on garde le sac.",
 'Красиво сработал. Момо в тебе не ошибся.':"Propre. Momo s'est pas trompé sur toi.",
 'Вот твоя доля. Заходи в гараж — для тебя всегда найдётся работа.':"Voilà ta part. Passe au garage, y'a toujours du taf pour toi.",
 'Это ты разрулил с «Хищниками»? Неплохо для новенького.':"C'est toi qui as géré les Rapaces? Pas mal, pour un nouveau.",
 'Эти клоуны закрашивают наши куски по всему району. Пора напомнить, чей это город.':"Ces clowns repassent nos pièces partout. Faut leur rappeler à qui est la ville.",
 'Три стены у вокзала. Держи баллоны. Копы взбесятся — не попадайся.':"Trois murs vers la gare. Prends les bombes. Les keufs vont rager, fais gaffe.",
 'Как закончишь — жду у фонтана в парке.':"Quand t'as fini, je t'attends à la fontaine du parc.",
 'Видела твою работу. Весь вокзал теперь говорит нашими буквами.':"J'ai vu ton travail. Toute la gare parle avec nos lettres maintenant.",
 'Дальше? Держи мою доску. Говорят, ты катаешь не хуже, чем рисуешь.':"La suite? Prends ma planche. Il paraît que tu rides aussi bien que tu peins.",
 'Скейтпарк на старой стоянке — метка S на карте. Покажи им, кто хозяин района.':"Le skatepark, sur le vieux parking. Montre-leur qui tient le quartier.",
 'Эй! Смотрите, кто вернулся! Живой!':"Eh! Regardez qui revient! Vivant!",
 'Видел вокзал? «Хищники» закрасили всё. Даже наш кусок у путей.':"T'as vu la gare? Les Rapaces ont tout repassé. Même notre pièce près des voies.",
 'Нужен не тег. Нужен кусок, который увидит каждый поезд утром.':"Pas un tag. Une pièce que chaque train verra demain matin.",
 'Нарисуй сам. Как чувствуешь. Только быстро — там патрули.':"Peins-la toi-même. Comme tu le sens. Mais vite, y'a des patrouilles.",
 'Утренний поезд ехал медленно. Весь вагон смотрел на твою стену.':"Le train du matin roulait doucement. Tout le wagon regardait ton mur.",
 'Но «Хищники» это тоже видели. Будь осторожен. Они пойдут на Момо.':"Mais les Rapaces l'ont vu aussi. Fais attention. Ils vont s'en prendre à Momo.",
 'Они пришли ночью. Забрали гараж. Джамель у них.':"Ils sont venus cette nuit. Ils ont pris le garage. Ils ont Djamel.",
 'Старая стоянка на севере. Их главный — Стервятник. Без него они никто.':"Le vieux parking au nord. Leur chef, c'est le Vautour. Sans lui, ils sont rien.",
 'Возьми это. И вернись живым, малой.':"Prends ça. Et reviens vivant, p'tit.",
 'Смотрите-ка. Художник приехал.':"Tiens, tiens. L'artiste est arrivé.",
 'Здесь твои стены и закончатся. Валите его!':"C'est ici que tes murs s'arrêtent. Allez, butez-le!",
 'Я знал, что ты придёшь. Момо сказал — ты псих.':"J'savais que tu viendrais. Momo m'a dit que t'étais un ouf.",
 'Стервятника больше нет. Район снова наш. Твои стены — тоже.':"Le Vautour, c'est fini. Le quartier est à nous. Tes murs aussi.",
 'Я был тут, Момо. Что за пожар?':"J'étais là, Momo. C'est quoi l'urgence?",'Понял. Без проблем.':"Compris. Pas de souci.",'Слухи быстро ходят.':"Les nouvelles vont vite.",
 'И что дальше?':"Et maintenant?",'Ещё увидимся.':"On se revoit.",'Стена у путей. Ночью. Понял.':"Le mur des voies. Cette nuit. Compris.",'Пусть идут.':"Qu'ils viennent.",
 'Где они?':"Ils sont où?",'Это не мой район. Это наш.':"C'est pas mon quartier. C'est le nôtre.",
 'Сюда не возят туристов. Отсюда Эйфелева башня — просто огни на горизонте.':"Ici, pas de touristes. D'ici, la tour Eiffel, c'est juste des lumières à l'horizon.",
 'Бетон, стены в цвет, крыши из цинка. Каждая стена здесь кому-то принадлежит.':"Du béton, des murs en couleurs, des toits en zinc. Ici, chaque mur appartient à quelqu'un.",
 'Меня не было полгода. Больница Сен-Рок. Долгая история.':"Six mois d'absence. L'hôpital Saint-Roch. Longue histoire.",
 'Но район не ждёт. Момо уже ищет меня — у него всегда есть работа.':"Mais le quartier n'attend pas. Momo me cherche déjà. Lui, il a toujours du boulot.",
 'Йо! Новая поставка кроссов, глянь.':"Yo! Nouvel arrivage de baskets, regarde.",'Бери что нравится. Всё оригинал, отвечаю.':"Prends c'que tu veux. Que de l'original, j'te jure.",
 'Сидит как влитое.':"Ça te va nickel.",'Огонь, брат. На районе все обзавидуются.':"Le feu, frère. Tout le quartier va être jaloux.",'Вот это стиль.':"Ça, c'est du style."};
{const sy=say;say=function(who,line,dur){sy(who,line,dur);const isPl=who===pl.name,fr=FR[line];if(fr)speak(fr,isPl?'PL':who.trim()===''&&$('#sub').classList.contains('vo')?'':who);};}
/* street barks: greetings near crews, threats when a fight starts, cops shouting */
const BARK={greet:["Wesh!","Ça dit quoi?","Bien ou bien?","Salam, frère.","Vas-y, tranquille."],gang:["Tu cherches quoi, toi?","Viens là!","C'est notre quartier!","Tu vas voir!"],
  cop:["Police! Plus un geste!","Arrêtez-vous!","Les mains en l'air!"],flee:["Au secours!","T'es malade!","Arrête!"],hit:["Aïe!","Ouais, vas-y!","Laisse-moi!"]};
V6.upd.push(()=>{if(CINE.on||time-VOX.last<3.5)return;for(const p of peds){if(p.state==='dead')continue;const d=Math.hypot(p.x-pl.x,p.z-pl.z);if(d>16)continue;
  let k=null;if(p.state==='attack'&&!p.bk){p.bk=1;k=p.type==='cop'?'cop':'gang';}else if(p.state==='flee'&&!p.bk){p.bk=1;k='flee';}
  else if(p.hang&&p.state==='idle'&&d<4&&!p.bkg&&!pl.inCar){p.bkg=1;k='greet';p.ch.gest={k:'wave',t:0,d:1.4};}
  if(k){speak(pick(BARK[k]),p.type==='cop'?'СТЕРВЯТНИК':'МОМО',clamp(1-d/18,0.25,1));break;}}});
V6.hurt.push((p,dmg,fromPlayer)=>{if(fromPlayer&&time-VOX.last>2.5&&p.state!=='dead'&&Math.random()<0.5)speak(pick(BARK.hit),'МОМО',0.8);});
/* iOS only lets speech start after a user gesture: prime it on the first tap */
addEventListener('pointerdown',function prime(){if(VOX.ok){try{const u=new SpeechSynthesisUtterance(' ');u.volume=0;speechSynthesis.speak(u);}catch(e){}voxVoices();}removeEventListener('pointerdown',prime);},{once:true});
