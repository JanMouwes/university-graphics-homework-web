import * as settings from "./settings.json";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {Scene, PerspectiveCamera, BoxGeometry, MeshNormalMaterial, Mesh, WebGLRenderer, AmbientLight, DirectionalLight} from "three";
import * as THREE from "three";
import CameraControls from "./controls";

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

// Load a glTF resource
loader.load(
    // resource URL
    './src/scene.gltf',
    // called when the resource is loaded
    function (gltf) {

        scene.add(gltf.scene);

        gltf.animations; // Array<THREE.AnimationClip>
        gltf.scene; // THREE.Scene
        gltf.scenes; // Array<THREE.Scene>
        gltf.cameras; // Array<THREE.Camera>
        gltf.asset; // Object

    },
    // called while loading is progressing
    function (xhr) {

        console.log((xhr.loaded / xhr.total * 100) + '% loaded');

    },
    // called when loading has errors
    function (error) {

        console.log('An error happened');

    }
);

var ambient = new AmbientLight( 0x404040 );
scene.add( ambient );

// directional - KEY LIGHT
keyLight = new THREE.DirectionalLight( 0xdddddd, .7 );
keyLight.position.set( -80, 60, 80 );
scene.add( keyLight );

//fillLightHelper = new THREE.DirectionalLightHelper( fillLight, 15 );
//scene.add( fillLightHelper );

// directional - RIM LIGHT
//rimLight = new DirectionalLight( 0xdddddd, .6 );
//rimLight.position.set( -20, 80, -80 );
//scene.add( rimLight );

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