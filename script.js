const ark = new THREE.Group();

// Casco inferior
const hullBottom = new THREE.Mesh(
    new THREE.BoxGeometry(10, 3, 34),
    new THREE.MeshPhongMaterial({ color: 0x6D3F1C })
);
hullBottom.position.y = 1.5;
ark.add(hullBottom);

// Casco superior
const hullTop = new THREE.Mesh(
    new THREE.BoxGeometry(12, 3, 30),
    new THREE.MeshPhongMaterial({ color: 0x8B5A2B })
);
hullTop.position.y = 4;
ark.add(hullTop);

// Convés
const deck = new THREE.Mesh(
    new THREE.BoxGeometry(11.5, 0.4, 30),
    new THREE.MeshPhongMaterial({ color: 0xB87333 })
);
deck.position.y = 5.7;
ark.add(deck);

// Cabine
const cabin = new THREE.Mesh(
    new THREE.BoxGeometry(6, 3, 14),
    new THREE.MeshPhongMaterial({ color: 0x80512F })
);
cabin.position.y = 7.5;
ark.add(cabin);

scene.add(ark);
