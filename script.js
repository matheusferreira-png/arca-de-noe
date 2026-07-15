import * as THREE from "three";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB);

// câmera
const camera = new THREE.PerspectiveCamera(
45,
window.innerWidth / window.innerHeight,
0.1,
1000
);

camera.position.set(0, 8, 25);

// render
const renderer = new THREE.WebGLRenderer({
antialias:true
});

renderer.setSize(window.innerWidth,window.innerHeight);

document.body.appendChild(renderer.domElement);

// luz
const sun = new THREE.DirectionalLight(0xffffff,3);
sun.position.set(20,30,10);
scene.add(sun);

scene.add(new THREE.AmbientLight(0xffffff,2));

// oceano
const water = new THREE.Mesh(
new THREE.PlaneGeometry(300,300),
new THREE.MeshPhongMaterial({
color:0x1976d2
})
);

water.rotation.x = -Math.PI/2;
scene.add(water);

// arca
const ark = new THREE.Mesh(
new THREE.BoxGeometry(10,3,30),
new THREE.MeshPhongMaterial({
color:0x8B4513
})
);

ark.position.y = 2;
scene.add(ark);

// esconde texto
document.getElementById("loading").style.display="none";

// animação
function animate(){

requestAnimationFrame(animate);

ark.rotation.y += 0.003;

renderer.render(scene,camera);

}

animate();

// resize
window.addEventListener("resize",()=>{

camera.aspect=window.innerWidth/window.innerHeight;

camera.updateProjectionMatrix();

renderer.setSize(window.innerWidth,window.innerHeight);

});
