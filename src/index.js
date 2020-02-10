import * as settings from "./settings";
import * as THREE from "three";

// Create scene
const scene = new THREE.Scene();

const cameraSettings = settings.camera;
if (cameraSettings["aspect-ratio-use-window"] === true) {
    cameraSettings["aspect-ratio"] = window.innerWidth / window.innerHeight;
}

// Create camera
const camera = new THREE.PerspectiveCamera(
    cameraSettings["field-of-view"], // fov — Camera frustum vertical field of view.
    cameraSettings["aspect-ratio"], // aspect — Camera frustum aspect ratio.
    cameraSettings["plane-near"], // near — Camera frustum near plane.
    cameraSettings["plane-far"]  // far — Camera frustum far plane.
);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshNormalMaterial();
const cube = new THREE.Mesh(geometry, material);

scene.add(cube);

camera.position.x = 2;
camera.position.y = 1;
camera.position.z = 5;

// Create renderer
const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);

renderer.render(scene, camera);

let cameraAcceleration = {x: 0, y: 0, z: 0};


const keyDownListener = (e) => {
    if (e.code === "KeyA") cameraAcceleration.x = -.2;
    else if (e.code === "KeyD") cameraAcceleration.x = .2;
    else if (e.code === "KeyW") cameraAcceleration.y = -.2;
    else if (e.code === "KeyS") cameraAcceleration.y = .2;
};

const decay = () => {
    cameraAcceleration.x *= .9;
    cameraAcceleration.y *= .9;
    cameraAcceleration.z *= .9;
};

let onUpdate;
document.addEventListener('keydown', (e) => {
    keyDownListener(e);
    onUpdate = null;
});
document.addEventListener('keyup', () => (onUpdate = decay));

const update = (deltaTime) => {
    if (onUpdate) {
        onUpdate(deltaTime);
    }

    camera.position.x += cameraAcceleration.x;
    camera.position.y += cameraAcceleration.y;
    camera.position.z += cameraAcceleration.z;

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