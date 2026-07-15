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

// Controles de órbita ajustados para o modo global
const controls = new THREE.OrbitControls(camera, renderer.domElement);
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

// CONVÉS INTERNO
const innerDeck = new THREE.Mesh(
    new THREE.BoxGeometry(10, 0.2, 36),
    new THREE.MeshPhongMaterial({ color: 0x5a3d1a })
);
innerDeck.position.set(0, 3.5, 0);
ark.add(innerDeck);

// CABINE TRANSLÚCIDA
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

// Ovelha
function createSheep() {
    const sheep = new THREE.Group();
    const white = new THREE.MeshPhongMaterial({ color: 0xEEEEEE, flatShading: true });
    const black = new THREE.MeshPhongMaterial({ color: 0x222222 });

    const body = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 1), white);
    body.position.y = 0.5;
    sheep.add(body);

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), black);
    head.position.set(0, 0.7, 0.5);
    sheep.add(head);

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

// Adicionar animais à arca
const animals = [];

const g1 = createGiraffe(); g1.position.set(1.5, 7.5, 12); g1.rotation.y = -Math.PI / 4; ark.add(g1);
const g2 = createGiraffe(); g2.position.set(-1.5, 7.5, 10); g2.rotation.y = Math.PI / 3; ark.add(g2);
animals.push(g1, g2);

const s1 = createSheep(); s1.position.set(2, 3.6, 5); s1.rotation.y = Math.PI / 2; ark.add(s1);
const s2 = createSheep(); s2.position.set(-2, 3.6, -2); s2.rotation.y = -Math.PI / 6; ark.add(s2);
const s3 = createSheep(); s3.position.set(0, 3.6, -8); s3.rotation.y = Math.PI; ark.add(s3);
animals.push(s1, s2, s3);

// =====================================
// SISTEMA DE ÁUDIO NATIVO
// =====================================
let audioCtx = null;

function initAudio() {
    if (audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    const bufferSize = audioCtx.sampleRate * 2;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 350;

    const gainNode = audioCtx.createGain();
    gainNode.gain.value = 0.05;

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    whiteNoise.start();

    showAudioBanner();
}

function playAnimalSound() {
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(350, audioCtx.currentTime + 0.15);
    osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.4);

    gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.45);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.5);
}

window.addEventListener('click', () => {
    initAudio();
    playAnimalSound();
});

function showAudioBanner() {
    const banner = document.createElement("div");
    banner.style.position = "absolute";
    banner.style.bottom = "20px";
    banner.style.left = "50%";
    banner.style.transform = "translateX(-50%)";
    banner.style.background = "rgba(0,0,0,0.85)";
    banner.style.color = "#fff";
    banner.style.padding = "10px 20px";
    banner.style.borderRadius = "20px";
    banner.style.fontFamily = "sans-serif";
    banner.style.fontSize = "14px";
    banner.style.pointerEvents = "none";
    banner.style.zIndex = "10000";
    banner.innerHTML = "Som do mar ativado! Clique na tela para ouvir os animais.";
    document.body.appendChild(banner);
    setTimeout(() => banner.remove(), 4000);
}

// =====================================
// OCULTAR CARREGAMENTO
// =====================================
const loadingElement = document.getElementById("loading");
if (loadingElement) {
    loadingElement.style.display = "none";
}

// =====================================
// ANIMAÇÃO
// =====================================
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const time = clock.getElapsedTime();
    controls.update();

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

    ark.position.y = Math.sin(time * 1.5) * 0.35;
    ark.rotation.z = Math.sin(time * 1.2) * 0.03;
    ark.rotation.x = Math.cos(time * 1.5) * 0.015;

    animals.forEach((animal, index) => {
        animal.rotation.y += Math.sin(time + index) * 0.003;
    });

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
