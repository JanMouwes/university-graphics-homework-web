import * as settings from "./settings.json";
import {
    Scene,
    PerspectiveCamera,
    BoxGeometry,
    MeshNormalMaterial,
    Mesh,
    WebGLRenderer,
    AmbientLight,
    Vector3
} from "three";
import * as THREE from "three";
import CameraControls from "./controls";
import createSkybox from "./skybox";
import SodaCan from "./objects/soda-can";

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

// scene.add(cube);

camera.position.x = cameraSettings["start-position"].x;
camera.position.y = cameraSettings["start-position"].y;
camera.position.z = cameraSettings["start-position"].z;

// Create renderer
const renderer = new WebGLRenderer({antialias: true, alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);

renderer.render(scene, camera);

const skybox = createSkybox(settings.skybox);
scene.add(skybox);

var ambient = new AmbientLight(0x404040);
scene.add(ambient);

// directional - KEY LIGHT
const keyLight = new THREE.DirectionalLight(0xdddddd, 10);
keyLight.position.set(-80, 60, 80);
scene.add(keyLight);

//fillLightHelper = new THREE.DirectionalLightHelper( fillLight, 15 );
//scene.add( fillLightHelper );

// directional - RIM LIGHT
//rimLight = new DirectionalLight( 0xdddddd, .6 );
//rimLight.position.set( -20, 80, -80 );
//scene.add( rimLight );

const movement = new CameraControls(window);
movement.init(camera);

/**
 * @type {SodaCan[]}
 */
const gameObjects = [];

const GRAVITY = new Vector3(0, -9.81, 0);

const shootCan = () => {
    const newCan = new SodaCan(camera.position.clone(), .01);

    camera.getWorldDirection(newCan.velocity);
    newCan.velocity = newCan.velocity.add(GRAVITY);

    console.log(newCan.velocity);

    newCan.init(scene);
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