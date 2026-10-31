/* ======================= V6 ROUND PLAZAS + smooth bending of big geometry ======================= */
V6.build.push(()=>{
  // circular plazas on the swirl centres: cobbled island, white ring, give-way arrows painted on the asphalt
  const pav=LM({map:imgTex(ASSETS.img.pavers,3,3),color:0xc8c0b8,polygonOffset:true,polygonOffsetFactor:-2}),white=new THREE.MeshBasicMaterial({color:0xdedad2,polygonOffset:true,polygonOffsetFactor:-3});
  for(const[cx,cz]of PLAZAS){if(cx<=0||cz<=0||cx>=SIZE||cz>=SIZE)continue;
    const isl=new THREE.Mesh(new THREE.CircleGeometry(3.4,40).rotateX(-Math.PI/2),pav);isl.position.set(cx,0.03,cz);scene.add(isl);
    const kerb=new THREE.Mesh(new THREE.RingGeometry(3.4,3.65,40).rotateX(-Math.PI/2),LM({color:0xb0aca4}));kerb.position.set(cx,0.035,cz);scene.add(kerb);
    for(let k=0;k<28;k++){const a=k/28*TAU;const d=new THREE.Mesh(new THREE.PlaneGeometry(0.18,0.9).rotateX(-Math.PI/2).rotateY(-a),white);d.position.set(cx+Math.sin(a)*5.6,0.02,cz+Math.cos(a)*5.6);scene.add(d);}
    const bed=new THREE.Mesh(new THREE.CylinderGeometry(1.6,1.8,0.25,24),LM({color:0x3a5a2c}));bed.position.set(cx,0.13,cz);scene.add(bed);
    for(let k=0;k<9;k++){const a=k/9*TAU,f=new THREE.Mesh(new THREE.IcosahedronGeometry(0.28,0),LM({color:pick([0xc4161c,0xf2c418,0xe8e8e8,0x7a2fb5])}));f.position.set(cx+Math.sin(a)*1.1,0.35,cz+Math.cos(a)*1.1);scene.add(f);}}
  // bend smoothly: cut long flat triangles (roads, pavements, walls) into ~3 m pieces
  const list=[];scene.traverse(o=>{if(!o.isMesh||o.isInstancedMesh||o.isSkinnedMesh||!o.geometry||!o.geometry.attributes||!o.geometry.attributes.position)return;
    const g=o.geometry;if(!g.boundingSphere)g.computeBoundingSphere();const r=g.boundingSphere.radius*Math.max(o.scale.x,o.scale.z);if(r<5||r>700)return;list.push(o);});
  const done=new Map();for(const o of list){let ng=done.get(o.geometry);if(!ng){ng=tessellate(o.geometry,3.2);done.set(o.geometry,ng);}o.geometry=ng;}});
