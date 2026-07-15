import * as THREE from 'three';

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x87CEEB);

const camera = new THREE.PerspectiveCamera(
60,
window.innerWidth/window.innerHeight,
0.1,
1000
);

camera.position.set(0,8,18);

const renderer = new THREE.WebGLRenderer({
antialias:true
});

renderer.setSize(window.innerWidth,window.innerHeight);

document.body.appendChild(renderer.domElement);

// Luz

const light=new THREE.DirectionalLight(0xffffff,2);

light.position.set(20,30,20);

scene.add(light);

scene.add(new THREE.AmbientLight(0xffffff,1));

// Chão

const floor=new THREE.Mesh(

new THREE.PlaneGeometry(300,300),

new THREE.MeshStandardMaterial({

color:0x4ea5ff

})

);

floor.rotation.x=-Math.PI/2;

scene.add(floor);

// Caixa temporária (será substituída pela Arca)

const ark=new THREE.Mesh(

new THREE.BoxGeometry(12,5,30),

new THREE.MeshStandardMaterial({

color:0x8b5a2b

})

);

ark.position.y=2.5;

scene.add(ark);

function animate(){

requestAnimationFrame(animate);

ark.rotation.y+=0.002;

renderer.render(scene,camera);

}

animate();

window.addEventListener("resize",()=>{

camera.aspect=window.innerWidth/window.innerHeight;

camera.updateProjectionMatrix();

renderer.setSize(window.innerWidth,window.innerHeight);

});

document.getElementById("loading").style.display="none";
