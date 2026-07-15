const canvas = document.getElementById("renderCanvas");

const engine = new BABYLON.Engine(canvas, true);

const createScene = function () {

    const scene = new BABYLON.Scene(engine);

    scene.clearColor = new BABYLON.Color4(0.53,0.81,0.98,1);

    const camera = new BABYLON.ArcRotateCamera(
        "camera",
        Math.PI/2,
        Math.PI/3,
        150,
        BABYLON.Vector3.Zero(),
        scene
    );

    camera.attachControl(canvas,true);

    const light = new BABYLON.HemisphericLight(
        "light",
        new BABYLON.Vector3(0,1,0),
        scene
    );

    light.intensity = 1.3;

    const ground = BABYLON.MeshBuilder.CreateGround(
        "ground",
        {
            width:500,
            height:500
        },
        scene
    );

    const water = new BABYLON.StandardMaterial("water",scene);

    water.diffuseColor = new BABYLON.Color3(0,0.35,0.75);

    ground.material = water;

    const ark = BABYLON.MeshBuilder.CreateBox(
        "ark",
        {
            width:35,
            height:12,
            depth:90
        },
        scene
    );

    ark.position.y = 6;

    const wood = new BABYLON.StandardMaterial("wood",scene);

    wood.diffuseColor = new BABYLON.Color3(0.45,0.28,0.10);

    ark.material = wood;

    return scene;

};

const scene = createScene();

engine.runRenderLoop(function () {
    scene.render();
});

window.addEventListener("resize",function(){
    engine.resize();
});
