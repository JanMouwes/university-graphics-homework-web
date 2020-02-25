import * as settings from "./settings.json";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {Scene, PerspectiveCamera, BoxGeometry, MeshNormalMaterial, Mesh, WebGLRenderer, AmbientLight, DirectionalLight} from "three";
import * as THREE from "three";
import CameraControls from "./controls";
import createSkybox from "./skybox";

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
floor.material.side = THREE.DoubleSide;
floor.rotation.x = Math.PI / 2;
floor.position.set(0, 0, 0);
scene.add( floor ); 
    
var geometry = new BoxGeometry(1, 1, 1);
var material = new MeshNormalMaterial();
var cube = new Mesh(geometry, material);
cube.castShadow = true;
cube.receiveShadow = true;

// adding floor
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

// Instantiate a loader
var loader = new GLTFLoader();

function msg(xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
}

function msgerror(error) {
    console.log('An error happened');
}

var canscale = 0.01;
var car0scale = 0.07;
var car1scale = 0.012;
var car2scale = 0.0045;
var car3scale = 0.014;

// Load a glTF resource
loader.load(
    // resource URL
    './src/can.gltf',
    // called when the resource is loaded
    function (gltf) {

        scene.add(gltf.scene);
    
        gltf.animations; // Array<THREE.AnimationClip>
        gltf.scene; // THREE.Scene
        gltf.scene.scale.set(canscale, canscale, canscale);
        gltf.scene.position.set(1, 0, 0);
        gltf.scenes; // Array<THREE.Scene>
        gltf.cameras; // Array<THREE.Camera>
        gltf.asset; // Object
    },
    // called while loading is progressing
    msg,
    // called when loading has errors
    msgerror
);
loader.load(
    './src/car0.gltf',
    function (gltf) {

        scene.add(gltf.scene);
    
        gltf.scene.scale.set(car0scale, car0scale, car0scale);
        gltf.scene.position.set(10, 4, 0);
    },
    msg,
    msgerror
);
loader.load(
    './src/car1.gltf',
    function (gltf) {

        scene.add(gltf.scene);
    
        gltf.scene.scale.set(car1scale, car1scale, car1scale);
        gltf.scene.position.set(20, 1, 0);
    },
    msg,
    msgerror
);
loader.load(
    './src/car2.gltf',
    function (gltf) {

        scene.add(gltf.scene);
    
        gltf.scene.scale.set(car2scale, car2scale, car2scale);
        gltf.scene.position.set(30, 3, 0);
    },
    msg,
    msgerror
);
loader.load(
    './src/car3.gltf',
    function (gltf) {

        scene.add(gltf.scene);
    
        gltf.scene.scale.set(car3scale, car3scale, car3scale);
        gltf.scene.position.set(40, 3, 0);
    },
    msg,
    msgerror
);

var skybox = createSkybox(settings.skybox);
scene.add(skybox);

var ambient = new AmbientLight( 0x404040, 15 );
scene.add( ambient );

// directional - KEY LIGHT
var keyLight = new THREE.DirectionalLight( 0xdddddd, 10 );
keyLight.position.set( -3, 6, -3 );

keyLight.castShadow = true;
// keyLight.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 50, 1, 10, 2500 ) );
// keyLight.shadow.bias = 0.0001;
// keyLight.shadow.mapSize.width = 2048;
// keyLight.shadow.mapSize.height = 1024;

floor.receiveShadow = true;
scene.add( keyLight );
scene.add(cube);

// Geen idee wat dit doet
/*
var fillLight = new THREE.DirectionalLight(0xffcc00, 10);
var fillLightHelper = new THREE.DirectionalLightHelper( fillLight, 1 );
scene.add( fillLightHelper );
*/

// directional - RIM LIGHT
var rimLight = new DirectionalLight( 0xdddddd, 5 );
rimLight.position.set( -20, 80, -80 );
scene.add( rimLight );

const movement = new CameraControls(window);
movement.init(camera);

const update = (deltaTime) => {
    movement.update(deltaTime);

    renderer.render(scene, camera);
};

let lastRender = 0;
const loop = (timestamp) => {
    const progress = timestamp - lastRender;

    update(progress);

    lastRender = timestamp;
    window.requestAnimationFrame(loop)
};

window.requestAnimationFrame(loop);

document.body.appendChild(renderer.domElement);