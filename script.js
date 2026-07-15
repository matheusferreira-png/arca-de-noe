import * as THREE from "https://unpkg.com/three@0.150.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.150.0/examples/jsm/controls/OrbitControls.js";

// =====================================
// CENA E RENDER
// =====================================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB);

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(45, 22, 45);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Controles para olhar por dentro e por fora
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI / 2 - 0.05; // Evita que a câmera passe por baixo da água
controls.minDistance = 5;
controls.maxDistance = 150;

// =====================================
// LUZES
// =====================================
const sun = new THREE.DirectionalLight(0xffffff, 2.5);
sun.position.set(30, 40, 20);
scene.add(sun);

const ambient = new THREE.AmbientLight(0xffffff, 1.8);
scene.add(ambient);

// =====================================
// OCEANO
// =====================================
const waterGeometry = new THREE.PlaneGeometry(500, 500, 80, 80);
const waterMaterial = new THREE.MeshPhongMaterial({
    color: 0x2E86DE,
    flatShading: true
});
const water = new THREE.Mesh(waterGeometry, waterMaterial);
water.rotation.x = -Math.PI / 2;
scene.add(water);

// =====================================
// GRUPO DA ARCA
// =====================================
const ark = new THREE.Group();
scene.add(ark);

// CASCO DA ARCA (Corrigido e sem duplicatas)
const hullShape = new THREE.Shape();
hullShape.moveTo(-3.5, 0);
hullShape.quadraticCurveTo(-7, 1, -7, 4);
hullShape.quadraticCurveTo(-7, 7, -4, 8);
hullShape.lineTo(4, 8);
hullShape.quadraticCurveTo(7, 7, 7, 4);
hullShape.quadraticCurveTo(7, 1, 3.5, 0);
hullShape.closePath();

const hullGeometry = new THREE.ExtrudeGeometry(hullShape, {
    depth: 42,
    bevelEnabled: true,
    bevelThickness: 0.2,
    bevelSize: 0.2,
    bevelSegments: 3
});

const hullMaterial = new THREE.MeshPhongMaterial({
    color: 0x7A4A21,
    side: THREE.DoubleSide
});

const hull = new THREE.Mesh(hullGeometry, hullMaterial);
hull.rotation.x = Math.PI;
hull.rotation.y = Math.PI;
hull.position.set(0, 8, 17);
ark.add(hull);

// CONVÉS PRINCIPAL (Deck de cima)
const deck = new THREE.Mesh(
    new THREE.BoxGeometry(12, 0.4, 40),
    new THREE.MeshPhongMaterial({ color: 0xC68642 })
);
deck.position.set(0, 7.25, 0);
ark.add(deck);

// CONVÉS INTERNO (Para ver os animais dentro da arca!)
const innerDeck = new THREE.Mesh(
    new THREE.BoxGeometry(10, 0.2, 36),
    new THREE.MeshPhongMaterial({ color: 0x5a3d1a })
);
innerDeck.position.set(0, 3.5, 0);
ark.add(innerDeck);

// CABINE (Paredes semi-transparentes para ver o interior)
const cabin = new THREE.Mesh(
    new THREE.BoxGeometry(8, 5, 24),
    new THREE.MeshPhongMaterial({
        color: 0x8A5A2B,
        transparent: true,
        opacity: 0.65, // Torna o interior visível!
        side: THREE.DoubleSide
    })
);
cabin.position.set(0, 9.7, 0);
ark.add(cabin);

// TELHADO
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(6, 3, 4),
    new THREE.MeshPhongMaterial({ color: 0x5A3418 })
);
roof.rotation.y = Math.PI / 4;
roof.position.set(0, 13.5, 0);
ark.add(roof);

// JANELAS DA CABINE
const windowMaterial = new THREE.MeshPhongMaterial({ color: 0x111111, transparent: true, opacity: 0.8 });
for (let i = -8; i <= 8; i += 4) {
    if (i === 0) continue;
    const windowBox = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.2, 0.8), windowMaterial);
    windowBox.position.set(3.95, 10, i);
    ark.add(windowBox);
    
    const windowBoxLeft = windowBox.clone();
    windowBoxLeft.position.x = -3.95;
    ark.add(windowBoxLeft);
}

// =====================================
// GERADOR DE ANIMAIS (LOW-POLY)
// =====================================

// 1. GIRAFA
function createGiraffe() {
    const giraffe = new THREE.Group();
    const yellow = new THREE.MeshPhongMaterial({ color: 0xD2912E });
    const brown = new THREE.MeshPhongMaterial({ color: 0x5A3418 });

    // Corpo
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 1.4), yellow);
    body.position.y = 1;
    giraffe.add(body);

    // Pescoço
    const neck = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.8, 0.3), yellow);
    neck.position.set(0, 2.1, 0.5);
    neck.rotation.x = -0.2;
    giraffe.add(neck);

    // Cabeça
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.6), yellow);
    head.position.set(0, 3, 0.7);
    giraffe.add(head);

    // Pernas (4x)
    const legGeo = new THREE.BoxGeometry(0.15, 1, 0.15);
    const positions = [
        [-0.3, 0.5, 0.5], [0.3, 0.5, 0.5],
        [-0.3, 0.5, -0.5], [0.3, 0.5, -0.5]
    ];
    positions.forEach(pos => {
        const leg = new THREE.Mesh(legGeo, yellow);
        leg.position.set(...pos);
        giraffe.add(leg);
    });

    giraffe.scale.set(0.7, 0.7, 0.7);
    return giraffe;
}

// 2. OVELHA
function createSheep() {
    const sheep = new THREE.Group();
    const white = new THREE.MeshPhongMaterial({ color: 0xEEEEEE, flatShading: true });
    const black = new THREE.MeshPhongMaterial({ color: 0x222222 });

    // Corpo de lã
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 1), white);
    body.position.y = 0.5;
    sheep.add(body);

    // Cabeça
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), black);
    head.position.set(0, 0.7, 0.5);
    sheep.add(head);

    // Pernas
    const legGeo = new THREE.BoxGeometry(0.1, 0.4, 0.1);
    const positions = [
        [-0.25, 0.2, 0.3], [0.25, 0.2, 0.3],
        [-0.25, 0.2, -0.3], [0.25, 0.2, -0.3]
    ];
    positions.forEach(pos => {
        const leg = new THREE.Mesh(legGeo, black);
        leg.position.set(...pos);
        sheep.add(leg);
    });

    sheep.scale.set(0.8, 0.8, 0.8);
    return sheep;
}

// Distribuir animais pela Arca
const animals = [];

// Animais no Deck de Cima (Ar livre)
const g1 = createGiraffe(); g1.position.set(1.5, 7.5, 12); g1.rotation.y = -Math.PI/4; ark.add(g1);
const g2 = createGiraffe(); g2.position.set(-1.5, 7.5, 10); g2.rotation.y = Math.PI/3; ark.add(g2);
animals.push(g1, g2);

// Animais no Deck Interno (Visíveis pelas paredes transparentes!)
const s1 = createSheep(); s1.position.set(2, 3.6, 5); s1.rotation
