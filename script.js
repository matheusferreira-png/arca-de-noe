/**
 * SISTEMA DE CARREGAMENTO AUTO-LOADER PARA O GITHUB PAGES
 */
(function() {
    const THREE_CDN = "https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js";
    const CONTROLS_CDN = "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js";

    function loadScript(url, callback) {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        script.onload = callback;
        document.head.appendChild(script);
    }

    if (typeof THREE === "undefined") {
        loadScript(THREE_CDN, () => {
            loadScript(CONTROLS_CDN, iniciarExperiencia);
        });
    } else if (typeof THREE.OrbitControls === "undefined") {
        loadScript(CONTROLS_CDN, iniciarExperiencia);
    } else {
        iniciarExperiencia();
    }

    function iniciarExperiencia() {
        // =====================================
        // CENA E CONFIGURAÇÃO VISUAL
        // =====================================
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf1c40f); // Tom de entardecer dourado (combinando com a foto)
        scene.fog = new THREE.FogExp2(0xf1c40f, 0.008);

        const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(45, 20, 50);

        let container = document.getElementById("canvas-container");
        if (!container) {
            container = document.createElement("div");
            container.id = "canvas-container";
            container.style.position = "fixed";
            container.style.top = "0";
            container.style.left = "0";
            container.style.width = "100%";
            container.style.height = "100%";
            container.style.zIndex = "1";
            document.body.appendChild(container);
        }

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;
        container.appendChild(renderer.domElement);

        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.target.set(0, 5, 0);
        controls.maxPolarAngle = Math.PI / 2 - 0.02; // Evita entrar debaixo da terra
        controls.minDistance = 5;
        controls.maxDistance = 120;

        // =====================================
        // ILUMINAÇÃO (SOL DE OURO / GOLDEN HOUR)
        // =====================================
        const sun = new THREE.DirectionalLight(0xffe6a3, 3.0);
        sun.position.set(40, 30, 25);
        sun.castShadow = true;
        sun.shadow.mapSize.width = 2048;
        sun.shadow.mapSize.height = 2048;
        sun.shadow.bias = -0.0005;
        scene.add(sun);

        const ambient = new THREE.AmbientLight(0xd35400, 1.2); // Sombra em tons de terracota quente
        scene.add(ambient);

        // Luzes internas para destacar o interior nos andares
        const lights = [
            new THREE.PointLight(0xffaa44, 3, 15),
            new THREE.PointLight(0xffaa44, 3, 15),
            new THREE.PointLight(0xffaa44, 3, 15)
        ];
        lights[0].position.set(0, 2.5, 5);
        lights[1].position.set(0, 5.5, -5);
        lights[2].position.set(0, 8.5, 0);
        lights.forEach(l => scene.add(l));

        // =====================================
        // TERRENO E FUNDAÇÃO (IGUAL À FOTO)
        // =====================================
        const groundGeo = new THREE.PlaneGeometry(600, 600, 30, 30);
        const groundMat = new THREE.MeshStandardMaterial({ color: 0x95a5a6, roughness: 0.9, flatShading: true });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.1;
        ground.receiveShadow = true;
        scene.add(ground);

        // Lago artificial ao lado (detalhe da foto)
        const lakeGeo = new THREE.PlaneGeometry(80, 200);
        const lakeMat = new THREE.MeshStandardMaterial({ color: 0x34495e, roughness: 0.1, metalness: 0.8 });
        const lake = new THREE.Mesh(lakeGeo, lakeMat);
        lake.rotation.x = -Math.PI / 2;
        lake.position.set(-35, 0, 10);
        scene.add(lake);

        // =====================================
        // MATERIAIS DE CONSTRUÇÃO DE MADEIRA
        // =====================================
        const woodDark = new THREE.MeshStandardMaterial({ color: 0x5c3a21, roughness: 0.95, flatShading: true });
        const woodMedium = new THREE.MeshStandardMaterial({ color: 0x8a5a36, roughness: 0.9, flatShading: true });
        const woodLight = new THREE.MeshStandardMaterial({ color: 0xb5825c, roughness: 0.85, flatShading: true });
        const concreteMat = new THREE.MeshStandardMaterial({ color: 0xbdc3c7, roughness: 0.9, flatShading: true });

        // =====================================
        // CONSTRUÇÃO ESTRUTURAL DA ARCA (ARK ENCOUNTER)
        // =====================================
        const ark = new THREE.Group();
        scene.add(ark);

        // 1. PILARES DE CONCRETO DE SUSTENTAÇÃO (IGUAL À FOTO)
        const pilares = new THREE.Group();
        for (let z = -18; z <= 18; z += 3.5) {
            const pilarL = new THREE.Mesh(new THREE.BoxGeometry(0.8, 3.5, 0.8), concreteMat);
            pilarL.position.set(5, 1.75, z);
            pilarL.castShadow = true;
            pilarL.receiveShadow = true;

            const pilarR = pilarL.clone();
            pilarR.position.x = -5;
            pilares.add(pilarL, pilarR);
        }
        ark.add(pilares);

        // Grupo principal do corpo do barco (começa a partir da fundação de madeira)
        const boatBody = new THREE.Group();
        boatBody.position.y = 3.5; // Fica suspenso sobre as colunas
        ark.add(boatBody);

        // 2. CASCO BASE (RETANGULAR MONUMENTAL)
        const hullMain = new THREE.Mesh(new THREE.BoxGeometry(11, 9, 36), woodDark);
        hullMain.position.set(0, 4.5, 0);
        hullMain.castShadow = true;
        hullMain.receiveShadow = true;
        boatBody.add(hullMain);

        // 3. PROA EMBLEMÁTICA (CURVA VERTICAL IMPONENTE DA FOTO)
        const proaGroup = new THREE.Group();
        proaGroup.position.set(0, 0, 18);

        // Quilha arqueada frontal
        const bowShape = new THREE.Shape();
        bowShape.moveTo(-5.5, 0);
        bowShape.quadraticCurveTo(-5.5, 5, -1, 9);
        bowShape.lineTo(0, 11); // Extensão vertical extra para a barbatana superior da foto
        bowShape.lineTo(-3, 11);
        bowShape.quadraticCurveTo(-7.5, 6, -7.5, 0);
        bowShape.closePath();

        const bowExtrude = new THREE.ExtrudeGeometry(bowShape, { depth: 11, bevelEnabled: false });
        const bowMesh = new THREE.Mesh(bowExtrude, woodDark);
        bowMesh.rotation.y = -Math.PI / 2;
        bowMesh.position.set(-5.5, 0, 0);
        bowMesh.castShadow = true;
        proaGroup.add(bowMesh);
        boatBody.add(proaGroup);

        // 4. POPA QUADRADA (PARTE TRASEIRA)
        const stern = new THREE.Mesh(new THREE.BoxGeometry(11, 9, 4), woodDark);
        stern.position.set(0, 4.5, -20);
        stern.castShadow = true;
        boatBody.add(stern);

        // 5. TELHADO CONTÍNUO (COBERTURA TOTAL DA FOTO)
        const roofGeo = new THREE.BoxGeometry(11.6, 1.2, 44);
        const roof = new THREE.Mesh(roofGeo, woodMedium);
        roof.position.set(0, 9.6, -1);
        roof.castShadow = true;
        boatBody.add(roof);

        // 6. ANDARES INTERNOS (3 DECKS DISTINTOS)
        const deck1 = new THREE.Mesh(new THREE.BoxGeometry(10.2, 0.25, 34), woodMedium);
        deck1.position.set(0, 0.2, 0); // Térreo
        boatBody.add(deck1);

        const deck2 = deck1.clone();
        deck2.position.y = 3.2; // 2º Andar
        boatBody.add(deck2);

        const deck3 = deck1.clone();
        deck3.position.y = 6.2; // 3º Andar
        boatBody.add(deck3);

        // Colunas e vigas internas para suporte estrutural
        for (let z = -14; z <= 14; z += 6) {
            const coluna = new THREE.Mesh(new THREE.BoxGeometry(0.3, 9, 0.3), woodDark);
            coluna.position.set(0, 4.5, z);
            boatBody.add(coluna);
        }

        // 7. PAREDE LATERAL DE CORTE INTERATIVO (MAGIA DA VISUALIZAÇÃO)
        // Criamos uma parede lateral móvel que some quando a câmera está na direita (Z lateral)
        const sideWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 8.8, 35.8), woodLight);
        sideWall.position.set(5.5, 4.5, 0);
        sideWall.castShadow = true;
        boatBody.add(sideWall);

        // =====================================
        // CRIAÇÃO E INSTALAÇÃO DE ANIMAIS
        // =====================================

        // 1. ELEFANTE (Novo!)
        function createElephant() {
            const elephant = new THREE.Group();
            const gray = new THREE.MeshStandardMaterial({ color: 0x7f8c8d, roughness: 0.9, flatShading: true });

            const body = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.0, 1.6), gray);
            body.position.y = 0.8;
            elephant.add(body);

            const head = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.7), gray);
            head.position.set(0, 1.1, 0.9);
            elephant.add(head);

            // Tromba
            const trunk = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.8, 0.2), gray);
            trunk.position.set(0, 0.6, 1.3);
            elephant.add(trunk);

            // Pernas
            const legGeo = new THREE.BoxGeometry(0.25, 0.7, 0.25);
            const legOffsets = [[-0.4, 0.35, 0.5], [0.4, 0.35, 0.5], [-0.4, 0.35, -0.5], [0.4, 0.35, -0.5]];
            legOffsets.forEach(offset => {
                const leg = new THREE.Mesh(legGeo, gray);
                leg.position.set(...offset);
                elephant.add(leg);
            });

            elephant.scale.set(0.7, 0.7, 0.7);
            return elephant;
        }

        // 2. GIRAFA
        function createGiraffe() {
            const giraffe = new THREE.Group();
            const yellow = new THREE.MeshStandardMaterial({ color: 0xd35400, roughness: 0.8, flatShading: true });

            const body = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 1.3), yellow);
            body.position.y = 1;
            giraffe.add(body);

            const neck = new THREE.Mesh(new THREE.BoxGeometry(0.22, 2.0, 0.22), yellow);
            neck.position.set(0, 2.1, 0.4);
            neck.rotation.x = -0.15;
            giraffe.add(neck);

            const head = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.28, 0.5), yellow);
            head.position.set(0, 3.1, 0.6);
            giraffe.add(head);

            const legGeo = new THREE.BoxGeometry(0.13, 1.2, 0.13);
            const legOffsets = [[-0.28, 0.6, 0.45], [0.28, 0.6, 0.45], [-0.28, 0.6, -0.45], [0.28, 0.6, -0.45]];
            legOffsets.forEach(offset => {
                const leg = new THREE.Mesh(legGeo, yellow);
                leg.position.set(...offset);
                giraffe.add(leg);
            });

            giraffe.scale.set(0.6, 0.6, 0.6);
            return giraffe;
        }

        // 3. OVELHA
        function createSheep() {
            const sheep = new THREE.Group();
            const white = new THREE.MeshStandardMaterial({ color: 0xecf0f1, roughness: 0.95, flatShading: true });
            const black = new THREE.MeshStandardMaterial({ color: 0x2c3e50, roughness: 0.9, flatShading: true });

            const body = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 1.1), white);
            body.position.y = 0.5;
            sheep.add(body);

            const head = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), black);
            head.position.set(0, 0.7, 0.55);
            sheep.add(head);

            const legGeo = new THREE.BoxGeometry(0.1, 0.4, 0.1);
            const legOffsets = [[-0.25, 0.2, 0.35], [0.25, 0.2, 0.35], [-0.25, 0.2, -0.35], [0.25, 0.2, -0.35]];
            legOffsets.forEach(offset => {
                const leg = new THREE.Mesh(legGeo, black);
                leg.position.set(...offset);
                sheep.add(leg);
            });

            sheep.scale.set(0.7, 0.7, 0.7);
            return sheep;
        }

        const animals = [];

        // 1º Andar (Elefantes)
        const e1 = createElephant(); e1.position.set(1.5, 0.2, 5); e1.rotation.y = -Math.PI / 3; boatBody.add(e1);
        const e2 = createElephant(); e2.position.set(-1.8, 0.2, -2); e2.rotation.y = Math.PI / 4; boatBody.add(e2);
        animals.push(e1, e2);

        // 2º Andar (Ovelhas)
        const s1 = createSheep(); s1.position.set(2, 3.2, 8); s1.rotation.y = Math.PI / 2; boatBody.add(s1);
        const s2 = createSheep(); s2.position.set(-2, 3.2, 2); s2.rotation.y = -Math.PI / 6; boatBody.add(s2);
        const s3 = createSheep(); s3.position.set(1, 3.2, -6); s3.rotation.y = Math.PI; boatBody.add(s3);
        animals.push(s1, s2, s3);

        // 3º Andar (Girafas - pescoço se projeta para cima)
        const g1 = createGiraffe(); g1.position.set(1.5, 6.2, 3); g1.rotation.y = -Math.PI / 4; boatBody.add(g1);
        const g2 = createGiraffe(); g2.position.set(-1.5, 6.2, -5); g2.rotation.y = Math.PI / 3; boatBody.add(g2);
        animals.push(g1, g2);


        // =====================================
        // SISTEMA DE ÁUDIO REALISTA NATIVO
        // =====================================
        let audioCtx = null;

        function initAudio() {
            if (audioCtx) return;
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();

            // Som constante de vento/natureza
            const bufferSize = audioCtx.sampleRate * 3;
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
            filter.frequency.value = 280;

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

            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(140, audioCtx.currentTime);
            osc.frequency.linearRampToValueAtTime(180, audioCtx.currentTime + 0.1);
            osc.frequency.exponentialRampToValueAtTime(75, audioCtx.currentTime + 0.4);

            gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
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
            banner.style.fontSize = "13px";
            banner.style.pointerEvents = "none";
            banner.style.zIndex = "10000";
            banner.innerHTML = "📢 Sons de animais ativados! Clique no terreno para emitir sons.";
            document.body.appendChild(banner);
            setTimeout(() => banner.remove(), 4000);
        }

        // Esconde a tela de carregamento de forma limpa
        const loadingElement = document.getElementById("loading");
        if (loadingElement) {
            loadingElement.style.display = "none";
        }

        // =====================================
        // LOOP DE ANIMAÇÃO E INTERAÇÃO DA PAREDE
        // =====================================
        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);

            const time = clock.getElapsedTime();
            controls.update();

            // Lógica do Corte Lateral: Se o ângulo de órbita focar na lateral direita,
            // removemos a parede para que você consiga olhar lá dentro perfeitamente.
            if (camera.position.x > 5) {
                sideWall.visible = false; // "Abre" a arca para visualização interna!
            } else {
                sideWall.visible = true;  // Fecha a parede para ver por fora!
            }

            // Balanço realista (como se estivesse ancorada sobre vibrações sutis da terra/água)
            ark.position.y = Math.sin(time * 0.8) * 0.1;
            ark.rotation.z = Math.sin(time * 0.6) * 0.01;

            // Movimento sutil dos animais
            animals.forEach((animal, index) => {
                animal.rotation.y += Math.sin(time * 1.5 + index) * 0.0015;
            });

            renderer.render(scene, camera);
        }

        animate();

        // Ajuste de tamanho automático da tela
        window.addEventListener("resize", () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
})();
