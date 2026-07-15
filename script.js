// Usando CDNs robustos e compatíveis com o GitHub Pages
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.150.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.150.0/examples/jsm/controls/OrbitControls.js";

// Captura de erros para exibir na tela caso algo dê errado no seu celular/PC
window.addEventListener('error', function(e) {
    const errorDiv = document.createElement('div');
    errorDiv.style.position = 'fixed';
    errorDiv.style.top = '10px';
    errorDiv.style.left = '10px';
    errorDiv.style.background = 'rgba(255,0,0,0.9)';
    errorDiv.style.color = 'white';
    errorDiv.style.padding = '15px';
    errorDiv.style.zIndex = '99999';
    errorDiv.style.fontFamily = 'monospace';
    errorDiv.innerHTML = '<b>Erro detectado:</b> ' + e.message;
    document.body.appendChild(errorDiv);
});

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

// Controles para olhar por dentro e por fora (OrbitControls)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI / 2 - 0.05; 
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

// CASCO DA ARCA
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

// CONVÉS SUPERIOR
const deck = new THREE.Mesh(
    new THREE.BoxGeometry(12, 0.4, 40),
    new THREE.MeshPhongMaterial({ color: 0xC68642 })
);
deck.position.set(0, 7.25, 0);
ark.add(deck);

// CONVÉS INTERNO (Para colocar animais na parte de dentro)
const innerDeck = new THREE.Mesh(
    new THREE.BoxGeometry(10, 0.2, 36),
    new THREE.MeshPhongMaterial({ color: 0x5a3d1a })
);
innerDeck.position.set(0, 3.5, 0);
ark.add(innerDeck);

// CABINE (Paredes translúcidas para dar visibilidade interna)
const cabin = new THREE.Mesh(
    new THREE.BoxGeometry(8, 5, 24),
    new THREE.MeshPhongMaterial({
        color: 0x8A5A2B,
        transparent: true,
        opacity: 0.65, 
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

// Girafa
function createGiraffe() {
    const giraffe = new THREE.Group();
    const yellow = new THREE.MeshPhongMaterial({ color: 0xD2912E });

    const body = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 1.4), yellow);
    body.position.y = 1;
    giraffe.add(body);

    const neck = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.8, 0.3), yellow);
    neck.position.set(0, 2.1, 0.5);
    neck.rotation.x = -0.2;
    giraffe.add(neck);

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.6), yellow);
    head.position.set(0, 3, 0.7);
    giraffe.add(head);

    const legGeo = new THREE.BoxGeometry(0.15, 1, 0.15);
    const positions =
