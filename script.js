/**
 * SISTEMA DE CARREGAMENTO BLINDADO (Auto-Loader)
 * Garante que o Three.js e OrbitControls carreguem mesmo se o HTML estiver desatualizado.
 */
(function() {
    const THREE_CDN = "https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js";
    const CONTROLS_CDN = "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js";

    function loadScript(url, callback) {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        script.onload = callback;
        script.onerror = () => {
            console.error("Falha ao carregar: " + url);
            mostrarErroTela("Erro de conexão ao carregar bibliotecas 3D. Verifique sua internet.");
        };
        document.head.appendChild(script);
    }

    function mostrarErroTela(msg) {
        const errDiv = document.createElement("div");
        errDiv.style.position = "fixed";
        errDiv.style.top = "50%";
        errDiv.style.left = "50%";
        errDiv.style.transform = "translate(-50%, -50%)";
        errDiv.style.background = "rgba(255, 0, 0, 0.9)";
        errDiv.style.color = "white";
        errDiv.style.padding = "20px";
        errDiv.style.borderRadius = "10px";
        errDiv.style.zIndex = "99999";
        errDiv.style.fontFamily = "sans-serif";
        errDiv.innerHTML = "<b>Erro:</b> " + msg;
        document.body.appendChild(errDiv);
    }

    // Inicia o fluxo de carregamento seguro
    if (typeof THREE === "undefined") {
        loadScript(THREE_CDN, () => {
            loadScript(CONTROLS_CDN, iniciarExperiencia);
        });
    } else if (typeof THREE.OrbitControls === "undefined") {
        loadScript(CONTROLS_CDN, iniciarExperiencia);
    } else {
        iniciarExperiencia();
    }

    // ============================================================================
    // EXPERIÊNCIA 3D PROFISSIONAL DA ARCA
    // ============================================================================
    function iniciarExperiencia() {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x1a252f); // Céu dramático de tempestade
        scene.fog = new THREE.FogExp2(0x1a252f, 0.012);

        const camera = new THREE.PerspectiveCamera(
            40,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.set(35, 18, 40);

        // Força a criação do container caso ele não exista no HTML
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
        renderer.shadowMap.enabled = true; // Sombra profissional ativada
        renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
        renderer.toneMapping = THREE.ACESFilmicToneMapping; 
        renderer.toneMappingExposure = 1.2;
        container.appendChild(renderer.domElement);

        // Controles de câmera totalmente calibrados para aproximar e girar
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.target.set(0, 3, 0);
        controls.maxPolarAngle = Math.PI / 2 - 0.05; 
        controls.minDistance = 2; // Permite entrar na cabine com zoom
        controls.maxDistance = 90;

        // ============================================================================
        // ILUMINAÇÃO CENOGRÁFICA
        // ============================================================================
        const sun = new THREE.DirectionalLight(0xffdfb0, 2.5);
        sun.position.set(35, 45, 20);
        sun.castShadow = true;
        sun.shadow.mapSize.width = 2048; 
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

        const ambient = new THREE.AmbientLight(0x2c3e50, 1.4);
        scene.add(ambient);

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
        // MODELAGEM DA ARCA PROFISSIONAL
        // ============================================================================
        const ark = new THREE.Group();
        scene.add(ark);

        const matCasco = new THREE.MeshStandardMaterial({ color: 0x3d1d0c, roughness: 0.9, metalness: 0.1, flatShading: true });
        const matVigas = new THREE.MeshStandardMaterial({ color: 0x271206, roughness: 0.9, metalness: 0.1, flatShading: true });
        const matDeck = new THREE.MeshStandardMaterial({ color: 0x5e3719, roughness: 0.8, flatShading: true });
        const matCabine = new THREE.MeshStandardMaterial({ color: 0x824b24, roughness: 0.75, flatShading: true, side: THREE.DoubleSide });
        const matTelhado = new THREE.MeshStandardMaterial({ color: 0x4a1805, roughness: 0.9, flatShading: true });
        const matGrade = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.5, metalness: 0.8 });

        // Casco robusto com quilha
        const hullGroup = new THREE.Group();
        const hullCenter = new THREE.Mesh(new THREE.BoxGeometry(14, 8, 26), matCasco);
        hullCenter.position.y = 4;
        hullCenter.castShadow = true;
        hullCenter.receiveShadow = true;
        hullGroup.add(hullCenter);

        const bowGeo = new THREE.BoxGeometry(14, 8, 8);
        const bow = new THREE.Mesh(bowGeo, matCasco);
        bow.position.set(0, 4, 17);
        bow.scale.set(0.1, 1, 1); // Bico frontal (proa)
        bow.castShadow = true;
        hullGroup.add(bow);

        const sternGeo = new THREE.BoxGeometry(14, 8, 6);
        const stern = new THREE.Mesh(sternGeo, matCasco);
        stern.position.set(0, 4, -16);
        stern.rotation.x = -0.2; // Traseira inclinada (popa)
        stern.castShadow = true;
        hullGroup.add(stern);

        // Vigas de reforço laterais
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

        // Decks de madeira
        const mainDeck = new THREE.Mesh(new THREE.BoxGeometry(14.8, 0.6, 42), matDeck);
        mainDeck.position.set(0, 8, 0);
        mainDeck.castShadow = true;
        mainDeck.receiveShadow = true;
        ark.add(mainDeck);

        const innerDeck = new THREE.Mesh(new THREE.BoxGeometry(13, 0.3, 36), matDeck);
        innerDeck.position.set(0, 3.8, 0);
        innerDeck.receiveShadow = true;
        ark.add(innerDeck);

        // Cabine estruturada translúcida
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

        // Colunas de madeira da cabine
        for (let z = -11; z <= 11; z += 5.5) {
            const colL = new THREE.Mesh(new THREE.BoxGeometry(0.4, 6.2, 0.4), matVigas);
            colL.position.set(4.8, 11, z);
            colL.castShadow = true;
            const colR = colL.clone();
            colR.position.x = -4.8;
            ark.add(colL, colR);
        }

        // Telhado clássico
        const roofGeo = new THREE.ConeGeometry(8.5, 4.5, 4);
        const roof = new THREE.Mesh(roofGeo, matTelhado);
        roof.rotation.y = Math.PI / 4;
        roof.position.set(0, 16, 0);
        roof.castShadow = true;
        ark.add(roof);

        // Rampa de embarque detalhada
        const rampa = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.3, 10), matDeck);
        rampa.position.set(8.5, 4.2, 3);
        rampa.rotation.z = -Math.PI / 6;
        rampa.castShadow = true;
        ark.add(rampa);

        const corrimaoL = new THREE.Mesh(new THREE.BoxGeometry(0.15, 1.2, 10), matVigas);
        corrimaoL.position.set(8.5, 4.9, 5.2);
        corrimaoL.rotation.z = -Math.PI / 6;
        corrimaoL.castShadow = true;
        const corrimaoR = corrimaoL.clone();
        corrimaoR.position.z = 0.8;
        ark.add(corrimaoL, corrimaoR);

        // Janelas com grades
        for (let i = -8; i <= 8; i += 4) {
            if (i === 0) continue;
            const frame = new THREE.Mesh(new THREE.BoxGeometry(0.15, 1.6, 1.2), matVigas);
            frame.position.set(4.8, 11.2, i);
            frame.castShadow = true;
            ark.add(frame);
            
            const frameLeft = frame.clone();
            frameLeft.position.x = -4.8;
            ark.add(frameLeft);

            const grade = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.4, 0.1), matGrade);
            grade.position.set(4.8, 11.2, i);
            ark.add(grade);
            const gradeL = grade.clone(); gradeL.position.x = -4.8;
            ark.add(grade, gradeL);
        }

        // ============================================================================
        // ANIMAIS REALISTAS (LOW-POLY PREMIUM)
        // ============================================================================
        function createGiraffe() {
            const giraffe = new THREE.Group();
            const matPele = new THREE.MeshStandardMaterial({ color: 0xD2912E, roughness: 0.8, flatShading: true });
            const matManchas = new THREE.MeshStandardMaterial({ color: 0x6e3b19, roughness: 0.9 });

            const body = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 1.5), matPele);
            body.position.y = 1.1;
            body.castShadow = true;
            giraffe.add(body);

            const mancha1 = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.3, 0.3), matManchas);
            mancha1.position.set(0.46, 1.2, 0.2);
            const mancha2 = mancha1.clone();
            mancha2.position.set(-0.46, 1.1, -0.3);
            giraffe.add(mancha1, mancha2);

            const neck = new THREE.Mesh(new THREE.BoxGeometry(0.26, 2.3, 0.26), matPele);
            neck.position.set(0, 2.4, 0.5);
            neck.rotation.x = -0.15;
            neck.castShadow = true;
            giraffe.add(neck);

            const head = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.6), matPele);
            head.position.set(0, 3.4, 0.7);
            giraffe.add(head);

            const chifreL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.25, 0.06), matManchas);
            chifreL.position.set(0.08, 3.65, 0.55);
            const chifreR = chifreL.clone();
            chifreR.position.x = -0.08;
            giraffe.add(chifreL, chifreR);

            const legGeo = new THREE.BoxGeometry(0.14, 1.4, 0.14);
            const positions = [
                [-0.32, 0.7, 0.55], [0.32, 0.7, 0.55],
                [-0.32, 0.7, -0.55], [0.32, 0.7, -0.55]
            ];
            positions.forEach(pos => {
                const leg = new THREE.Mesh(legGeo, matPele);
                leg.position.set(...pos);
                leg.castShadow = true;
                giraffe.add(leg);
            });

            giraffe.scale.set(0.8, 0.8, 0.8);
            return giraffe;
        }

        function createSheep() {
            const sheep = new THREE.Group();
            const matLa = new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.95, flatShading: true });
            const matCara = new THREE.MeshStandardMaterial({ color: 0x1c1c1c, roughness: 0.9 });

            const body = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.95, 1.4), matLa);
            body.position.y = 0.65;
            body.castShadow = true;
            sheep.add(body);

            const head = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), matCara);
            head.position.set(0, 0.85, 0.75);
            head.castShadow = true;
            sheep.add(head);

            const orelhaL = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.1, 0.35), matCara);
            orelhaL.position.set(0.3, 0.85, 0.65);
            orelhaL.rotation.z = -0.2;
            const orelhaR = orelhaL.clone();
            orelhaR.position.x = -0.3;
            orelhaR.rotation.z = 0.2;
            sheep.add(orelhaL, orelhaR);

            const legGeo = new THREE.BoxGeometry(0.13, 0.6, 0.13);
            const positions = [
                [-0.35, 0.3, 0.45], [0.35, 0.3, 0.45],
                [-0.35, 0.3, -0.45], [0.35, 0.3, -0.45]
            ];
            positions.forEach(pos => {
                const leg = new THREE.Mesh(legGeo, matCara);
                leg.position.set(...pos);
                leg.castShadow = true;
                sheep.add(leg);
            });

            sheep.scale.set(0.75, 0.75, 0.75);
            return sheep;
        }

        const animals = [];

        const g1 = createGiraffe(); g1.position.set(2, 8.3, 11); g1.rotation.y = -0.5; ark.add(g1);
        const g2 = createGiraffe(); g2.position.set(-2, 8.3, 13); g2.rotation.y = 0.6; ark.add(g2);
        animals.push(g1, g2);

        const s1 = createSheep(); s1.position.set(1.5, 3.9, 6); s1.rotation.y = 1.2; ark.add(s1);
        const s2 = createSheep(); s2.position.set(-1.8, 3.9, -1); s2.rotation.y = -0.4; ark.add(s2);
        const s3 = createSheep(); s3.position.set(0, 3.9, -7); s3.rotation.y = Math.PI; ark.add(s3);
        animals.push(s1, s2, s3);

        // ============================================================================
        // SISTEMA DE ÁUDIO REALISTA NATIVO
        // ============================================================================
        let audioCtx = null;

        function initAudio() {
            if (audioCtx) return;
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();

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
            filter.frequency.value = 220; 

            const gainNode = audioCtx.createGain();
            gainNode.gain.value = 0.09;

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
            osc.frequency.setValueAtTime(125, audioCtx.currentTime);
            osc.frequency.linearRampToValueAtTime(170, audioCtx.currentTime + 0.12);
            osc.frequency.exponentialRampToValueAtTime(85, audioCtx.currentTime + 0.5);

            const vibrato = audioCtx.createOscillator();
            const vibratoGain = audioCtx.createGain();
            vibrato.frequency.value = 16; 
            vibratoGain.gain.value = 22; 

            vibrato.connect(vibratoGain);
            vibratoGain.connect(osc.frequency);
            
            gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.005, audioCtx.currentTime + 0.5);

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
            banner.style.background = "rgba(10, 15, 25, 0.9)";
            banner.style.color = "#2ecc71";
            banner.style.border = "1px solid #2ecc71";
            banner.style.padding = "10px 20px";
            banner.style.borderRadius = "20px";
            banner.style.fontFamily = "sans-serif";
            banner.style.fontSize = "13px";
            banner.style.pointerEvents = "none";
            banner.style.zIndex = "10000";
            banner.innerHTML = "📢 Som Ativado! Clique no oceano para balir com os animais.";
            document.body.appendChild(banner);
            setTimeout(() => banner.remove(), 4000);
        }

        // Esconde a tela de carregamento de forma garantida
        const loadingElement = document.getElementById("loading");
        if (loadingElement) {
            loadingElement.style.display = "none";
        }

        // ============================================================================
        // LOOP DE ANIMAÇÃO
        // ============================================================================
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
                    Math.sin((x + time * 2.2) * 0.05) * 0.45 +
                    Math.cos((y + time * 1.5) * 0.04) * 0.45;
                position.setZ(i, wave);
            }
            position.needsUpdate = true;
            water.geometry.computeVertexNormals();

            ark.position.y = Math.sin(time * 1.3) * 0.35; 
            ark.rotation.z = Math.sin(time * 0.9) * 0.035; 
            ark.rotation.x = Math.cos(time * 1.1) * 0.018; 

            animals.forEach((animal, index) => {
                animal.rotation.y += Math.sin(time * 1.5 + index) * 0.0015;
            });

            renderer.render(scene, camera);
        }

        animate();

        window.addEventListener("resize", () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
})();
