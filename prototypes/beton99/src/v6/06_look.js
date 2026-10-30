/* ======================= V6 LOOK: sharp filtering + world-space detail so neighbours share one material language ======================= */
const MAXANI=Math.min(8,renderer.capabilities.getMaxAnisotropy?renderer.capabilities.getMaxAnisotropy():1);
const SHARPED=new WeakSet();function sharpTex(t){if(!t||!t.isTexture||SHARPED.has(t))return;SHARPED.add(t);if(SET.style==='ps1')return;
  t.generateMipmaps=true;t.minFilter=THREE.LinearMipmapLinearFilter;t.magFilter=THREE.LinearFilter;t.anisotropy=MAXANI;t.needsUpdate=true;}
function sharpen(root){root.traverse(o=>{if(!o.material)return;for(const m of Array.isArray(o.material)?o.material:[o.material])for(const k of['map','emissiveMap'])if(m[k])sharpTex(m[k]);});}
/* fine concrete grain + soft grime, sampled in world space (triplanar by normal) */
const DETAIL=(()=>{const[c,g]=mk(256,256);const id=g.createImageData(256,256),d=id.data;let s=7;const R=()=>{s=(s*16807)%2147483647;return s/2147483647;};
  const v=new Float32Array(256*256);for(let i=0;i<v.length;i++)v[i]=R();
  for(let k=0;k<3;k++){const o=new Float32Array(v.length);for(let y=0;y<256;y++)for(let x=0;x<256;x++){let a=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)a+=v[((y+dy)&255)*256+((x+dx)&255)];o[y*256+x]=a/9;}if(k<2)v.set(o);}
  for(let i=0;i<v.length;i++){const n=R()*0.55+v[i]*0.45,val=Math.round(clamp(128+(n-0.5)*120,0,255));d[i*4]=d[i*4+1]=d[i*4+2]=val;d[i*4+3]=255;}
  g.putImageData(id,0,0);for(let i=0;i<70;i++){g.fillStyle=`rgba(${R()<0.5?0:255},${R()<0.5?0:255},${R()<0.5?0:255},.0)`;}
  for(let i=0;i<260;i++){g.fillStyle=R()<0.5?'rgba(0,0,0,.18)':'rgba(255,255,255,.14)';g.fillRect(R()*256,R()*256,1+R()*2,1);}
  const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.generateMipmaps=true;t.minFilter=THREE.LinearMipmapLinearFilter;t.anisotropy=MAXANI;return{value:t};})();
function detailize(m,scale,amt){if(!m||m.userData.detail)return;m.userData.detail=1;const prev=m.onBeforeCompile;
  m.onBeforeCompile=function(sh,r){prev.call(this,sh,r);sh.uniforms.tDetail=DETAIL;
    sh.vertexShader='varying vec3 vDWP;varying vec3 vDWN;\n'+sh.vertexShader.replace('wpos.xz+=uWarpK*warpF(wpos.xz);','vDWP=wpos.xyz;{vec3 wn=objectNormal;\n#ifdef USE_INSTANCING\nwn=mat3(instanceMatrix)*wn;\n#endif\nvDWN=normalize(mat3(modelMatrix)*wn);}\nwpos.xz+=uWarpK*warpF(wpos.xz);');
    sh.fragmentShader='uniform sampler2D tDetail;varying vec3 vDWP;varying vec3 vDWN;\n'+sh.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\n{vec3 an=abs(vDWN);vec2 du=an.y>max(an.x,an.z)?vDWP.xz:(an.x>an.z?vDWP.zy:vDWP.xy);float dd=texture2D(tDetail,du*'+scale.toFixed(3)+').r*0.7+texture2D(tDetail,du*'+(scale*0.17).toFixed(3)+').r*0.3;diffuseColor.rgb*=1.0+(dd-0.5)*'+amt.toFixed(2)+';}');};
  m.customProgramCacheKey=()=>'det'+scale+'_'+amt;m.needsUpdate=true;}
function detailScene(root,scale,amt,skip){root.traverse(o=>{if(!o.isMesh||o.isSkinnedMesh||!o.material)return;if(skip&&skip(o))return;for(const m of Array.isArray(o.material)?o.material:[o.material])if(m.isMeshLambertMaterial&&!m.transparent)detailize(m,scale,amt);});}
V6.build.push(()=>{sharpen(scene);detailScene(scene,0.9,0.55);});
