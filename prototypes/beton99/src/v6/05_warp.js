/* ======================= V6 SMOOTH WORLD: the grid is bent into flowing streets at render time ======================= */
/* game logic, AI and collisions stay on the grid; every vertex (and the camera) goes through the same smooth field */
const WARPU={value:1};
const WARP_GLSL='uniform float uWarpK;\nvec2 warpF(vec2 p){return vec2(13.0*sin(p.y*0.021+0.7)+6.0*sin((p.x+p.y)*0.013+2.1),13.0*sin(p.x*0.019+1.3)+6.0*sin((p.x-p.y)*0.015+0.4));}\n';
function warpXZ(x,z){return[x+WARPU.value*(13*Math.sin(z*0.021+0.7)+6*Math.sin((x+z)*0.013+2.1)),z+WARPU.value*(13*Math.sin(x*0.019+1.3)+6*Math.sin((x-z)*0.015+0.4))];}
function warpV(v){const w=warpXZ(v.x,v.z);v.x=w[0];v.z=w[1];return v;}
function addWarp(sh){sh.uniforms.uWarpK=WARPU;
  if(sh.vertexShader.includes('#include <project_vertex>')){sh.vertexShader=WARP_GLSL+sh.vertexShader.replace('#include <project_vertex>',
    'vec4 wpos=vec4(transformed,1.0);\n#ifdef USE_INSTANCING\nwpos=instanceMatrix*wpos;\n#endif\nwpos=modelMatrix*wpos;\nwpos.xz+=uWarpK*warpF(wpos.xz);\nvec4 mvPosition=viewMatrix*wpos;\ngl_Position=projectionMatrix*mvPosition;');}
  else if(sh.vertexShader.includes('vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );')){sh.vertexShader=WARP_GLSL+sh.vertexShader.replace('vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );',
    'vec4 wc=modelMatrix*vec4(0.0,0.0,0.0,1.0);wc.xz+=uWarpK*warpF(wc.xz);vec4 mvPosition=viewMatrix*wc;');}}
THREE.Material.prototype.onBeforeCompile=function(sh){addWarp(sh);};
