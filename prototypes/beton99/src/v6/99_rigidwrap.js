/* ======================= V6: outermost wrappers so everything a mover carries is rigid ======================= */
{const f=makeChar;makeChar=function(a,m,n){const ch=f(a,m,n);if(!m)rigidify(ch.root);return ch;};}
{const f=setWeapon;setWeapon=function(ch,id){f(ch,id);if(ch.wmesh)rigidify(ch.wmesh);};}
{const f=makeCar;makeCar=function(...a){const c=f(...a);rigidify(c.root);return c;};}
{const f=spawnPed;spawnPed=function(...a){const p=f(...a);rigidify(p.ch.root);return p;};}
{const f=addPickup;addPickup=function(...a){const r=f(...a);const k=pickups[pickups.length-1];if(k)rigidify(k.m);return r;};}
