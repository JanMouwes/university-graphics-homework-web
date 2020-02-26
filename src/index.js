import * as settings from "./settings.json";
import {
    Scene,
    PerspectiveCamera,
    BoxGeometry,
    MeshNormalMaterial,
    Mesh,
    WebGLRenderer,
    AmbientLight,
    Vector3,
    DirectionalLight,
    LightShadow,
    ConeGeometry,
    DirectionalLightShadow, 
    Cache
} from "three";
import * as THREE from "three";
import CameraControls from "./controls";
import createSkybox from "./skybox";
import SodaCan from "./objects/soda-can";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import EntityBase from "./objects/entity-base";

// Create scene
const scene = new Scene();

const cameraSettings = settings.camera;
if (cameraSettings["aspect-ratio-use-window"] === true) {
    cameraSettings["aspect-ratio"] = window.innerWidth / window.innerHeight;
}

// Create camera, load from settings
const camera = new PerspectiveCamera(
    cameraSettings["field-of-view"], // fov — Camera frustum vertical field of view.
    cameraSettings["aspect-ratio"], // aspect — Camera frustum aspect ratio.
    cameraSettings["plane-near"], // near — Camera frustum near plane.
    cameraSettings["plane-far"]  // far — Camera frustum far plane.
);

var geometry = new THREE.PlaneGeometry( 1000, 1000, 10, 10 );
var material = new THREE.MeshBasicMaterial( { color: 0xffcc00, wireframe: false } );
var floor = new THREE.Mesh( geometry, material );
floor.material.side = THREE.BackSide;
floor.position.set(0, 0, 0);
floor.rotation.x = Math.PI / 2;
scene.add( floor ); 
    
var geometry = new BoxGeometry(1, 1, 1);
var material = new MeshNormalMaterial();
var cube = new Mesh(geometry, material);
cube.castShadow = true;
cube.receiveShadow = true;
scene.add(cube);

var geometry = new BoxGeometry(8,5,8);
var texture = new THREE.TextureLoader().load('./src/resources/models/textures/BrickWall/Brick_Wall_017_basecolor.jpg');
texture.repeat.set(4, 4);
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set( 4, 4);
var material = new THREE.MeshBasicMaterial({map: texture});
var huis = new Mesh(geometry, material);
huis.position.set(0, 2.5, -20);
scene.add(huis);

var geometry = new ConeGeometry(7, 2.5, 4, 1, false, Math.PI / 4);
var texture = new THREE.TextureLoader().load('./src/resources/models/textures/TerracottaRoof/Shingles_Terracotta_001_basecolor.jpg');
texture.repeat.set(6, 6);
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set( 6, 6);
var material = new THREE.MeshBasicMaterial({map: texture});
var dak = new Mesh(geometry, material);
dak.position.set(0, 6.3, -20);
scene.add(dak);

// adding floor van martijn en sybren
/*
const planegeometry = new THREE.PlaneGeometry(200, 200, 1);

const colorMap = new THREE.TextureLoader().load('./src/textures/BrickWall/Brick_Wall_017_basecolor.jpg');
colorMap.wrapS = THREE.RepeatWrapping;
colorMap.wrapT = THREE.RepeatWrapping;
colorMap.repeat.set(24, 24);

var materialbrick = new THREE.MeshStandardMaterial({
    map: colorMap
});
var mesh = new THREE.Mesh(planegeometry, materialbrick);
mesh.material.side = THREE.DoubleSide;
mesh.rotation.x = Math.PI / 2;

scene.add(mesh);
*/

camera.position.x = cameraSettings["start-position"].x;
camera.position.y = cameraSettings["start-position"].y;
camera.position.z = cameraSettings["start-position"].z;

// Create renderer
const renderer = new WebGLRenderer({antialias: true, alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;

renderer.render(scene, camera);

const skybox = createSkybox(settings.skybox);
scene.add(skybox);

// Instantiate a loader
const loader = new GLTFLoader();

const canscale = 0.01;
const car0scale = 0.07;
const car1scale = 0.012;
const car2scale = 0.0045;
const car3scale = 0.014;

const can = new SodaCan(canscale);
can.init(loader, scene, new Vector3(1, 0, 0));

/*
    const can = new SodaCan(canscale);
    can.init(loader, scene, new Vector3(1, 0, 0));

    const car0 = new EntityBase("car0.gltf", car0scale);
    car0.init(loader, scene, new Vector3(10, 4, 0));

    const car1 = new EntityBase("car1.gltf", car1scale);
    car1.init(loader, scene, new Vector3(20, 0, 0));

    const car2 = new EntityBase("car2.gltf", car2scale);
    car2.init(loader, scene, new Vector3(30, 1.55, 0));

    const car3 = new EntityBase("car3.gltf", car3scale);
    car3.init(loader, scene, new Vector3(40, 1.75, 0));
*/

const ambient = new AmbientLight(0x404040, 10);
scene.add(ambient);

window.addEventListener("keydown", (e)=> {
    const obj = car0;

    if (e.key === "ArrowDown") {
        obj.pos.y -= .05;
        obj.object3d.position.y -= .05;
        console.log(obj.pos.y);
    } else if (e.key === "ArrowUp") {
        obj.pos.y += .05;
        obj.object3d.position.y += .05;
        console.log(obj.pos.y);
    }
});

// directional - KEY LIGHT
const keyLight = new THREE.DirectionalLight(0xdddddd, 10);
keyLight.position.set(-80, 60, 80);
keyLight.castShadow = true;
keyLight.shadow = new DirectionalLightShadow(camera);
keyLight.shadow.bias = 0.0001;
keyLight.shadow.mapSize.width = 2048;
keyLight.shadow.mapSize.height = 1024;

//floor.receiveShadow = true;scene.add(keyLight);scene.add(cube);

// Geen idee wat dit doet
/*
var fillLight = new THREE.DirectionalLight(0xffcc00, 10);
var fillLightHelper = new THREE.DirectionalLightHelper( fillLight, 1 );
scene.add( fillLightHelper );
*/

// directional - RIM LIGHT
const rimLight = new DirectionalLight(0xdddddd, 5);
rimLight.position.set(-20, 80, -80);
scene.add(rimLight);

const movement = new CameraControls(window);
movement.init(camera);

/**
 * @type {SodaCan[]}
 */
const gameObjects = [];

const GRAVITY = new Vector3(0, -9.81, 0);

const shootCan = () => {
    const newCan = new SodaCan(.01);

    camera.getWorldDirection(newCan.velocity);
    newCan.velocity = newCan.velocity.normalize().multiplyScalar(4).add(GRAVITY);

    console.log(newCan.velocity);

    newCan.init(loader, scene, camera.position.clone());
    gameObjects.push(newCan);
};

const update = (deltaTime) => {
    movement.update(deltaTime);

    gameObjects.forEach(obj => obj.update(deltaTime));

    renderer.render(scene, camera);
};

let lastRender = 0;

window.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    shootCan();
});

const loop = (timestamp) => {
    const progress = timestamp - lastRender;

    update(progress);

    lastRender = timestamp;
    window.requestAnimationFrame(loop)
};

window.requestAnimationFrame(loop);

document.body.appendChild(renderer.domElement);