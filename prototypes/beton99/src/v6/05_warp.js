/* ======================= V6 CURVED CITY: the grid is bent into long, gentle curves at render time ======================= */
/* Logic, AI and collisions stay on the grid. Static geometry, the maps and the camera go through one smooth field made of
   long waves only: streets drift up to ~24 m in wide arcs while local stretch stays under ~10 % on average (the earlier
   swirls stretched space by 2x and were removed). People, cars and props are NOT bent: they are moved rigidly to their
   bent position and turned with the street (see 13_rigid.js), so they never deform. */
const WARPU={value:1};
const WV=[18,0.0055,3,0.012];
const WARP_GLSL='uniform float uWarpK;\nvec2 warpP(vec2 p){return p+vec2('+WV[0].toFixed(1)+'*sin(p.y*'+WV[1]+'+0.7)+'+WV[2].toFixed(1)+'*sin((p.x+p.y)*'+WV[3]+'+2.1),'+WV[0].toFixed(1)+'*sin(p.x*'+(WV[1]*0.92).toFixed(5)+'+1.3)+'+WV[2].toFixed(1)+'*sin((p.x-p.y)*'+(WV[3]*1.1).toFixed(5)+'+0.4));}\n';
const SWC=[];const PLAZAS=[[2,2],[4,4],[4,1],[1,4],[5,3]].map(([a,b])=>[a*64,b*64]);
function wavesJS(x,z){return[WV[0]*Math.sin(z*WV[1]+0.7)+WV[2]*Math.sin((x+z)*WV[3]+2.1),WV[0]*Math.sin(x*WV[1]*0.92+1.3)+WV[2]*Math.sin((x-z)*WV[3]*1.1+0.4)];}
function warpRaw(x,z){const w=wavesJS(x,z);return[x+w[0],z+w[1]];}
function unwarpRaw(x,z){let q=[x,z];for(let i=0;i<8;i++){const w=wavesJS(q[0],q[1]);q=[x-w[0],z-w[1]];}return q;}
function warpXZ(x,z){if(WARPU.value<0.5)return[x,z];return warpRaw(x,z);}
function warpV(v){const w=warpXZ(v.x,v.z);v.x=w[0];v.z=w[1];return v;}
/* how much the street is turned at a point (radians, added to headings) */
function warpRot(x,z){const a=warpRaw(x,z),b=warpRaw(x,z+0.5);return Math.atan2(b[0]-a[0],b[1]-a[1]);}
/* heading as it looks on screen at a point */
function visAng(x,z,a){const w0=warpRaw(x,z),w1=warpRaw(x+Math.sin(a)*0.6,z+Math.cos(a)*0.6);return Math.atan2(w1[0]-w0[0],w1[1]-w0[1]);}
const WARP_LINE='wpos.xz=mix(wpos.xz,warpP(wpos.xz),uWarpK);';
function addWarp(sh,mat){sh.uniforms.uWarpK=WARPU;if(mat&&mat.userData&&mat.userData.rigid)return;
  if(sh.vertexShader.includes('#include <project_vertex>')){sh.vertexShader=WARP_GLSL+sh.vertexShader.replace('#include <project_vertex>',
    'vec4 wpos=vec4(transformed,1.0);\n#ifdef USE_INSTANCING\nwpos=instanceMatrix*wpos;\n#endif\nwpos=modelMatrix*wpos;\n'+WARP_LINE+'\nvec4 mvPosition=viewMatrix*wpos;\ngl_Position=projectionMatrix*mvPosition;');}
  else if(sh.vertexShader.includes('vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );')){sh.vertexShader=WARP_GLSL+sh.vertexShader.replace('vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );',
    'vec4 wc=modelMatrix*vec4(0.0,0.0,0.0,1.0);wc.xz=mix(wc.xz,warpP(wc.xz),uWarpK);vec4 mvPosition=viewMatrix*wc;');}}
THREE.Material.prototype.onBeforeCompile=function(sh){addWarp(sh,this);};
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
