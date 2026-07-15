// =======================
// ARCA DE NOÉ
// =======================

const ark = new THREE.Group();

// =======================
// CASCO
// =======================

const hullShape = new THREE.Shape();

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
    bevelSize:0.15,
    bevelThickness:0.15,
    bevelSegments:2
});

const hull = new THREE.Mesh(
    hullGeometry,
    new THREE.MeshPhongMaterial({
        color:0x8B5A2B
    })
);

hull.rotation.x = Math.PI;
hull.rotation.y = Math.PI;
hull.position.set(0,7,17);

ark.add(hull);

// =======================
// PROA
// =======================

const bow = new THREE.Mesh(

new THREE.ConeGeometry(4.5,6,4),

new THREE.MeshPhongMaterial({
    color:0x8B5A2B
})

);

bow.rotation.z=Math.PI/2;
bow.rotation.y=Math.PI/4;
bow.position.set(0,4,-18);

ark.add(bow);

// =======================
// POPA
// =======================

const stern = new THREE.Mesh(

new THREE.BoxGeometry(10,6,2),

new THREE.MeshPhongMaterial({
    color:0x7A4A22
})

);

stern.position.set(0,4,17);

ark.add(stern);

// =======================
// CONVÉS
// =======================

const deck = new THREE.Mesh(

new THREE.BoxGeometry(11.5,0.4,32),

new THREE.MeshPhongMaterial({
    color:0xC68642
})

);

deck.position.set(0,7.2,0);

ark.add(deck);

// =======================
// CABINE
// =======================

const cabin = new THREE.Mesh(

new THREE.BoxGeometry(6,3.5,14),

new THREE.MeshPhongMaterial({
    color:0x704214
})

);

cabin.position.set(0,9,0);

ark.add(cabin);

// =======================
// TELHADO
// =======================

const roof = new THREE.Mesh(

new THREE.ConeGeometry(5,2.2,4),

new THREE.MeshPhongMaterial({
    color:0x5D3A1A
})

);

roof.rotation.y=Math.PI/4;
roof.position.set(0,11.5,0);

ark.add(roof);

// =======================
// JANELAS
// =======================

for(let i=-10;i<=10;i+=5){

    const leftWindow = new THREE.Mesh(

        new THREE.BoxGeometry(0.3,1.2,1.6),

        new THREE.MeshPhongMaterial({
            color:0x99ddff
        })

    );

    leftWindow.position.set(-5.7,9,i);
    ark.add(leftWindow);

    const rightWindow = leftWindow.clone();
    rightWindow.position.x=5.7;
    ark.add(rightWindow);

}

// =======================
// PORTA
// =======================

const door = new THREE.Mesh(

new THREE.BoxGeometry(2,3,0.25),

new THREE.MeshPhongMaterial({
    color:0x3B2415
})

);

door.position.set(0,8,-8);

ark.add(door);

// =======================

scene.add(ark);
