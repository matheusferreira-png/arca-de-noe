// =======================
// ARCA DE NOÉ
// =======================

const ark = new THREE.Group();

// Formato lateral do casco
const hullShape = new THREE.Shape();

hullShape.moveTo(-5,0);
hullShape.lineTo(5,0);
hullShape.lineTo(6,3);
hullShape.lineTo(5,6);
hullShape.lineTo(-5,6);
hullShape.lineTo(-6,3);
hullShape.closePath();

// Extrusão
const hullGeometry = new THREE.ExtrudeGeometry(hullShape,{
    depth:30,
    bevelEnabled:false
});

const hull = new THREE.Mesh(
    hullGeometry,
    new THREE.MeshPhongMaterial({
        color:0x8B5A2B
    })
);

hull.rotation.x = Math.PI;
hull.rotation.y = Math.PI;
hull.position.set(0,6,15);

ark.add(hull);

// Convés

const deck = new THREE.Mesh(

new THREE.BoxGeometry(10.5,0.3,30),

new THREE.MeshPhongMaterial({
    color:0xC68642
})

);

deck.position.set(0,6.2,0);

ark.add(deck);

// Cabine

const cabin = new THREE.Mesh(

new THREE.BoxGeometry(5,3,12),

new THREE.MeshPhongMaterial({
    color:0x704214
})

);

cabin.position.set(0,8,0);

ark.add(cabin);

// Telhado

const roof = new THREE.Mesh(

new THREE.ConeGeometry(4.3,2,4),

new THREE.MeshPhongMaterial({
    color:0x5D3A1A
})

);

roof.rotation.y = Math.PI/4;
roof.position.set(0,10,0);

ark.add(roof);

scene.add(ark);
