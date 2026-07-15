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

// Grupo da Arca
const ark = new THREE.Group();

// Casco
const hull = new THREE.Mesh(
    new THREE.BoxGeometry(12, 4, 34),
    new THREE.MeshPhongMaterial({
        color: 0x8B5A2B
    })
);

hull.position.y = 2;
ark.add(hull);

// Convés
const deck = new THREE.Mesh(
    new THREE.BoxGeometry(11, 0.5, 30),
    new THREE.MeshPhongMaterial({
        color: 0xA66A2C
    })
);

deck.position.y = 4.25;
ark.add(deck);

// Cabine
const cabin = new THREE.Mesh(
    new THREE.BoxGeometry(6,3,12),
    new THREE.MeshPhongMaterial({
        color:0x704214
    })
);

cabin.position.set(0,6,0);
ark.add(cabin);

// Telhado
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(5,2,4),
    new THREE.MeshPhongMaterial({
        color:0x5D3A1A
    })
);

roof.rotation.y=Math.PI/4;
roof.position.y=8;
ark.add(roof);

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
