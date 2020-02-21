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

const geometry = new BoxGeometry(1, 1, 1);
const material = new MeshNormalMaterial();
const cube = new Mesh(geometry, material);

scene.add(cube);

camera.position.x = cameraSettings["start-position"].x;
camera.position.y = cameraSettings["start-position"].y;
camera.position.z = cameraSettings["start-position"].z;

// Create renderer
const renderer = new WebGLRenderer({antialias: true, alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);

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
        gltf.scene.position.set(10, 1, 0);
    },
    msg,
    msgerror
);
loader.load(
    './src/car1.gltf',
    function (gltf) {

        scene.add(gltf.scene);
    
        gltf.scene.scale.set(car1scale, car1scale, car1scale);
        gltf.scene.position.set(20, -3, 0);
    },
    msg,
    msgerror
);
loader.load(
    './src/car2.gltf',
    function (gltf) {

        scene.add(gltf.scene);
    
        gltf.scene.scale.set(car2scale, car2scale, car2scale);
        gltf.scene.position.set(30, -1, 0);
    },
    msg,
    msgerror
);
loader.load(
    './src/car3.gltf',
    function (gltf) {

        scene.add(gltf.scene);
    
        gltf.scene.scale.set(car3scale, car3scale, car3scale);
        gltf.scene.position.set(40, -1, 0);
    },
    msg,
    msgerror
);

const skybox = createSkybox(settings.skybox);
scene.add(skybox);

var ambient = new AmbientLight( 0x404040 );
scene.add( ambient );

// directional - KEY LIGHT
const keyLight = new THREE.DirectionalLight( 0xdddddd, .7 );
keyLight.position.set( -80, 60, 80 );
scene.add( keyLight );

//fillLightHelper = new THREE.DirectionalLightHelper( fillLight, 15 );
//scene.add( fillLightHelper );

// directional - RIM LIGHT
const rimLight = new DirectionalLight( 0xdddddd, .6 );
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