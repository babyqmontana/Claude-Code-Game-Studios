/* ======================= V6 EXTRA ANIMATION LAYERS ======================= */
V6.anim=function(ch,dt,spd,o){const t=time+ch.phase*0.3;
  if(ch.talk>0){ch.talk-=dt;const g=Math.sin(t*5.2),g2=Math.sin(t*3.1+1);addP('UpperArmR',-0.45-0.25*g,0.35,-0.2);addP('ForeArmR',0,1.2+0.35*g2,0);addP('Head',0.06*Math.sin(t*7),0.12*g2,0);
    if(g2>0.3){addP('UpperArmL',-0.3,-0.3,0.15);addP('ForeArmL',0,-0.9,0);}addP('Spine2',0,0.06*g,0);}
  if(ch.flinch>0){const f=ch.flinch;addP('Spine1',-0.35*f,0,0);addP('Spine2',-0.25*f,0.2*f,0);addP('Head',-0.4*f,0,0);addP('UpperArmL',0,0,0.4*f);addP('UpperArmR',0,0,-0.4*f);ch.flinch=Math.max(0,f-dt*5);}
  const Q=ch.pose;if(!Q||spd>0.2)return;
  if(Q.startsWith&&Q.startsWith('raw:')){for(const[b,x,y,z]of JSON.parse(Q.slice(4)))addP(b,x,y,z);return;}
  if(Q==='sit'){for(const s of['L','R']){addP('UpperLeg'+s,-1.55,0,s==='L'?0.08:-0.08);addP('LowerLeg'+s,1.5,0,0);addP('Foot'+s,0.1,0,0);}
    addP('UpperArmL',-0.35,0,0.75);addP('UpperArmR',-0.35,0,-0.75);addP('ForeArmL',0,-0.6,0);addP('ForeArmR',0,0.6,0);addP('Spine1',0.15,0,0);ch.bob=-0.45;}
  else if(Q==='drink'){const k=Math.sin(t*0.9)>0.2?1:0.35;addP('UpperArmR',-0.6*k,0.3,-0.2);addP('ForeArmR',0,2.3*k,0);addP('Head',-0.3*(k>0.9?1:0),0,0);}
  else if(Q==='dance'){const b=Math.sin(t*7.5),b2=Math.sin(t*3.75);addP('Hips',0,0.25*b2,0.06*b);addP('Spine2',0.1,-0.3*b2,0);addP('UpperArmL',-0.6-0.4*b,0,0.4);addP('UpperArmR',-0.6+0.4*b,0,-0.4);
    addP('ForeArmL',0,-1.2,0);addP('ForeArmR',0,1.2,0);addP('Head',0.15*Math.abs(b),0,0);addP('UpperLegL',-0.25*Math.max(0,b),0,0);addP('UpperLegR',-0.25*Math.max(0,-b),0,0);addP('LowerLegL',0.45*Math.max(0,b),0,0);addP('LowerLegR',0.45*Math.max(0,-b),0,0);ch.bob=0.04*Math.abs(b);}
  else if(Q==='pullup'){const u=(Math.sin(t*2.2)+1)/2;addP('UpperArmL',-2.9+1.2*u,0,0.2);addP('UpperArmR',-2.9+1.2*u,0,-0.2);addP('ForeArmL',0,-1.6*u,0);addP('ForeArmR',0,1.6*u,0);addP('UpperLegL',-0.3,0,0);addP('UpperLegR',-0.3,0,0);addP('LowerLegL',0.8,0,0);addP('LowerLegR',0.8,0,0);ch.bob=0.55*u;}
  else if(Q==='crossed'){addP('UpperArmL',-0.1,-0.72,0.08);addP('UpperArmR',-0.1,0.72,-0.08);addP('ForeArmL',0,-1.75,0);addP('ForeArmR',0,1.75,0);addP('Head',0.05,0,0);addP('Spine2',-0.05,0,0);}
  else if(Q==='squat'){for(const s of['L','R']){addP('UpperLeg'+s,-1.9,0,s==='L'?0.35:-0.35);addP('LowerLeg'+s,2.4,0,0);addP('Foot'+s,-0.4,0,0);}addP('Spine1',0.45,0,0);addP('UpperArmL',-0.9,0,0.3);addP('UpperArmR',-0.9,0,-0.3);addP('ForeArmL',0,-0.5,0);addP('ForeArmR',0,0.5,0);ch.bob=-0.62;}};
