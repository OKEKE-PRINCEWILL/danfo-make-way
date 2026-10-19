import * as THREE from './vendor/three.module.js';
export {THREE};
const materials=new Map();
function material(color,metalness=0){const key=color+':'+metalness;if(!materials.has(key))materials.set(key,new THREE.MeshStandardMaterial({color,roughness:metalness?.32:.7,metalness}));return materials.get(key);}
export function box(parent,w,h,d,x,y,z,color,r=0){
 let geo;
 if(r){const shape=new THREE.Shape(),a=w/2,b=d/2;r=Math.min(r,a,b);shape.moveTo(-a+r,-b);shape.lineTo(a-r,-b);shape.quadraticCurveTo(a,-b,a,-b+r);shape.lineTo(a,b-r);shape.quadraticCurveTo(a,b,a-r,b);shape.lineTo(-a+r,b);shape.quadraticCurveTo(-a,b,-a,b-r);shape.lineTo(-a,-b+r);shape.quadraticCurveTo(-a,-b,-a+r,-b);geo=new THREE.ExtrudeGeometry(shape,{depth:h,bevelEnabled:false,steps:1,curveSegments:4});geo.rotateX(-Math.PI/2);geo.translate(0,-h/2,0);}else geo=new THREE.BoxGeometry(w,h,d);
 const mesh=new THREE.Mesh(geo,material(color));mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
}
function cylinder(parent,r,h,x,y,z,color){const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,12),material(color));m.position.set(x,y,z);m.castShadow=true;parent.add(m);return m;}
function sphere(parent,r,x,y,z,color){const m=new THREE.Mesh(new THREE.SphereGeometry(r,14,10),material(color));m.position.set(x,y,z);m.castShadow=true;parent.add(m);return m;}
export function makeVehicle(car,index,color,style={}){
 const g=new THREE.Group(),bus=index===0,long=car.n===3,L=car.n-.2,glass='#234b58',dark='#24352f';
 g.userData.index=index;g.userData.car=car;
 // Keep lane occupancy unchanged while giving the modeled body more clearance.
 g.scale.set(.94,.8,.74);
 box(g,L,.16,.77,0,.22,0,dark,.1);
 const body=box(g,L,.32,.74,0,.42,0,bus?'#f1b92b':color,bus?.06:.15);g.userData.paint=body;
 if(bus){
  box(g,L-.06,.62,.73,-.015,.79,0,'#f1bd31',.055);
  box(g,L-.1,.065,.75,-.02,.69,0,'#232f24');
  box(g,L-.1,.035,.75,-.02,.59,0,'#232f24');
  box(g,L-.15,.065,.76,-.04,1.135,0,'#ffcf55',.04);
  // Passenger windows on both sides, separated by yellow pillars.
  for(const side of [-1,1])for(let k=0;k<4;k++)box(g,.28,.25,.014,-L/2+.24+k*.36,.94,side*.373,glass,.018);
  box(g,.025,.28,.59,L/2-.01,.96,0,glass);
  box(g,.028,.29,.024,L/2+.006,.96,0,'#ddb040');
  for(let k=0;k<4;k++)box(g,.025,.015,.57,-.55+k*.32,1.175,0,'#e6aa28');
  box(g,.03,.16,.36,L/2+.015,.54,0,dark);
  box(g,.045,.045,.45,L/2+.04,.53,0,'#7d8874');
 }else{
  const cabin=box(g,long?L*.65:L*.55,.35,.64,-.1,.74,0,color,.12);
  box(g,.055,.24,.53,(long?L*.65:L*.55)/2-.08,.75,0,glass);
  box(g,.04,.23,.51,-(long?L*.65:L*.55)/2-.09,.74,0,glass);
  for(const side of [-1,1]){box(g,long?L*.52:L*.42,.22,.014,-.1,.76,side*.324,glass,.025);box(g,.035,.24,.018,-.08,.76,side*.337,color);}
  box(g,L*.25,.045,.5,L*.32,.59,0,color,.04);
  box(g,.03,.07,.39,L/2+.01,.37,0,dark);
  if(long)for(let k=0;k<3;k++)box(g,.02,.013,.42,-.5+k*.3,.926,0,'#ffffff');
 }
 for(const side of [-1,1]){
  for(const axle of [-1,1]){const x=axle*(L/2-.3),wheel=cylinder(g,.18,.12,x,.22,side*.39,'#18251f');wheel.rotation.x=Math.PI/2;const hub=cylinder(g,.085,.125,x,.22,side*.395,'#879288');hub.rotation.x=Math.PI/2;}
  box(g,.13,.07,.1,L*.25,bus?.92:.72,side*.42,dark,.025);
  box(g,.04,bus?.1:.075,.13,L/2+.025,bus?.73:.48,side*.23,'#fff0b4',.018);
  box(g,.03,.08,.13,-L/2-.015,.45,side*.24,'#e45f47',.012);
 }
 box(g,.055,.065,.67,L/2+.045,.29,0,'#728174');box(g,.045,.06,.66,-L/2-.03,.29,0,'#728174');
 if(bus){
  const driver=new THREE.Group();driver.position.set(L/2-.28,.77,.27);g.add(driver);
  box(driver,.18,.2,.18,0,0,0,style.primaryColor||'#2d7055',.035);
  sphere(driver,.105,0,.22,0,style.skinColor||'#945e3c');
  if(style.hair!=='bald')sphere(driver,.108,-.01,.27,-.015,style.hairColor||'#24271f');
  if(style.hat&&style.hat!=='none')cylinder(driver,.12,.08,0,.34,0,style.primaryColor||'#d2a52e');
  const face=new THREE.Mesh(new THREE.PlaneGeometry(.205,.205),new THREE.MeshBasicMaterial({transparent:true,side:THREE.DoubleSide,color:'#ffffff'}));face.position.set(0,.22,.107);driver.add(face);
  g.userData.driver=driver;g.userData.face=face;
 }
 g.traverse(m=>{if(m.isMesh)m.userData.vehicle=index;});return g;
}
export function createWorld(){
 const scene=new THREE.Scene();scene.background=new THREE.Color('#dbe8da');
 scene.add(new THREE.HemisphereLight('#fff4d8','#59775c',2.8));
 const sun=new THREE.DirectionalLight('#fff1cc',3.4);sun.position.set(-3,10,6);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-6;sun.shadow.camera.right=6;sun.shadow.camera.top=6;sun.shadow.camera.bottom=-6;sun.shadow.normalBias=.025;sun.shadow.bias=-.0002;scene.add(sun);
 box(scene,10,.25,9,0,-.5,0,'#aebf98',.25);
 box(scene,6.65,.28,6.65,0,-.27,0,'#b5a887',.12);
 box(scene,6.05,.09,6.05,0,-.08,0,'#46514b',.04);
 // Paving and black-and-yellow kerbs; leave a real exit in row 3.
 for(let i=0;i<13;i++)for(const side of [-1,1]){
  box(scene,.49,.15,.19,-3+i*.5,.02,side*3.15,i%2?'#25352c':'#f1c43e');
  if(i<12&&!(side===1&&i>=4&&i<=5))box(scene,.19,.15,.49,side*3.15,.02,-2.75+i*.5,i%2?'#25352c':'#f1c43e');
 }
 for(let i=1;i<6;i++)for(let j=0;j<12;j++){
  box(scene,.012,.006,.16,-3+i,-.03,-2.85+j*.5,'#8c9984');
  box(scene,.16,.006,.012,-2.85+j*.5,-.03,-3+i,'#8c9984');
 }
 box(scene,1.5,.09,.98,3.78,-.08,-.5,'#46514b');
 for(let i=0;i<6;i++)box(scene,.08,.012,.74,3.03+i*.11,-.025,-.5,'#f4eacb');
 const arrow=new THREE.Shape();arrow.moveTo(0,-.05);arrow.lineTo(.25,-.05);arrow.lineTo(.25,-.14);arrow.lineTo(.43,0);arrow.lineTo(.25,.14);arrow.lineTo(.25,.05);arrow.lineTo(0,.05);arrow.closePath();const ar=new THREE.Mesh(new THREE.ShapeGeometry(arrow),new THREE.MeshBasicMaterial({color:'#f4d455',side:THREE.DoubleSide}));ar.rotation.x=-Math.PI/2;ar.position.set(3.7,-.018,-.5);scene.add(ar);
 // Lagos-inspired roadside shops, palm trees and a distant bridge silhouette.
 for(const [x,z,h,c] of [[-3.95,-2,1.3,'#d6b77a'],[-3.95,-.6,.85,'#c47b57'],[-3.95,1,1.7,'#d5c5a1'],[2,-3.95,1.1,'#b6bca5'],[.4,-3.95,1.55,'#dfc394']]){
  box(scene,.8,h,.72,x,h/2-.37,z,c,.03);box(scene,.85,.1,.78,x,h-.32,z,'#476754');
  for(let y=.1;y<h-.3;y+=.4)box(scene,.46,.17,.025,x,y,z+.37,'#3b6565');
  box(scene,.86,.08,.4,x,.55,z+.45,'#e0aa32');
 }
 for(const [x,z] of [[-3.9,2.7],[3,-3.9]]){const trunk=cylinder(scene,.07,1.4,x,.3,z,'#816b45');trunk.rotation.z=.09;for(let k=0;k<6;k++){const leaf=box(scene,.95,.04,.19,x+Math.cos(k*Math.PI/3)*.3,1.04,z+Math.sin(k*Math.PI/3)*.3,'#3b7750',.06);leaf.rotation.y=-k*Math.PI/3;leaf.rotation.z=.15;}}
 for(const x of [-2,2]){box(scene,.12,1.9,.15,x,.4,-4.3,'#ded7bf');for(let k=-2;k<=2;k++){const points=[new THREE.Vector3(x,1.3,-4.3),new THREE.Vector3(x+k*.4,-.2,-4.3)];scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color:'#d8d4b9'})));}}box(scene,6.5,.08,.3,0,-.16,-4.3,'#8d9e8f');
 return scene;
}
