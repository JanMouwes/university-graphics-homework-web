import {Vector3} from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

export default class SodaCan {

    /**
     *
     * @param {Vector3} initialPosition
     * @param {number} scale
     */
    constructor(initialPosition, scale) {
        this.pos = initialPosition;

        this._scale = scale;
        /**
         * @type {Scene | null}
         * @private
         */
        this._object3d = null;

        /** @type {Vector3} */
        this.velocity = new Vector3();

        //  Hardcoded for now
        this._textureSrc = "can.gltf"
    }

    init(scene) {
        // Instantiate a loader
        const loader = new GLTFLoader();

        const scale = this._scale;

        const onTextureLoaded = (gltf) => {
            gltf.scene.scale.set(scale, scale, scale);

            this._object3d = gltf.scene;
            scene.add(gltf.scene);
        };

        // Load a glTF resource
        loader.load(
            // resource URL
            './src/' + this._textureSrc,
            // called when the resource is loaded
            onTextureLoaded,
            // called while loading is progressing
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            // called when loading has errors
            function (error) {
                console.log('Error when loading resource SodaCan: ' + error.message);
            }
        );
    }

    update(deltaMillis) {

        const deltaSeconds = (deltaMillis / 1000.0);

        const relativeVelocity = this.velocity.clone().multiplyScalar(deltaSeconds);
        this.pos.add(relativeVelocity);

        if (this.pos.y < 0) {
            this.pos.y = 0;
        }

        if (this._object3d) {
            this._object3d.position.set(this.pos.x, this.pos.y, this.pos.z);
        }
    }

    get object3d() {
        return this._object3d;
    }
}