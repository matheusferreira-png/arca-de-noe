import * as THREE from "three";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB);

// ====================
// CÂMERA
// ====================

const camera = new THREE.PerspectiveCamera(
45,
window.innerWidth / window.innerHeight,
0.1,
1000
);

camera.position.set(0,10,30);

// ====================
// RENDER
// ====================

const renderer = new THREE.WebGLRenderer({
antialias:true
});

renderer.setSize(window.innerWidth,window.innerHeight);
renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);

// ====================
// LUZES
// ====================

const sun = new THREE.DirectionalLight(0xffffff,3);
sun.position.set(30,40,20);
sun.castShadow=true;

scene.add(sun);

scene.add(new THREE.AmbientLight(0xffffff,1.8));

// ====================
// OCEANO
// ====================

const water = new THREE.Mesh(

new THREE.PlaneGeometry(500,500),

new THREE.MeshPhongMaterial({
color:0x1E88E5
})

);

water.rotation.x = -Math.PI/2;
water.receiveShadow=true;

scene.add(water);

// ====================
// ARCA
// ====================

const ark = new THREE.Group();

// Casco

const hull = new THREE.Mesh(

new THREE.BoxGeometry(12,4,34),

new THREE.MeshPhongMaterial({
color:0x8B5A2B
})

);

hull.position.y=2;
hull.castShadow=true;

ark.add(hull);

// Convés

const deck = new THREE.Mesh(

new THREE.BoxGeometry(11,0.6,30),

new THREE.MeshPhongMaterial({
color:0xB87333
})

);

deck.position.y=4.3;
deck.castShadow=true;

ark.add(deck);

// Cabine

const cabin = new THREE.Mesh(

new THREE.BoxGeometry(6,3,12),

new THREE.MeshPhongMaterial({
color:0x704214
})

);

cabin.position.set(0,6,0);
cabin.castShadow=true;

ark.add(cabin);

// Telhado

const roof = new THREE.Mesh(

new THREE.ConeGeometry(5,2,4),

new THREE.MeshPhongMaterial({
color:0x5A381E
})

);

roof.rotation.y=Math.PI/4;
roof.position.y=8.2;
roof.castShadow=true;

ark.add(roof);

// Porta

const door = new THREE.Mesh(

new THREE.BoxGeometry(2,3,0.2),

new THREE.MeshPhongMaterial({
color:0x3E2723
})

);

door.position.set(0,5.2,6.1);

ark.add(door);

// Janelas

for(let i=-2;i<=2;i++){

const windowBox = new THREE.Mesh(

new THREE.BoxGeometry(0.8,0.8,0.2),

new THREE.MeshPhongMaterial({
color:0x99ddff
})

);

windowBox.position.set(i*2,6,-6.1);

ark.add(windowBox);

}

scene.add(ark);

// ====================
// LOADING
// ====================

document.getElementById("loading").style.display="none";

// ====================
// ANIMAÇÃO
// ====================

function animate(){

requestAnimationFrame(animate);

// gira lentamente

ark.rotation.y += 0.0015;

// balança

ark.position.y = Math.sin(Date.now()*0.0015)*0.3 + 1.8;

// inclina

ark.rotation.z = Math.sin(Date.now()*0.0012)*0.03;

renderer.render(scene,camera);

}

animate();

// ====================
// RESIZE
// ====================

window.addEventListener("resize",()=>{

camera.aspect = window.innerWidth/window.innerHeight;

camera.updateProjectionMatrix();

renderer.setSize(window.innerWidth,window.innerHeight);

});
