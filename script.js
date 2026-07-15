import * as THREE from "three";

// ===========================
// CENA
// ===========================

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB);

// ===========================
// CÂMERA
// ===========================

const camera = new THREE.PerspectiveCamera(
45,
window.innerWidth / window.innerHeight,
0.1,
1000
);

camera.position.set(0, 12, 45);

// ===========================
// RENDER
// ===========================

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

document.body.appendChild(renderer.domElement);

// ===========================
// LUZES
// ===========================

const sun = new THREE.DirectionalLight(0xffffff, 3);
sun.position.set(30, 40, 20);
scene.add(sun);

const ambient = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambient);

// ===========================
// OCEANO
// ===========================

const waterGeometry = new THREE.PlaneGeometry(500,500,120,120);

const waterMaterial = new THREE.MeshPhongMaterial({
    color:0x2E86DE,
    flatShading:true
});

const water = new THREE.Mesh(
    waterGeometry,
    waterMaterial
);

water.rotation.x = -Math.PI/2;

scene.add(water);

// ===========================
// GRUPO DA ARCA
// ===========================

const ark = new THREE.Group();

scene.add(ark);
// =====================================
// CASCO
// =====================================

const hullShape = new THREE.Shape();

hullShape.moveTo(-6,0);
hullShape.lineTo(6,0);
hullShape.lineTo(7,2);
hullShape.lineTo(7,5);
hullShape.lineTo(5.5,7);
hullShape.lineTo(-5.5,7);
hullShape.lineTo(-7,5);
hullShape.lineTo(-7,2);
hullShape.closePath();

const hullGeometry = new THREE.ExtrudeGeometry(hullShape,{
    depth:34,
    bevelEnabled:true,
    bevelThickness:0.25,
    bevelSize:0.25,
    bevelSegments:2
});

const hullMaterial = new THREE.MeshPhongMaterial({
    color:0x7B4A21
});

const hull = new THREE.Mesh(
    hullGeometry,
    hullMaterial
);

hull.rotation.x = Math.PI;
hull.rotation.y = Math.PI;
hull.position.set(0,7,17);

ark.add(hull);

// =====================================
// CONVÉS
// =====================================

const deck = new THREE.Mesh(

    new THREE.BoxGeometry(11.5,0.4,32),

    new THREE.MeshPhongMaterial({
        color:0xC68642
    })

);

deck.position.set(0,7.25,0);

ark.add(deck);

// =====================================
// CABINE
// =====================================

const cabin = new THREE.Mesh(

    new THREE.BoxGeometry(5.5,3.5,13),

    new THREE.MeshPhongMaterial({
        color:0x8A5A2B
    })

);

cabin.position.set(0,9.2,0);

ark.add(cabin);

// =====================================
// TELHADO
// =====================================

const roof = new THREE.Mesh(

    new THREE.ConeGeometry(4.5,2.2,4),

    new THREE.MeshPhongMaterial({
        color:0x5A3418
    })

);

roof.rotation.y = Math.PI/4;

roof.position.set(0,12,0);

ark.add(roof);

// =====================================
// JANELAS
// =====================================

const windowMaterial = new THREE.MeshPhongMaterial({
    color:0x222222
});

for(let i=-4;i<=4;i+=2){

    const windowBox = new THREE.Mesh(

        new THREE.BoxGeometry(0.4,0.8,0.2),

        windowMaterial

    );

    windowBox.position.set(i,9.3,6.6);

    ark.add(windowBox);

}
