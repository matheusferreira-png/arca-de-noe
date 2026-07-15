import * as THREE from 'three';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB);

const camera = new THREE.PerspectiveCamera(
60,
window.innerWidth/window.innerHeight,
0.1,
1000
);

camera.position.set(0,12,35);

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);

// Luzes
scene.add(new THREE.AmbientLight(0xffffff,1.3));

const sun = new THREE.DirectionalLight(0xffffff,2);
sun.position.set(20,30,20);
scene.add(sun);

// Mar
const sea = new THREE.Mesh(
    new THREE.PlaneGeometry(500,500),
    new THREE.MeshPhongMaterial({
        color:0x1976d2
    })
);

sea.rotation.x = -Math.PI/2;
scene.add(sea);

// ======== ARCA ========

const ark = new THREE.Group();

// Casco
const hull = new THREE.Mesh(
    new THREE.BoxGeometry(18,5,45),
    new THREE.MeshStandardMaterial({
        color:0x8b5a2b
    })
);

hull.position.y=3;

ark.add(hull);

// Convés
const deck = new THREE.Mesh(
    new THREE.BoxGeometry(19,0.5,46),
    new THREE.MeshStandardMaterial({
        color:0xc48a45
    })
);

deck.position.y=5.6;

ark.add(deck);

// Telhado
const roof = new THREE.Mesh(
    new THREE.BoxGeometry(8,3,35),
    new THREE.MeshStandardMaterial({
        color:0x6d3c1b
    })
);

roof.position.y=7.3;

ark.add(roof);

scene.add(ark);

//====================

function animate(){

requestAnimationFrame(animate);

ark.rotation.y +=0.002;

renderer.render(scene,camera);

}

animate();

window.addEventListener("resize",()=>{

camera.aspect=window.innerWidth/window.innerHeight;
camera.updateProjectionMatrix();
renderer.setSize(window.innerWidth,window.innerHeight);

});
