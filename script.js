// =====================================
// CENA E RENDER
// =====================================
const scene = new THREE.Scene();
// Céu de fim de tarde dramático
scene.background = new THREE.Color(0x2c3e50); 
scene.fog = new THREE.FogExp2(0x2c3e50, 0.015);

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
// Câmera posicionada em um ângulo perfeito de perspectiva
camera.position.set(30, 18, 35); 

const container = document.getElementById("canvas-container") || document.body;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true; // Habilita sombras para dar profundidade
container.appendChild(renderer.domElement);

// Controles de câmera totalmente destravados
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(0, 3, 0); // Foca no centro exato da arca unificada
controls.maxPolarAngle = Math.PI / 2 - 0.05; 
controls.minDistance = 2; // Permite entrar dentro da cabine com o zoom!
controls.maxDistance = 80;

// =====================================
// LUZES (Clima dramático e quente)
// =====================================
const sun = new THREE.DirectionalLight(0xffd2a1, 2.0); // Luz solar quente de fim de tarde
sun.position.set(30, 25, 15);
scene.add(sun);

const ambient = new THREE.AmbientLight(0x34495e, 1.2); // Luz de preenchimento fria para sombras ricas
scene.add(ambient);

// Luz interna suave (amarelada) para iluminar os animais por dentro
const interiorLight = new THREE.PointLight(0xff9f43, 2, 15);
interiorLight.position.set(0, 4, 0);
scene.add(interiorLight);

// =====================================
// OCEANO REALISTA (ONDULAÇÃO ESCURA)
// =====================================
const waterGeometry = new THREE.PlaneGeometry(600, 600, 100, 100);
const waterMaterial = new THREE.MeshPhongMaterial({
    color: 0x1B4F72, // Azul marinho profundo
    flatShading: true,
    shininess: 40
});
const water = new THREE.Mesh(waterGeometry, waterMaterial);
water.rotation.x = -Math.PI / 2;
water.position.y = 0;
scene.add(water);

// =====================================
// GRUPO DA ARCA (UNIFICADO)
// =====================================
const ark = new THREE.Group();
scene.add(ark);

// Materiais de madeira rústica e sólida
const woodDark = new THREE.MeshPhongMaterial({ color: 0x4a2711, flatShading: true }); // Casco externo
const woodMedium = new THREE.MeshPhongMaterial({ color: 0x6e3b19, flatShading: true }); // Convés / Rampa
const woodLight = new THREE.MeshPhongMaterial({ color: 0x8f5329, flatShading: true }); // Cabine
const roofMaterial = new THREE.MeshPhongMaterial({ color: 0x3d1d0a, flatShading: true }); // Telhado rústico

// 1. CASCO DA ARCA (Formato curvo clássico de madeira)
const hullShape = new THREE.Shape();
hullShape.moveTo(-5, 0);
hullShape.quadraticCurveTo(-7.5, 0.5, -7.5, 3.5);
hullShape.quadraticCurveTo(-7.5, 6, -5, 7.5);
hullShape.lineTo(5, 7.5);
hullShape.quadraticCurveTo(7.5, 6, 7.5, 3.5);
hullShape.quadraticCurveTo(7.5, 0.5, 5, 0);
hullShape.closePath();

const hullGeometry = new THREE.ExtrudeGeometry(hullShape, {
    depth: 32,
    bevelEnabled: true,
    bevelThickness: 0.4,
    bevelSize: 0.3,
    bevelSegments: 3
});

const hull = new THREE.Mesh(hullGeometry, woodDark);
hull.rotation.x = Math.PI; // Inverte para o lado correto
hull.rotation.y = Math.PI;
hull.position.set(0, 7.5, 16); // Centralizado perfeitamente
ark.add(hull);

// 2. CONVÉS PRINCIPAL (Fechamento superior do barco)
const deck = new THREE.Mesh(
    new THREE.BoxGeometry(13.8, 0.5, 31.8),
    woodMedium
);
deck.position.set(0, 7.25, 0);
ark.add(deck);

// 3. CONVÉS INTERNO (Andar inferior para abrigar animais)
const innerDeck = new THREE.Mesh(
    new THREE.BoxGeometry(11, 0.3, 28),
    woodMedium
);
innerDeck.position.set(0, 3.2, 0);
ark.add(innerDeck);

// 4. CABINE PRINCIPAL (Paredes semi-transparentes para ver o interior)
const cabin = new THREE.Mesh(
    new THREE.BoxGeometry(9, 5.5, 20),
    new THREE.MeshPhongMaterial({
        color: 0x8f5329,
        transparent: true,
        opacity: 0.45, // Mais translúcido para valorizar os animais internos
        side: THREE.DoubleSide,
        flatShading: true
    })
);
cabin.position.set(0, 10, 0);
ark.add(cabin);

// 5. TELHADO DA CABINE
const roofGeo = new THREE.ConeGeometry(7.2, 4, 4);
const roof = new THREE.Mesh(roofGeo, roofMaterial);
roof.rotation.y = Math.PI / 4;
roof.position.set(0, 14.5, 0);
ark.add(roof);

// 6. RAMPA LATERAL (Visual de portal clássico de entrada)
const ramp = new THREE.Mesh(
    new THREE.BoxGeometry(4, 0.3, 8),
    woodMedium
);
ramp.position.set(6.5, 4, 0);
ramp.rotation.z = -Math.PI / 6; // Angulada descendo em direção à água
ark.add(ramp);

// 7. JANELAS DA CABINE
const windowMaterial = new THREE.MeshPhongMaterial({ color: 0x1a1a1a, flatShading: true });
for (let i = -7; i <= 7; i += 3.5) {
    if (i === 0) continue;
    const windowBox = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.4, 0.9), windowMaterial);
    windowBox.position.set(4.51, 10.2, i);
    ark.add(windowBox);
    
    const windowBoxLeft = windowBox.clone();
    windowBoxLeft.position.x = -4.51;
    ark.add(windowBoxLeft);
}

// =====================================
// GERADOR DE ANIMAIS (LOW-POLY FIEL)
// =====================================

// Girafa
function createGiraffe() {
    const giraffe = new THREE.Group();
    const yellow = new THREE.MeshPhongMaterial({ color: 0xD2912E, flatShading: true });
    const brown = new THREE.MeshPhongMaterial({ color: 0x5a3418, flatShading: true });

    // Corpo
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 1.4), yellow);
    body.position.y = 1;
    giraffe.add(body);

    // Pescoço longo
    const neck = new THREE.Mesh(new THREE.BoxGeometry(0.25, 2.0, 0.25), yellow);
    neck.position.set(0, 2.2, 0.45);
    neck.rotation.x = -0.15;
    giraffe.add(neck);

    // Cabeça
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.55), yellow);
    head.position.set(0, 3.1, 0.65);
    giraffe.add(head);

    // Orelhas pequenas
    const earL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 0.1), brown);
    earL.position.set(0.2, 3.2, 0.5);
    const earR = earL.clone();
    earR.position.x = -0.2;
    giraffe.add(earL, earR);

    // Pernas finas (4x)
    const legGeo = new THREE.BoxGeometry(0.14, 1.2, 0.14);
    const positions = [
        [-0.3, 0.6, 0.5], [0.3, 0.6, 0.5],
        [-0.3, 0.6, -0.5], [0.3, 0.6, -0.5]
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
    const wool = new THREE.MeshPhongMaterial({ color: 0xECECEC, flatShading: true });
    const black = new THREE.MeshPhongMaterial({ color: 0x1a1a1a, flatShading: true });

    // Corpo de lã volumoso
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 1.2), wool);
    body.position.y = 0.6;
    sheep.add(body);

    // Cabeça preta
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.45, 0.45), black);
    head.position.set(0, 0.8, 0.6);
    sheep.add(head);

    // Pernas (4x)
    const legGeo = new THREE.BoxGeometry(0.12, 0.5, 0.12);
    const positions = [
        [-0.3, 0.25, 0.4], [0.3, 0.25, 0.4],
        [-0.3, 0.25, -0.4], [0.3, 0.25, -0.4]
    ];
    positions.forEach(pos => {
        const leg = new THREE.Mesh(legGeo, black);
        leg.position.set(...pos);
        sheep.add(leg);
    });

    sheep.scale.set(0.7, 0.7, 0.7);
    return sheep;
}

// Distribuição e fixação dos animais à arca
const animals = [];

// Girafas no topo do convés (lado de fora da cabine)
const g1 = createGiraffe(); g1.position.set(2, 7.5, 11); g1.rotation.y = -Math.PI / 4; ark.add(g1);
const g2 = createGiraffe(); g2.position.set(-2, 7.5, 12); g2.rotation.y = Math.PI / 3; ark.add(g2);
animals.push(g1, g2);

// Ovelhas abrigadas confortavelmente dentro da cabine inferior (visíveis de fora)
const s1 = createSheep(); s1.position.set(1.5, 3.3, 4); s1.rotation.y = Math.PI / 2; ark.add(s1);
const s2 = createSheep(); s2.position.set(-1.8, 3.3, -2); s2.rotation.y = -Math.PI / 6; ark.add(s2);
const s3 = createSheep(); s3.position.set(0, 3.3, -7); s3.rotation.y = Math.PI; ark.add(s3);
animals.push(s1, s2, s3);

// =====================================
// SISTEMA DE ÁUDIO NATIVO (SÍNTESE WEB)
// =====================================
let audioCtx = null;

function initAudio() {
    if (audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    // Som de ondas do mar em tempestade (ruído filtrado rítmico)
    const bufferSize = audioCtx.sampleRate * 4;
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
    filter.frequency.value = 250;

    const gainNode = audioCtx.createGain();
    gainNode.gain.value = 0.08;

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    whiteNoise.start();

    showAudioBanner();
}

function playAnimalSound() {
    if (!audioCtx) return;

    // Efeito sonoro sintético simulando balido de ovelha / som de rebanho
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, audioCtx.currentTime);
    osc.frequency.linearRampToValueAtTime(180, audioCtx.currentTime + 0.1);
    osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.5);

    // Modulação para dar o efeito tremido de ovelhas (vibrato)
    const vibrato = audioCtx.createOscillator();
    const vibratoGain = audioCtx.createGain();
    vibrato.frequency.value = 15; // Velocidade do tremor
    vibratoGain.gain.value = 20; // Intensidade do tremor

    vibrato.connect(vibratoGain);
    vibratoGain.connect(osc.frequency);
    
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    vibrato.start();
    osc.start();
    
    osc.stop(audioCtx.currentTime + 0.5);
    vibrato.stop(audioCtx.currentTime + 0.5);
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
    banner.innerHTML = "Som do mar ativado! Clique na tela para balir com os animais.";
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
// ANIMAÇÃO (FLUTUAÇÃO DA ARCA E MAR)
// =====================================
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const time = clock.getElapsedTime();
    controls.update();

    // Ondas dinâmicas do mar rústico
    const position = water.geometry.attributes.position;
    for (let i = 0; i < position.count; i++) {
        const x = position.getX(i);
        const y = position.getY(i);
        const wave =
            Math.sin((x + time * 2.5) * 0.05) * 0.4 +
            Math.cos((y + time * 1.8) * 0.05) * 0.4;
        position.setZ(i, wave);
    }
    position.needsUpdate = true;
    water.geometry.computeVertexNormals();

    // Balanço unificado da Arca de Noé sobre as ondas
    ark.position.y = Math.sin(time * 1.2) * 0.4; // Sobe e desce suave
    ark.rotation.z = Math.sin(time * 0.9) * 0.04; // Balanço lateral leve
    ark.rotation.x = Math.cos(time * 1.1) * 0.02; // Pequena arfagem (para frente e para trás)

    // Pequena animação individual e orgânica dos bichinhos
    animals.forEach((animal, index) => {
        animal.rotation.y += Math.sin(time * 2 + index) * 0.002;
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
