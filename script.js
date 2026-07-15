// ============================================================================
// CONFIGURAÇÃO DA CENA E RENDERIZADOR PROFISSIONAL
// ============================================================================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a252f); // Céu de tempestade dramático
scene.fog = new THREE.FogExp2(0x1a252f, 0.012);

const camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(35, 18, 40);

const container = document.getElementById("canvas-container") || document.body;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true; // Sombra profissional ativada
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Sombras suaves de alta qualidade
renderer.toneMapping = THREE.ACESFilmicToneMapping; // Ajuste cinematográfico de cores
renderer.toneMappingExposure = 1.2;
container.appendChild(renderer.domElement);

// Controles de Órbita profissionais
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(0, 3, 0);
controls.maxPolarAngle = Math.PI / 2 - 0.05; 
controls.minDistance = 2; // Permite entrar com o zoom dentro das cabines
controls.maxDistance = 90;

// ============================================================================
// ILUMINAÇÃO CENOGRÁFICA
// ============================================================================
// Luz Direcional (Sol poente/tempestade) com projeção de sombras calibrada
const sun = new THREE.DirectionalLight(0xffdfb0, 2.5);
sun.position.set(35, 45, 20);
sun.castShadow = true;
sun.shadow.mapSize.width = 2048; // Alta resolução de sombras
sun.shadow.mapSize.height = 2048;
sun.shadow.camera.near = 0.5;
sun.shadow.camera.far = 150;
const d = 40;
sun.shadow.camera.left = -d;
sun.shadow.camera.right = d;
sun.shadow.camera.top = d;
sun.shadow.camera.bottom = -d;
sun.shadow.bias = -0.0005;
scene.add(sun);

// Luz Ambiente para suavizar as sombras do casco
const ambient = new THREE.AmbientLight(0x2c3e50, 1.4);
scene.add(ambient);

// Luz Interna Amarelada para destacar os animais nos conveses
const interiorLight = new THREE.PointLight(0xffa040, 3.5, 25);
interiorLight.position.set(0, 4, 0);
interiorLight.castShadow = true;
scene.add(interiorLight);

// ============================================================================
// OCEANO REALISTA DINÂMICO
// ============================================================================
const waterGeometry = new THREE.PlaneGeometry(600, 600, 120, 120);
const waterMaterial = new THREE.MeshStandardMaterial({
    color: 0x14344f,
    roughness: 0.15,
    metalness: 0.8,
    flatShading: true
});
const water = new THREE.Mesh(waterGeometry, waterMaterial);
water.rotation.x = -Math.PI / 2;
water.receiveShadow = true;
scene.add(water);

// ============================================================================
// GRUPO E MATERIAIS DE MADEIRA DA ARCA
// ============================================================================
const ark = new THREE.Group();
scene.add(ark);

// Paleta profissional de materiais rústicos
const matCasco = new THREE.MeshStandardMaterial({ color: 0x3d1d0c, roughness: 0.9, metalness: 0.1, flatShading: true });
const matVigas = new THREE.MeshStandardMaterial({ color: 0x271206, roughness: 0.9, metalness: 0.1, flatShading: true });
const matDeck = new THREE.MeshStandardMaterial({ color: 0x5e3719, roughness: 0.8, flatShading: true });
const matCabine = new THREE.MeshStandardMaterial({ color: 0x824b24, roughness: 0.75, flatShading: true, side: THREE.DoubleSide });
const matTelhado = new THREE.MeshStandardMaterial({ color: 0x4a1805, roughness: 0.9, flatShading: true });
const matGrade = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.5, metalness: 0.8 });

// --- 1. CASCO PROFISSIONAL COM QUILHA E CURVATURA ---
const hullGroup = new THREE.Group();

// Parte central do casco
const hullCenter = new THREE.Mesh(new THREE.BoxGeometry(14, 8, 26), matCasco);
hullCenter.position.y = 4;
hullCenter.castShadow = true;
hullCenter.receiveShadow = true;
hullGroup.add(hullCenter);

// Proa Afunilada (Frente)
const bowGeo = new THREE.BoxGeometry(14, 8, 8);
const bow = new THREE.Mesh(bowGeo, matCasco);
bow.position.set(0, 4, 17);
bow.scale.set(0.1, 1, 1); // Afunila a frente formando um bico
bow.castShadow = true;
hullGroup.add(bow);

// Popa (Traseira chanfrada)
const sternGeo = new THREE.BoxGeometry(14, 8, 6);
const stern = new THREE.Mesh(sternGeo, matCasco);
stern.position.set(0, 4, -16);
stern.rotation.x = -0.2; // Inclina a traseira para o visual clássico
stern.castShadow = true;
hullGroup.add(stern);

// Vigas e Reforços Laterais Externos (Dão realismo de engenharia naval)
for (let z = -12; z <= 12; z += 4) {
    const vigaL = new THREE.Mesh(new THREE.BoxGeometry(0.6, 9, 0.6), matVigas);
    vigaL.position.set(7.1, 4.2, z);
    vigaL.rotation.z = -0.05;
    vigaL.castShadow = true;
    
    const vigaR = vigaL.clone();
    vigaR.position.x = -7.1;
    vigaR.rotation.z = 0.05;
    
    hullGroup.add(vigaL, vigaR);
}
ark.add(hullGroup);

// --- 2. DECK PRINCIPAL (CONVÉS SUPERIOR) ---
const mainDeck = new THREE.Mesh(
    new THREE.BoxGeometry(14.8, 0.6, 42),
    matDeck
);
mainDeck.position.set(0, 8, 0);
mainDeck.castShadow = true;
mainDeck.receiveShadow = true;
ark.add(mainDeck);

// --- 3. CONVÉS INTERNO DOS ANIMAIS (Andar de baixo) ---
const innerDeck = new THREE.Mesh(
    new THREE.BoxGeometry(13, 0.3, 36),
    matDeck
);
innerDeck.position.set(0, 3.8, 0);
innerDeck.receiveShadow = true;
ark.add(innerDeck);

// --- 4. CABINE COM DETALHAMENTO DE COLUNAS ---
// Paredes semi-transparentes estruturadas
const cabin = new THREE.Mesh(
    new THREE.BoxGeometry(9.5, 6, 24),
    new THREE.MeshStandardMaterial({
        color: 0x824b24,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
        roughness: 0.7,
        flatShading: true
    })
);
cabin.position.set(0, 11, 0);
cabin.castShadow = true;
cabin.receiveShadow = true;
ark.add(cabin);

// Colunas de suporte da cabine
for (let z = -11; z <= 11; z += 5.5) {
    const colL = new THREE.Mesh(new THREE.BoxGeometry(0.4, 6.2, 0.4), matVigas);
    colL.position.set(4.8, 11, z);
    colL.castShadow = true;
    const colR = colL.clone();
    colR.position.x = -4.8;
    ark.add(colL, colR);
}

// --- 5. TELHADO MULTI-FACETADO ---
const roofGeo = new THREE.ConeGeometry(8.5, 4.5, 4);
const roof = new THREE.Mesh(roofGeo, matTelhado);
roof.rotation.y = Math.PI / 4;
roof.position.set(0, 16, 0);
roof.castShadow = true;
ark.add(roof);

// --- 6. PORTÃO E RAMPA DE ACESSO DUPLA ---
const rampa = new THREE.Mesh(
    new THREE.BoxGeometry(4.5, 0.3, 10),
    matDeck
);
rampa.position.set(8.5, 4.2, 3);
rampa.rotation.z = -Math.PI / 6;
rampa.castShadow = true;
ark.add(rampa);

// Corrimões da Rampa
const corrimaoL = new THREE.Mesh(new THREE.BoxGeometry(0.15, 1.2, 10), matVigas);
corrimaoL.position.set(8.5, 4.9, 5.2);
corrimaoL.rotation.z = -Math.PI / 6;
corrimaoL.castShadow = true;
const corrimaoR = corrimaoL.clone();
corrimaoR.position.z = 0.8;
ark.add(corrimaoL, corrimaoR);

// --- 7. JANELAS DETALHADAS COM GRADES ---
for (let i = -8; i <= 8; i += 4) {
    if (i === 0) continue;
    // Moldura externa da janela
    const frame = new THREE.Mesh(new THREE.BoxGeometry(0.15, 1.6, 1.2), matVigas);
    frame.position.set(4.8, 11.2, i);
    frame.castShadow = true;
    ark.add(frame);
    
    const frameLeft = frame.clone();
    frameLeft.position.x = -4.8;
    ark.add(frameLeft);

    // Grades internas metálicas
    const grade = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.4, 0.1), matGrade);
    grade.position.set(4.8, 11.2, i);
    ark.add(grade);
    const gradeL = grade.clone(); gradeL.position.x = -4.8;
    scene.add(grade, gradeL);
}

// ============================================================================
// MODELAGEM PROFISSIONAL DE ANIMAIS (LOW-POLY PREMIUM)
// ============================================================================

// Girafa com Manchas Realistas
function createGiraffe() {
    const giraffe = new THREE.Group();
    const matPele = new THREE.MeshStandardMaterial({ color: 0xD2912E, roughness: 0.8, flatShading: true });
    const matManchas = new THREE.MeshStandardMaterial({ color: 0x6e3b19, roughness: 0.9 });

    // Corpo
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 1.5), matPele);
    body.position.y = 1.1;
    body.castShadow = true;
    giraffe.add(body);

    // Detalhe de manchas nas laterais do corpo
    const mancha1 = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.3, 0.3), matManchas);
    mancha1.position.set(0.46, 1.2, 0.2);
    const mancha2 = mancha1.clone();
    mancha2.position.set(-0.46, 1.1, -0.3);
    giraffe.add(mancha1, mancha2);

    // Pescoço longo e elegante
    const neck = new THREE.Mesh(new THREE.BoxGeometry(0.26, 2.3, 0.26), matPele);
    neck.position.set(0, 2.4, 0.5);
    neck.rotation.x = -0.15;
    neck.castShadow = true;
    giraffe.add(neck);

    // Cabeça detalhada
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.6), matPele);
    head.position.set(0, 3.4, 0.7);
    giraffe.add(head);

    // Chifres ossicones
    const chifreL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.25, 0.06), matManchas);
    chifreL.position.set(0.08, 3.65, 0.55);
    const chifreR = chifreL.clone();
    chifreR.position.x = -0.08;
    giraffe.add(chifreL, chifreR);

    // Pernas (4x)
    const legGeo = new THREE.BoxGeometry(0.14, 1.4, 0.14);
    const positions = [
        [-0.32, 0.7, 0.55], [0.32, 0.7, 0.55],
        [-0.32, 0.7, -0.55],v
