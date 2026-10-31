/* ======================= V6 VOICE TEST: hear every line with the voice this device will use ======================= */
V6CSS.textContent+=`
#vox{position:fixed;inset:0;z-index:60;display:none;background:rgba(6,6,20,.92);color:#fff;font:600 14px 'Exo 2',sans-serif;padding:max(14px,env(safe-area-inset-top)) 14px max(14px,env(safe-area-inset-bottom));overflow:auto}
#vox.on{display:block}#vox h2{margin:0 0 4px;font:italic 900 26px 'Exo 2',sans-serif}#vox .st{color:#ffd84d;margin-bottom:10px;font-weight:500}
#vox .grp{margin:12px 0 4px;letter-spacing:.2em;font-size:12px;color:#9fd0ff}
#vox .ln{display:flex;gap:10px;align-items:flex-start;padding:8px 10px;border-radius:8px;background:rgba(255,255,255,.05);margin-bottom:6px;cursor:pointer}
#vox .ln:active,#vox .ln.play{background:rgba(255,216,77,.2)}#vox .pb{flex:none;width:30px;height:30px;border-radius:50%;background:#ffd84d;color:#111;display:grid;place-items:center;font-size:13px}
#vox .fr{font-weight:700}#vox .ru{color:rgba(255,255,255,.6);font-weight:500;font-size:12px;margin-top:2px}
#vox .top{position:sticky;top:-14px;background:rgba(6,6,20,.97);padding:6px 0 8px;display:flex;justify-content:space-between;align-items:center;gap:8px;z-index:1}
#vox .x{background:#2a2a36;border:1px solid rgba(255,255,255,.25);border-radius:14px;padding:7px 14px;cursor:pointer;font-weight:800}`;
(()=>{const d=document.createElement('div');d.id='vox';document.body.appendChild(d);d.addEventListener('pointerdown',e=>e.stopPropagation());})();
function openVox(){audioInit();voxVoices();const d=$('#vox');const who=[['МОМО',['Йо, малой! Наконец-то. Я тебя полчаса жду.','Видишь сумку? Её надо отвезти Джамелю, на стоянку у вокзала. Быстро и тихо.','Возьми мою тачку. Одна царапина — и платишь ты.','Они пришли ночью. Забрали гараж. Джамель у них.','Возьми это. И вернись живым, малой.']],
  ['НАДЯ',['Это ты разрулил с «Хищниками»? Неплохо для новенького.','Эти клоуны закрашивают наши куски по всему району. Пора напомнить, чей это город.','Нужен не тег. Нужен кусок, который увидит каждый поезд утром.','Видела твою работу. Весь вокзал теперь говорит нашими буквами.']],
  ['ДЖАМЕЛЬ',['Ты от Момо? Давай сюда, не светись.','Чёрт! «Хищники»! Они за тобой ехали!','Я знал, что ты придёшь. Момо сказал — ты псих.']],
  ['СТЕРВЯТНИК',['Смотрите-ка. Художник приехал.','Здесь твои стены и закончатся. Валите его!']],
  ['PL',['Я был тут, Момо. Что за пожар?','Стена у путей. Ночью. Понял.','Это не мой район. Это наш.']],
  ['',['Сюда не возят туристов. Отсюда Эйфелева башня — просто огни на горизонте.','Меня не было полгода. Больница Сен-Рок. Долгая история.']],
  ['ПРОДАВЕЦ',['Бери что нравится. Всё оригинал, отвечаю.','Огонь, брат. На районе все обзавидуются.']]];
  const label={PL:'ГЕРОЙ','':'РАССКАЗЧИК'};let h='<div class="top"><h2>ОЗВУЧКА</h2><span class="x" id="voxx">ЗАКРЫТЬ</span></div><div class="st" id="voxst"></div>';
  for(const[w,lines]of who){h+='<div class="grp">'+(label[w]??w)+'</div>';for(const ru of lines)h+='<div class="ln" data-w="'+w+'" data-ru="'+ru.replace(/"/g,'&quot;')+'"><span class="pb">▶</span><div><div class="fr">'+FR[ru]+'</div><div class="ru">'+ru+'</div></div></div>';}
  h+='<div class="grp">УЛИЦА</div>';for(const k of['greet','gang','cop','flee'])for(const fr of BARK[k])h+='<div class="ln" data-w="'+(k==='cop'?'СТЕРВЯТНИК':'МОМО')+'" data-fr="'+fr+'"><span class="pb">▶</span><div><div class="fr">'+fr+'</div></div></div>';
  d.innerHTML=h;d.classList.add('on');$('#voxx').onclick=()=>{d.classList.remove('on');try{speechSynthesis.cancel();}catch(e){}};
  const st=()=>{const e=$('#voxst');if(!VOX.ok)e.textContent='Этот браузер не умеет синтез речи — озвучки не будет.';else if(!VOX.fr)e.textContent='Французский голос на устройстве не найден (бывает до первого нажатия — нажми ▶). Если тишина: добавь голос «Français» в настройках речи телефона.';
    else e.textContent='Голос устройства: '+VOX.fr.map(v=>v.name).slice(0,3).join(', ')+(SET.sfx<=0?' · ЗВУКИ выключены в настройках!':'');};st();setTimeout(()=>{voxVoices();st();},600);
  d.querySelectorAll('.ln').forEach(el=>el.onclick=()=>{voxVoices();st();d.querySelectorAll('.ln').forEach(x=>x.classList.remove('play'));el.classList.add('play');const fr=el.dataset.fr||FR[el.dataset.ru];VOX.last=-99;speak(fr,el.dataset.w==='PL'?'PL':el.dataset.w,1);});}
ACT.voxtest=openVox;
