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

camera.position.set(0, 18, 70);
camera.lookAt(0, 7, 0);

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
// =====================================
// CASCO DA ARCA (mais realista)
// =====================================

const hullShape = new THREE.Shape();

hullShape.moveTo(-3.5,0);
hullShape.quadraticCurveTo(-7,1,-7,4);
hullShape.quadraticCurveTo(-7,7,-4,8);
hullShape.lineTo(4,8);
hullShape.quadraticCurveTo(7,7,7,4);
hullShape.quadraticCurveTo(7,1,3.5,0);
hullShape.closePath();

const hullGeometry = new THREE.ExtrudeGeometry(hullShape,{
    depth:34,
    bevelEnabled:true,
    bevelThickness:0.2,
    bevelSize:0.2,
    bevelSegments:3
});

const hullMaterial = new THREE.MeshPhongMaterial({
    color:0x7A4A21
});

const hull = new THREE.Mesh(
    hullGeometry,
    hullMaterial
);

// Centraliza
hull.rotation.x = Math.PI;
hull.rotation.y = Math.PI;

hull.position.set(0,8,17);

ark.add(hull);

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

    new THREE.BoxGeometry(10.2,0.35,31),

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

    new THREE.BoxGeometry(4.5,3.2,11),

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
// =====================================
// ESCONDE A TELA DE CARREGAMENTO
// =====================================

document.getElementById("loading").style.display = "none";

// =====================================
// ANIMAÇÃO
// =====================================

const clock = new THREE.Clock();

function animate() {

    requestAnimationFrame(animate);

    const time = clock.getElapsedTime();

    // Ondas do oceano
    const position = water.geometry.attributes.position;

    for (let i = 0; i < position.count; i++) {

        const x = position.getX(i);
        const y = position.getY(i);

        const wave =
            Math.sin((x + time * 3) * 0.08) * 0.25 +
            Math.cos((y + time * 2) * 0.08) * 0.25;

        position.setZ(i, wave);

    }

    position.needsUpdate = true;

    water.geometry.computeVertexNormals();

    // Arca flutuando
    ark.position.y = Math.sin(time * 1.5) * 0.35;

    // Balanço lateral
    ark.rotation.z = Math.sin(time * 1.2) * 0.03;

    // Pequeno balanço para frente
    ark.rotation.x = Math.cos(time * 1.5) * 0.015;

    renderer.render(scene, camera);

}

animate();

// =====================================
// REDIMENSIONAMENTO
// =====================================

window.addEventListener("resize", () => {

    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

});
