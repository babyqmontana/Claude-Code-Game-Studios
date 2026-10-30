/* ======================= V6 ROUND CITY: the grid is bent into arcs, rings and ovals at render time ======================= */
/* Logic, AI and collisions stay on the grid. Every vertex, the camera and both maps go through the same field:
   five swirls around crossroads (a swirl rotates points by an angle that fades with distance, so it can never fold
   the city onto itself) followed by long gentle waves. Streets near a swirl centre curve into arcs around a round
   plaza; blocks between swirls become wedges and ovals. */
const WARPU={value:1};
const SWIRLS=[[2,2,1.05,82],[4,1,-0.9,74],[1,4,-0.95,78],[4,4,0.95,80],[6,3,-0.7,70],[0,1,0.6,60]];
const WARP_GLSL='uniform float uWarpK;\nvec2 tw(vec2 p,vec2 c,float A,float R){vec2 d=p-c;float a=A*exp(-dot(d,d)/(R*R));float s=sin(a),co=cos(a);return c+vec2(d.x*co-d.y*s,d.x*s+d.y*co);}\n'+
  'vec2 warpP(vec2 p){'+SWIRLS.map(([a,b,A,R])=>'p=tw(p,vec2('+(a*64).toFixed(1)+','+(b*64).toFixed(1)+'),'+A.toFixed(3)+','+R.toFixed(1)+');').join('')+
  'return p+vec2(8.0*sin(p.y*0.021+0.7)+4.0*sin((p.x+p.y)*0.013+2.1),8.0*sin(p.x*0.019+1.3)+4.0*sin((p.x-p.y)*0.015+0.4));}\n';
function twJS(x,z,c,A,R,inv){const dx=x-c[0],dz=z-c[1],a=(inv?-1:1)*A*Math.exp(-(dx*dx+dz*dz)/(R*R)),s=Math.sin(a),co=Math.cos(a);return[c[0]+dx*co-dz*s,c[1]+dx*s+dz*co];}
const SWC=SWIRLS.map(([a,b,A,R])=>[[a*P,b*P],A,R]);
function wavesJS(x,z){return[8*Math.sin(z*0.021+0.7)+4*Math.sin((x+z)*0.013+2.1),8*Math.sin(x*0.019+1.3)+4*Math.sin((x-z)*0.015+0.4)];}
function warpRaw(x,z){let p=[x,z];for(const[c,A,R]of SWC)p=twJS(p[0],p[1],c,A,R,false);const w=wavesJS(p[0],p[1]);return[p[0]+w[0],p[1]+w[1]];}
/* inverse: undo the waves by fixed-point iteration, then unwind the swirls exactly in reverse order */
function unwarpRaw(x,z){let q=[x,z];for(let i=0;i<6;i++){const w=wavesJS(q[0],q[1]);q=[x-w[0],z-w[1]];}for(let i=SWC.length-1;i>=0;i--){const[c,A,R]=SWC[i];q=twJS(q[0],q[1],c,A,R,true);}return q;}
function warpXZ(x,z){if(WARPU.value<0.5)return[x,z];return warpRaw(x,z);}
function warpV(v){const w=warpXZ(v.x,v.z);v.x=w[0];v.z=w[1];return v;}
/* heading as it looks on screen at a point */
function visAng(x,z,a){const w0=warpRaw(x,z),w1=warpRaw(x+Math.sin(a)*0.6,z+Math.cos(a)*0.6);return Math.atan2(w1[0]-w0[0],w1[1]-w0[1]);}
const WARP_LINE='wpos.xz=mix(wpos.xz,warpP(wpos.xz),uWarpK);';
function addWarp(sh){sh.uniforms.uWarpK=WARPU;
  if(sh.vertexShader.includes('#include <project_vertex>')){sh.vertexShader=WARP_GLSL+sh.vertexShader.replace('#include <project_vertex>',
    'vec4 wpos=vec4(transformed,1.0);\n#ifdef USE_INSTANCING\nwpos=instanceMatrix*wpos;\n#endif\nwpos=modelMatrix*wpos;\n'+WARP_LINE+'\nvec4 mvPosition=viewMatrix*wpos;\ngl_Position=projectionMatrix*mvPosition;');}
  else if(sh.vertexShader.includes('vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );')){sh.vertexShader=WARP_GLSL+sh.vertexShader.replace('vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );',
    'vec4 wc=modelMatrix*vec4(0.0,0.0,0.0,1.0);wc.xz=mix(wc.xz,warpP(wc.xz),uWarpK);vec4 mvPosition=viewMatrix*wc;');}}
THREE.Material.prototype.onBeforeCompile=function(sh){addWarp(sh);};
/* the city must be finely tessellated to bend smoothly: subdivide long flat geometry before it reaches the GPU */
function tessellate(geo,maxLen){if(!geo.isBufferGeometry)return geo;let g=geo.index?geo.toNonIndexed():geo;
  for(let pass=0;pass<6;pass++){const P_=g.attributes.position,n=P_.count;let need=false;for(let i=0;i<n;i+=3){for(let e=0;e<3;e++){const a=i+e,b=i+(e+1)%3;if(Math.hypot(P_.getX(a)-P_.getX(b),P_.getZ(a)-P_.getZ(b))>maxLen){need=true;break;}}if(need)break;}
    if(!need)break;const attrs=Object.keys(g.attributes),out={};attrs.forEach(k=>out[k]=[]);
    for(let i=0;i<n;i+=3){let le=-1,lm=maxLen;for(let e=0;e<3;e++){const a=i+e,b=i+(e+1)%3,d=Math.hypot(P_.getX(a)-P_.getX(b),P_.getZ(a)-P_.getZ(b));if(d>lm){lm=d;le=e;}}
      const push=(ids,mid)=>{for(const k of attrs){const A=g.attributes[k],s=A.itemSize;for(const id of ids){if(id==='m'){for(let c=0;c<s;c++)out[k].push(mid[k][c]);}else for(let c=0;c<s;c++)out[k].push(A.array[id*s+c]);}}};
      if(le<0){push([i,i+1,i+2]);continue;}const a=i+le,b=i+(le+1)%3,c=i+(le+2)%3,mid={};for(const k of attrs){const A=g.attributes[k],s=A.itemSize;mid[k]=[];for(let q=0;q<s;q++)mid[k].push((A.array[a*s+q]+A.array[b*s+q])/2);}
      push([a,'m',c],mid);push(['m',b,c],mid);}
    const ng=new THREE.BufferGeometry();for(const k of attrs){const A=g.attributes[k];ng.setAttribute(k,new THREE.Float32BufferAttribute(out[k],A.itemSize));}g=ng;}
  g.computeBoundingSphere();return g;}
/* maps follow the bent city */
function warpMapImage(src){const S=512,MWv=MW,k=S/MWv,[c,g]=mk(S,S),sd=src.getContext('2d').getImageData(0,0,S,S).data,od=g.createImageData(S,S),o=od.data;
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){const wx=x/k-MARG,wz=y/k-MARG,L=unwarpRaw(wx,wz),sx=Math.round((L[0]+MARG)*k),sy=Math.round((L[1]+MARG)*k),i=(y*S+x)*4;
    if(sx<0||sy<0||sx>=S||sy>=S){o[i]=20;o[i+1]=17;o[i+2]=42;o[i+3]=255;continue;}const j=(sy*S+sx)*4;o[i]=sd[j];o[i+1]=sd[j+1];o[i+2]=sd[j+2];o[i+3]=255;}
  g.putImageData(od,0,0);return c;}
{const bm=buildMapImage;buildMapImage=function(){bm();mapImg=warpMapImage(mapImg);};}
